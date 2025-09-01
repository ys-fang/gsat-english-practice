/**
 * Playwright 全域設置
 * 在所有測試開始前執行
 */

async function globalSetup(config) {
  console.log('🚀 開始設置測試環境...');
  
  // 確保測試資料目錄存在
  const fs = require('fs');
  const path = require('path');
  
  const testResultsDir = path.join(__dirname, '../../test-results');
  if (!fs.existsSync(testResultsDir)) {
    fs.mkdirSync(testResultsDir, { recursive: true });
  }

  // 清理之前的測試結果
  const cleanupPaths = [
    path.join(testResultsDir, '*.png'),
    path.join(testResultsDir, '*.webm'),
    path.join(testResultsDir, '*.zip')
  ];

  cleanupPaths.forEach(pattern => {
    const files = require('glob').sync(pattern);
    files.forEach(file => {
      try {
        fs.unlinkSync(file);
      } catch (error) {
        console.warn(`無法刪除檔案: ${file}`, error.message);
      }
    });
  });

  console.log('✅ 測試環境設置完成');
}

module.exports = globalSetup;