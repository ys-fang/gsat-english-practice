/**
 * 學測英文練習系統 - 統一基礎類
 * GSAT English Practice System - Unified Base Class
 * 
 * 提供一致的用戶體驗和增強的學習功能
 * Professional exam-style experience with learning enhancements
 */

class GSATExamBase {
    constructor(year, answers, config = {}) {
        // 基本配置
        this.year = year;
        this.answers = answers || {};
        this.totalQuestions = config.totalQuestions || 46;
        this.timeLimit = config.timeLimit || 100 * 60 * 1000; // 100分鐘
        
        // 題目配分設定
        this.scores = config.scores || {
            vocabulary: { range: [1, 10], points: 1 },    // 詞彙題
            cloze: { range: [11, 20], points: 1 },        // 綜合測驗
            fill: { range: [21, 30], points: 1 },         // 文意選填
            structure: { range: [31, 34], points: 2 },    // 篇章結構
            reading: { range: [35, 46], points: 2 }       // 閱讀測驗
        };

        // 狀態管理
        this.isSubmitted = false;
        this.startTime = Date.now();
        this.timerInterval = null;
        this.currentMode = 'normal'; // normal, focus
        this.bookmarkedQuestions = new Set();
        this.questionTimes = {}; // 記錄每題作答時間
        
        // 初始化
        this.init();
    }

    /**
     * 系統初始化
     */
    init() {
        this.setupInterface();
        this.startTimer();
        this.bindEvents();
        this.loadProgress();
        this.setupKeyboardShortcuts();
        console.log(`${this.year}學年度學測英文互動系統已載入 - 專業考試模式`);
    }

    /**
     * 設置界面元素
     */
    setupInterface() {
        // 確保標題顯示正確
        const examTitle = document.querySelector('.exam-title');
        if (examTitle && !examTitle.textContent.includes(this.year)) {
            examTitle.textContent = `${this.year}學年度學科能力測驗 - 英文考科`;
        }

        // 初始化進度統計顯示
        this.createProgressStats();
        
        // 設置考試模式橫幅
        this.createModeIndicator();
    }

    /**
     * 創建進度統計顯示
     */
    createProgressStats() {
        const header = document.querySelector('.exam-header .container');
        if (!header) return;

        const progressStats = document.createElement('div');
        progressStats.className = 'progress-stats';
        progressStats.innerHTML = `
            <div class="stat-item">
                <span class="stat-value" id="answeredCount">0</span>
                <span class="stat-label">已作答</span>
            </div>
            <div class="stat-item">
                <span class="stat-value" id="bookmarkCount">0</span>
                <span class="stat-label">已標記</span>
            </div>
            <div class="stat-item">
                <span class="stat-value" id="avgTime">--</span>
                <span class="stat-label">平均用時</span>
            </div>
            <div class="stat-item">
                <span class="stat-value" id="estimatedRemaining">--</span>
                <span class="stat-label">預估剩餘</span>
            </div>
        `;
        
        header.appendChild(progressStats);
    }

    /**
     * 創建模式指示器
     */
    createModeIndicator() {
        const examContent = document.querySelector('.exam-content');
        if (!examContent) return;

        const banner = document.createElement('div');
        banner.className = 'exam-mode-banner';
        banner.id = 'modeBanner';
        banner.style.display = 'none';
        
        examContent.insertBefore(banner, examContent.firstChild);
    }

    /**
     * 計時器功能
     */
    startTimer() {
        const timerElement = document.getElementById('timer');
        if (!timerElement) return;
        
        this.timerInterval = setInterval(() => {
            const elapsed = Date.now() - this.startTime;
            const remaining = this.timeLimit - elapsed;
            
            if (remaining <= 0) {
                this.timeUp();
                return;
            }

            const minutes = Math.floor(remaining / (60 * 1000));
            const seconds = Math.floor((remaining % (60 * 1000)) / 1000);
            
            timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            // 剩餘時間警告
            if (remaining <= 10 * 60 * 1000) { // 最後10分鐘
                timerElement.classList.add('warning');
                if (remaining <= 5 * 60 * 1000 && remaining % 60000 < 1000) { // 最後5分鐘每分鐘提醒
                    this.showTimeWarning(Math.ceil(remaining / 60000));
                }
            }
        }, 1000);
    }

