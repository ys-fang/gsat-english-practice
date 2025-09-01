/**
 * 答題資料收集系統
 * 負責收集、批次保存和分析學生答題數據
 */

import { collection, doc, addDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db, COLLECTIONS, CONFIG } from './config.js';
import { userIdentification } from './user-identification.js';

export class AnswerCollector {
  constructor(examYear) {
    this.examYear = examYear;
    this.userId = null;
    this.sessionId = null;
    
    // 答題數據緩存
    this.pendingAnswers = [];
    this.allAnswers = {};
    this.sessionData = {
      start_time: Date.now(),
      total_questions: CONFIG.TOTAL_QUESTIONS[examYear] || 46,
      completed_questions: 0,
      current_score: 0
    };
    
    // 狀態管理
    this.lastSaved = Date.now();
    this.isSubmitting = false;
    this.retryQueue = [];
    
    this.initialize();
  }

  /**
   * 初始化收集器
   */
  async initialize() {
    try {
      // 獲取用戶ID
      this.userId = await userIdentification.getUserId();
      
      // 生成會話ID
      this.sessionId = this.generateSessionId();
      
      // 嘗試恢復之前的會話（如果有）
      await this.restoreSession();
      
      // 設置自動保存
      this.setupAutoSave();
      
      // 設置頁面離開監聽
      this.setupBeforeUnload();
      
      console.log(`✅ 答題收集器已初始化 - 年度: ${this.examYear}, 用戶: ${this.userId.substring(0, 8)}...`);
      
    } catch (error) {
      console.error('❌ 答題收集器初始化失敗:', error);
      // 降級到離線模式
      this.userId = 'offline_' + Date.now();
      this.sessionId = this.generateSessionId();
    }
  }

  /**
   * 生成會話ID
   */
  generateSessionId() {
    return `${this.examYear}_${this.userId}_${Date.now().toString(36)}`;
  }

  /**
   * 記錄答題
   */
  async recordAnswer(questionNumber, userAnswer, correctAnswer, timeSpent = 0) {
    const answerData = {
      question_number: parseInt(questionNumber),
      user_answer: userAnswer,
      correct_answer: correctAnswer,
      is_correct: userAnswer === correctAnswer,
      time_spent: timeSpent,
      timestamp: Date.now(),
      sequence: this.pendingAnswers.length + 1
    };

    // 加入暫存
    this.pendingAnswers.push(answerData);
    this.allAnswers[questionNumber] = answerData;
    
    // 更新會話統計
    this.updateSessionStats(answerData);
    
    // 本地備份
    this.saveToLocalStorage();
    
    // 檢查是否需要批次保存
    if (this.shouldFlushBatch()) {
      await this.flushBatch();
    }
    
    console.log(`📝 記錄答題 Q${questionNumber}: ${userAnswer} (${answerData.is_correct ? '✓' : '✗'})`);
  }

  /**
   * 更新會話統計
   */
  updateSessionStats(answerData) {
    this.sessionData.completed_questions++;
    
    if (answerData.is_correct) {
      // 根據題目類型計分
      const points = this.getQuestionPoints(answerData.question_number);
      this.sessionData.current_score += points;
    }
    
    this.sessionData.last_activity = Date.now();
  }

  /**
   * 獲取題目分數
   */
  getQuestionPoints(questionNumber) {
    // 114年學測計分規則
    if (questionNumber <= 30) {
      return 1; // 詞彙、綜合測驗、文意選填：1分
    } else if (questionNumber <= 34) {
      return 2; // 篇章結構：2分
    } else {
      return 2; // 閱讀測驗：2分
    }
  }

  /**
   * 檢查是否應該批次保存
   */
  shouldFlushBatch() {
    const timePassed = Date.now() - this.lastSaved > CONFIG.AUTO_SAVE_INTERVAL;
    const batchFull = this.pendingAnswers.length >= CONFIG.BATCH_SIZE;
    return timePassed || batchFull;
  }

