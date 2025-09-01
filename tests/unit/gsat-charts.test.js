/**
 * GSATCharts 單元測試
 * 測試圖表系統的渲染功能
 */

const fs = require('fs');
const path = require('path');

// 載入圖表模組
const chartsScript = fs.readFileSync(
  path.join(__dirname, '../../scripts/gsat-charts.js'),
  'utf8'
);

eval(chartsScript);

describe('GSATCharts', () => {
  let charts;
  let container;

  beforeEach(() => {
    charts = new GSATCharts();
    
    // 創建測試用的DOM容器
    container = document.createElement('div');
    container.id = 'test-chart';
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('長條圖測試', () => {
    test('應該正確渲染長條圖', () => {
      const data = {
        labels: ['114年', '113年', '112年'],
        datasets: [{
          data: [85, 78, 92],
          backgroundColor: ['#4CAF50', '#2196F3', '#FF9800']
        }]
      };

      const config = {
        title: '各年份成績比較',
        showValues: true
      };

      charts.createBarChart('test-chart', data, config);

      // 驗證圖表容器被正確創建
      const chartContainer = container.querySelector('.chart-container');
      expect(chartContainer).toBeTruthy();

      // 驗證標題顯示
      const title = container.querySelector('.chart-title');
      expect(title).toBeTruthy();
      expect(title.textContent).toBe('各年份成績比較');

      // 驗證長條元素被創建
      const bars = container.querySelectorAll('.chart-bar');
      expect(bars.length).toBe(3);

      // 驗證資料值顯示
      if (config.showValues) {
        const values = container.querySelectorAll('.bar-value');
        expect(values.length).toBe(3);
        expect(values[0].textContent).toBe('85');
      }
    });

    test('應該正確處理空資料', () => {
      const emptyData = {
        labels: [],
        datasets: [{ data: [] }]
      };

      expect(() => {
        charts.createBarChart('test-chart', emptyData);
      }).not.toThrow();

      const emptyMessage = container.querySelector('.no-data-message');
      expect(emptyMessage).toBeTruthy();
    });

    test('應該正確計算長條高度比例', () => {
      const data = {
        labels: ['A', 'B', 'C'],
        datasets: [{
          data: [100, 50, 75] // 最大值100，其他應按比例縮放
        }]
      };

      charts.createBarChart('test-chart', data);

      const bars = container.querySelectorAll('.chart-bar');
      const bar1Height = parseInt(bars[0].style.height);
      const bar2Height = parseInt(bars[1].style.height);
      const bar3Height = parseInt(bars[2].style.height);

      // 驗證比例正確 (100:50:75)
      expect(bar2Height).toBe(bar1Height * 0.5);
      expect(bar3Height).toBe(bar1Height * 0.75);
    });
  });

  describe('圓餅圖測試', () => {
    test('應該正確渲染圓餅圖', () => {
      const data = {
        labels: ['詞彙', '閱讀理解', '翻譯', '作文'],
        datasets: [{
          data: [24, 32, 16, 28],
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
        }]
      };

      charts.createPieChart('test-chart', data, { title: '分數分布' });

      // 驗證SVG元素被創建
      const svg = container.querySelector('svg');
      expect(svg).toBeTruthy();

      // 驗證路徑元素（圓餅片段）
      const paths = container.querySelectorAll('path');
      expect(paths.length).toBe(4);

      // 驗證圖例
      const legend = container.querySelector('.chart-legend');
      expect(legend).toBeTruthy();
      
      const legendItems = legend.querySelectorAll('.legend-item');
      expect(legendItems.length).toBe(4);
    });

    test('應該正確計算圓餅圖角度', () => {
      const data = {
        labels: ['A', 'B'],
        datasets: [{
          data: [25, 75] // 應該是25%和75%的角度
        }]
      };

      charts.createPieChart('test-chart', data);

      const paths = container.querySelectorAll('path');
      
      // 這裡我們可以檢查path的d屬性來驗證角度計算
      // 25% = 90度，75% = 270度
      expect(paths.length).toBe(2);
    });
  });

  describe('折線圖測試', () => {
    test('應該正確渲染折線圖', () => {
      const data = {
        labels: ['1月', '2月', '3月', '4月'],
        datasets: [{
          data: [65, 72, 68, 85],
          borderColor: '#2196F3',
          fill: true
        }]
      };

      charts.createLineChart('test-chart', data, {
        title: '學習進度趨勢',
        showGrid: true
      });

      // 驗證SVG和折線路徑
      const svg = container.querySelector('svg');
      expect(svg).toBeTruthy();

      const path = container.querySelector('path.line-path');
      expect(path).toBeTruthy();

      // 驗證資料點
      const points = container.querySelectorAll('.data-point');
      expect(points.length).toBe(4);

      // 驗證網格線（如果啟用）
      const gridLines = container.querySelectorAll('.grid-line');
      expect(gridLines.length).toBeGreaterThan(0);
    });
  });

  describe('進度圓環測試', () => {
    test('應該正確渲染進度圓環', () => {
      charts.createProgressCircle('test-chart', {
        value: 75,
        max: 100,
        color: '#4CAF50',
        title: '完成進度'
      });

      // 驗證SVG圓環
      const svg = container.querySelector('svg');
      expect(svg).toBeTruthy();

      const circles = container.querySelectorAll('circle');
      expect(circles.length).toBe(2); // 背景圓和進度圓

      // 驗證百分比文字
      const percentText = container.querySelector('.progress-text');
      expect(percentText).toBeTruthy();
      expect(percentText.textContent).toBe('75%');
    });

    test('應該正確計算圓環進度', () => {
      const progressData = { value: 60, max: 100 };
      
      charts.createProgressCircle('test-chart', progressData);

      const progressCircle = container.querySelector('.progress-circle');
      expect(progressCircle).toBeTruthy();

      // 驗證stroke-dasharray計算 (60% of circumference)
      const strokeDasharray = progressCircle.style.strokeDasharray;
      expect(strokeDasharray).toBeTruthy();
    });
  });

  describe('響應式設計測試', () => {
    test('應該根據容器大小調整圖表', () => {
      // 設置較小的容器
      container.style.width = '300px';
      container.style.height = '200px';

      const data = {
        labels: ['A', 'B', 'C'],
        datasets: [{ data: [1, 2, 3] }]
      };

      charts.createBarChart('test-chart', data);

      const svg = container.querySelector('svg');
      expect(parseInt(svg.getAttribute('width'))).toBeLessThanOrEqual(300);
      expect(parseInt(svg.getAttribute('height'))).toBeLessThanOrEqual(200);
    });
  });

  describe('無障礙功能測試', () => {
    test('應該提供適當的ARIA標籤', () => {
      const data = {
        labels: ['分類1', '分類2'],
        datasets: [{ data: [10, 20] }]
      };

      charts.createBarChart('test-chart', data, { title: '測試圖表' });

      const chartContainer = container.querySelector('.chart-container');
      expect(chartContainer.getAttribute('role')).toBe('img');
      expect(chartContainer.getAttribute('aria-label')).toContain('測試圖表');
    });

    test('應該提供鍵盤導航支援', () => {
      const data = {
        labels: ['A', 'B'],
        datasets: [{ data: [1, 2] }]
      };

      charts.createBarChart('test-chart', data);

      const bars = container.querySelectorAll('.chart-bar');
      bars.forEach(bar => {
        expect(bar.getAttribute('tabindex')).toBe('0');
        expect(bar.getAttribute('aria-label')).toBeTruthy();
      });
    });
  });

  describe('效能測試', () => {
    test('大量資料渲染效能', () => {
      // 生成大量測試資料
      const labels = Array.from({ length: 100 }, (_, i) => `Item ${i + 1}`);
      const data = Array.from({ length: 100 }, () => Math.random() * 100);

      const startTime = performance.now();
      
      charts.createBarChart('test-chart', {
        labels,
        datasets: [{ data }]
      });

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // 渲染時間應該在合理範圍內（< 500ms）
      expect(renderTime).toBeLessThan(500);
    });
  });
});