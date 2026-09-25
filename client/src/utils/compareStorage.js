/**
 * Storage key and utility for selected TBIs to compare across pages
 */
const COMPARE_TBIS_KEY = 'tbi_compare_selection';
export const MAX_COMPARE_ITEMS = 3;

export const getCompareTbis = () => {
  try {
    const raw = localStorage.getItem(COMPARE_TBIS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Failed to read compare TBIs from storage:', err);
    return [];
  }
};

export const setCompareTbis = (tbis) => {
  try {
    const valid = Array.isArray(tbis) ? tbis.slice(0, MAX_COMPARE_ITEMS) : [];
    localStorage.setItem(COMPARE_TBIS_KEY, JSON.stringify(valid));
    window.dispatchEvent(new CustomEvent('compare-tbis-updated', { detail: valid }));
  } catch (err) {
    console.error('Failed to save compare TBIs to storage:', err);
  }
};

export const toggleCompareTbi = (tbi) => {
  if (!tbi || !tbi.id) return { action: 'none', list: getCompareTbis() };
  const current = getCompareTbis();
  const exists = current.some((item) => String(item.id) === String(tbi.id));

  if (exists) {
    const updated = current.filter((item) => String(item.id) !== String(tbi.id));
    setCompareTbis(updated);
    return { action: 'removed', list: updated };
  }

  if (current.length >= MAX_COMPARE_ITEMS) {
    return { action: 'limit_reached', list: current };
  }

  // Store clean snapshot
  const record = {
    id: tbi.id,
    university: tbi.university,
    name: tbi.name,
    universityType: tbi.universityType,
    incubatorType: tbi.incubatorType,
    city: tbi.city,
    email: tbi.email,
    website: tbi.website,
    hasValidWebsite: tbi.hasValidWebsite,
    websiteUrl: tbi.websiteUrl,
    status: tbi.status,
    logo: tbi.logo || null
  };

  const updated = [...current, record];
  setCompareTbis(updated);
  return { action: 'added', list: updated };
};

export const removeCompareTbi = (tbiId) => {
  const current = getCompareTbis();
  const updated = current.filter((item) => String(item.id) !== String(tbiId));
  setCompareTbis(updated);
  return updated;
};

export const clearCompareTbis = () => {
  try {
    localStorage.removeItem(COMPARE_TBIS_KEY);
    window.dispatchEvent(new CustomEvent('compare-tbis-updated', { detail: [] }));
  } catch (err) {
    console.error('Failed to clear compare TBIs:', err);
  }
};
