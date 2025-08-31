/**
 * Firebase Failsafe 機制
 * 確保 Firebase 失敗時不影響考試系統正常運作
 */

// 全域錯誤處理
window.addEventListener('error', (event) => {
    if (event.error && event.error.message && 
        (event.error.message.includes('firebase') || 
         event.error.message.includes('firestore') ||
         event.filename && event.filename.includes('firebase'))) {
        
        console.warn('🛡️ Firebase 錯誤已被捕獲，考試系統繼續正常運作:', event.error);
        event.preventDefault(); // 防止錯誤中斷頁面
        return true;
    }
});

// Promise rejection 處理
window.addEventListener('unhandledrejection', (event) => {
    if (event.reason && event.reason.toString().toLowerCase().includes('firebase')) {
        console.warn('🛡️ Firebase Promise 錯誤已被捕獲:', event.reason);
        event.preventDefault();
        return true;
    }
});

/**
 * Firebase 健康檢查和降級策略
 */
class FirebaseHealthCheck {
    constructor() {
        this.isHealthy = true;
        this.consecutiveFailures = 0;
        this.maxFailures = 3;
        this.healthCheckInterval = null;
    }

    /**
     * 檢查 Firebase 服務狀態
     */
    async checkFirebaseHealth() {
        try {
            // 嘗試簡單的 Firebase 操作來檢查健康狀態
            if (typeof db !== 'undefined') {
                // 嘗試一個輕量級的讀操作
                const testRef = doc(db, 'health_check', 'test');
                await getDoc(testRef);
                
                // 重置失敗計數
                this.consecutiveFailures = 0;
                if (!this.isHealthy) {
                    this.isHealthy = true;
                    console.log('✅ Firebase 服務已恢復');
                    this.notifyRecovery();
                }
            }
        } catch (error) {
            this.consecutiveFailures++;
            console.warn(`⚠️ Firebase 健康檢查失敗 (${this.consecutiveFailures}/${this.maxFailures}):`, error);
            
            if (this.consecutiveFailures >= this.maxFailures && this.isHealthy) {
                this.isHealthy = false;
                console.warn('❌ Firebase 服務標記為不健康，啟用離線模式');
                this.notifyDegradation();
            }
        }
    }

    /**
     * 通知服務降級
     */
    notifyDegradation() {
        // 通知用戶（可選，不影響考試）
        if (window.gsatExam && typeof window.gsatExam.showNotification === 'function') {
            window.gsatExam.showNotification(
                '📱 已切換至離線模式，答題記錄將暫存本地', 
                'info',
                3000
            );
        }
    }

    /**
     * 通知服務恢復
     */
    notifyRecovery() {
        if (window.gsatExam && typeof window.gsatExam.showNotification === 'function') {
            window.gsatExam.showNotification(
                '🔄 線上記錄已恢復', 
                'success',
                2000
            );
        }
    }

    /**
     * 開始健康監控
     */
    startHealthMonitoring() {
        // 每30秒檢查一次（僅在有問題時）
        this.healthCheckInterval = setInterval(() => {
            if (this.consecutiveFailures > 0) {
                this.checkFirebaseHealth();
            }
        }, 30000);
    }

    /**
     * 停止健康監控
     */
    stopHealthMonitoring() {
        if (this.healthCheckInterval) {
            clearInterval(this.healthCheckInterval);
            this.healthCheckInterval = null;
        }
    }

    /**
     * 檢查當前是否健康
     */
    getHealthStatus() {
        return {
            isHealthy: this.isHealthy,
            consecutiveFailures: this.consecutiveFailures,
            maxFailures: this.maxFailures
        };
    }
}

// 全域健康檢查實例
window.firebaseHealthCheck = new FirebaseHealthCheck();

/**
 * 安全的 Firebase 操作包裝器
 */
class SafeFirebaseWrapper {
    constructor(healthChecker) {
        this.healthChecker = healthChecker;
    }

