// 114年學測英文試題 - 互動功能
class Exam114 {
    constructor() {
        // 正確答案 (來自官方答案)
        this.answers = {
            q1: 'C', q2: 'A', q3: 'A', q4: 'C', q5: 'C',
            q6: 'D', q7: 'D', q8: 'A', q9: 'B', q10: 'A',
            q11: 'B', q12: 'B', q13: 'A', q14: 'C', q15: 'D',
            q16: 'D', q17: 'C', q18: 'C', q19: 'B', q20: 'A',
            q21: 'I', q22: 'A', q23: 'B', q24: 'F', q25: 'D',
            q26: 'C', q27: 'E', q28: 'G', q29: 'J', q30: 'H',
            q31: 'D', q32: 'C', q33: 'A', q34: 'B',
            q35: 'A', q36: 'C', q37: 'D', q38: 'C',
            q39: 'A', q40: 'B', q41: 'D', q42: 'B',
            q43: 'C', q44: 'A', q45: 'D', q46: 'A',
            q49: ['C', 'D', 'G', 'I'] // 多選題
        };

        // 題目配分
        this.scores = {
            vocabulary: 10,     // 詞彙題 1-10 (每題1分)
            cloze: 10,          // 綜合測驗 11-20 (每題1分)
            fill: 10,           // 文意選填 21-30 (每題1分)
            structure: 8,       // 篇章結構 31-34 (每題2分)
            reading: 24,        // 閱讀測驗 35-46 (每題2分)
            mixed: 10           // 混合題 47-50
        };

        this.totalQuestions = 46; // 選擇題總數
        this.isSubmitted = false;
        this.startTime = Date.now();
        this.timeLimit = 100 * 60 * 1000; // 100分鐘

        this.init();
    }

    init() {
        this.startTimer();
        this.bindEvents();
        this.loadProgress();
    }

    startTimer() {
        const timerElement = document.getElementById('timer');
        
        this.timerInterval = setInterval(() => {
            const elapsed = Date.now() - this.startTime;
            const remaining = this.timeLimit - elapsed;
            
            if (remaining <= 0) {
                this.timeUp();
                return;
            }
            
            const minutes = Math.floor(remaining / 60000);
            const seconds = Math.floor((remaining % 60000) / 1000);
            
            timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            
            // 剩餘時間警告
            if (remaining <= 10 * 60 * 1000) { // 剩餘10分鐘
                timerElement.classList.add('warning');
            }
        }, 1000);
    }

    timeUp() {
        clearInterval(this.timerInterval);
        alert('考試時間結束！系統將自動提交答案。');
        this.submitExam();
    }

    bindEvents() {
        // 選項點擊事件
        document.querySelectorAll('input[type="radio"], input[type="checkbox"]').forEach(input => {
            input.addEventListener('change', () => {
                this.updateProgress();
                this.saveProgress();
                
                // 視覺反饋
                const option = input.closest('.option');
                const allOptions = option.parentElement.querySelectorAll('.option');
                
                if (input.type === 'radio') {
                    allOptions.forEach(opt => opt.classList.remove('selected'));
                }
                
                if (input.checked) {
                    option.classList.add('selected');
                } else {
                    option.classList.remove('selected');
                }
            });
        });

        // 檢查答案按鈕
        document.getElementById('checkAnswers').addEventListener('click', () => {
            this.checkAnswers();
        });

        // 提交試卷按鈕
        document.getElementById('submitExam').addEventListener('click', () => {
            this.submitExam();
        });

        // 頁面卸載時保存進度
        window.addEventListener('beforeunload', () => {
            this.saveProgress();
        });
    }

    updateProgress() {
        const totalQuestions = this.totalQuestions;
        let answeredQuestions = 0;

        // 計算已回答的題目數
        for (let i = 1; i <= totalQuestions; i++) {
            const questionName = `q${i}`;
            const inputs = document.querySelectorAll(`input[name="${questionName}"]`);
            
            if (inputs.length > 0) {
                const isAnswered = Array.from(inputs).some(input => input.checked);
                if (isAnswered) answeredQuestions++;
            }
        }

        // 更新進度條
        const progressPercentage = (answeredQuestions / totalQuestions) * 100;
        document.getElementById('progressBar').style.width = `${progressPercentage}%`;
    }