    /**
     * 時間警告提示
     */
    showTimeWarning(minutesLeft) {
        if (minutesLeft === 5) {
            this.showNotification('⏰ 剩餘時間：5分鐘！請檢查答案完整性。', 'warning');
        } else if (minutesLeft === 1) {
            this.showNotification('🚨 剩餘時間：1分鐘！系統即將自動提交。', 'error');
        }
    }

    /**
     * 時間到自動提交
     */
    timeUp() {
        clearInterval(this.timerInterval);
        this.showNotification('⏰ 考試時間結束！系統自動提交答案。', 'info');
        setTimeout(() => {
            this.submitExam();
        }, 2000);
    }

    /**
     * 綁定事件處理
     */
    bindEvents() {
        // 綁定所有答題選項
        document.querySelectorAll('input[type="radio"], select').forEach(input => {
            input.addEventListener('change', (e) => {
                this.handleAnswerChange(e);
            });
        });

        // 綁定控制按鈕
        this.bindControlButtons();
        
        // 添加書籤按鈕
        this.addBookmarkButtons();
        
        // 監聽頁面離開
        window.addEventListener('beforeunload', (e) => {
            if (!this.isSubmitted && this.hasAnswers()) {
                e.preventDefault();
                e.returnValue = '您有未提交的答案，確定要離開嗎？';
            }
        });
    }

    /**
     * 綁定統一的控制按鈕
     */
    bindControlButtons() {
        // 清除現有的控制按鈕區域
        const controlsContainer = document.querySelector('.controls .control-buttons');
        if (controlsContainer) {
            controlsContainer.innerHTML = `
                <a href="../index.html" class="btn btn-secondary">
                    ← 返回首頁
                </a>
                <button type="button" class="btn btn-primary" id="showAnswersBtn">
                    查看答案
                </button>
                <button type="button" class="btn btn-success" id="submitExamBtn">
                    提交考卷
                </button>
                <button type="button" class="btn btn-warning" id="resetExamBtn">
                    重新開始
                </button>
                <button type="button" class="btn btn-secondary" id="focusModeBtn">
                    專注模式
                </button>
            `;
        }

        // 綁定按鈕事件
        document.getElementById('showAnswersBtn')?.addEventListener('click', () => this.showAnswers());
        document.getElementById('submitExamBtn')?.addEventListener('click', () => this.submitExam());
        document.getElementById('resetExamBtn')?.addEventListener('click', () => this.resetExam());
        document.getElementById('focusModeBtn')?.addEventListener('click', () => this.toggleFocusMode());
    }

