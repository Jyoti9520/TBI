/**
 * Utility to map TBI records to UI display values.
 * Resolves dataset anomalies where emails were stored in the name column,
 * and ensures:
 * 1. University name is the primary title
 * 2. Incubator / TBI name is the secondary prominent information
 * 3. Incubator Type is a badge
 * 4. City with MapPin icon
 * 5. Official Email ID with Mail icon
 * 6. Status at the bottom
 * 7. View Details button
 * 8. Favorite heart button
 */

const isEmailLike = (val) => {
  if (!val || typeof val !== 'string') return false;
  const trimmed = val.trim();
  return trimmed.includes('@') && !trimmed.includes(' ') && trimmed.includes('.');
};

export const getTbiDisplayData = (tbi) => {
  if (!tbi) {
    return {
      universityName: 'Unknown University',
      incubatorName: 'Incubation Centre',
      incubatorType: null,
      city: 'Location not specified',
      email: null,
      status: 'Unverified',
      firstLetter: 'U'
    };
  }

  // 1. University name as primary title
  let universityName = 'Unknown University';
  if (tbi.university && typeof tbi.university === 'string') {
    const trimmedUniv = tbi.university.trim();
    if (trimmedUniv.length > 0 && !isEmailLike(trimmedUniv)) {
      universityName = trimmedUniv;
    }
  }

  // 2. Incubator / TBI name as secondary prominent information
  // If tbi.name is an email, the incubator name is in tbi.universityType
  let incubatorName = '';
  const rawName = typeof tbi.name === 'string' ? tbi.name.trim() : '';
  const rawUnivType = typeof tbi.universityType === 'string' ? tbi.universityType.trim() : '';
  const rawIncType = typeof tbi.incubatorType === 'string' ? tbi.incubatorType.trim() : '';

  if (rawName && !isEmailLike(rawName)) {
    incubatorName = rawName;
  } else if (rawUnivType && !isEmailLike(rawUnivType)) {
    incubatorName = rawUnivType;
  } else if (rawIncType && !isEmailLike(rawIncType)) {
    incubatorName = `${rawIncType} Centre`;
  } else {
    incubatorName = 'Incubation Centre';
  }

  // 3. Incubator Type badge
  let incubatorType = null;
  if (rawIncType && !isEmailLike(rawIncType)) {
    incubatorType = rawIncType;
  } else if (rawUnivType && isEmailLike(rawName)) {
    incubatorType = 'Incubator';
  }

  // 4. City
  const city = (typeof tbi.city === 'string' && tbi.city.trim()) || 'Location not specified';

  // 5. Official Email ID
  let email = null;
  const rawEmail = typeof tbi.email === 'string' ? tbi.email.trim() : '';
  if (isEmailLike(rawEmail)) {
    email = rawEmail;
  } else if (isEmailLike(rawName)) {
    email = rawName;
  }

  // 6. Status
  const status = tbi.status || 'Unverified';

  // First letter for avatar (from University name or Incubator name)
  let firstLetter = 'U';
  const cleanUnivForLetter = universityName.replace(/[^a-zA-Z0-9]/g, ' ').trim();
  if (cleanUnivForLetter.length > 0) {
    firstLetter = cleanUnivForLetter[0].toUpperCase();
  } else {
    const cleanIncForLetter = incubatorName.replace(/[^a-zA-Z0-9]/g, ' ').trim();
    if (cleanIncForLetter.length > 0) {
      firstLetter = cleanIncForLetter[0].toUpperCase();
    }
  }

  return {
    universityName,
    incubatorName,
    incubatorType,
    city,
    email,
    status,
    firstLetter
  };
};
