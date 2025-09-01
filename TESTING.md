# 自動化測試指南

學測英文練習系統的完整自動化測試策略與執行指南。

## 📋 測試架構概述

本專案採用三層測試架構：

```
tests/
├── unit/                 # 單元測試
│   ├── gsat-analytics.test.js
│   └── gsat-charts.test.js
├── integration/          # 整合測試
│   └── exam-analytics.integration.test.js
├── e2e/                  # 端到端測試
│   └── exam-workflow.spec.js
└── setup/                # 測試配置
    ├── test-setup.js
    ├── jest.config.js
    ├── global-setup.js
    └── global-teardown.js
```

## 🛠️ 環境設置

### 1. 安裝依賴套件

```bash
npm install
```

### 2. 安裝瀏覽器 (Playwright)

```bash
npx playwright install
```

### 3. 驗證環境設置

```bash
npm run validate
```

## 🧪 測試類型與執行

### 單元測試 (Jest)

測試個別 JavaScript 模組的功能邏輯。

```bash
# 執行所有單元測試
npm run test:unit

# 監控模式執行
npm run test:watch

# 生成覆蓋率報告
npm run test:coverage
```

**測試範圍：**
- ✅ `gsat-analytics.js` - 分析系統邏輯
- ✅ `gsat-charts.js` - 圖表渲染功能
- ✅ LocalStorage 資料操作
- ✅ 跨年份資料比較演算法
- ✅ 分數計算與統計分析

### 整合測試 (Jest + jsdom)

測試多個模組間的協作與資料流。

```bash
# 執行整合測試
npm run test:integration
```

**測試範圍：**
- ✅ 考試系統與分析系統整合
- ✅ 資料持久化流程
- ✅ 跨年份比較功能整合
- ✅ 錯誤處理機制
- ✅ 效能基準測試

### 端到端測試 (Playwright)

測試完整使用者工作流程與真實瀏覽器互動。

```bash
# 執行 E2E 測試
npm run test:e2e

# 有界面模式執行 (可視化)
npm run test:e2e:headed

# 除錯模式
npm run test:e2e:debug
```

**測試範圍：**
- ✅ 完整考試流程 (選年份→作答→提交→查看結果)
- ✅ 計時器功能與進度儲存
- ✅ 學習分析頁面互動
- ✅ 跨瀏覽器相容性
- ✅ 響應式設計 (手機/平板/桌面)
- ✅ 無障礙功能 (a11y)

## 🎯 測試執行策略

### 開發階段測試

```bash
# 快速回饋循環
npm run test:watch

# 本地完整驗證
npm run test:all
```

### CI/CD 管道測試

```bash
# 生產前驗證
npm run validate
```

### 效能基準測試

```bash
# 載入效能測試
npm run test:e2e -- --grep "效能測試"

# 覆蓋率分析
npm run test:coverage
```

## 📊 測試報告

### 覆蓋率報告

執行 `npm run test:coverage` 後，在 `coverage/` 目錄查看：

- `coverage/lcov-report/index.html` - 詳細覆蓋率報告
- `coverage/coverage-summary.json` - 覆蓋率摘要

**目標覆蓋率：**
- 語句覆蓋率：≥ 90%
- 分支覆蓋率：≥ 85% 
- 函數覆蓋率：≥ 90%
- 行數覆蓋率：≥ 90%

### E2E 測試報告

Playwright 自動生成：
- `test-results/` - 測試結果與截圖
- `playwright-report/` - HTML 測試報告

## 🔧 關鍵測試案例

### 1. 考試核心功能測試

```javascript
// 驗證考試計時、作答、評分的完整流程
describe('完整考試流程', () => {
  test('使用者可以完成114年考試並獲得正確評分')
});
```

### 2. 分析系統整合測試

```javascript
// 驗證考試資料正確儲存到分析系統
describe('分析系統整合', () => {
  test('考試完成後資料正確儲存並可供分析')
});
```

### 3. 跨瀏覽器相容性測試

```javascript
// 確保功能在主要瀏覽器都正常運作
const browsers = ['chromium', 'firefox', 'webkit'];
```

### 4. 響應式設計測試

```javascript
// 驗證不同螢幕尺寸下的使用體驗
const viewports = [
  { name: '手機', width: 375, height: 667 },
  { name: '平板', width: 768, height: 1024 },
  { name: '桌面', width: 1920, height: 1080 }
];
```

## 🚀 持續整合建議

### GitHub Actions 配置範例

```yaml
name: 自動化測試
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run validate
      - run: npx playwright install --with-deps
      - run: npm run test:all
```

### 測試品質門檻

在 CI/CD 管道中設置以下品質門檻：

- ✅ 所有測試必須通過
- ✅ 代碼覆蓋率 ≥ 85%
- ✅ E2E 測試在 3 個主要瀏覽器都通過
- ✅ 效能測試符合基準值

## 🐛 測試除錯指南

### 單元測試除錯

```bash
# 除錯單一測試檔案
npm test -- --testPathPattern=gsat-analytics.test.js --verbose

# 除錯特定測試案例
npm test -- --testNamePattern="應該正確儲存考試結果"
```

### E2E 測試除錯

```bash
# 視覺化除錯模式
npm run test:e2e:debug

# 產生測試執行錄影
npm run test:e2e -- --video=on
```

### 常見問題排解

1. **localStorage 測試失敗**
   - 確認 `test-setup.js` 正確模擬 localStorage
   - 檢查測試間是否正確清理資料

2. **圖表渲染測試失敗**
   - 驗證 DOM 容器正確設置
   - 檢查 CSS 樣式在測試環境中載入

3. **E2E 測試不穩定**
   - 增加適當的等待時間
   - 使用 `page.waitForSelector()` 確保元素載入

## 📈 測試監控與改善

### 測試指標追蹤

定期監控：
- 測試執行時間趨勢
- 失敗率統計
- 覆蓋率變化
- 新功能測試完整性

### 測試維護

- 每月檢視並更新過時的測試案例
- 新功能開發時同步撰寫測試
- 定期重構重複的測試程式碼
- 持續優化測試執行效率

## 🎓 最佳實踐

1. **測試先行開發 (TDD)**
   - 新功能先撰寫測試
   - 確保測試案例覆蓋邊界條件

2. **測試金字塔原則**
   - 70% 單元測試 (快速回饋)
   - 20% 整合測試 (模組協作)
   - 10% E2E 測試 (使用者流程)

3. **測試獨立性**
   - 每個測試可獨立執行
   - 測試間不相互依賴
   - 適當的設置與清理

4. **有意義的測試命名**
   - 描述測試的行為與預期
   - 使用中文命名提高可讀性
   - 遵循 "應該...當...時" 格式

---

📝 **注意事項**：
- 測試執行前請確保沒有其他服務佔用 3000 埠口
- E2E 測試需要穩定的網路連線
- 建議在本地開發環境定期執行完整測試套件