    /**
     * 添加書籤按鈕
     */
    addBookmarkButtons() {
        document.querySelectorAll('.question').forEach((question, index) => {
            if (question.querySelector('.bookmark-btn')) return; // 避免重複添加
            
            const bookmarkBtn = document.createElement('button');
            bookmarkBtn.className = 'bookmark-btn';
            bookmarkBtn.innerHTML = '☆';
            bookmarkBtn.title = '標記此題';
            bookmarkBtn.setAttribute('data-question', index + 1);
            
            bookmarkBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleBookmark(index + 1);
            });
            
            question.appendChild(bookmarkBtn);
        });
    }

    /**
     * 處理答案變更
     */
    handleAnswerChange(event) {
        const input = event.target;
        const questionName = input.name;
        const questionNumber = parseInt(questionName.replace('q', ''));
        
        // 記錄答題時間
        if (!this.questionTimes[questionName]) {
            this.questionTimes[questionName] = Date.now();
        }
        
        // 保存進度
        this.saveProgress();
        
        // 更新進度顯示
        this.updateProgressDisplay();
        
        // 即時反饋（如果未提交）
        if (!this.isSubmitted) {
            this.checkAnswer(input);
        }
    }

    /**
     * 答案檢查（可選的即時反饋）
     */
    checkAnswer(input) {
        // 子類可以覆蓋此方法來實現即時反饋
        // 預設不顯示答案，避免影響考試體驗
    }

    /**
     * 智能進度管理
     */
    saveProgress() {
        const formData = new FormData(document.getElementById('examForm'));
        const progress = {};
        
        for (let [key, value] of formData.entries()) {
            progress[key] = value;
        }
        
        const progressData = {
            year: this.year,
            answers: progress,
            bookmarks: Array.from(this.bookmarkedQuestions),
            questionTimes: this.questionTimes,
            startTime: this.startTime,
            timestamp: Date.now()
        };
        
        localStorage.setItem(`gsat_exam_${this.year}_progress`, JSON.stringify(progressData));
    }

    /**
     * 載入進度
     */
    loadProgress() {
        const saved = localStorage.getItem(`gsat_exam_${this.year}_progress`);
        if (!saved) return;

        try {
            const data = JSON.parse(saved);
            
            // 恢復答案
            if (data.answers) {
                Object.entries(data.answers).forEach(([key, value]) => {
                    const input = document.querySelector(`[name="${key}"][value="${value}"]`);
                    if (input) {
                        input.checked = true;
                    }
                    const select = document.querySelector(`select[name="${key}"]`);
                    if (select) {
                        select.value = value;
                    }
                });
            }

            // 恢復書籤
            if (data.bookmarks) {
                data.bookmarks.forEach(qNum => this.bookmarkedQuestions.add(qNum));
                this.updateBookmarkDisplay();
            }

            // 恢復時間記錄
            if (data.questionTimes) {
                this.questionTimes = data.questionTimes;
            }

            // 恢復開始時間
            if (data.startTime) {
                this.startTime = data.startTime;
            }

            this.updateProgressDisplay();
            
            // 顯示恢復提示
            if (Object.keys(data.answers).length > 0) {
                this.showNotification(`已恢復 ${Object.keys(data.answers).length} 題的作答進度`, 'success');
            }
        } catch (error) {
            console.error('載入進度失敗:', error);
        }
    }

    /**
     * 更新進度顯示
     */
    updateProgressDisplay() {
        const form = document.getElementById('examForm');
        if (!form) return;

        const formData = new FormData(form);
        const answeredQuestions = new Set();
        
        for (let [key, value] of formData.entries()) {
            if (value && value !== '') {
                answeredQuestions.add(key);
            }
        }

        // 更新進度條
        const progress = (answeredQuestions.size / this.totalQuestions) * 100;
        const progressBar = document.getElementById('progressBar');
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }

        // 更新統計顯示
        document.getElementById('answeredCount').textContent = answeredQuestions.size;
        document.getElementById('bookmarkCount').textContent = this.bookmarkedQuestions.size;

        // 計算平均答題時間
        const avgTime = this.calculateAverageTime();
        document.getElementById('avgTime').textContent = avgTime ? `${avgTime}s` : '--';

        // 估算剩餘時間
        const estimatedRemaining = this.estimateRemainingTime(answeredQuestions.size);
        document.getElementById('estimatedRemaining').textContent = estimatedRemaining || '--';
    }

    /**
     * 計算平均答題時間
     */
    calculateAverageTime() {
        const times = Object.values(this.questionTimes);
        if (times.length === 0) return null;

        const currentTime = Date.now();
        const totalTime = times.reduce((sum, startTime) => sum + (currentTime - startTime), 0);
        return Math.round(totalTime / times.length / 1000);
    }

    /**
     * 估算剩餘完成時間
     */
    estimateRemainingTime(answeredCount) {
        if (answeredCount === 0) return null;
        
        const avgTime = this.calculateAverageTime();
        if (!avgTime) return null;

        const remainingQuestions = this.totalQuestions - answeredCount;
        const estimatedMinutes = Math.round((remainingQuestions * avgTime) / 60);
        
        return estimatedMinutes > 0 ? `${estimatedMinutes}min` : '即將完成';
    }

    /**
     * 書籤功能
     */
    toggleBookmark(questionNumber) {
        const isBookmarked = this.bookmarkedQuestions.has(questionNumber);
        
        if (isBookmarked) {
            this.bookmarkedQuestions.delete(questionNumber);
        } else {
            this.bookmarkedQuestions.add(questionNumber);
        }
        
        this.updateBookmarkDisplay();
        this.updateProgressDisplay();
        this.saveProgress();
    }

    /**
     * 更新書籤顯示
     */
    updateBookmarkDisplay() {
        document.querySelectorAll('.bookmark-btn').forEach(btn => {
            const questionNum = parseInt(btn.getAttribute('data-question'));
            const question = btn.closest('.question');
            
            if (this.bookmarkedQuestions.has(questionNum)) {
                btn.innerHTML = '★';
                btn.className = 'bookmark-btn bookmarked';
                btn.title = '取消標記';
                question.classList.add('bookmarked');
            } else {
                btn.innerHTML = '☆';
                btn.className = 'bookmark-btn';
                btn.title = '標記此題';
                question.classList.remove('bookmarked');
            }
        });
    }

    /**
     * 專注模式切換
     */
    toggleFocusMode() {
        const body = document.body;
        const modeBtn = document.getElementById('focusModeBtn');
        const banner = document.getElementById('modeBanner');
        
        if (this.currentMode === 'normal') {
            // 進入專注模式
            body.classList.add('focus-mode');
            modeBtn.textContent = '退出專注';
            banner.textContent = '📚 專注模式已開啟 - 隱藏干擾元素，專心答題';
            banner.style.display = 'block';
            this.currentMode = 'focus';
            
            // 隱藏統計資訊
            document.querySelector('.progress-stats')?.classList.add('hidden');
            
            this.showNotification('已進入專注模式，按 ESC 可退出', 'info');
        } else {
            // 退出專注模式
            body.classList.remove('focus-mode');
            modeBtn.textContent = '專注模式';
            banner.style.display = 'none';
            this.currentMode = 'normal';
            
            // 顯示統計資訊
            document.querySelector('.progress-stats')?.classList.remove('hidden');
        }
    }

    /**
     * 設置鍵盤快捷鍵
     */
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // 專注模式：ESC 退出
            if (e.key === 'Escape' && this.currentMode === 'focus') {
                this.toggleFocusMode();
                return;
            }

            // 數字鍵選擇選項 (1-4 對應 A-D)
            if (e.key >= '1' && e.key <= '4' && !e.target.matches('input, select, textarea')) {
                const focusedQuestion = document.querySelector('.question:focus-within') || 
                                      document.querySelector('.question');
                if (focusedQuestion) {
                    const options = focusedQuestion.querySelectorAll('input[type="radio"]');
                    const optionIndex = parseInt(e.key) - 1;
                    if (options[optionIndex]) {
                        options[optionIndex].checked = true;
                        options[optionIndex].dispatchEvent(new Event('change'));
                    }
                }
            }

            // Ctrl+Enter: 提交考卷
            if (e.ctrlKey && e.key === 'Enter') {
                e.preventDefault();
                this.submitExam();
            }

            // Ctrl+B: 標記當前題目
            if (e.ctrlKey && e.key === 'b') {
                e.preventDefault();
                const focusedQuestion = document.querySelector('.question:focus-within');
                if (focusedQuestion) {
                    const bookmarkBtn = focusedQuestion.querySelector('.bookmark-btn');
                    if (bookmarkBtn) {
                        bookmarkBtn.click();
                    }
                }
            }
        });
    }

    /**
     * 檢查是否有答案
     */
    hasAnswers() {
        const formData = new FormData(document.getElementById('examForm'));
        for (let [key, value] of formData.entries()) {
            if (value && value !== '') {
                return true;
            }
        }
        return false;
    }

    /**
     * 顯示答案和分析
     */
    showAnswers() {
        this.isSubmitted = true;
        const form = document.getElementById('examForm');
        const formData = new FormData(form);
        
        let totalScore = 0;
        let maxScore = 0;
        const sectionResults = {};
        
        // 計算各部分分數
        Object.entries(this.scores).forEach(([sectionName, config]) => {
            sectionResults[sectionName] = {
                correct: 0,
                total: config.range[1] - config.range[0] + 1,
                points: config.points
            };
        });

        // 檢查每個答案
        Object.entries(this.answers).forEach(([questionName, correctAnswer]) => {
            const questionNumber = parseInt(questionName.replace('q', ''));
            const userAnswer = formData.get(questionName);
            const isCorrect = userAnswer === correctAnswer;
            
            // 確定所屬部分和得分
            const section = this.getQuestionSection(questionNumber);
            const points = this.scores[section].points;
            
            maxScore += points;
            if (isCorrect) {
                totalScore += points;
                sectionResults[section].correct++;
            }

            // 顯示答案反饋
            this.highlightAnswer(questionName, userAnswer, correctAnswer, isCorrect);
        });

        // 顯示結果
        this.showResultSummary(totalScore, maxScore, sectionResults);
        
        // 清除計時器
        clearInterval(this.timerInterval);
        
        // 滾動到結果
        setTimeout(() => {
            document.querySelector('.result-container')?.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }, 500);
    }

    /**
     * 確定題目所屬部分
     */
    getQuestionSection(questionNumber) {
        for (const [sectionName, config] of Object.entries(this.scores)) {
            if (questionNumber >= config.range[0] && questionNumber <= config.range[1]) {
                return sectionName;
            }
        }
        return 'vocabulary'; // 預設
    }

    /**
     * 標示答案正確性
     */
    highlightAnswer(questionName, userAnswer, correctAnswer, isCorrect) {
        // 處理單選題
        const radioInputs = document.querySelectorAll(`input[name="${questionName}"]`);
        radioInputs.forEach(input => {
            const container = input.closest('.option');
            const questionContainer = input.closest('.question, .question-inline');
            
            // 標示正確答案
            if (input.value === correctAnswer) {
                container?.classList.add('correct-answer');
            }
            
            // 標示用戶答案
            if (input.checked) {
                if (isCorrect) {
                    container?.classList.add('user-correct');
                    questionContainer?.classList.add('correct');
                } else {
                    container?.classList.add('user-incorrect');
                    questionContainer?.classList.add('incorrect');
                }
            }
        });

        // 處理下拉選單
        const selectElement = document.querySelector(`select[name="${questionName}"]`);
        if (selectElement) {
            const questionContainer = selectElement.closest('.question-inline');
            selectElement.classList.add(isCorrect ? 'correct' : 'incorrect');
            questionContainer?.classList.add(isCorrect ? 'correct' : 'incorrect');
            
            // 標示正確選項
            const correctOption = selectElement.querySelector(`option[value="${correctAnswer}"]`);
            if (correctOption) {
                correctOption.style.backgroundColor = '#d4edda';
                correctOption.style.color = '#155724';
                correctOption.style.fontWeight = 'bold';
            }
        }
    }

    /**
     * 顯示結果摘要
     */
    showResultSummary(totalScore, maxScore, sectionResults) {
        const percentage = ((totalScore / maxScore) * 100).toFixed(1);
        const grade = this.calculateGrade(percentage);
        
        const resultContainer = document.createElement('div');
        resultContainer.className = 'result-container';
        
        resultContainer.innerHTML = `
            <div class="result-header">
                <h2>${this.year}學年度學測英文 - 作答結果</h2>
                <div class="result-score">${totalScore} / ${maxScore}</div>
                <div class="result-grade">${percentage}% - ${grade}</div>
            </div>
            <div class="result-details">
                <div class="score-breakdown">
                    ${this.generateSectionBreakdown(sectionResults)}
                </div>
                ${this.generatePerformanceAnalysis(totalScore, maxScore, sectionResults)}
            </div>
        `;
        
        // 插入到表單前面
        const form = document.getElementById('examForm');
        form.parentNode.insertBefore(resultContainer, form);
        
        // 更新分數顯示
        const scoreDisplay = document.getElementById('currentScore');
        const scoreValue = document.getElementById('scoreValue');
        if (scoreDisplay && scoreValue) {
            scoreValue.textContent = totalScore;
            scoreDisplay.style.display = 'block';
        }
    }

    /**
     * 計算等級
     */
    calculateGrade(percentage) {
        if (percentage >= 90) return 'A+ 優秀';
        if (percentage >= 80) return 'A 良好';
        if (percentage >= 70) return 'B+ 中上';
        if (percentage >= 60) return 'B 中等';
        if (percentage >= 50) return 'C+ 待加強';
        return 'C 需努力';
    }

    /**
     * 生成各部分分數詳情
     */
    generateSectionBreakdown(sectionResults) {
        const sectionNames = {
            vocabulary: '詞彙題',
            cloze: '綜合測驗',
            fill: '文意選填',
            structure: '篇章結構',
            reading: '閱讀測驗'
        };

        return Object.entries(sectionResults).map(([key, data]) => {
            const sectionScore = data.correct * data.points;
            const sectionMax = data.total * data.points;
            const sectionPercent = sectionMax > 0 ? ((sectionScore / sectionMax) * 100).toFixed(1) : '0';
            
            return `
                <div class="score-item">
                    <h4>${sectionNames[key] || key}</h4>
                    <div class="score">${sectionScore}/${sectionMax}</div>
                    <div class="percentage">${sectionPercent}%</div>
                </div>
            `;
        }).join('');
    }

    /**
     * 生成學習分析報告
     */
    generatePerformanceAnalysis(totalScore, maxScore, sectionResults) {
        const weakestSection = this.findWeakestSection(sectionResults);
        const strongestSection = this.findStrongestSection(sectionResults);
        const totalTime = Math.round((Date.now() - this.startTime) / 60000);
        
        return `
            <div style="margin-top: 2rem; padding: 2rem; background: #f8f9fa; border: 1px solid #dee2e6;">
                <h3 style="color: #000; margin-bottom: 1rem;">學習分析報告</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
                    <div>
                        <strong>考試用時</strong><br>
                        <span>${totalTime} 分鐘</span>
                    </div>
                    <div>
                        <strong>答題完成度</strong><br>
                        <span>${Object.keys(this.answers).length}題 / ${this.totalQuestions}題</span>
                    </div>
                    <div>
                        <strong>最強項目</strong><br>
                        <span>${strongestSection}</span>
                    </div>
                    <div>
                        <strong>待加強項目</strong><br>
                        <span>${weakestSection}</span>
                    </div>
                </div>
                ${this.generateStudyRecommendations(sectionResults)}
            </div>
        `;
    }

    /**
     * 找出最弱的題型
     */
    findWeakestSection(sectionResults) {
        let minPercentage = 100;
        let weakestSection = '';
        
        const sectionNames = {
            vocabulary: '詞彙題',
            cloze: '綜合測驗',
            fill: '文意選填',
            structure: '篇章結構',
            reading: '閱讀測驗'
        };

        Object.entries(sectionResults).forEach(([key, data]) => {
            const percentage = data.total > 0 ? (data.correct / data.total) * 100 : 0;
            if (percentage < minPercentage) {
                minPercentage = percentage;
                weakestSection = sectionNames[key] || key;
            }
        });

        return weakestSection || '無';
    }

    /**
     * 找出最強的題型
     */
    findStrongestSection(sectionResults) {
        let maxPercentage = -1;
        let strongestSection = '';
        
        const sectionNames = {
            vocabulary: '詞彙題',
            cloze: '綜合測驗',
            fill: '文意選填',
            structure: '篇章結構',
            reading: '閱讀測驗'
        };

        Object.entries(sectionResults).forEach(([key, data]) => {
            const percentage = data.total > 0 ? (data.correct / data.total) * 100 : 0;
            if (percentage > maxPercentage) {
                maxPercentage = percentage;
                strongestSection = sectionNames[key] || key;
            }
        });

        return strongestSection || '無';
    }

    /**
     * 生成學習建議
     */
    generateStudyRecommendations(sectionResults) {
        const recommendations = [];
        
        Object.entries(sectionResults).forEach(([key, data]) => {
            const percentage = data.total > 0 ? (data.correct / data.total) * 100 : 0;
            if (percentage < 70) {
                const advice = this.getSectionAdvice(key);
                if (advice) recommendations.push(advice);
            }
        });

        if (recommendations.length === 0) {
            recommendations.push('各題型表現均佳，繼續保持並多做綜合練習！');
        }

        return `
            <div style="margin-top: 1rem;">
                <strong>學習建議：</strong>
                <ul style="margin-top: 0.5rem; padding-left: 2rem;">
                    ${recommendations.map(rec => `<li style="margin: 0.5rem 0;">${rec}</li>`).join('')}
                </ul>
            </div>
        `;
    }

    /**
     * 獲取題型建議
     */
    getSectionAdvice(sectionKey) {
        const advice = {
            vocabulary: '建議增加單字量，多背誦高頻詞彙，並注意詞性變化',
            cloze: '加強文法結構理解，多練習句型分析和語境判斷',
            fill: '提升閱讀理解能力，練習從上下文推測適當詞彙',
            structure: '強化段落邏輯理解，多練習文章結構分析',
            reading: '增加閱讀量，提升快速理解和資訊擷取能力'
        };
        
        return advice[sectionKey];
    }

    /**
     * 提交考卷
     */
    submitExam() {
        if (this.isSubmitted) {
            this.showNotification('考卷已提交，請查看結果', 'info');
            return;
        }

        const form = document.getElementById('examForm');
        const formData = new FormData(form);
        const answeredCount = Array.from(formData.entries()).filter(([key, value]) => value !== '').length;
        
        if (answeredCount < this.totalQuestions) {
            const unanswered = this.totalQuestions - answeredCount;
            const confirmed = confirm(`還有 ${unanswered} 題未作答，確定要提交嗎？\n\n提交後將無法修改答案。`);
            if (!confirmed) {
                return;
            }
        }

        // 顯示最終確認
        const finalConfirm = confirm('確定提交考卷嗎？提交後將顯示答案和分數。');
        if (!finalConfirm) {
            return;
        }

        this.showAnswers();
    }

    /**
     * 重新開始考試
     */
    resetExam() {
        const confirmed = confirm('確定要重新開始嗎？\n\n這將清除所有答案和進度，且無法恢復。');
        if (!confirmed) return;

        // 清除本地儲存
        localStorage.removeItem(`gsat_exam_${this.year}_progress`);
        
        // 重新載入頁面
        location.reload();
    }

    /**
     * 顯示通知訊息
     */
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 4px;
            color: white;
            font-weight: bold;
            z-index: 10000;
            max-width: 400px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            animation: slideInRight 0.3s ease-out;
        `;

        const colors = {
            info: '#17a2b8',
            success: '#28a745',
            warning: '#ffc107',
            error: '#dc3545'
        };

        notification.style.backgroundColor = colors[type] || colors.info;
        notification.textContent = message;

        // 添加動畫樣式
        if (!document.getElementById('notificationStyles')) {
            const style = document.createElement('style');
            style.id = 'notificationStyles';
            style.textContent = `
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(notification);

        // 自動移除
        setTimeout(() => {
            notification.style.animation = 'slideInRight 0.3s ease-out reverse';
            setTimeout(() => notification.remove(), 300);
        }, type === 'error' ? 5000 : 3000);
    }
}

// 導出基礎類供其他模組使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GSATExamBase;
}