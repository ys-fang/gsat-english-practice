/**
 * 學測英文練習系統 - 學習分析模組
 * GSAT English Practice System - Learning Analytics Module
 * VERSION: 7.1 - sectionResults fix
 * 
 * 提供詳細的學習分析和跨年度比較功能
 * Enhanced learning analytics with cross-year comparison
 * 支援 Firebase Firestore 後端整合
 */
console.log('🔧 gsat-analytics.js VERSION 7.2 已載入 - timestamp fix');

// Firebase 動態匯入 - 避免阻塞頁面載入
let firebaseApp = null;
let firestore = null;

async function initializeFirebase() {
    try {
        if (firebaseApp) return { app: firebaseApp, db: firestore };
        
        // 動態載入 Firebase 模組
        const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js');
        const { getFirestore, collection, addDoc, doc, setDoc, serverTimestamp } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js');
        
        // Firebase 配置
        const firebaseConfig = {
            apiKey: "AIzaSyAH9vf-drMA6o2itFJJPQNH4zTbuYHMCxI",
            authDomain: "gsat-analytics-2025.firebaseapp.com",
            projectId: "gsat-analytics-2025",
            storageBucket: "gsat-analytics-2025.firebasestorage.app",
            messagingSenderId: "863633123721",
            appId: "1:863633123721:web:56e3b8a4267534c9b29958"
        };
        
        // 初始化 Firebase
        firebaseApp = initializeApp(firebaseConfig);
        firestore = getFirestore(firebaseApp);
        
        console.log('🔥 Firebase Firestore 已連接');
        return { app: firebaseApp, db: firestore };
    } catch (error) {
        console.warn('⚠️ Firebase 初始化失敗，使用離線模式:', error);
        return null;
    }
}

class GSATAnalytics {
    constructor() {
        this.storageKeys = {
            examResults: 'gsat_exam_results',
            userProfile: 'gsat_user_profile',
            studyGoals: 'gsat_study_goals',
            practiceStats: 'gsat_practice_stats'
        };
        
        this.sectionNames = {
            vocabulary: '詞彙題',
            cloze: '綜合測驗', 
            fill: '文意選填',
            structure: '篇章結構',
            reading: '閱讀測驗'
        };
        
        // 初始化圖表系統
        this.charts = typeof GSATCharts !== 'undefined' ? new GSATCharts() : null;
        
        this.init();
    }

    /**
     * 初始化分析系統
     */
    init() {
        this.ensureStorageStructure();
        this.updatePracticeStats();
    }

    /**
     * 初始化 Firebase 分析 (用於考試系統整合)
     */
    async initialize(year, options = {}) {
        try {
            // 設置當前考試年份
            this.currentYear = year;
            this.debugMode = options.debug || false;
            
            // 初始化本地存儲結構和考試會話
            this.init();
            this.currentSession = {
                year: year,
                startTime: Date.now(),
                answers: [],
                sessionId: this.generateSessionId()
            };
            
            if (this.debugMode) {
                console.log(`🔥 GSAT Firebase 分析已初始化 - 年份: ${year}, SessionID: ${this.currentSession.sessionId}`);
            }
            
            return true; // 初始化成功
        } catch (error) {
            console.error('❌ GSAT 分析初始化失敗:', error);
            return false; // 初始化失敗
        }
    }

    /**
     * 記錄單題答案 (用於考試系統整合)
     */
    async recordAnswer(questionNumber, userAnswer, correctAnswer, timeSpent) {
        try {
            if (!this.currentSession) {
                throw new Error('考試會話尚未初始化');
            }

            const answerRecord = {
                questionNumber,
                userAnswer,
                correctAnswer,
                isCorrect: userAnswer === correctAnswer,
                timeSpent,
                timestamp: Date.now()
            };
            
            // Debug: 檢查答案比較
            if (this.debugMode || window.location.hostname !== 'localhost') {
                console.log(`🔍 Q${questionNumber}: "${userAnswer}" vs "${correctAnswer}" = ${userAnswer === correctAnswer}`);
            }

            this.currentSession.answers.push(answerRecord);

            if (this.debugMode) {
                console.log(`📝 記錄答案 Q${questionNumber}: ${userAnswer} (正確: ${correctAnswer}, 耗時: ${timeSpent}ms)`);
                console.log(`📝 當前 session 答案總數: ${this.currentSession.answers.length}`);
            }

            return true;
        } catch (error) {
            console.error('❌ 記錄答案失敗:', error);
            return false;
        }
    }

