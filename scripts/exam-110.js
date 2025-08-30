// 110年學測英文試題 - 互動功能
class Exam110 {
    constructor() {
        // 正確答案 (基於題目分析推測)
        this.answers = {
            // 詞彙題 (1-15題)
            q1: 'C', q2: 'C', q3: 'A', q4: 'A', q5: 'D',
            q6: 'D', q7: 'B', q8: 'D', q9: 'A', q10: 'C',
            q11: 'B', q12: 'A', q13: 'A', q14: 'C', q15: 'B',
            
            // 綜合測驗 (16-30題)
            q16: 'D', q17: 'C', q18: 'B', q19: 'D', q20: 'B',
            q21: 'C', q22: 'C', q23: 'A', q24: 'A', q25: 'D',
            q26: 'A', q27: 'C', q28: 'C', q29: 'A', q30: 'D',
            
            // 文意選填 (31-40題)
            q31: 'J', q32: 'G', q33: 'F', q34: 'H', q35: 'D',
            q36: 'E', q37: 'C', q38: 'B', q39: 'A', q40: 'I',
            
            // 閱讀測驗 (41-56題)
            q41: 'B', q42: 'D', q43: 'D', q44: 'B', q45: 'A',
            q46: 'B', q47: 'C', q48: 'D', q49: 'A', q50: 'D',
            q51: 'C', q52: 'B', q53: 'B', q54: 'A', q55: 'C', q56: 'D'
        };

        // 題目配分
        this.scores = {
            vocabulary: 15,     // 詞彙題 1-15 (每題1分)
            cloze: 15,          // 綜合測驗 16-30 (每題1分)
            fill: 10,           // 文意選填 31-40 (每題1分)
            reading: 32         // 閱讀測驗 41-56 (每題2分)
        };

        this.totalQuestions = 56; // 選擇題總數
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
    }

    updateProgress() {
        const answered = this.getAnsweredQuestions();
        const progressBar = document.getElementById('progressBar');
        const percentage = (answered.length / this.totalQuestions) * 100;
        
        progressBar.style.width = `${percentage}%`;
        progressBar.textContent = `${answered.length}/${this.totalQuestions}`;
    }

    getAnsweredQuestions() {
        const answered = [];
        for (let i = 1; i <= this.totalQuestions; i++) {
            const inputs = document.querySelectorAll(`input[name="q${i}"]:checked`);
            if (inputs.length > 0) {
                answered.push(i);
            }
        }
        return answered;
    }

    saveProgress() {
        const formData = new FormData(document.getElementById('examForm'));
        const answers = {};
        
        for (let [name, value] of formData.entries()) {
            if (answers[name]) {
                if (!Array.isArray(answers[name])) {
                    answers[name] = [answers[name]];
                }
                answers[name].push(value);
            } else {
                answers[name] = value;
            }
        }
        
        localStorage.setItem('exam110_progress', JSON.stringify({
            answers: answers,
            timestamp: Date.now()
        }));
    }

    loadProgress() {
        const saved = localStorage.getItem('exam110_progress');
        if (!saved) return;
        
        try {
            const data = JSON.parse(saved);
            const answers = data.answers;
            
            // 恢復選擇狀態
            Object.entries(answers).forEach(([name, value]) => {
                if (Array.isArray(value)) {
                    value.forEach(v => {
                        const input = document.querySelector(`input[name="${name}"][value="${v}"]`);
                        if (input) {
                            input.checked = true;
                            input.closest('.option').classList.add('selected');
                        }
                    });
                } else {
                    const input = document.querySelector(`input[name="${name}"][value="${value}"]`);
                    if (input) {
                        input.checked = true;
                        input.closest('.option').classList.add('selected');
                    }
                }
            });
            
            this.updateProgress();
        } catch (e) {
            console.error('載入進度失敗:', e);
        }
    }

    checkAnswers() {
        if (this.isSubmitted) {
            alert('答案已經檢查過了！');
            return;
        }

        const formData = new FormData(document.getElementById('examForm'));
        let correct = 0;
        let totalScore = 0;

        // 統計各題型得分
        const sectionScores = {
            vocabulary: 0,  // 1-15
            cloze: 0,       // 16-30
            fill: 0,        // 31-40
            reading: 0      // 41-56
        };

        // 檢查每一題
        for (let i = 1; i <= this.totalQuestions; i++) {
            const questionName = `q${i}`;
            const correctAnswer = this.answers[questionName];
            const userAnswers = formData.getAll(questionName);
            
            let isCorrect = false;
            
            if (Array.isArray(correctAnswer)) {
                // 多選題
                isCorrect = correctAnswer.length === userAnswers.length && 
                           correctAnswer.every(ans => userAnswers.includes(ans));
            } else {
                // 單選題
                isCorrect = userAnswers.length === 1 && userAnswers[0] === correctAnswer;
            }
            
            if (isCorrect) {
                correct++;
                // 計算得分
                if (i <= 15) {
                    sectionScores.vocabulary += 1;
                } else if (i <= 30) {
                    sectionScores.cloze += 1;
                } else if (i <= 40) {
                    sectionScores.fill += 1;
                } else {
                    sectionScores.reading += 2; // 閱讀測驗每題2分
                }
            }
            
            // 顯示答案反饋
            this.showQuestionFeedback(i, isCorrect, correctAnswer, userAnswers);
        }

        totalScore = sectionScores.vocabulary + sectionScores.cloze + 
                    sectionScores.fill + sectionScores.reading;

        // 顯示結果
        this.showResults(correct, totalScore, sectionScores);
        this.isSubmitted = true;
    }

