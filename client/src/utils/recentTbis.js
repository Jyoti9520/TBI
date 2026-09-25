/**
 * Storage key for recently viewed TBIs
 */
const RECENTLY_VIEWED_KEY = 'tbi_recently_viewed';
const MAX_RECENT_ITEMS = 5;

/**
 * Get the list of recently viewed TBIs from localStorage
 * @returns {Array} List of up to 5 recently viewed TBI objects
 */
export const getRecentlyViewed = () => {
  try {
    const raw = localStorage.getItem(RECENTLY_VIEWED_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Failed to read recently viewed TBIs:', err);
    return [];
  }
};

/**
 * Add a TBI to recently viewed history
 * - Most recently viewed appears first
 * - No duplicates
 * - Capped at 5 items
 * @param {Object} tbi TBI object
 */
export const addRecentlyViewed = (tbi) => {
  if (!tbi || !tbi.id) return;
  try {
    const current = getRecentlyViewed();
    // Remove if already exists to prevent duplicates
    const filtered = current.filter((item) => String(item.id) !== String(tbi.id));
    
    // Minimal snapshot to keep storage light and fast
    const record = {
      id: tbi.id,
      university: tbi.university,
      name: tbi.name,
      universityType: tbi.universityType,
      incubatorType: tbi.incubatorType,
      city: tbi.city,
      email: tbi.email,
      website: tbi.website,
      status: tbi.status,
      logo: tbi.logo || null,
      viewedAt: Date.now()
    };

    const updated = [record, ...filtered].slice(0, MAX_RECENT_ITEMS);
    localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(updated));

    // Dispatch event so any open components can reactively update
    window.dispatchEvent(new CustomEvent('recently-viewed-updated', { detail: updated }));
  } catch (err) {
    console.error('Failed to update recently viewed TBIs:', err);
  }
};

/**
 * Clear recently viewed TBIs
 */
export const clearRecentlyViewed = () => {
  try {
    localStorage.removeItem(RECENTLY_VIEWED_KEY);
    window.dispatchEvent(new CustomEvent('recently-viewed-updated', { detail: [] }));
  } catch (err) {
    console.error('Failed to clear recently viewed TBIs:', err);
  }
};