    /**
     * 完成考試並儲存結果 (用於考試系統整合)
     */
    async finalizeExam(totalScore, totalTime, maxScore = null, sectionResults = null) {
        try {
            if (!this.currentSession) {
                throw new Error('考試會話尚未初始化');
            }

            // 準備考試結果資料
            const examResult = {
                year: this.currentSession.year,
                score: totalScore,
                totalScore: totalScore,  // 同時提供 totalScore 欄位
                maxScore: maxScore || this.currentSession.maxScore, // 使用傳入的 maxScore
                timeSpent: totalTime,
                completedAt: new Date().toISOString(),
                answers: this.currentSession.answers,
                sessionId: this.currentSession.sessionId,
                sectionResults: sectionResults || {}  // 添加 sectionResults
            };
            
            console.log(`🔍 finalizeExam 收到參數: totalScore=${totalScore}, maxScore=${maxScore}, totalTime=${totalTime}`);
            console.log(`🔍 sectionResults:`, sectionResults);

            // 先保存 sessionId，避免被清理
            const sessionId = this.currentSession.sessionId;
            
            if (this.debugMode) {
                console.log(`🎯 考試完成 - 分數: ${totalScore}, 時間: ${totalTime}ms, SessionID: ${sessionId}`);
                console.log(`🔍 即將儲存 ${examResult.answers.length} 個答案`);
            }

            // 儲存到現有的 saveExamResult 方法（等待完成後再清理 session）
            await this.saveExamResult(this.currentSession.year, examResult);

            // 清理當前會話（在儲存完成後）
            this.currentSession = null;

            return sessionId;
        } catch (error) {
            console.error('❌ 完成考試記錄失敗:', error);
            return null;
        }
    }

