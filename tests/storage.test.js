// storage.test.js
import StorageManager from '../src/storage/storageManager.js';

describe('StorageManager', () => {
  beforeEach(() => {
    // Clear mock storage state
    browser.storage.local.clear();
    
    // Reset all mock implementations
    browser.storage.local.get.mockClear();
    browser.storage.local.set.mockClear();
  });

  test('initializes with default values', async () => {
    // Mock the storage.local.get response
    browser.storage.local.get.mockResolvedValue({
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
    });

    await StorageManager.init();
    const data = await StorageManager.getData();
    
    expect(data).toBeDefined();
    expect(data.version).toBeDefined();
    expect(data.stats).toBeDefined();
    expect(data.settings).toBeDefined();
  });
});
