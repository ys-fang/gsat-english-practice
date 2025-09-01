/**
 * GSAT Analytics - Firebase 數據分析整合
 * 為學測英文練習系統提供完整的數據收集和分析功能
 */

import AnswerCollector from './answer-collector.js';
import { userIdentification } from './user-identification.js';
import { CONFIG } from './config.js';

export class GSATAnalytics {
  constructor() {
    this.collector = null;
    this.currentExamYear = null;
    this.isInitialized = false;
    this.debugMode = false;
  }

  /**
   * 初始化分析系統
   */
  async initialize(examYear, options = {}) {
    try {
      this.currentExamYear = examYear;
      this.debugMode = options.debug || false;
      
      // 初始化答題收集器
      this.collector = new AnswerCollector(examYear);
      
      // 等待初始化完成
      await new Promise(resolve => {
        const checkInitialized = () => {
          if (this.collector.userId) {
            resolve();
          } else {
            setTimeout(checkInitialized, 100);
          }
        };
        checkInitialized();
      });
      
      this.isInitialized = true;
      
      if (this.debugMode) {
        console.log('🚀 GSAT Analytics 已初始化:', {
          examYear: this.currentExamYear,
          userId: this.collector.userId.substring(0, 8) + '...',
          totalQuestions: CONFIG.TOTAL_QUESTIONS[examYear]
        });
      }
      
      // 顯示數據收集通知（符合隱私規範）
      this.showDataCollectionNotice();
      
      return true;
      
    } catch (error) {
      console.error('❌ GSAT Analytics 初始化失敗:', error);
      this.isInitialized = false;
      return false;
    }
  }

  /**
   * 記錄答題 - 主要API
   */
  async recordAnswer(questionNumber, userAnswer, correctAnswer, timeSpent = 0) {
    if (!this.isInitialized || !this.collector) {
      console.warn('⚠️ Analytics 未初始化，答題記錄被跳過');
      return false;
    }

    try {
      await this.collector.recordAnswer(
        questionNumber, 
        userAnswer, 
        correctAnswer, 
        timeSpent
      );
      
      if (this.debugMode) {
        console.log(`📊 Q${questionNumber}: ${userAnswer} → ${correctAnswer} (${timeSpent}ms)`);
      }
      
      return true;
      
    } catch (error) {
      console.error('❌ 記錄答題失敗:', error);
      return false;
    }
  }

  /**
   * 完成考試 - 主要API
   */
  async finalizeExam(finalScore, totalTime, maxScore = null, sectionResults = null) {
    if (!this.isInitialized || !this.collector) {
      console.warn('⚠️ Analytics 未初始化，無法完成考試記錄');
      return null;
    }

    try {
      const sessionId = await this.collector.finalizeExam(finalScore, totalTime, maxScore, sectionResults);
      
      if (this.debugMode) {
        console.log('🎯 考試完成:', {
          sessionId: sessionId,
          finalScore: finalScore,
          totalTime: totalTime,
          maxScore: maxScore,
          sectionResults: sectionResults,
          examYear: this.currentExamYear
        });
      }
      
      // 顯示完成通知
      this.showCompletionSummary(finalScore, totalTime);
      
      return sessionId;
      
    } catch (error) {
      console.error('❌ 完成考試記錄失敗:', error);
      return null;
    }
  }

  /**
   * 獲取當前統計
   */
  getCurrentStats() {
    if (!this.isInitialized || !this.collector) {
      return {
        completedQuestions: 0,
        currentScore: 0,
        accuracy: 0,
        timeElapsed: 0,
        error: 'Analytics not initialized'
      };
    }

    return this.collector.getCurrentStats();
  }

  /**
   * 獲取用戶歷史統計
   */
  getUserHistory() {
    return userIdentification.getUserStats();
  }

  /**
   * 手動保存數據
   */
  async saveProgress() {
    if (!this.isInitialized || !this.collector) {
      return false;
    }

    try {
      await this.collector.flushBatch();
      console.log('💾 進度已手動保存');
      return true;
    } catch (error) {
      console.error('❌ 手動保存失敗:', error);
      return false;
    }
  }