  /**
   * 批次保存到 Firebase
   */
  async flushBatch() {
    if (this.pendingAnswers.length === 0 || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;

    try {
      const batchData = {
        user_id: this.userId,
        session_id: this.sessionId,
        exam_year: this.examYear,
        batch_timestamp: serverTimestamp(),
        answers: [...this.pendingAnswers], // 創建副本
        session_stats: { ...this.sessionData }
      };

      // 保存到 Firebase
      const docRef = await addDoc(collection(db, COLLECTIONS.ANSWERS), batchData);
      
      // 清空已保存的暫存
      this.pendingAnswers = [];
      this.lastSaved = Date.now();
      
      console.log(`💾 批次保存成功: ${docRef.id} (${batchData.answers.length} 題)`);
      
    } catch (error) {
      console.error('❌ 批次保存失敗:', error);
      
      // 加入重試隊列
      this.retryQueue.push({
        data: [...this.pendingAnswers],
        timestamp: Date.now(),
        retryCount: 0
      });
      
      // 嘗試重試
      setTimeout(() => this.processRetryQueue(), 5000);
      
    } finally {
      this.isSubmitting = false;
    }
  }

  /**
   * 處理重試隊列
   */
  async processRetryQueue() {
    if (this.retryQueue.length === 0 || this.isSubmitting) return;
    
    const retryItem = this.retryQueue.shift();
    
    if (retryItem.retryCount >= CONFIG.MAX_RETRY_ATTEMPTS) {
      console.error('❌ 重試次數超限，數據將保留在本地');
      this.saveFailedDataLocally(retryItem.data);
      return;
    }

    try {
      const batchData = {
        user_id: this.userId,
        session_id: this.sessionId,
        exam_year: this.examYear,
        batch_timestamp: serverTimestamp(),
        answers: retryItem.data,
        retry_attempt: retryItem.retryCount + 1,
        original_timestamp: retryItem.timestamp
      };

      await addDoc(collection(db, COLLECTIONS.ANSWERS), batchData);
      console.log(`🔄 重試保存成功 (第${retryItem.retryCount + 1}次)`);
      
    } catch (error) {
      // 重新加入隊列，增加重試計數
      retryItem.retryCount++;
      this.retryQueue.push(retryItem);
      
      // 指數退避
      const delay = Math.min(30000, 5000 * Math.pow(2, retryItem.retryCount));
      setTimeout(() => this.processRetryQueue(), delay);
    }
  }

  /**
   * 完成考試
   */
  async finalizeExam(finalScore, totalTime, maxScore = null, sectionResults = null) {
    // 先保存任何待處理的答案
    if (this.pendingAnswers.length > 0) {
      await this.flushBatch();
    }

    // 創建完整的考試會話記錄
    const sessionRecord = {
      user_id: this.userId,
      session_id: this.sessionId,
      exam_year: this.examYear,
      completed_at: serverTimestamp(),
      final_score: finalScore,
      max_score: maxScore || this.sessionData.total_questions,
      total_time: totalTime,
      total_questions: this.sessionData.total_questions,
      completed_questions: this.sessionData.completed_questions,
      accuracy: this.sessionData.completed_questions > 0 ? 
        (Object.values(this.allAnswers).filter(a => a.is_correct).length / this.sessionData.completed_questions) : 0,
      
      // 詳細統計 - 優先使用傳入的 sectionResults，否則使用內部計算的
      section_performance: sectionResults || this.calculateSectionPerformance(),
      time_analysis: {
        total_time: totalTime,
        average_time_per_question: totalTime / this.sessionData.completed_questions,
        start_time: this.sessionData.start_time,
        end_time: Date.now()
      },
      
      // 完整答案記錄
      all_answers: this.allAnswers,
      
      // 元數據
      browser_info: {
        user_agent: navigator.userAgent,
        viewport: `${window.innerWidth}x${window.innerHeight}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      }
    };

    try {
      // 保存完整的考試會話
      await setDoc(doc(db, COLLECTIONS.SESSIONS, this.sessionId), sessionRecord);
      
      // 更新用戶統計
      await this.updateUserStats(finalScore);
      
      console.log('🎯 考試完成記錄已保存');
      
      // 清理本地存儲
      this.clearLocalStorage();
      
      return this.sessionId;
      
    } catch (error) {
      console.error('❌ 考試完成記錄保存失敗:', error);
      
      // 保存到本地作為備份
      this.saveFailedDataLocally(sessionRecord, 'final_session');
      throw error;
    }
  }

  /**
   * 計算各區段表現
   */
  calculateSectionPerformance() {
    const sections = {
      vocabulary: { range: [1, 10], correct: 0, total: 0 },
      cloze: { range: [11, 20], correct: 0, total: 0 },
      fill: { range: [21, 30], correct: 0, total: 0 },
      structure: { range: [31, 34], correct: 0, total: 0 },
      reading: { range: [35, 46], correct: 0, total: 0 }
    };

    Object.values(this.allAnswers).forEach(answer => {
      const qNum = answer.question_number;
      
      Object.keys(sections).forEach(sectionName => {
        const section = sections[sectionName];
        if (qNum >= section.range[0] && qNum <= section.range[1]) {
          section.total++;
          if (answer.is_correct) {
            section.correct++;
          }
        }
      });
    });

    // 計算各區段正確率
    Object.keys(sections).forEach(sectionName => {
      const section = sections[sectionName];
      section.accuracy = section.total > 0 ? section.correct / section.total : 0;
    });

    return sections;
  }

  /**
   * 更新用戶統計
   */
  async updateUserStats(finalScore) {
    try {
      const userRef = doc(db, COLLECTIONS.USERS, this.userId);
      const userStats = userIdentification.getUserStats();
      
      const updatedHistory = {
        total_sessions: (userStats.total_sessions || 0) + 1,
        completed_years: [...new Set([...(userStats.completed_years || []), this.examYear])],
        total_questions_answered: (userStats.total_questions_answered || 0) + this.sessionData.completed_questions,
        latest_score: finalScore,
        last_exam_date: serverTimestamp()
      };

      await updateDoc(userRef, {
        exam_history: updatedHistory,
        last_activity: serverTimestamp()
      });

    } catch (error) {
      console.error('❌ 更新用戶統計失敗:', error);
    }
  }

  /**
   * 本地存儲備份
   */
  saveToLocalStorage() {
    const backupData = {
      userId: this.userId,
      sessionId: this.sessionId,
      examYear: this.examYear,
      allAnswers: this.allAnswers,
      sessionData: this.sessionData,
      pendingAnswers: this.pendingAnswers,
      timestamp: Date.now()
    };
    
    localStorage.setItem(`exam_backup_${this.examYear}`, JSON.stringify(backupData));
  }

  /**
   * 恢復會話
   */
  async restoreSession() {
    const backupKey = `exam_backup_${this.examYear}`;
    const backupData = localStorage.getItem(backupKey);
    
    if (backupData) {
      try {
        const restored = JSON.parse(backupData);
        
        // 檢查是否為同一用戶的會話
        if (restored.userId === this.userId) {
          this.allAnswers = restored.allAnswers || {};
          this.sessionData = { ...this.sessionData, ...restored.sessionData };
          this.pendingAnswers = restored.pendingAnswers || [];
          
          console.log(`🔄 恢復會話數據: ${Object.keys(this.allAnswers).length} 題已作答`);
        }
      } catch (error) {
        console.error('❌ 恢復會話失敗:', error);
      }
    }
  }

  /**
   * 清理本地存儲
   */
  clearLocalStorage() {
    localStorage.removeItem(`exam_backup_${this.examYear}`);
  }

  /**
   * 保存失敗數據到本地
   */
  saveFailedDataLocally(data, type = 'failed_batch') {
    const failedData = {
      type,
      data,
      timestamp: Date.now(),
      examYear: this.examYear,
      userId: this.userId
    };
    
    const existingFailed = JSON.parse(localStorage.getItem('failed_submissions') || '[]');
    existingFailed.push(failedData);
    localStorage.setItem('failed_submissions', JSON.stringify(existingFailed));
    
    console.log(`💾 數據已保存到本地備份 (${type})`);
  }

  /**
   * 設置自動保存
   */
  setupAutoSave() {
    setInterval(() => {
      if (this.pendingAnswers.length > 0 && !this.isSubmitting) {
        this.flushBatch().catch(console.error);
      }
    }, CONFIG.AUTO_SAVE_INTERVAL);
  }

  /**
   * 設置頁面離開監聽
   */
  setupBeforeUnload() {
    window.addEventListener('beforeunload', () => {
      // 使用 sendBeacon 確保數據發送
      if (this.pendingAnswers.length > 0) {
        const data = JSON.stringify({
          user_id: this.userId,
          session_id: this.sessionId,
          exam_year: this.examYear,
          answers: this.pendingAnswers,
          emergency_save: true,
          timestamp: Date.now()
        });
        
        navigator.sendBeacon('/api/emergency-save', data);
      }
      
      // 保存到本地
      this.saveToLocalStorage();
    });
  }

  /**
   * 獲取當前統計
   */
  getCurrentStats() {
    return {
      sessionId: this.sessionId,
      completedQuestions: this.sessionData.completed_questions,
      currentScore: this.sessionData.current_score,
      totalQuestions: this.sessionData.total_questions,
      accuracy: this.sessionData.completed_questions > 0 ? 
        Object.values(this.allAnswers).filter(a => a.is_correct).length / this.sessionData.completed_questions : 0,
      timeElapsed: Date.now() - this.sessionData.start_time,
      pendingAnswers: this.pendingAnswers.length
    };
  }
}

export default AnswerCollector;