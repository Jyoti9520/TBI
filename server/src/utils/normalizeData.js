function normalizeStatus(status) {
  if (!status) return 'Unverified';
  const clean = String(status).trim();
  if (clean.includes('Verified') && !clean.includes('Under')) {
    return 'Verified';
  }
  if (clean.includes('Under Verification')) {
    return 'Under Verification';
  }
  if (clean.toLowerCase() === 'verified') {
    return 'Verified';
  }
  return 'Unverified';
}

function isValidUrl(string) {
  if (!string || typeof string !== 'string') return false;
  const trimmed = string.trim();
  try {
    const url = new URL(trimmed.startsWith('http://') || trimmed.startsWith('https://') ? trimmed : `https://${trimmed}`);
    return url.hostname.includes('.') && !url.hostname.endsWith('.');
  } catch (_) {
    return false;
  }
}

function normalizeUrl(string) {
  if (!isValidUrl(string)) return null;
  const trimmed = string.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

function cleanString(val) {
  if (val === null || val === undefined) return null;
  const str = String(val).trim();
  return str.length > 0 ? str : null;
}

module.exports = {
  normalizeStatus,
  isValidUrl,
  normalizeUrl,
  cleanString
};