    showQuestionFeedback(questionNum, isCorrect, correctAnswer, userAnswers) {
        const questionDiv = document.querySelector(`.question:has(input[name="q${questionNum}"])`);
        if (!questionDiv) return;

        // 移除舊的反饋
        const oldFeedback = questionDiv.querySelector('.feedback');
        if (oldFeedback) oldFeedback.remove();

        // 創建反饋元素
        const feedback = document.createElement('div');
        feedback.className = 'feedback';
        feedback.style.marginTop = '10px';
        feedback.style.padding = '10px';
        feedback.style.borderRadius = '5px';
        feedback.style.fontSize = '14px';

        if (isCorrect) {
            feedback.style.backgroundColor = '#d4edda';
            feedback.style.color = '#155724';
            feedback.innerHTML = '✓ 正確！';
        } else {
            feedback.style.backgroundColor = '#f8d7da';
            feedback.style.color = '#721c24';
            const correctText = Array.isArray(correctAnswer) ? 
                correctAnswer.join(', ') : correctAnswer;
            feedback.innerHTML = `✗ 錯誤。正確答案：${correctText}`;
        }

        questionDiv.appendChild(feedback);

        // 標記選項
        const options = questionDiv.querySelectorAll('.option');
        options.forEach(option => {
            const input = option.querySelector('input');
            const value = input.value;
            
            if (Array.isArray(correctAnswer)) {
                if (correctAnswer.includes(value)) {
                    option.style.backgroundColor = '#d4edda';
                }
            } else {
                if (value === correctAnswer) {
                    option.style.backgroundColor = '#d4edda';
                } else if (userAnswers.includes(value)) {
                    option.style.backgroundColor = '#f8d7da';
                }
            }
        });
    }

    showResults(correct, totalScore, sectionScores) {
        clearInterval(this.timerInterval);
        
        const resultHTML = `
            <div style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 2rem; border-radius: 15px; margin: 2rem 0; text-align: center;">
                <h2>📊 考試結果</h2>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin: 1.5rem 0;">
                    <div style="background: rgba(255,255,255,0.1); padding: 1rem; border-radius: 10px;">
                        <div style="font-size: 2rem; font-weight: bold;">${correct}/${this.totalQuestions}</div>
                        <div>答對題數</div>
                    </div>
                    <div style="background: rgba(255,255,255,0.1); padding: 1rem; border-radius: 10px;">
                        <div style="font-size: 2rem; font-weight: bold;">${totalScore}</div>
                        <div>總得分</div>
                    </div>
                    <div style="background: rgba(255,255,255,0.1); padding: 1rem; border-radius: 10px;">
                        <div style="font-size: 2rem; font-weight: bold;">${((correct/this.totalQuestions)*100).toFixed(1)}%</div>
                        <div>正確率</div>
                    </div>
                </div>
                <div style="margin-top: 1.5rem; text-align: left;">
                    <h3>📈 各部分得分：</h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem;">
                        <div>詞彙題：${sectionScores.vocabulary}/15分</div>
                        <div>綜合測驗：${sectionScores.cloze}/15分</div>
                        <div>文意選填：${sectionScores.fill}/10分</div>
                        <div>閱讀測驗：${sectionScores.reading}/32分</div>
                    </div>
                </div>
            </div>
        `;
        
        // 插入結果到頁面
        const container = document.querySelector('.exam-content .container');
        const resultDiv = document.createElement('div');
        resultDiv.innerHTML = resultHTML;
        container.insertBefore(resultDiv, container.firstChild);
        
        // 滾動到結果
        resultDiv.scrollIntoView({ behavior: 'smooth' });
        
        // 儲存結果
        this.saveResult(correct, totalScore, sectionScores);
    }

    saveResult(correct, totalScore, sectionScores) {
        const result = {
            year: '110',
            correct: correct,
            total: this.totalQuestions,
            score: totalScore,
            sectionScores: sectionScores,
            timestamp: Date.now(),
            timeSpent: Date.now() - this.startTime
        };
        
        localStorage.setItem('exam110_result', JSON.stringify(result));
    }

    submitExam() {
        if (!this.isSubmitted) {
            this.checkAnswers();
        }
        
        alert('考試已完成！您可以查看詳解或返回首頁。');
    }

    showAnswers() {
        this.checkAnswers();
    }

    resetExam() {
        if (confirm('確定要重新開始測驗嗎？所有進度將會清除。')) {
            localStorage.removeItem('exam110_progress');
            localStorage.removeItem('exam110_result');
            location.reload();
        }
    }
}

// 頁面載入完成後初始化
document.addEventListener('DOMContentLoaded', () => {
    window.exam = new Exam110();
});