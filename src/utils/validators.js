export const isValidStats = (stats) => {
    if (!stats || typeof stats !== 'object') return false;
    
    const requiredFields = ['totalBlocked', 'bandwidthSaved', 'uniqueDomains'];
    return requiredFields.every(field => field in stats);
  };
  
  export const sanitizeNumber = (num) => {
    const parsed = parseInt(num, 10);
    return isNaN(parsed) ? 0 : Math.max(0, parsed);
  };
  
  export const sanitizeArray = (arr) => {
    if (!Array.isArray(arr)) return [];
    return [...new Set(arr)]; // Remove duplicates
  };
  