  /**
   * 顯示數據收集通知
   */
  showDataCollectionNotice() {
    // 檢查是否已經顯示過通知
    const hasShownNotice = localStorage.getItem('gsat_data_notice_shown');
    if (hasShownNotice) return;

    const isReturningUser = userIdentification.isReturningUser();
    
    const noticeHTML = `
      <div id="gsat-data-notice" style="
        position: fixed; top: 20px; right: 20px; 
        background: rgba(50, 186, 174, 0.95); color: white;
        padding: 15px 20px; border-radius: 8px; 
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        max-width: 350px; z-index: 10000;
        font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        font-size: 14px; line-height: 1.4;
      ">
        <div style="display: flex; align-items: start; gap: 10px;">
          <div style="font-size: 18px;">📊</div>
          <div>
            <div style="font-weight: bold; margin-bottom: 5px;">
              ${isReturningUser ? '歡迎回來！' : '數據收集說明'}
            </div>
            <div style="margin-bottom: 10px; opacity: 0.9;">
              我們收集匿名答題數據以改善學習體驗。
              ${isReturningUser ? '您的學習記錄將持續追蹤。' : '不收集個人資料，可隨時停用。'}
            </div>
            <button onclick="this.parentElement.parentElement.parentElement.style.display='none'" 
                    style="background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.3); 
                           color: white; padding: 5px 12px; border-radius: 4px; cursor: pointer; font-size: 12px;">
              了解 ✓
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', noticeHTML);
    
    // 3秒後自動隱藏
    setTimeout(() => {
      const notice = document.getElementById('gsat-data-notice');
      if (notice) {
        notice.style.opacity = '0';
        notice.style.transition = 'opacity 0.3s ease';
        setTimeout(() => notice.remove(), 300);
      }
    }, 8000);

    localStorage.setItem('gsat_data_notice_shown', 'true');
  }

  /**
   * 顯示完成摘要
   */
  showCompletionSummary(finalScore, totalTime) {
    const stats = this.getCurrentStats();
    const minutes = Math.floor(totalTime / 60000);
    const seconds = Math.floor((totalTime % 60000) / 1000);
    
    const summaryHTML = `
      <div id="gsat-completion-summary" style="
        position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
        background: white; border: 3px solid var(--jutor-primary, #32BAAE);
        border-radius: 12px; padding: 25px; box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        max-width: 400px; z-index: 10001; text-align: center;
        font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      ">
        <div style="font-size: 24px; margin-bottom: 15px;">🎯</div>
        <h3 style="color: var(--jutor-primary, #32BAAE); margin-bottom: 15px;">
          考試完成！
        </h3>
        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span>最終分數：</span>
            <strong>${finalScore} 分</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span>答題時間：</span>
            <strong>${minutes}:${seconds.toString().padStart(2, '0')}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span>正確率：</span>
            <strong>${(stats.accuracy * 100).toFixed(1)}%</strong>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span>完成題數：</span>
            <strong>${stats.completedQuestions}/${stats.totalQuestions}</strong>
          </div>
        </div>
        <div style="font-size: 12px; color: #666; margin-bottom: 15px;">
          📊 答題數據已安全保存用於學習分析
        </div>
        <button onclick="document.getElementById('gsat-completion-summary').remove()" 
                style="background: var(--jutor-primary, #32BAAE); color: white; border: none;
                       padding: 10px 20px; border-radius: 6px; cursor: pointer; font-weight: bold;">
          確定
        </button>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', summaryHTML);
  }

  /**
   * 啟用調試模式
   */
  enableDebug() {
    this.debugMode = true;
    console.log('🔍 GSAT Analytics 調試模式已啟用');
  }

  /**
   * 停用數據收集
   */
  disableTracking() {
    localStorage.setItem('gsat_tracking_disabled', 'true');
    this.isInitialized = false;
    console.log('🚫 GSAT Analytics 數據收集已停用');
  }

  /**
   * 檢查數據收集是否被停用
   */
  isTrackingDisabled() {
    return localStorage.getItem('gsat_tracking_disabled') === 'true';
  }

  /**
   * 重新啟用數據收集
   */
  enableTracking() {
    localStorage.removeItem('gsat_tracking_disabled');
    console.log('✅ GSAT Analytics 數據收集已重新啟用');
  }

  /**
   * 獲取離線備份數據
   */
  getOfflineBackups() {
    const backups = [];
    
    // 檢查考試備份
    CONFIG.EXAM_YEARS.forEach(year => {
      const backup = localStorage.getItem(`exam_backup_${year}`);
      if (backup) {
        try {
          backups.push(JSON.parse(backup));
        } catch (e) {
          console.warn(`⚠️ 無法解析 ${year} 年備份數據`);
        }
      }
    });
    
    // 檢查失敗提交
    const failedSubmissions = localStorage.getItem('failed_submissions');
    if (failedSubmissions) {
      try {
        const failed = JSON.parse(failedSubmissions);
        backups.push(...failed);
      } catch (e) {
        console.warn('⚠️ 無法解析失敗提交數據');
      }
    }
    
    return backups;
  }

  /**
   * 導出用戶數據（GDPR合規）
   */
  async exportUserData() {
    const userData = {
      user_id: this.collector?.userId,
      export_timestamp: new Date().toISOString(),
      user_stats: this.getUserHistory(),
      current_session: this.getCurrentStats(),
      offline_backups: this.getOfflineBackups(),
      privacy_settings: {
        tracking_disabled: this.isTrackingDisabled(),
        data_notice_shown: localStorage.getItem('gsat_data_notice_shown') === 'true'
      }
    };
    
    return userData;
  }
}

// 創建全局實例
export const gsatAnalytics = new GSATAnalytics();

// 為了向後兼容，也導出類
export default GSATAnalytics;