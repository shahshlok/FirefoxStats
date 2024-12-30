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
  constructor() {
    this.initialized = false; // Flag to check if storage is initialized
  }

  async init() {
    if (this.initialized) return;

    try {
      // Check if storage exists
      const data = await browser.storage.local.get(STORAGE_NAMESPACE);
      
      if (!data[STORAGE_NAMESPACE]) {
        // Initialize storage with default values
        await this.resetStorage();
      }
      
      this.initialized = true;
    } catch (error) {
      console.error('Storage initialization failed:', error);
      throw new Error('Storage initialization failed');
    }
  }

  async resetStorage() {
    try {
      await browser.storage.local.set({
        [STORAGE_NAMESPACE]: DEFAULT_STORAGE
      });
    } catch (error) {
      console.error('Storage reset failed:', error);
      throw new Error('Storage reset failed');
    }
  }

  async getData() {
    if (!this.initialized) await this.init();
    
    try {
      const data = await browser.storage.local.get(STORAGE_NAMESPACE);
      return data[STORAGE_NAMESPACE];
    } catch (error) {
      console.error('Failed to get data:', error);
      throw new Error('Failed to get data');
    }
  }
}

export default new StorageManager();
