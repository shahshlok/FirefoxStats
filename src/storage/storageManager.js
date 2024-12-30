// Storage namespace to prevent conflicts
const STORAGE_NAMESPACE = 'privacyStats';

// Data schema version for future migrations
const SCHEMA_VERSION = 1;

// Basic storage structure
const DEFAULT_STORAGE = {
  version: SCHEMA_VERSION,

  // Stores the stats
  stats: { 
    totalBlocked: 0,
    bandwidthSaved: 0,
    uniqueDomains: [],
    lastUpdated: null
  },

  // User configurations
  settings: {
    displayMode: 'default',
    updateInterval: 1000
  }
};



class StorageManager {
  static async init() {
    try {
      const data = await browser.storage.local.get('privacyStats');
      
      if (!data.privacyStats) {
        const defaultData = {
          privacyStats: {
            version: 1,
            stats: {
              totalBlocked: 0,
              bandwidthSaved: 0,
              uniqueDomains: [],
              lastUpdated: null
            },
            settings: {
              displayMode: 'default',
              updateInterval: 1000
            }
          }
        };
        
        await browser.storage.local.set(defaultData);
      }
    } catch (error) {
      throw new Error(`Failed to initialize storage: ${error.message}`);
    }
  }

  static async getData() {
    try {
      const data = await browser.storage.local.get('privacyStats');
      return data.privacyStats;
    } catch (error) {
      console.error('Failed to get data:', error);
      throw new Error('Failed to get data');
    }
  }

  static async setData(newData) {
    try {
      const currentData = await this.getData();
      const updatedData = {
        privacyStats: {
          ...currentData,
          ...newData,
          lastUpdated: new Date().toISOString()
        }
      };
      await browser.storage.local.set(updatedData);
    } catch (error) {
      throw new Error(`Failed to set data: ${error.message}`);
    }
  }
}

export default StorageManager;