    /**
     * 產生會話ID
     */
    generateSessionId() {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2, 8);
        return `session_${timestamp}_${random}`;
    }

    /**
     * 確保儲存結構存在
     */
    ensureStorageStructure() {
        const defaultStructure = {
            [this.storageKeys.examResults]: {},
            [this.storageKeys.userProfile]: {
                totalPracticeTime: 0,
                examsTaken: 0,
                averageScore: 0,
                strongestSection: '',
                weakestSection: '',
                improvementRate: 0,
                lastUpdated: Date.now()
            },
            [this.storageKeys.studyGoals]: {
                targetScore: 80,
                dailyGoal: 30, // minutes
                weeklyGoals: [],
                currentStreak: 0
            },
            [this.storageKeys.practiceStats]: {
                dailyStats: {},
                monthlyStats: {},
                yearlyStats: {}
            }
        };

        Object.entries(defaultStructure).forEach(([key, defaultValue]) => {
            if (!localStorage.getItem(key)) {
                localStorage.setItem(key, JSON.stringify(defaultValue));
            }
        });
    }

    /**
     * 儲存考試結果和詳細分析 (包含 Firebase 後端)
     */
    async saveExamResult(year, examData) {
        const results = this.getExamResults();
        const timestamp = Date.now();
        const date = new Date(timestamp).toISOString().split('T')[0];

        // 計算詳細統計
        const detailedStats = this.calculateDetailedStats(examData);
        
        const examResult = {
            year: parseInt(year),
            timestamp,
            date,
            totalScore: examData.totalScore,
            maxScore: examData.maxScore,
            percentage: ((examData.totalScore / examData.maxScore) * 100).toFixed(1),
            timeSpent: examData.timeSpent || Math.round((Date.now() - examData.startTime) / 60000),
            sectionResults: examData.sectionResults,
            questionTimes: examData.questionTimes || {},
            answeredQuestions: examData.answeredQuestions || 0,
            bookmarkedQuestions: examData.bookmarkedQuestions || [],
            detailedStats
        };

        // 儲存到年度結果中
        if (!results[year]) {
            results[year] = [];
        }
        results[year].push(examResult);

        // 保持每年最多10次記錄
        if (results[year].length > 10) {
            results[year] = results[year].slice(-10);
        }

        localStorage.setItem(this.storageKeys.examResults, JSON.stringify(results));
        
        // 更新用戶檔案
        this.updateUserProfile(examResult);
        
        // 更新練習統計
        this.updatePracticeStats(examResult);

        // Firebase 後端同步 (等待完成以確保 session 資料完整)
        try {
            await this.syncToFirestore(examResult);
        } catch (error) {
            console.warn('⚠️ Firebase 同步失敗，數據已保存至本地:', error);
        }

        return examResult;
    }

    /**
     * 同步數據到 Firebase Firestore
     */
    async syncToFirestore(examResult) {
        try {
            const firebase = await initializeFirebase();
            if (!firebase) {
                throw new Error('Firebase 未初始化');
            }

            const { addDoc, collection, doc, setDoc, serverTimestamp } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js');
            
            // 生成唯一用戶 ID (基於瀏覽器指紋)
            const userId = await this.generateUserId();
            
            // 準備要儲存的數據 (過濾 undefined 值)
            const score = examResult.totalScore || examResult.score || 0;
            const maxScore = examResult.maxScore || 100;
            const percentage = maxScore > 0 ? parseFloat(((score / maxScore) * 100).toFixed(1)) : 0;
            
            const currentTime = new Date().toISOString();
            
            const firestoreData = {
                userId: userId,
                year: examResult.year || 0,
                score: score,
                maxScore: maxScore,
                percentage: percentage,
                timeSpent: examResult.timeSpent || 0,
                completedAt: currentTime,
                date: examResult.date || currentTime.split('T')[0],
                answers: Array.isArray(examResult.answers) ? examResult.answers : 
                         (this.currentSession && Array.isArray(this.currentSession.answers) ? this.currentSession.answers : []),
                sessionId: examResult.sessionId || `session_${Date.now()}`,
                sectionResults: examResult.sectionResults || {},
                createdAt: currentTime,
                timestamp: Date.now() // 額外添加 Unix 時間戳用於排序
            };

            // 移除任何 undefined 值
            Object.keys(firestoreData).forEach(key => {
                if (firestoreData[key] === undefined) {
                    delete firestoreData[key];
                }
            });

            // Debug 日誌 (暫時強制顯示以調試答案收集)
            console.log('🔍 準備發送到 Firebase 的數據:', firestoreData);
            console.log(`🔍 答案數量: ${firestoreData.answers.length}`);
            if (firestoreData.answers.length > 0) {
                console.log(`🔍 前3題答案範例:`, firestoreData.answers.slice(0, 3));
            } else {
                console.warn('⚠️ 警告：沒有答案被記錄！檢查 recordAnswer 是否正常運作');
                console.log('🔍 當前 session 狀態:', this.currentSession);
                console.log('🔍 原始考試結果:', examResult);
            }

            // 儲存到 Firestore
            const docRef = await addDoc(collection(firebase.db, 'exam_results'), firestoreData);
            
            console.log(`🔥 考試結果已同步到 Firebase: ${docRef.id}`);
            return docRef.id;
            
        } catch (error) {
            console.warn('⚠️ Firebase 同步失敗:', error);
            throw error;
        }
    }

    /**
     * 生成匿名用戶 ID (基於瀏覽器指紋)
     */
    async generateUserId() {
        try {
            // 使用現有的用戶 ID 或生成新的
            let userId = localStorage.getItem('gsat_anonymous_user_id');
            
            if (!userId) {
                // 生成基於瀏覽器特徵的匿名 ID
                const fingerprint = [
                    navigator.userAgent,
                    navigator.language,
                    screen.width,
                    screen.height,
                    new Date().getTimezoneOffset(),
                    navigator.platform
                ].join('|');
                
                // 創建簡單哈希
                let hash = 0;
                for (let i = 0; i < fingerprint.length; i++) {
                    const char = fingerprint.charCodeAt(i);
                    hash = ((hash << 5) - hash) + char;
                    hash = hash & hash; // 轉換為 32-bit 整數
                }
                
                userId = `user_${Math.abs(hash)}_${Date.now()}`;
                localStorage.setItem('gsat_anonymous_user_id', userId);
            }
            
            return userId;
        } catch (error) {
            console.warn('生成用戶 ID 失敗:', error);
            return `user_${Date.now()}_${Math.random().toString(36).substring(2)}`;
        }
    }

    /**
     * 計算詳細統計資料
     */
    calculateDetailedStats(examData) {
        const stats = {
            accuracy: {},
            timeEfficiency: {},
            difficultyAnalysis: {},
            learningProgress: {}
        };

        // 計算各部分正確率
        Object.entries(examData.sectionResults || {}).forEach(([section, result]) => {
            stats.accuracy[section] = {
                correct: result.correct,
                total: result.total,
                percentage: result.total > 0 ? (result.correct / result.total * 100).toFixed(1) : 0
            };
        });

        // 計算時間效率
        if (examData.questionTimes) {
            const times = Object.values(examData.questionTimes);
            const avgTime = times.length > 0 ? times.reduce((a, b) => a + b, 0) / times.length : 0;
            
            stats.timeEfficiency = {
                averageTimePerQuestion: Math.round(avgTime / 1000),
                totalTime: examData.timeSpent || 0,
                timeDistribution: this.analyzeTimeDistribution(examData.questionTimes)
            };
        }

        return stats;
    }

    /**
     * 分析時間分配
     */
    analyzeTimeDistribution(questionTimes) {
        const times = Object.values(questionTimes);
        if (times.length === 0) return {};

        const sorted = times.sort((a, b) => a - b);
        const total = times.reduce((a, b) => a + b, 0);

        return {
            min: Math.round(sorted[0] / 1000),
            max: Math.round(sorted[sorted.length - 1] / 1000),
            median: Math.round(sorted[Math.floor(sorted.length / 2)] / 1000),
            average: Math.round(total / times.length / 1000),
            standardDeviation: this.calculateStandardDeviation(times)
        };
    }

    /**
     * 計算標準差
     */
    calculateStandardDeviation(values) {
        const mean = values.reduce((a, b) => a + b, 0) / values.length;
        const squaredDiffs = values.map(v => Math.pow(v - mean, 2));
        const avgSquaredDiff = squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
        return Math.round(Math.sqrt(avgSquaredDiff) / 1000);
    }

    /**
     * 更新用戶檔案
     */
    updateUserProfile(examResult) {
        const profile = JSON.parse(localStorage.getItem(this.storageKeys.userProfile));
        
        profile.totalPracticeTime += examResult.timeSpent;
        profile.examsTaken++;
        
        // 計算新的平均分數
        const allResults = this.getAllExamResults();
        const totalScore = allResults.reduce((sum, result) => sum + parseFloat(result.percentage), 0);
        profile.averageScore = (totalScore / allResults.length).toFixed(1);
        
        // 分析最強和最弱題型
        const sectionPerformance = this.analyzeSectionPerformance(allResults);
        profile.strongestSection = sectionPerformance.strongest;
        profile.weakestSection = sectionPerformance.weakest;
        
        // 計算進步率
        profile.improvementRate = this.calculateImprovementRate(allResults);
        profile.lastUpdated = Date.now();

        localStorage.setItem(this.storageKeys.userProfile, JSON.stringify(profile));
    }

    /**
     * 更新練習統計
     */
    updatePracticeStats(examResult = null) {
        const stats = JSON.parse(localStorage.getItem(this.storageKeys.practiceStats));
        const today = new Date().toISOString().split('T')[0];
        const month = today.substring(0, 7);
        const year = today.substring(0, 4);

        // 更新每日統計
        if (!stats.dailyStats[today]) {
            stats.dailyStats[today] = {
                examsCompleted: 0,
                totalTime: 0,
                averageScore: 0,
                scores: []
            };
        }

        if (examResult) {
            const dailyStat = stats.dailyStats[today];
            dailyStat.examsCompleted++;
            dailyStat.totalTime += examResult.timeSpent;
            dailyStat.scores.push(parseFloat(examResult.percentage));
            dailyStat.averageScore = (dailyStat.scores.reduce((a, b) => a + b, 0) / dailyStat.scores.length).toFixed(1);
        }

        // 更新月度統計
        this.updateMonthlyStats(stats, month, examResult);
        
        // 更新年度統計
        this.updateYearlyStats(stats, year, examResult);

        // 清理舊資料（保留最近3個月）
        this.cleanupOldStats(stats);

        localStorage.setItem(this.storageKeys.practiceStats, JSON.stringify(stats));
    }

    /**
     * 更新月度統計
     */
    updateMonthlyStats(stats, month, examResult) {
        if (!stats.monthlyStats[month]) {
            stats.monthlyStats[month] = {
                examsCompleted: 0,
                totalTime: 0,
                averageScore: 0,
                bestScore: 0,
                practiceHistory: []
            };
        }

        if (examResult) {
            const monthlyStat = stats.monthlyStats[month];
            monthlyStat.examsCompleted++;
            monthlyStat.totalTime += examResult.timeSpent;
            monthlyStat.practiceHistory.push({
                date: examResult.date,
                year: examResult.year,
                score: parseFloat(examResult.percentage)
            });
            
            const scores = monthlyStat.practiceHistory.map(h => h.score);
            monthlyStat.averageScore = (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1);
            monthlyStat.bestScore = Math.max(...scores).toFixed(1);
        }
    }

    /**
     * 更新年度統計
     */
    updateYearlyStats(stats, year, examResult) {
        if (!stats.yearlyStats[year]) {
            stats.yearlyStats[year] = {
                examsCompleted: 0,
                totalTime: 0,
                yearsCovered: [],
                sectionProgress: {}
            };
        }

        if (examResult) {
            const yearlyStat = stats.yearlyStats[year];
            yearlyStat.examsCompleted++;
            yearlyStat.totalTime += examResult.timeSpent;
            
            // 確保 yearsCovered 是陣列，並且避免重複年份
            if (!Array.isArray(yearlyStat.yearsCovered)) {
                yearlyStat.yearsCovered = [];
            }
            if (!yearlyStat.yearsCovered.includes(examResult.year)) {
                yearlyStat.yearsCovered.push(examResult.year);
            }
        }
    }

    /**
     * 清理舊統計資料
     */
    cleanupOldStats(stats) {
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
        const cutoffDate = threeMonthsAgo.toISOString().split('T')[0];

        // 清理每日統計
        Object.keys(stats.dailyStats).forEach(date => {
            if (date < cutoffDate) {
                delete stats.dailyStats[date];
            }
        });
    }

    /**
     * 獲取所有考試結果
     */
    getAllExamResults() {
        const results = this.getExamResults();
        const allResults = [];
        
        Object.values(results).forEach(yearResults => {
            allResults.push(...yearResults);
        });
        
        return allResults.sort((a, b) => a.timestamp - b.timestamp);
    }

    /**
     * 獲取考試結果
     */
    getExamResults() {
        return JSON.parse(localStorage.getItem(this.storageKeys.examResults)) || {};
    }

    /**
     * 分析題型表現
     */
    analyzeSectionPerformance(results) {
        const sectionTotals = {};
        
        // 初始化各題型統計
        Object.keys(this.sectionNames).forEach(section => {
            sectionTotals[section] = { correct: 0, total: 0 };
        });

        // 累計各題型結果
        results.forEach(result => {
            Object.entries(result.sectionResults || {}).forEach(([section, sectionResult]) => {
                if (sectionTotals[section]) {
                    sectionTotals[section].correct += sectionResult.correct;
                    sectionTotals[section].total += sectionResult.total;
                }
            });
        });

        // 計算各題型正確率
        const sectionPerformance = {};
        Object.entries(sectionTotals).forEach(([section, totals]) => {
            sectionPerformance[section] = totals.total > 0 ? 
                (totals.correct / totals.total * 100).toFixed(1) : 0;
        });

        // 找出最強和最弱題型
        const sections = Object.entries(sectionPerformance);
        const strongest = sections.reduce((a, b) => 
            parseFloat(a[1]) > parseFloat(b[1]) ? a : b)[0];
        const weakest = sections.reduce((a, b) => 
            parseFloat(a[1]) < parseFloat(b[1]) ? a : b)[0];

        return {
            strongest: this.sectionNames[strongest],
            weakest: this.sectionNames[weakest],
            performance: sectionPerformance
        };
    }

    /**
     * 計算進步率
     */
    calculateImprovementRate(results) {
        if (results.length < 2) return 0;

        const sortedResults = results.sort((a, b) => a.timestamp - b.timestamp);
        const firstScore = parseFloat(sortedResults[0].percentage);
        const lastScore = parseFloat(sortedResults[sortedResults.length - 1].percentage);

        return ((lastScore - firstScore) / firstScore * 100).toFixed(1);
    }

    /**
     * 獲取跨年度比較資料
     */
    getCrossYearComparison() {
        const results = this.getExamResults();
        const comparison = {};

        Object.entries(results).forEach(([year, yearResults]) => {
            if (yearResults.length > 0) {
                const scores = yearResults.map(r => parseFloat(r.percentage));
                const times = yearResults.map(r => r.timeSpent);

                comparison[year] = {
                    attemptCount: yearResults.length,
                    averageScore: (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1),
                    bestScore: Math.max(...scores).toFixed(1),
                    averageTime: Math.round(times.reduce((a, b) => a + b, 0) / times.length),
                    lastAttempt: yearResults[yearResults.length - 1].date,
                    sectionPerformance: this.getYearSectionPerformance(yearResults)
                };
            }
        });

        return comparison;
    }

    /**
     * 獲取特定年度的題型表現
     */
    getYearSectionPerformance(yearResults) {
        const sectionTotals = {};
        
        Object.keys(this.sectionNames).forEach(section => {
            sectionTotals[section] = { correct: 0, total: 0 };
        });

        yearResults.forEach(result => {
            Object.entries(result.sectionResults || {}).forEach(([section, sectionResult]) => {
                if (sectionTotals[section]) {
                    sectionTotals[section].correct += sectionResult.correct;
                    sectionTotals[section].total += sectionResult.total;
                }
            });
        });

        const performance = {};
        Object.entries(sectionTotals).forEach(([section, totals]) => {
            performance[section] = totals.total > 0 ? 
                (totals.correct / totals.total * 100).toFixed(1) : 0;
        });

        return performance;
    }

    /**
     * 獲取學習進度摘要
     */
    getProgressSummary() {
        const profile = JSON.parse(localStorage.getItem(this.storageKeys.userProfile));
        const practiceStats = JSON.parse(localStorage.getItem(this.storageKeys.practiceStats));
        const crossYearComparison = this.getCrossYearComparison();
        
        return {
            profile,
            practiceStats,
            crossYearComparison,
            totalExamYears: Object.keys(crossYearComparison).length,
            recentActivity: this.getRecentActivity()
        };
    }

    /**
     * 獲取最近活動
     */
    getRecentActivity() {
        const allResults = this.getAllExamResults();
        return allResults.slice(-5).map(result => ({
            year: result.year,
            date: result.date,
            score: result.percentage,
            timeSpent: result.timeSpent
        }));
    }

    /**
     * 清除所有分析資料
     */
    clearAllData() {
        Object.values(this.storageKeys).forEach(key => {
            localStorage.removeItem(key);
        });
        this.init(); // 重新初始化
        console.log('所有學習分析資料已清除');
    }

    /**
     * 導出分析資料（JSON格式）
     */
    exportData() {
        const data = {};
        Object.entries(this.storageKeys).forEach(([name, key]) => {
            data[name] = JSON.parse(localStorage.getItem(key) || '{}');
        });
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { 
            type: 'application/json' 
        });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `gsat-analytics-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    /**
     * 生成分數趨勢圖表
     */
    generateScoreTrendChart(containerId, yearFilter = null) {
        if (!this.charts) return;

        const allResults = this.getAllExamResults();
        const filteredResults = yearFilter ? 
            allResults.filter(r => r.year === parseInt(yearFilter)) : allResults;

        if (filteredResults.length === 0) return;

        const chartData = filteredResults
            .sort((a, b) => a.timestamp - b.timestamp)
            .map((result, index) => ({
                label: yearFilter ? `第${index + 1}次` : `${result.year}年`,
                value: parseFloat(result.percentage)
            }));

        this.charts.createLineChart(containerId, chartData, {
            title: yearFilter ? `${yearFilter}年度分數趨勢` : '整體分數趨勢',
            color: '#007bff',
            showPoints: true,
            height: 250
        });
    }

    /**
     * 生成題型表現圖表
     */
    generateSectionPerformanceChart(containerId, yearFilter = null) {
        if (!this.charts) return;

        const allResults = this.getAllExamResults();
        const filteredResults = yearFilter ? 
            allResults.filter(r => r.year === parseInt(yearFilter)) : allResults;

        if (filteredResults.length === 0) return;

        // 計算各題型平均表現
        const sectionTotals = {};
        Object.keys(this.sectionNames).forEach(section => {
            sectionTotals[section] = { correct: 0, total: 0 };
        });

        filteredResults.forEach(result => {
            Object.entries(result.sectionResults || {}).forEach(([section, sectionResult]) => {
                if (sectionTotals[section]) {
                    sectionTotals[section].correct += sectionResult.correct;
                    sectionTotals[section].total += sectionResult.total;
                }
            });
        });

        const chartData = Object.entries(sectionTotals).map(([section, totals]) => ({
            label: this.sectionNames[section],
            value: totals.total > 0 ? parseFloat((totals.correct / totals.total * 100).toFixed(1)) : 0
        }));

        this.charts.createBarChart(containerId, chartData, {
            title: yearFilter ? `${yearFilter}年度各題型表現` : '各題型平均表現',
            color: ['#007bff', '#28a745', '#ffc107', '#dc3545', '#17a2b8'],
            unit: '%',
            height: 200
        });
    }

    /**
     * 生成練習時間分佈圖表
     */
    generateTimeDistributionChart(containerId) {
        if (!this.charts) return;

        const allResults = this.getAllExamResults();
        if (allResults.length === 0) return;

        const timeRanges = {
            '30分以下': 0,
            '30-45分': 0,
            '45-60分': 0,
            '60-75分': 0,
            '75-90分': 0,
            '90分以上': 0
        };

        allResults.forEach(result => {
            const time = result.timeSpent || 0;
            if (time < 30) timeRanges['30分以下']++;
            else if (time < 45) timeRanges['30-45分']++;
            else if (time < 60) timeRanges['45-60分']++;
            else if (time < 75) timeRanges['60-75分']++;
            else if (time < 90) timeRanges['75-90分']++;
            else timeRanges['90分以上']++;
        });

        const chartData = Object.entries(timeRanges).map(([range, count]) => ({
            label: range,
            value: count
        }));

        this.charts.createPieChart(containerId, chartData, {
            title: '練習時間分佈',
            showPercentages: true
        });
    }

    /**
     * 生成跨年度比較圖表
     */
    generateCrossYearChart(containerId) {
        if (!this.charts) return;

        const comparison = this.getCrossYearComparison();
        if (Object.keys(comparison).length === 0) return;

        // 創建多系列折線圖，顯示各題型在不同年度的表現
        const series = Object.entries(this.sectionNames).map(([sectionKey, sectionName]) => ({
            name: sectionName,
            data: Object.entries(comparison)
                .sort(([a], [b]) => parseInt(a) - parseInt(b))
                .map(([year, data]) => ({
                    label: `${year}年`,
                    value: parseFloat(data.sectionPerformance[sectionKey] || 0)
                }))
        }));

        this.charts.createMultiLineChart(containerId, series, {
            title: '跨年度題型表現比較',
            width: 600,
            height: 300
        });
    }

    /**
     * 生成進步指標圓形圖
     */
    generateProgressIndicator(containerId, targetScore = 80) {
        if (!this.charts) return;

        const profile = JSON.parse(localStorage.getItem(this.storageKeys.userProfile));
        const currentScore = parseFloat(profile.averageScore || 0);
        const progress = Math.min((currentScore / targetScore) * 100, 100);

        this.charts.createProgressCircle(containerId, progress, {
            size: 120,
            color: progress >= 100 ? '#28a745' : progress >= 75 ? '#007bff' : progress >= 50 ? '#ffc107' : '#dc3545',
            label: `目標: ${targetScore}% | 當前: ${currentScore}%`
        });
    }

    /**
     * 生成學習活動熱力圖數據
     */
    generateActivityHeatmapData() {
        const practiceStats = JSON.parse(localStorage.getItem(this.storageKeys.practiceStats));
        const dailyStats = practiceStats.dailyStats || {};

        // 生成過去90天的活動數據
        const heatmapData = [];
        const today = new Date();
        
        for (let i = 89; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            
            const dayStats = dailyStats[dateStr];
            const intensity = dayStats ? Math.min(dayStats.examsCompleted, 4) : 0;
            
            heatmapData.push({
                date: dateStr,
                day: date.getDay(),
                week: Math.floor(i / 7),
                intensity,
                examsCompleted: dayStats ? dayStats.examsCompleted : 0,
                totalTime: dayStats ? dayStats.totalTime : 0
            });
        }

        return heatmapData;
    }

    /**
     * 創建活動熱力圖HTML
     */
    createActivityHeatmap(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const data = this.generateActivityHeatmapData();
        const weeks = Math.ceil(data.length / 7);

        const heatmapHTML = `
            <div class="gsat-chart">
                <h4 class="chart-title">學習活動熱力圖 (過去90天)</h4>
                <div class="activity-heatmap" style="display: grid; grid-template-columns: repeat(${weeks}, 1fr); gap: 2px; margin: 1rem 0;">
                    ${data.map(day => {
                        const colors = ['#ebedf0', '#c6e48b', '#7bc96f', '#239a3b', '#196127'];
                        const color = colors[day.intensity] || colors[0];
                        
                        return `
                            <div class="heatmap-day" 
                                 style="width: 12px; height: 12px; background: ${color}; border-radius: 2px; cursor: pointer;"
                                 title="${day.date}: ${day.examsCompleted}次練習, ${day.totalTime}分鐘">
                            </div>
                        `;
                    }).join('')}
                </div>
                <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.8rem; color: #666;">
                    <span>Less</span>
                    <div style="display: flex; gap: 2px;">
                        <div style="width: 10px; height: 10px; background: #ebedf0; border-radius: 2px;"></div>
                        <div style="width: 10px; height: 10px; background: #c6e48b; border-radius: 2px;"></div>
                        <div style="width: 10px; height: 10px; background: #7bc96f; border-radius: 2px;"></div>
                        <div style="width: 10px; height: 10px; background: #239a3b; border-radius: 2px;"></div>
                        <div style="width: 10px; height: 10px; background: #196127; border-radius: 2px;"></div>
                    </div>
                    <span>More</span>
                </div>
            </div>
        `;

        container.innerHTML = heatmapHTML;
    }
}

// 導出分析類
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GSATAnalytics;
} else {
    // 瀏覽器環境中創建全域變數
    window.gsatAnalytics = new GSATAnalytics();
}