    /**
     * 安全執行 Firebase 操作
     */
    async safeExecute(operation, fallback = null) {
        // 如果已知不健康，直接執行fallback
        if (!this.healthChecker.isHealthy) {
            console.log('🛡️ Firebase 不健康，跳過操作');
            return fallback ? fallback() : null;
        }

        try {
            const result = await operation();
            return result;
        } catch (error) {
            console.warn('🛡️ Firebase 操作失敗，執行降級策略:', error);
            
            // 記錄失敗
            this.healthChecker.consecutiveFailures++;
            
            // 檢查是否需要標記為不健康
            if (this.healthChecker.consecutiveFailures >= this.healthChecker.maxFailures) {
                this.healthChecker.isHealthy = false;
                this.healthChecker.notifyDegradation();
            }
            
            return fallback ? fallback() : null;
        }
    }

    /**
     * 安全記錄答題
     */
    async safeRecordAnswer(analytics, questionNumber, userAnswer, correctAnswer, timeSpent) {
        return this.safeExecute(
            () => analytics.recordAnswer(questionNumber, userAnswer, correctAnswer, timeSpent),
            () => {
                // Fallback: 保存到本地
                this.saveToLocalBackup('answer', {
                    questionNumber, userAnswer, correctAnswer, timeSpent,
                    timestamp: Date.now()
                });
                return true;
            }
        );
    }

    /**
     * 安全完成考試
     */
    async safeFinalizeExam(analytics, finalScore, totalTime) {
        return this.safeExecute(
            () => analytics.finalizeExam(finalScore, totalTime),
            () => {
                // Fallback: 保存完整考試記錄到本地
                this.saveToLocalBackup('exam_complete', {
                    finalScore, totalTime, timestamp: Date.now()
                });
                console.log('💾 考試完成記錄已保存到本地備份');
                return 'local_backup_' + Date.now();
            }
        );
    }

    /**
     * 保存到本地備份
     */
    saveToLocalBackup(type, data) {
        try {
            const backupKey = `firebase_backup_${type}_${Date.now()}`;
            const backupData = {
                type,
                data,
                timestamp: Date.now(),
                exam_year: window.gsatExam?.year || 'unknown'
            };
            
            localStorage.setItem(backupKey, JSON.stringify(backupData));
            
            // 維護備份列表
            const backupList = JSON.parse(localStorage.getItem('firebase_backup_list') || '[]');
            backupList.push(backupKey);
            localStorage.setItem('firebase_backup_list', JSON.stringify(backupList));
            
        } catch (error) {
            console.error('❌ 本地備份也失敗了:', error);
        }
    }

    /**
     * 獲取本地備份
     */
    getLocalBackups() {
        try {
            const backupList = JSON.parse(localStorage.getItem('firebase_backup_list') || '[]');
            const backups = backupList.map(key => {
                const data = localStorage.getItem(key);
                return data ? JSON.parse(data) : null;
            }).filter(Boolean);
            
            return backups;
        } catch (error) {
            console.error('❌ 讀取本地備份失敗:', error);
            return [];
        }
    }

    /**
     * 清理舊備份
     */
    cleanOldBackups(maxAge = 7 * 24 * 60 * 60 * 1000) { // 7天
        try {
            const now = Date.now();
            const backupList = JSON.parse(localStorage.getItem('firebase_backup_list') || '[]');
            const validBackups = [];
            
            backupList.forEach(key => {
                const data = localStorage.getItem(key);
                if (data) {
                    const backup = JSON.parse(data);
                    if (now - backup.timestamp < maxAge) {
                        validBackups.push(key);
                    } else {
                        localStorage.removeItem(key);
                    }
                }
            });
            
            localStorage.setItem('firebase_backup_list', JSON.stringify(validBackups));
            console.log(`🧹 清理了 ${backupList.length - validBackups.length} 個舊備份`);
            
        } catch (error) {
            console.error('❌ 清理備份失敗:', error);
        }
    }
}

// 全域安全包裝器
window.safeFirebase = new SafeFirebaseWrapper(window.firebaseHealthCheck);

// 頁面載入完成後開始健康監控
document.addEventListener('DOMContentLoaded', () => {
    window.firebaseHealthCheck.startHealthMonitoring();
    
    // 清理舊備份
    window.safeFirebase.cleanOldBackups();
});

// 頁面關閉時停止監控
window.addEventListener('beforeunload', () => {
    window.firebaseHealthCheck.stopHealthMonitoring();
});