    saveProgress() {
        const formData = new FormData(document.getElementById('examForm'));
        const progress = {};
        
        for (let [key, value] of formData.entries()) {
            progress[key] = value;
        }
        
        localStorage.setItem('exam114_progress', JSON.stringify({
            answers: progress,
            timestamp: Date.now(),
            startTime: this.startTime
        }));
    }

    loadProgress() {
        const saved = localStorage.getItem('exam114_progress');
        if (!saved) return;

        try {
            const progress = JSON.parse(saved);
            
            // 恢復答案
            for (let [questionName, answer] of Object.entries(progress.answers)) {
                const input = document.querySelector(`input[name="${questionName}"][value="${answer}"]`);
                if (input) {
                    input.checked = true;
                    input.closest('.option').classList.add('selected');
                }
            }
            
            // 恢復開始時間
            if (progress.startTime) {
                this.startTime = progress.startTime;
            }
            
            this.updateProgress();
        } catch (e) {
            console.error('載入進度失敗:', e);
        }
    }

    checkAnswers() {
        if (this.isSubmitted) return;

        const form = document.getElementById('examForm');
        const formData = new FormData(form);
        let correct = 0;
        let total = 0;

        // 檢查所有單選題答案
        for (let i = 1; i <= 46; i++) {
            const questionName = `q${i}`;
            const userAnswer = formData.get(questionName);
            const correctAnswer = this.answers[questionName];
            
            if (correctAnswer) {
                total++;
                const questionDiv = document.querySelector(`input[name="${questionName}"]`).closest('.question');
                const options = questionDiv.querySelectorAll('.option');
                
                options.forEach(option => {
                    const input = option.querySelector('input');
                    const value = input.value;
                    
                    // 清除之前的樣式
                    option.classList.remove('correct', 'incorrect');
                    
                    if (value === correctAnswer) {
                        option.classList.add('correct');
                    } else if (value === userAnswer && value !== correctAnswer) {
                        option.classList.add('incorrect');
                    }
                });
                
                if (userAnswer === correctAnswer) {
                    correct++;
                }
            }
        }

        // 顯示成績
        this.showResults(correct, total);
        
        // 顯示提交按鈕
        document.getElementById('checkAnswers').style.display = 'none';
        document.getElementById('submitExam').style.display = 'block';
    }

    showResults(correct, total) {
        const percentage = Math.round((correct / total) * 100);
        const scoreDisplay = document.getElementById('currentScore');
        const scoreValue = document.getElementById('scoreValue');
        
        // 計算各部分得分
        let vocabularyScore = 0;
        let clozeScore = 0;
        let fillScore = 0;
        let structureScore = 0;
        let readingScore = 0;
        
        const formData = new FormData(document.getElementById('examForm'));
        
        // 詞彙題 (1-10)
        for (let i = 1; i <= 10; i++) {
            if (formData.get(`q${i}`) === this.answers[`q${i}`]) {
                vocabularyScore++;
            }
        }
        
        // 綜合測驗 (11-20)
        for (let i = 11; i <= 20; i++) {
            if (formData.get(`q${i}`) === this.answers[`q${i}`]) {
                clozeScore++;
            }
        }
        
        // 文意選填 (21-30)
        for (let i = 21; i <= 30; i++) {
            if (formData.get(`q${i}`) === this.answers[`q${i}`]) {
                fillScore++;
            }
        }
        
        // 篇章結構 (31-34, 每題2分)
        for (let i = 31; i <= 34; i++) {
            if (formData.get(`q${i}`) === this.answers[`q${i}`]) {
                structureScore += 2;
            }
        }
        
        // 閱讀測驗 (35-46, 每題2分)
        for (let i = 35; i <= 46; i++) {
            if (formData.get(`q${i}`) === this.answers[`q${i}`]) {
                readingScore += 2;
            }
        }
        
        const totalScore = vocabularyScore + clozeScore + fillScore + structureScore + readingScore;
        
        scoreValue.textContent = `${totalScore}/62`;
        scoreDisplay.style.display = 'block';
        
        // 創建詳細結果顯示
        this.createDetailedResults({
            vocabulary: { score: vocabularyScore, total: 10 },
            cloze: { score: clozeScore, total: 10 },
            fill: { score: fillScore, total: 10 },
            structure: { score: structureScore, total: 8 },
            reading: { score: readingScore, total: 24 },
            total: { score: totalScore, total: 62 }
        });
    }

