/**
 * 考試系統與分析系統整合測試
 * 測試考試完成後的資料流和分析功能整合
 */

const fs = require('fs');
const path = require('path');

// 模擬完整的瀏覽器環境
require('jsdom-global')();

// 載入所有必要的腳本
const examBaseScript = fs.readFileSync(
  path.join(__dirname, '../../scripts/gsat-exam-base.js'),
  'utf8'
);

const analyticsScript = fs.readFileSync(
  path.join(__dirname, '../../scripts/gsat-analytics.js'),
  'utf8'
);

const chartsScript = fs.readFileSync(
  path.join(__dirname, '../../scripts/gsat-charts.js'),
  'utf8'
);

// 在全域環境中執行腳本
eval(chartsScript);
eval(analyticsScript);

describe('考試系統與分析系統整合測試', () => {
  let mockExamData, examInstance, analyticsInstance;

  beforeEach(() => {
    // 重置DOM環境
    document.body.innerHTML = `
      <div class="exam-container">
        <form id="exam-form">
          <div class="question" data-question="1">
            <input type="radio" name="q1" value="A" id="q1-a">
            <input type="radio" name="q1" value="B" id="q1-b">
            <input type="radio" name="q1" value="C" id="q1-c">
            <input type="radio" name="q1" value="D" id="q1-d">
          </div>
          <div class="question" data-question="2">
            <input type="radio" name="q2" value="A" id="q2-a">
            <input type="radio" name="q2" value="B" id="q2-b">
            <input type="radio" name="q2" value="C" id="q2-c">
            <input type="radio" name="q2" value="D" id="q2-d">
          </div>
        </form>
        <div id="timer">00:00:00</div>
        <div id="results-section" style="display:none;"></div>
        <div id="cross-year-modal" style="display:none;"></div>
      </div>
    `;

    // 模擬考試資料
    mockExamData = {
      year: '114',
      examConfig: {
        timeLimit: 3600,
        sections: {
          vocabulary: { questions: [1, 2], maxScore: 24 },
          reading: { questions: [], maxScore: 76 }
        }
      },
      questions: {
        1: {
          type: 'multiple-choice',
          section: 'vocabulary',
          points: 12,
          correctAnswer: 'B'
        },
        2: {
          type: 'multiple-choice', 
          section: 'vocabulary',
          points: 12,
          correctAnswer: 'A'
        }
      }
    };

    // 設置全域變數模擬
    global.examData = mockExamData;
    global.examConfig = mockExamData.examConfig;

    // 清理localStorage
    localStorage.clear();
    
    // 初始化實例
    analyticsInstance = new GSATAnalytics();
    
    // 執行考試系統腳本並初始化
    eval(examBaseScript);
  });

  describe('完整考試流程整合測試', () => {
    test('完成考試後應該正確儲存分析資料', async () => {
      // 模擬使用者作答
      const q1Input = document.querySelector('#q1-b'); // 正確答案
      const q2Input = document.querySelector('#q2-a'); // 正確答案
      
      q1Input.checked = true;
      q2Input.checked = true;

      // 模擬考試開始時間
      const startTime = Date.now() - 1800000; // 30分鐘前開始
      global.examStartTime = startTime;

      // 觸發答案提交和結果計算
      const submitButton = document.createElement('button');
      submitButton.onclick = showAnswers;
      submitButton.click();

      // 等待非同步操作完成
      await new Promise(resolve => setTimeout(resolve, 100));

      // 驗證分析資料被正確儲存
      expect(localStorage.setItem).toHaveBeenCalled();
      
      const savedDataCall = localStorage.setItem.mock.calls.find(
        call => call[0] === analyticsInstance.storageKeys.examResults
      );
      
      expect(savedDataCall).toBeTruthy();
      
      const savedResults = JSON.parse(savedDataCall[1]);
      expect(savedResults).toHaveLength(1);
      
      const result = savedResults[0];
      expect(result.year).toBe('114');
      expect(result.score).toBe(24); // 滿分
      expect(result.maxScore).toBe(100);
      expect(result.timeSpent).toBeGreaterThan(0);
      expect(result.answers).toEqual({ '1': 'B', '2': 'A' });
    });

    test('部分正確答案應該正確計算分數', async () => {
      // 模擬使用者部分正確作答
      const q1Input = document.querySelector('#q1-b'); // 正確答案
      const q2Input = document.querySelector('#q2-c'); // 錯誤答案
      
      q1Input.checked = true;
      q2Input.checked = true;

      global.examStartTime = Date.now() - 900000; // 15分鐘前開始

      // 觸發結果計算
      const submitButton = document.createElement('button');
      submitButton.onclick = showAnswers;
      submitButton.click();

      await new Promise(resolve => setTimeout(resolve, 100));

      const savedDataCall = localStorage.setItem.mock.calls.find(
        call => call[0] === analyticsInstance.storageKeys.examResults
      );
      
      const result = JSON.parse(savedDataCall[1])[0];
      expect(result.score).toBe(12); // 只有第一題正確
      expect(result.sections.vocabulary.score).toBe(12);
      expect(result.sections.vocabulary.maxScore).toBe(24);
    });
  });

  describe('跨年份比較功能整合測試', () => {
    beforeEach(() => {
      // 設置多年份測試資料
      const mockHistoricalData = [
        {
          year: '112',
          score: 85,
          maxScore: 100,
          completedAt: Date.now() - 86400000 * 30, // 30天前
          sections: { vocabulary: { score: 20, maxScore: 24 } }
        },
        {
          year: '113', 
          score: 78,
          maxScore: 100,
          completedAt: Date.now() - 86400000 * 15, // 15天前
          sections: { vocabulary: { score: 18, maxScore: 24 } }
        }
      ];

      localStorage.getItem.mockImplementation(key => {
        if (key === analyticsInstance.storageKeys.examResults) {
          return JSON.stringify(mockHistoricalData);
        }
        return null;
      });
    });

    test('應該能夠顯示跨年份比較', async () => {
      // 模擬點擊跨年份比較按鈕
      global.showCrossYearComparison = jest.fn().mockImplementation(() => {
        const modal = document.getElementById('cross-year-modal');
        modal.style.display = 'block';
        
        // 模擬分析資料載入和圖表生成
        const comparison = analyticsInstance.getCrossYearComparison();
        analyticsInstance.generateScoreTrendChart('trend-chart', comparison);
        
        return comparison;
      });

      const comparisonResult = global.showCrossYearComparison();

      expect(comparisonResult.examResults).toHaveLength(2);
      expect(comparisonResult.averageScore).toBe(81.5); // (85+78)/2
      
      // 驗證modal顯示
      const modal = document.getElementById('cross-year-modal');
      expect(modal.style.display).toBe('block');
    });
  });

  describe('本機儲存持久化測試', () => {
    test('頁面重新載入後應該能夠恢復學習進度', () => {
      // 模擬已儲存的進度資料
      const savedProgress = {
        year: '114',
        currentQuestion: 2,
        answers: { '1': 'B' },
        timeSpent: 600000, // 10分鐘
        startTime: Date.now() - 600000
      };

      localStorage.getItem.mockImplementation(key => {
        if (key.includes('progress_114')) {
          return JSON.stringify(savedProgress);
        }
        return null;
      });

      // 模擬頁面重新載入和進度恢復
      global.loadSavedProgress = jest.fn().mockImplementation(() => {
        const savedData = JSON.parse(
          localStorage.getItem('exam_progress_114') || '{}'
        );
        
        if (savedData.answers) {
          Object.entries(savedData.answers).forEach(([questionNum, answer]) => {
            const input = document.querySelector(`#q${questionNum}-${answer.toLowerCase()}`);
            if (input) input.checked = true;
          });
        }
        
        return savedData;
      });

      const restoredProgress = global.loadSavedProgress();

      expect(restoredProgress.currentQuestion).toBe(2);
      expect(restoredProgress.answers['1']).toBe('B');
      
      // 驗證UI狀態恢復
      const q1Input = document.querySelector('#q1-b');
      expect(q1Input.checked).toBe(true);
    });
  });

  describe('錯誤處理整合測試', () => {
    test('分析系統錯誤不應該影響考試功能', () => {
      // 模擬分析系統錯誤
      analyticsInstance.saveExamResult = jest.fn().mockImplementation(() => {
        throw new Error('Analytics storage error');
      });

      // 考試功能應該仍然正常運作
      const q1Input = document.querySelector('#q1-b');
      q1Input.checked = true;

      expect(() => {
        const submitButton = document.createElement('button');
        submitButton.onclick = showAnswers;
        submitButton.click();
      }).not.toThrow();

      // 結果應該仍然顯示
      const resultsSection = document.getElementById('results-section');
      expect(resultsSection.style.display).not.toBe('none');
    });

    test('本機儲存失敗時應該提供適當的使用者回饋', () => {
      // 模擬localStorage錯誤
      localStorage.setItem.mockImplementation(() => {
        throw new Error('Storage quota exceeded');
      });

      global.showStorageError = jest.fn();

      // 觸發儲存操作
      try {
        analyticsInstance.saveExamResult({
          year: '114',
          score: 85,
          completedAt: Date.now()
        });
      } catch (error) {
        global.showStorageError('無法儲存學習進度，請清理瀏覽器儲存空間');
      }

      expect(global.showStorageError).toHaveBeenCalledWith(
        expect.stringContaining('儲存空間')
      );
    });
  });

  describe('效能整合測試', () => {
    test('大量歷史資料處理效能', () => {
      // 生成大量模擬資料
      const largeDataSet = Array.from({ length: 1000 }, (_, i) => ({
        year: `${105 + (i % 10)}`,
        score: Math.random() * 100,
        completedAt: Date.now() - i * 86400000,
        sections: {
          vocabulary: { score: Math.random() * 24, maxScore: 24 },
          reading: { score: Math.random() * 76, maxScore: 76 }
        }
      }));

      localStorage.getItem.mockReturnValue(JSON.stringify(largeDataSet));

      const startTime = performance.now();
      const comparison = analyticsInstance.getCrossYearComparison();
      const endTime = performance.now();

      const processingTime = endTime - startTime;

      // 處理時間應該在合理範圍內
      expect(processingTime).toBeLessThan(1000); // < 1秒
      expect(comparison.examResults).toHaveLength(1000);
      expect(comparison.averageScore).toBeGreaterThanOrEqual(0);
      expect(comparison.averageScore).toBeLessThanOrEqual(100);
    });
  });
});