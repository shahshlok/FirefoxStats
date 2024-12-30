import StorageManager from '../storage/storageManager';

describe('StorageManager', () => {
  beforeEach(() => {
    browser.storage.local.clear();
  });

  test('initializes with default values', async () => {
    await StorageManager.init();
    const data = await StorageManager.getData();
    
    expect(data.version).toBeDefined();
    expect(data.stats).toBeDefined();
    expect(data.settings).toBeDefined();
  });
});