    createDetailedResults(results) {
        const existingResults = document.querySelector('.result-summary');
        if (existingResults) {
            existingResults.remove();
        }

        const resultDiv = document.createElement('div');
        resultDiv.className = 'result-summary';
        resultDiv.innerHTML = `
            <div class="score">${results.total.score}/62</div>
            <div style="font-size: 1.2rem; margin-bottom: 1rem;">
                得分率: ${Math.round((results.total.score / results.total.total) * 100)}%
            </div>
            <div class="score-details">
                <div class="score-item">
                    <div class="label">詞彙題</div>
                    <div class="value">${results.vocabulary.score}/${results.vocabulary.total}</div>
                </div>
                <div class="score-item">
                    <div class="label">綜合測驗</div>
                    <div class="value">${results.cloze.score}/${results.cloze.total}</div>
                </div>
                <div class="score-item">
                    <div class="label">文意選填</div>
                    <div class="value">${results.fill.score}/${results.fill.total}</div>
                </div>
                <div class="score-item">
                    <div class="label">篇章結構</div>
                    <div class="value">${results.structure.score}/${results.structure.total}</div>
                </div>
                <div class="score-item">
                    <div class="label">閱讀測驗</div>
                    <div class="value">${results.reading.score}/${results.reading.total}</div>
                </div>
            </div>
        `;

        // 插入到主要內容區域的開始
        const mainContent = document.querySelector('.exam-content .container');
        mainContent.insertBefore(resultDiv, mainContent.firstChild);

        // 滾動到結果區域
        resultDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    submitExam() {
        if (this.isSubmitted) return;

        const confirmation = confirm('確定要提交試卷嗎？提交後將無法再修改答案。');
        if (!confirmation) return;

        this.isSubmitted = true;
        clearInterval(this.timerInterval);

        // 禁用所有輸入
        document.querySelectorAll('input[type="radio"], input[type="checkbox"]').forEach(input => {
            input.disabled = true;
        });

        // 隱藏控制按鈕
        document.querySelector('.controls').style.display = 'none';

        // 保存最終結果
        this.saveFinalResults();

        // 顯示提交成功訊息
        const message = document.createElement('div');
        message.style.cssText = `
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #27ae60, #2ecc71);
            color: white; padding: 2rem; border-radius: 15px;
            text-align: center; z-index: 1000;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            font-size: 1.2rem;
        `;
        message.innerHTML = `
            <div style="font-size: 2rem; margin-bottom: 1rem;">✓</div>
            <div>試卷提交成功！</div>
            <div style="font-size: 0.9rem; margin-top: 0.5rem; opacity: 0.9;">
                感謝您使用學測英文練習系統
            </div>
        `;
        document.body.appendChild(message);

        setTimeout(() => {
            message.remove();
        }, 3000);
    }

    saveFinalResults() {
        const formData = new FormData(document.getElementById('examForm'));
        const results = {
            answers: {},
            score: document.getElementById('scoreValue').textContent,
            completedAt: new Date().toISOString(),
            timeSpent: Date.now() - this.startTime
        };

        for (let [key, value] of formData.entries()) {
            results.answers[key] = value;
        }

        localStorage.setItem('exam114_final_results', JSON.stringify(results));
        
        // 清除進度數據
        localStorage.removeItem('exam114_progress');
    }
}

// 初始化考試
document.addEventListener('DOMContentLoaded', () => {
    new Exam114();
});