/**
 * 用戶識別系統
 * 無需註冊的匿名用戶識別和追蹤
 */

import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, COLLECTIONS, CONFIG } from './config.js';

export class UserIdentification {
  constructor() {
    this.userId = null;
    this.userInfo = null;
  }

  /**
   * 獲取或創建用戶ID
   */
  async getUserId() {
    if (this.userId) {
      return this.userId;
    }

    // 1. 嘗試從本地存儲獲取
    const storedUserId = localStorage.getItem(CONFIG.USER_ID_KEY);
    if (storedUserId) {
      this.userId = storedUserId;
      await this.updateUserInfo();
      return this.userId;
    }

    // 2. 生成新的用戶ID
    this.userId = this.generateUserId();
    localStorage.setItem(CONFIG.USER_ID_KEY, this.userId);
    
    // 3. 初始化用戶資料
    await this.initializeUser();
    
    return this.userId;
  }

  /**
   * 生成唯一用戶ID
   * 結合設備指紋和隨機數確保唯一性
   */
  generateUserId() {
    const fingerprint = this.generateFingerprint();
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2);
    
    // 創建混合雜湊
    const combined = `${fingerprint}-${timestamp}-${random}`;
    return this.hashString(combined);
  }

  /**
   * 生成設備指紋
   */
  generateFingerprint() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('GSAT Fingerprint', 2, 2);
    
    const fingerprint = {
      // 螢幕解析度
      screen: `${screen.width}x${screen.height}x${screen.colorDepth}`,
      // 時區
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      // 語言
      language: navigator.language,
      // 平台
      platform: navigator.platform,
      // User Agent 簡化版（移除版本號避免頻繁變化）
      userAgent: navigator.userAgent.replace(/[\d.]+/g, ''),
      // Canvas 指紋
      canvas: canvas.toDataURL(),
      // 記憶體（如果可用）
      memory: navigator.deviceMemory || 'unknown',
      // 硬體併發
      cores: navigator.hardwareConcurrency || 'unknown'
    };

    return this.hashString(JSON.stringify(fingerprint));
  }

  /**
   * 簡單雜湊函數
   */
  hashString(str) {
    let hash = 0;
    if (str.length === 0) return hash.toString(36);
    
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // 轉換為32位整數
    }
    
    return Math.abs(hash).toString(36);
  }

  /**
   * 初始化新用戶
   */
  async initializeUser() {
    const userDoc = {
      user_id: this.userId,
      created_at: serverTimestamp(),
      first_visit: serverTimestamp(),
      last_visit: serverTimestamp(),
      device_info: {
        screen_resolution: `${screen.width}x${screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: navigator.language,
        platform: navigator.platform,
        user_agent_hash: this.hashString(navigator.userAgent)
      },
      exam_history: {
        total_sessions: 0,
        completed_years: [],
        total_questions_answered: 0,
        average_score: 0
      },
      privacy: {
        data_collection_consent: true,
        created_method: 'anonymous_fingerprint',
        retention_acknowledged: true
      }
    };

    try {
      await setDoc(doc(db, COLLECTIONS.USERS, this.userId), userDoc);
      this.userInfo = userDoc;
      console.log('✅ 新用戶已初始化:', this.userId.substring(0, 8) + '...');
    } catch (error) {
      console.error('❌ 用戶初始化失敗:', error);
      // 即使Firebase失敗，本地ID仍然可用
    }
  }

  /**
   * 更新用戶資訊
   */
  async updateUserInfo() {
    if (!this.userId) return;

    try {
      const userRef = doc(db, COLLECTIONS.USERS, this.userId);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        this.userInfo = userSnap.data();
        
        // 更新最後訪問時間
        await setDoc(userRef, {
          last_visit: serverTimestamp()
        }, { merge: true });
        
      } else {
        // 用戶不存在，重新初始化
        await this.initializeUser();
      }
    } catch (error) {
      console.error('❌ 更新用戶資訊失敗:', error);
      // 降級到本地模式
      this.userInfo = { user_id: this.userId, offline_mode: true };
    }
  }

  /**
   * 獲取用戶統計資訊
   */
  getUserStats() {
    if (!this.userInfo) {
      return {
        user_id: this.userId,
        total_sessions: 0,
        completed_years: [],
        offline_mode: true
      };
    }

    return {
      user_id: this.userId,
      total_sessions: this.userInfo.exam_history?.total_sessions || 0,
      completed_years: this.userInfo.exam_history?.completed_years || [],
      average_score: this.userInfo.exam_history?.average_score || 0,
      first_visit: this.userInfo.created_at,
      offline_mode: this.userInfo.offline_mode || false
    };
  }

  /**
   * 檢查是否為回訪用戶
   */
  isReturningUser() {
    return localStorage.getItem(CONFIG.USER_ID_KEY) !== null;
  }

  /**
   * 重設用戶ID（開發用）
   */
  resetUserId() {
    localStorage.removeItem(CONFIG.USER_ID_KEY);
    this.userId = null;
    this.userInfo = null;
    console.log('🔄 用戶ID已重設');
  }
}

// 單例模式
export const userIdentification = new UserIdentification();