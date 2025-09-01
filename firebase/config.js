/**
 * Firebase 配置文件
 * 學測英文練習系統 - 數據收集後端
 */

// Firebase 配置 - gsat-analytics-2025 專案
const firebaseConfig = {
  apiKey: "AIzaSyAH9vf-drMA6o2itFJJPQNH4zTbuYHMCxI",
  authDomain: "gsat-analytics-2025.firebaseapp.com",
  projectId: "gsat-analytics-2025",
  storageBucket: "gsat-analytics-2025.firebasestorage.app",
  messagingSenderId: "863633123721",
  appId: "1:863633123721:web:56e3b8a4267534c9b29958"
};

// Firebase 服務初始化
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// 初始化 Firebase
const app = initializeApp(firebaseConfig);

// 初始化服務
export const db = getFirestore(app);
export const analytics = getAnalytics(app);

// 數據庫集合名稱常數
export const COLLECTIONS = {
  USERS: 'users',
  ANSWERS: 'exam_answers', 
  SESSIONS: 'exam_sessions',
  ANALYTICS: 'learning_analytics'
};

// 配置選項
export const CONFIG = {
  // 數據收集設定
  BATCH_SIZE: 10,           // 每批次保存題目數
  AUTO_SAVE_INTERVAL: 5 * 60 * 1000, // 5分鐘自動保存
  MAX_RETRY_ATTEMPTS: 3,    // 網路錯誤重試次數
  
  // 用戶識別設定
  USER_ID_KEY: 'gsat_user_id',
  SESSION_KEY: 'gsat_session_data',
  
  // 考試相關
  EXAM_YEARS: [105, 106, 107, 108, 109, 110, 111, 112, 113, 114],
  TOTAL_QUESTIONS: {
    105: 46, 106: 46, 107: 46, 108: 46, 109: 46,
    110: 46, 111: 46, 112: 46, 113: 46, 114: 46
  }
};

export default app;