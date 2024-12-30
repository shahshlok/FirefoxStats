export const sanitizeArray = (arr) => {
  if (!Array.isArray(arr)) return [];
  return [...new Set(arr.filter(item => item != null))];
};

export const sanitizeNumber = (num) => {
  const parsed = parseInt(num, 10);
  return isNaN(parsed) || parsed < 0 ? 0 : parsed;
};

export const isValidStats = (stats) => {
  if (!stats || typeof stats !== 'object') return false;
  return (
    'totalBlocked' in stats &&
    'bandwidthSaved' in stats &&
    'uniqueDomains' in stats
  );
};
