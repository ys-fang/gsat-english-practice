/**
 * GSATAnalytics 單元測試
 * 測試分析系統的核心功能
 */

// Mock the GSATCharts dependency
const mockCharts = {
  createBarChart: jest.fn(),
  createPieChart: jest.fn(), 
  createLineChart: jest.fn(),
  createProgressCircle: jest.fn()
};

global.GSATCharts = jest.fn(() => mockCharts);

// Import the module after mocking dependencies
const fs = require('fs');
const path = require('path');
const analyticsScript = fs.readFileSync(
  path.join(__dirname, '../../scripts/gsat-analytics.js'),
  'utf8'
);

// Execute the script in the global context
eval(analyticsScript);

describe('GSATAnalytics', () => {
  let analytics;

  beforeEach(() => {
    analytics = new GSATAnalytics();
    localStorage.clear();
  });

  describe('基本功能測試', () => {
    test('應該正確初始化', () => {
      expect(analytics).toBeDefined();
      expect(analytics.storageKeys).toBeDefined();
      expect(analytics.charts).toBeDefined();
    });

    test('應該有正確的儲存鍵值', () => {
      const expectedKeys = [
        'examResults',
        'userProfile', 
        'studyGoals',
        'practiceStats'
      ];
      
      expectedKeys.forEach(key => {
        expect(analytics.storageKeys[key]).toBeDefined();
      });
    });
  });

  describe('考試結果儲存測試', () => {
    test('應該正確儲存考試結果', () => {
      const examResult = {
        year: '114',
        score: 85,
        maxScore: 100,
        completedAt: Date.now(),
        timeSpent: 3600000, // 1 hour in ms
        answers: { '1': 'A', '2': 'B', '3': 'C' },
        correctAnswers: ['A', 'B', 'C'],
        sections: {
          vocabulary: { score: 20, maxScore: 24 },
          reading: { score: 65, maxScore: 76 }
        }
      };

      analytics.saveExamResult(examResult);

      const savedData = localStorage.setItem.mock.calls[0];
      expect(savedData[0]).toBe(analytics.storageKeys.examResults);
      
      const parsedData = JSON.parse(savedData[1]);
      expect(parsedData).toHaveLength(1);
      expect(parsedData[0]).toMatchObject(examResult);
    });

    test('應該正確處理多個考試結果', () => {
      const results = [
        { year: '114', score: 85, completedAt: Date.now() - 86400000 },
        { year: '113', score: 78, completedAt: Date.now() - 172800000 },
        { year: '112', score: 92, completedAt: Date.now() - 259200000 }
      ];

      results.forEach(result => analytics.saveExamResult(result));

      const finalCall = localStorage.setItem.mock.calls[2];
      const savedResults = JSON.parse(finalCall[1]);
      expect(savedResults).toHaveLength(3);
    });
  });

  describe('跨年份比較測試', () => {
    beforeEach(() => {
      // 設置測試資料
      const mockResults = [
        { year: '114', score: 85, maxScore: 100, completedAt: Date.now() - 86400000 },
        { year: '113', score: 78, maxScore: 100, completedAt: Date.now() - 172800000 },
        { year: '112', score: 92, maxScore: 100, completedAt: Date.now() - 259200000 },
        { year: '111', score: 73, maxScore: 100, completedAt: Date.now() - 345600000 }
      ];
      
      localStorage.getItem.mockReturnValue(JSON.stringify(mockResults));
    });

    test('應該正確計算平均分數', () => {
      const comparison = analytics.getCrossYearComparison();
      
      expect(comparison).toBeDefined();
      expect(comparison.averageScore).toBe(82); // (85+78+92+73)/4
    });

    test('應該正確識別最高和最低分數', () => {
      const comparison = analytics.getCrossYearComparison();
      
      expect(comparison.highestScore).toMatchObject({
        year: '112',
        score: 92
      });
      
      expect(comparison.lowestScore).toMatchObject({
        year: '111', 
        score: 73
      });
    });

    test('應該正確計算分數趨勢', () => {
      const comparison = analytics.getCrossYearComparison();
      
      expect(comparison.trends).toBeDefined();
      expect(comparison.trends.length).toBe(4);
      
      // 驗證趨勢資料結構
      comparison.trends.forEach(trend => {
        expect(trend).toHaveProperty('year');
        expect(trend).toHaveProperty('score');
        expect(trend).toHaveProperty('improvement');
      });
    });
  });

  describe('學習統計測試', () => {
    test('應該正確計算學習時數', () => {
      const mockResults = [
        { timeSpent: 3600000 }, // 1 hour
        { timeSpent: 5400000 }, // 1.5 hours  
        { timeSpent: 7200000 }  // 2 hours
      ];
      
      localStorage.getItem.mockReturnValue(JSON.stringify(mockResults));
      
      const stats = analytics.getStudyStatistics();
      expect(stats.totalStudyTime).toBe(16200000); // 4.5 hours in ms
      expect(stats.averageStudyTime).toBe(5400000); // 1.5 hours in ms
    });

    test('應該正確計算完成率', () => {
      const mockResults = [
        { year: '114', completed: true },
        { year: '113', completed: true },
        { year: '112', completed: false },
        { year: '111', completed: true }
      ];
      
      localStorage.getItem.mockReturnValue(JSON.stringify(mockResults));
      
      const stats = analytics.getStudyStatistics();
      expect(stats.completionRate).toBe(0.75); // 3/4 = 75%
    });
  });

  describe('資料驗證測試', () => {
    test('應該拒絕無效的考試結果', () => {
      const invalidResult = {
        // 缺少必要欄位
        score: 85
      };

      expect(() => {
        analytics.saveExamResult(invalidResult);
      }).toThrow();
    });

    test('應該處理損壞的localStorage資料', () => {
      localStorage.getItem.mockReturnValue('invalid json');
      
      expect(() => {
        analytics.getCrossYearComparison();
      }).not.toThrow();
      
      // 應該返回空的預設結果
      const result = analytics.getCrossYearComparison();
      expect(result.examResults).toEqual([]);
    });
  });

  describe('圖表整合測試', () => {
    test('應該正確調用圖表生成方法', () => {
      const mockData = {
        years: ['112', '113', '114'],
        scores: [92, 78, 85]
      };

      analytics.generateScoreTrendChart('chart-container', mockData);

      expect(mockCharts.createLineChart).toHaveBeenCalledWith(
        'chart-container',
        expect.objectContaining({
          labels: mockData.years,
          data: mockData.scores
        }),
        expect.any(Object)
      );
    });
  });
});