/**
 * Playwright 全域清理
 * 在所有測試完成後執行
 */

async function globalTeardown(config) {
  console.log('🧹 開始清理測試環境...');
  
  const fs = require('fs');
  const path = require('path');

  // 產生測試摘要報告
  const testResultsDir = path.join(__dirname, '../../test-results');
  const summaryPath = path.join(testResultsDir, 'test-summary.json');

  const summary = {
    timestamp: new Date().toISOString(),
    testRun: process.env.CI ? 'CI' : 'Local',
    environment: {
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch
    }
  };

  try {
    fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
    console.log(`📊 測試摘要已儲存至: ${summaryPath}`);
  } catch (error) {
    console.warn('無法儲存測試摘要:', error.message);
  }

  // 在 CI 環境中保留測試證據，本地環境可選擇清理
  if (!process.env.CI && process.env.CLEANUP_AFTER_TESTS === 'true') {
    console.log('🗑️  清理本地測試檔案...');
    
    try {
      // 保留 HTML 報告，清理影片和截圖
      const cleanupPatterns = [
        path.join(testResultsDir, '*.webm'),
        path.join(testResultsDir, '*.png')
      ];

      cleanupPatterns.forEach(pattern => {
        const files = require('glob').sync(pattern);
        files.forEach(file => {
          try {
            fs.unlinkSync(file);
          } catch (error) {
            console.warn(`無法刪除: ${file}`);
          }
        });
      });
    } catch (error) {
      console.warn('清理過程中發生錯誤:', error.message);
    }
  }

  console.log('✅ 測試環境清理完成');
}

module.exports = globalTeardown;