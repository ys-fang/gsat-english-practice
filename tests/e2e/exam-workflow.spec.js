/**
 * Playwright E2E 測試
 * 測試完整的使用者考試流程
 */

const { test, expect } = require('@playwright/test');

test.describe('GSAT 英文練習系統 E2E 測試', () => {
  test.beforeEach(async ({ page }) => {
    // 清理 localStorage
    await page.evaluate(() => localStorage.clear());
  });

  test.describe('首頁導航測試', () => {
    test('應該正確顯示年份選擇頁面', async ({ page }) => {
      await page.goto('http://localhost:3000'); // 需要啟動本地伺服器

      // 驗證頁面標題
      await expect(page).toHaveTitle('學測英文歷年試題練習');

      // 驗證主要元素存在
      await expect(page.locator('h1')).toContainText('學測英文歷年試題練習');
      
      // 驗證年份卡片顯示
      const yearCards = page.locator('.year-card');
      await expect(yearCards).toHaveCount(10); // 105-114年共10個年份

      // 驗證最新年份標記
      const latestCard = page.locator('.year-card.latest');
      await expect(latestCard.locator('.year-number')).toContainText('114');
      await expect(latestCard.locator('.label')).toContainText('最新');

      // 驗證分析頁面連結
      const analyticsLink = page.locator('a[href="analytics.html"]');
      await expect(analyticsLink).toBeVisible();
      await expect(analyticsLink).toContainText('查看學習分析');
    });

    test('點擊年份卡片應該正確導航到考試頁面', async ({ page }) => {
      await page.goto('http://localhost:3000');

      // 點擊114年考試
      await page.click('a[href="year/114.html"]');
      
      // 驗證正確導航到考試頁面
      await expect(page).toHaveURL(/.*\/year\/114\.html/);
      await expect(page.locator('h1')).toContainText('114年');
    });
  });

  test.describe('完整考試流程測試', () => {
    test('完成114年考試的完整流程', async ({ page }) => {
      // 導航到114年考試頁面
      await page.goto('http://localhost:3000/year/114.html');

      // 等待頁面完全載入
      await page.waitForSelector('.exam-container');

      // 驗證考試介面元素
      await expect(page.locator('.exam-title')).toBeVisible();
      await expect(page.locator('#timer')).toBeVisible();
      await expect(page.locator('#exam-form')).toBeVisible();

      // 開始考試
      const startButton = page.locator('#start-exam-btn');
      if (await startButton.isVisible()) {
        await startButton.click();
      }

      // 等待計時器開始
      await page.waitForFunction(() => {
        const timer = document.getElementById('timer');
        return timer && timer.textContent !== '00:00:00';
      });

      // 模擬作答前幾題（詞彙題）
      await page.check('input[name="q1"][value="B"]');
      await page.check('input[name="q2"][value="A"]');
      await page.check('input[name="q3"][value="C"]');

      // 滾動到頁面中間，作答更多題目
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
      
      // 繼續作答
      await page.check('input[name="q10"][value="D"]');
      await page.check('input[name="q11"][value="A"]');

      // 測試儲存進度功能
      const saveButton = page.locator('#save-progress-btn');
      if (await saveButton.isVisible()) {
        await saveButton.click();
        
        // 驗證儲存成功提示
        await expect(page.locator('.save-success-message')).toBeVisible();
      }

      // 作答完成，提交答案
      await page.click('#submit-answers-btn');

      // 確認提交對話框
      await page.click('button:has-text("確定提交")');

      // 等待結果頁面載入
      await page.waitForSelector('#results-section', { state: 'visible' });

      // 驗證結果顯示
      await expect(page.locator('.total-score')).toBeVisible();
      await expect(page.locator('.section-scores')).toBeVisible();
      
      // 驗證分數在合理範圍內
      const scoreElement = page.locator('.score-number');
      const scoreText = await scoreElement.textContent();
      const score = parseInt(scoreText);
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);

      // 測試查看詳解功能
      await page.click('button:has-text("查看詳解")');
      await expect(page.locator('.answer-explanations')).toBeVisible();

      // 驗證題目解析顯示
      const explanations = page.locator('.explanation-item');
      await expect(explanations.first()).toBeVisible();
    });

    test('計時器功能正確運作', async ({ page }) => {
      await page.goto('http://localhost:3000/year/114.html');
      
      // 記錄開始時間
      const startTime = await page.evaluate(() => Date.now());

      // 開始考試
      await page.click('#start-exam-btn');

      // 等待5秒
      await page.waitForTimeout(5000);

      // 檢查計時器顯示
      const timerText = await page.locator('#timer').textContent();
      expect(timerText).not.toBe('00:00:00');

      // 驗證時間格式正確
      expect(timerText).toMatch(/^\d{2}:\d{2}:\d{2}$/);
    });

    test('進度自動儲存與恢復', async ({ page }) => {
      await page.goto('http://localhost:3000/year/113.html');

      // 開始考試並作答部分題目
      await page.click('#start-exam-btn');
      await page.check('input[name="q1"][value="A"]');
      await page.check('input[name="q2"][value="B"]');

      // 重新載入頁面
      await page.reload();

      // 等待進度恢復
      await page.waitForSelector('#exam-form');

      // 驗證答案被恢復
      await expect(page.locator('input[name="q1"][value="A"]')).toBeChecked();
      await expect(page.locator('input[name="q2"][value="B"]')).toBeChecked();
    });
  });

  test.describe('學習分析功能測試', () => {
    test.beforeEach(async ({ page }) => {
      // 設置模擬學習資料
      await page.goto('http://localhost:3000');
      await page.evaluate(() => {
        const mockData = [
          {
            year: '114',
            score: 85,
            maxScore: 100,
            completedAt: Date.now() - 86400000,
            timeSpent: 3600000,
            sections: {
              vocabulary: { score: 20, maxScore: 24 },
              reading: { score: 65, maxScore: 76 }
            }
          },
          {
            year: '113',
            score: 78,
            maxScore: 100,
            completedAt: Date.now() - 172800000,
            timeSpent: 4200000
          }
        ];
        localStorage.setItem('gsat_exam_results', JSON.stringify(mockData));
      });
    });

    test('分析頁面正確顯示學習統計', async ({ page }) => {
      await page.goto('http://localhost:3000/analytics.html');

      // 等待頁面載入
      await page.waitForSelector('.analytics-container');

      // 驗證統計卡片顯示
      await expect(page.locator('.stat-card')).toHaveCount.toBeGreaterThan(0);

      // 驗證基本統計資訊
      const totalExamsCard = page.locator('.stat-card').filter({ hasText: '總考試次數' });
      await expect(totalExamsCard).toBeVisible();

      const averageScoreCard = page.locator('.stat-card').filter({ hasText: '平均分數' });
      await expect(averageScoreCard).toBeVisible();

      // 驗證圖表容器存在
      await expect(page.locator('#score-trend-chart')).toBeVisible();
      await expect(page.locator('#section-performance-chart')).toBeVisible();
    });

    test('互動圖表功能正常', async ({ page }) => {
      await page.goto('http://localhost:3000/analytics.html');

      // 等待圖表載入
      await page.waitForSelector('#score-trend-chart .chart-container');

      // 測試圖表互動功能
      const chartContainer = page.locator('#score-trend-chart');
      await chartContainer.hover();

      // 驗證工具提示顯示（如果有的話）
      const tooltip = page.locator('.chart-tooltip');
      if (await tooltip.isVisible()) {
        await expect(tooltip).toContainText(/分數|年份/);
      }

      // 測試圖表篩選功能
      const filterSelect = page.locator('#chart-filter-select');
      if (await filterSelect.isVisible()) {
        await filterSelect.selectOption('last-6-months');
        // 等待圖表更新
        await page.waitForTimeout(1000);
      }
    });

    test('跨年份比較功能', async ({ page }) => {
      // 從考試頁面測試跨年份比較
      await page.goto('http://localhost:3000/year/114.html');

      // 完成考試流程（簡化版）
      await page.click('#start-exam-btn');
      await page.check('input[name="q1"][value="A"]');
      await page.click('#submit-answers-btn');
      await page.click('button:has-text("確定提交")');

      // 等待結果顯示
      await page.waitForSelector('#results-section', { state: 'visible' });

      // 點擊跨年份比較按鈕
      const comparisonButton = page.locator('button:has-text("跨年份比較")');
      if (await comparisonButton.isVisible()) {
        await comparisonButton.click();

        // 驗證比較modal顯示
        await expect(page.locator('#cross-year-modal')).toBeVisible();
        await expect(page.locator('.comparison-chart')).toBeVisible();

        // 測試關閉modal
        await page.click('.modal-close');
        await expect(page.locator('#cross-year-modal')).not.toBeVisible();
      }
    });
  });

  test.describe('響應式設計測試', () => {
    const viewports = [
      { name: '手機', width: 375, height: 667 },
      { name: '平板', width: 768, height: 1024 },
      { name: '桌面', width: 1920, height: 1080 }
    ];

    viewports.forEach(viewport => {
      test(`${viewport.name}螢幕尺寸下介面正常顯示`, async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.goto('http://localhost:3000');

        // 驗證主要元素可見
        await expect(page.locator('h1')).toBeVisible();
        await expect(page.locator('.year-grid')).toBeVisible();

        // 驗證年份卡片佈局
        const yearCards = page.locator('.year-card');
        const cardCount = await yearCards.count();
        expect(cardCount).toBeGreaterThan(0);

        // 測試導航到考試頁面
        await page.click('a[href="year/114.html"]');
        await page.waitForSelector('.exam-container');
        
        // 驗證考試介面在該螢幕尺寸下正常顯示
        await expect(page.locator('#exam-form')).toBeVisible();
      });
    });
  });

  test.describe('無障礙功能測試', () => {
    test('鍵盤導航功能', async ({ page }) => {
      await page.goto('http://localhost:3000');

      // 使用Tab鍵導航
      await page.keyboard.press('Tab');
      
      // 驗證焦點管理
      const focusedElement = await page.evaluate(() => document.activeElement.tagName);
      expect(['A', 'BUTTON', 'INPUT']).toContain(focusedElement);

      // 繼續Tab導航到年份卡片
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');

      // 使用Enter鍵選擇
      await page.keyboard.press('Enter');
    });

    test('螢幕閱讀器友善標籤', async ({ page }) => {
      await page.goto('http://localhost:3000/year/114.html');

      // 驗證表單標籤
      const radioButtons = page.locator('input[type="radio"]');
      const firstRadio = radioButtons.first();
      
      const ariaLabel = await firstRadio.getAttribute('aria-label');
      const labelElement = await page.locator(`label[for="${await firstRadio.getAttribute('id')}"]`);
      
      expect(ariaLabel || await labelElement.textContent()).toBeTruthy();
    });
  });

  test.describe('效能測試', () => {
    test('頁面載入效能', async ({ page }) => {
      const startTime = Date.now();
      await page.goto('http://localhost:3000');
      
      // 等待主要內容載入
      await page.waitForSelector('.year-grid');
      const loadTime = Date.now() - startTime;

      // 頁面載入時間應該在合理範圍內
      expect(loadTime).toBeLessThan(3000); // < 3秒
    });

    test('大量題目渲染效能', async ({ page }) => {
      await page.goto('http://localhost:3000/year/111.html'); // 111年題目較多

      const startTime = Date.now();
      await page.waitForSelector('.question:last-child');
      const renderTime = Date.now() - startTime;

      // 所有題目渲染時間應該合理
      expect(renderTime).toBeLessThan(2000); // < 2秒
    });
  });

  test.describe('跨瀏覽器相容性測試', () => {
    ['chromium', 'firefox', 'webkit'].forEach(browserName => {
      test(`${browserName} 瀏覽器基本功能測試`, async ({ page }) => {
        await page.goto('http://localhost:3000');
        
        // 基本導航功能
        await expect(page.locator('h1')).toBeVisible();
        await page.click('a[href="year/114.html"]');
        await expect(page.locator('.exam-container')).toBeVisible();

        // 基本表單功能
        await page.check('input[name="q1"][value="A"]');
        await expect(page.locator('input[name="q1"][value="A"]')).toBeChecked();
      });
    });
  });
});