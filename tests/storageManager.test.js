import StorageManager from '../src/storage/storageManager.js';

describe('StorageManager', () => {
  beforeEach(() => {
    // Reset storage and mocks before each test
    browser.storage.local.clear();
    browser.storage.local.get.mockClear();
    browser.storage.local.set.mockClear();
  });

  test('initialization creates default storage if empty', async () => {
    browser.storage.local.get.mockResolvedValue({});
    
    await StorageManager.init();
    
    expect(browser.storage.local.set).toHaveBeenCalledWith({
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
  });

  test('getData returns existing data', async () => {
    const mockData = {
      privacyStats: {
        version: 1,
        stats: {
          totalBlocked: 10,
          bandwidthSaved: 1000,
          uniqueDomains: ['example.com']
        }
      }
    };
    browser.storage.local.get.mockResolvedValue(mockData);

    const data = await StorageManager.getData();
    
    expect(data).toEqual(mockData.privacyStats);
  });

  test('setData updates storage with timestamp', async () => {
    const newData = {
      version: 1,
      stats: {
        totalBlocked: 15,
        bandwidthSaved: 2000,
        uniqueDomains: ['example.com', 'test.com']
      }
    };
    
    await StorageManager.setData(newData);
    
    expect(browser.storage.local.set).toHaveBeenCalled();
    const setCall = browser.storage.local.set.mock.calls[0][0];
    expect(setCall.privacyStats.stats).toEqual(newData.stats);
    expect(setCall.privacyStats.lastUpdated).toBeDefined();
  });

  test('handles storage errors gracefully', async () => {
    browser.storage.local.get.mockRejectedValue(new Error('Storage error'));
    
    await expect(StorageManager.getData()).rejects.toThrow('Failed to get data');
  });

  test('maintains data integrity during updates', async () => {
    const initialData = {
      privacyStats: {
        version: 1,
        stats: {
          totalBlocked: 5,
          bandwidthSaved: 500,
          uniqueDomains: ['example.com']
        }
      }
    };
    browser.storage.local.get.mockResolvedValue(initialData);
    
    const newStats = {
      totalBlocked: 6,
      bandwidthSaved: 600,
      uniqueDomains: ['example.com', 'test.com']
    };
    
    await StorageManager.setData({ stats: newStats });
    
    expect(browser.storage.local.set).toHaveBeenCalledWith(
      expect.objectContaining({
        privacyStats: expect.objectContaining({
          version: 1,
          stats: newStats
        })
      })
    );
  });
});
