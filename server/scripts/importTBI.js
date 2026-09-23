const path = require('path');
const fs = require('fs');
const xlsx = require('xlsx');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env') });

const { connectDB } = require('../src/config/db');
const { TBI } = require('../src/models');
const { normalizeStatus, cleanString } = require('../src/utils/normalizeData');

async function importData() {
  console.log('--- Starting TBI Dataset Importer ---');
  await connectDB();

  let rawRecords = [];
  const excelPath = path.resolve(__dirname, '../../dataset/TBI(3).xlsx');
  const jsonPath = path.resolve(__dirname, '../../dataset/tbi_india_seed.json');

  if (fs.existsSync(excelPath)) {
    console.log(`Reading dataset from Excel: ${excelPath}`);
    const workbook = xlsx.readFile(excelPath);
    const sheetName = workbook.SheetNames[0];
    rawRecords = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
    console.log(`Extracted ${rawRecords.length} records from sheet "${sheetName}"`);
  } else if (fs.existsSync(jsonPath)) {
    console.log(`Reading dataset from JSON fallback: ${jsonPath}`);
    const fileContent = fs.readFileSync(jsonPath, 'utf8');
    rawRecords = JSON.parse(fileContent);
    console.log(`Extracted ${rawRecords.length} records from JSON`);
  } else {
    console.error('No dataset file found at expected locations!');
    process.exit(1);
  }

  const report = {
    totalRows: rawRecords.length,
    validRows: 0,
    invalidRows: 0,
    duplicateRows: 0,
    insertedRows: 0,
    updatedRows: 0,
    errors: []
  };

  for (let i = 0; i < rawRecords.length; i++) {
    const row = rawRecords[i];
    const rowNum = i + 1;

    const university = cleanString(row['University'] || row['university']);
    const name = cleanString(
      row['Incubator / TBI Name'] || row['name'] || row['tbiName'] || row['Incubator Name']
    );
    const city = cleanString(row['City'] || row['city']);
    const universityType = cleanString(row['University Type'] || row['universityType']);
    const incubatorType = cleanString(row['Incubator Type'] || row['incubatorType']);
    const email = cleanString(row['Official Email ID'] || row['email'] || row['Official Email']);
    const website = cleanString(row['Website'] || row['website']);
    const statusRaw = row['Status'] || row['status'];
    const serialNumber = row['S.No'] || row['id'] || row['serialNumber'] || rowNum;

    if (!university || !name) {
      report.invalidRows++;
      report.errors.push(`Row ${rowNum}: Missing required fields (University or Name)`);
      continue;
    }

    report.validRows++;
    const status = normalizeStatus(statusRaw);

    const existing = await TBI.findOne({
      where: {
        university,
        name,
        ...(city ? { city } : {})
      }
    });

    if (existing) {
      report.duplicateRows++;
      existing.serialNumber = Number(serialNumber) || existing.serialNumber;
      existing.universityType = universityType || existing.universityType;
      existing.incubatorType = incubatorType || existing.incubatorType;
      existing.email = email || existing.email;
      existing.website = website || existing.website;
      existing.status = status;
      if (city) existing.city = city;
      await existing.save();
      report.updatedRows++;
    } else {
      await TBI.create({
        serialNumber: Number(serialNumber) || null,
        university,
        city,
        universityType,
        name,
        incubatorType,
        email,
        website,
        status
      });
      report.insertedRows++;
    }
  }

  console.log('\n======================================');
  console.log('       TBI IMPORT REPORT SUMMARY       ');
  console.log('======================================');
  console.log(`Total rows processed : ${report.totalRows}`);
  console.log(`Valid rows           : ${report.validRows}`);
  console.log(`Invalid rows         : ${report.invalidRows}`);
  console.log(`Duplicate rows       : ${report.duplicateRows}`);
  console.log(`Inserted rows        : ${report.insertedRows}`);
  console.log(`Updated rows         : ${report.updatedRows}`);
  console.log('======================================\n');

  if (report.errors.length > 0) {
    console.log('Errors encountered:');
    report.errors.forEach(err => console.log(' - ' + err));
  }

  process.exit(0);
}

importData().catch(err => {
  console.error('Fatal importer error:', err);
  process.exit(1);
});
