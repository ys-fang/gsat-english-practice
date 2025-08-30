class Exam111 {
    constructor() {
        this.answers = {
            1: 'B', 2: 'A', 3: 'C', 4: 'A', 5: 'A',
            6: 'C', 7: 'B', 8: 'D', 9: 'D', 10: 'B',
            11: 'A', 12: 'D', 13: 'C', 14: 'B', 15: 'D',
            16: 'D', 17: 'A', 18: 'D', 19: 'C', 20: 'A',
            21: 'C', 22: 'I', 23: 'F', 24: 'H', 25: 'D',
            26: 'G', 27: 'J', 28: 'E', 29: 'A', 30: 'B',
            31: 'D', 32: 'A', 33: 'C', 34: 'B',
            35: 'B', 36: 'A', 37: 'C', 38: 'C', 39: 'D',
            40: 'A', 41: 'B', 42: 'B', 43: 'D', 44: 'C',
            45: 'A', 46: 'D',
            47: 'participating', '47b': 'abuse',
            48: 'asylum',
            49: 'CD'
        };
        
        this.totalQuestions = 49;
        this.timeLimit = 100 * 60;
        this.userAnswers = this.loadAnswers();
        this.startTime = Date.now();
        
        this.initializeExam();
        this.startTimer();
        this.bindEvents();
    }

    initializeExam() {
        this.loadAnswers();
        this.updateProgress();
        
        const savedTime = localStorage.getItem('exam111_remainingTime');
        if (savedTime) {
            this.timeLimit = parseInt(savedTime);
        }
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            this.timeLimit--;
            this.updateTimerDisplay();
            this.saveProgress();
            
            if (this.timeLimit <= 10 * 60) {
                document.getElementById('timer').style.color = '#e74c3c';
            }
            
            if (this.timeLimit <= 0) {
                this.submitExam();
            }
        }, 1000);
    }

    updateTimerDisplay() {
        const minutes = Math.floor(this.timeLimit / 60);
        const seconds = this.timeLimit % 60;
        const timerElement = document.getElementById('timer');
        timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    bindEvents() {
        document.querySelectorAll('input[type="radio"]').forEach(input => {
            input.addEventListener('change', (e) => {
                const questionNum = parseInt(e.target.name.replace('q', ''));
                this.userAnswers[questionNum] = e.target.value;
                this.saveAnswers();
                this.updateProgress();
            });
        });

        document.querySelectorAll('input[type="checkbox"]').forEach(input => {
            input.addEventListener('change', (e) => {
                const questionNum = e.target.name.replace('q', '');
                if (!this.userAnswers[questionNum]) {
                    this.userAnswers[questionNum] = '';
                }
                
                if (e.target.checked) {
                    this.userAnswers[questionNum] += e.target.value;
                } else {
                    this.userAnswers[questionNum] = this.userAnswers[questionNum].replace(e.target.value, '');
                }
                
                this.saveAnswers();
                this.updateProgress();
            });
        });

        document.querySelectorAll('input[type="text"]').forEach(input => {
            input.addEventListener('input', (e) => {
                const questionNum = e.target.name.replace('q', '');
                this.userAnswers[questionNum] = e.target.value.trim();
                this.saveAnswers();
                this.updateProgress();
            });
        });

        document.querySelectorAll('select').forEach(select => {
            select.addEventListener('change', (e) => {
                const questionNum = parseInt(e.target.name.replace('q', ''));
                this.userAnswers[questionNum] = e.target.value;
                this.saveAnswers();
                this.updateProgress();
            });
        });

        window.addEventListener('beforeunload', () => {
            this.saveProgress();
        });
    }

    updateProgress() {
        const answered = Object.keys(this.userAnswers).filter(key => 
            this.userAnswers[key] && this.userAnswers[key].toString().trim() !== ''
        ).length;
        
        const percentage = (answered / this.totalQuestions) * 100;
        const progressBar = document.getElementById('progressBar');
        if (progressBar) {
            progressBar.style.width = `${percentage}%`;
        }
    }

    saveAnswers() {
        localStorage.setItem('exam111_answers', JSON.stringify(this.userAnswers));
    }

    loadAnswers() {
        const saved = localStorage.getItem('exam111_answers');
        const answers = saved ? JSON.parse(saved) : {};
        
        Object.keys(answers).forEach(questionNum => {
            const value = answers[questionNum];
            
            if (questionNum.includes('b') || questionNum === '47' || questionNum === '48') {
                const input = document.querySelector(`input[name="q${questionNum}"]`);
                if (input && input.type === 'text') {
                    input.value = value;
                }
            } else if (questionNum === '49') {
                for (let char of value) {
                    const checkbox = document.querySelector(`input[name="q${questionNum}"][value="${char}"]`);
                    if (checkbox) {
                        checkbox.checked = true;
                    }
                }
            } else {
                const input = document.querySelector(`input[name="q${questionNum}"]:not([type="radio"]), select[name="q${questionNum}"]`);
                
                if (input) {
                    if (input.tagName === 'SELECT') {
                        input.value = value;
                    }
                } else {
                    const radioInput = document.querySelector(`input[name="q${questionNum}"][value="${value}"]`);
                    if (radioInput) {
                        radioInput.checked = true;
                    }
                }
            }
        });
        
        return answers;
    }

    saveProgress() {
        localStorage.setItem('exam111_remainingTime', this.timeLimit.toString());
        localStorage.setItem('exam111_answers', JSON.stringify(this.userAnswers));
    }

    submitExam() {
        clearInterval(this.timerInterval);
        
        const results = this.calculateScore();
        this.displayResults(results);
        
        localStorage.removeItem('exam111_remainingTime');
        localStorage.removeItem('exam111_answers');
    }

    calculateScore() {
        let score = 0;
        const results = {};
        
        for (let i = 1; i <= 46; i++) {
            const userAnswer = this.userAnswers[i];
            const correctAnswer = this.answers[i];
            
            if (userAnswer && userAnswer.toString().toLowerCase() === correctAnswer.toString().toLowerCase()) {
                results[i] = 'correct';
                score += (i >= 1 && i <= 10) ? 2 : 
                         (i >= 11 && i <= 20) ? 2 :
                         (i >= 21 && i <= 30) ? 1.5 :
                         (i >= 31 && i <= 34) ? 2 :
                         (i >= 35 && i <= 46) ? 2 : 0;
            } else {
                results[i] = 'incorrect';
            }
        }
        
        // Mixed questions scoring
        if (this.userAnswers['47'] && this.userAnswers['47'].toLowerCase().includes('participat')) {
            results['47'] = 'correct';
            score += 2;
        } else {
            results['47'] = 'incorrect';
        }
        
        if (this.userAnswers['47b'] && this.userAnswers['47b'].toLowerCase().includes('abus')) {
            results['47b'] = 'correct';
            score += 2;
        } else {
            results['47b'] = 'incorrect';
        }
        
        if (this.userAnswers['48'] && this.userAnswers['48'].toLowerCase() === 'asylum') {
            results['48'] = 'correct';
            score += 2;
        } else {
            results['48'] = 'incorrect';
        }
        
        if (this.userAnswers['49'] && this.userAnswers['49'].includes('C') && this.userAnswers['49'].includes('D') && this.userAnswers['49'].length === 2) {
            results['49'] = 'correct';
            score += 4;
        } else {
            results['49'] = 'incorrect';
        }
        
        return { score, results, totalPossible: 72 };
    }

    displayResults(results) {
        const percentage = Math.round((results.score / results.totalPossible) * 100);
        let level = '';
        
        if (percentage >= 90) level = '頂標';
        else if (percentage >= 80) level = '前標';
        else if (percentage >= 70) level = '均標';
        else if (percentage >= 60) level = '後標';
        else level = '底標';

        const correct = Object.values(results.results).filter(r => r === 'correct').length;
        const incorrect = this.totalQuestions - correct;

        const resultModal = document.createElement('div');
        resultModal.innerHTML = `
            <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 1000; display: flex; align-items: center; justify-content: center;">
                <div style="background: white; padding: 2rem; border-radius: 15px; max-width: 500px; width: 90%; text-align: center;">
                    <h2 style="color: #2d3436; margin-bottom: 1rem;">📊 測驗結果</h2>
                    <div style="font-size: 3rem; margin: 1rem 0; color: #00b894;">${percentage}%</div>
                    <div style="margin: 1rem 0;">
                        <div style="color: #2d3436; font-size: 1.2rem; margin: 0.5rem 0;">總分：${results.score} / ${results.totalPossible}</div>
                        <div style="color: #636e72;">等級：${level}</div>
                    </div>
                    <div style="display: flex; justify-content: space-around; margin: 1.5rem 0;">
                        <div>
                            <div style="color: #00b894; font-size: 1.5rem; font-weight: bold;">${correct}</div>
                            <div style="color: #636e72; font-size: 0.9rem;">答對</div>
                        </div>
                        <div>
                            <div style="color: #e17055; font-size: 1.5rem; font-weight: bold;">${incorrect}</div>
                            <div style="color: #636e72; font-size: 0.9rem;">答錯</div>
                        </div>
                    </div>
                    <div style="margin-top: 1.5rem;">
                        <button onclick="this.parentElement.parentElement.parentElement.remove(); exam.showAnswers();" style="background: #0984e3; color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 25px; margin: 0 0.5rem; cursor: pointer;">查看詳解</button>
                        <button onclick="location.reload()" style="background: #636e72; color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 25px; margin: 0 0.5rem; cursor: pointer;">重新測驗</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(resultModal);
    }

    showAnswers() {
        document.querySelectorAll('.question').forEach(question => {
            const questionNumText = question.querySelector('.question-number').textContent;
            const questionNum = questionNumText.includes('-') ? questionNumText.split('-')[0] : questionNumText;
            const correctAnswer = this.answers[questionNum] || this.answers[parseInt(questionNum)];
            const userAnswer = this.userAnswers[questionNum] || this.userAnswers[parseInt(questionNum)];
            
            if (correctAnswer) {
                const answerDiv = document.createElement('div');
                answerDiv.className = 'answer-explanation';
                
                let isCorrect = false;
                if (userAnswer && userAnswer.toString().toLowerCase().includes(correctAnswer.toString().toLowerCase())) {
                    isCorrect = true;
                }
                
                answerDiv.innerHTML = `
                    <div style="background: ${isCorrect ? '#d4edda' : '#f8d7da'}; 
                                border: 1px solid ${isCorrect ? '#c3e6cb' : '#f5c6cb'}; 
                                padding: 1rem; margin-top: 1rem; border-radius: 8px;">
                        <div style="font-weight: bold; color: ${isCorrect ? '#155724' : '#721c24'};">
                            ${isCorrect ? '✓ 答對了！' : '✗ 答錯了'}
                        </div>
                        <div style="margin-top: 0.5rem;">
                            正確答案：${correctAnswer}
                            ${userAnswer ? ` | 你的答案：${userAnswer}` : ' | 未作答'}
                        </div>
                    </div>
                `;
                
                question.appendChild(answerDiv);
            }
        });
        
        document.getElementById('timer').style.display = 'none';
        const controls = document.querySelector('.controls');
        if (controls) {
            controls.innerHTML = `
                <div class="container">
                    <div class="control-buttons">
                        <a href="../index.html" class="btn btn-secondary">← 返回首頁</a>
                        <button onclick="location.reload()" class="btn btn-primary">重新測驗</button>
                        <button onclick="window.print()" class="btn btn-secondary">列印結果</button>
                    </div>
                </div>
            `;
        }
    }

    resetExam() {
        if (confirm('確定要重新開始測驗嗎？所有進度將會清除。')) {
            localStorage.removeItem('exam111_answers');
            localStorage.removeItem('exam111_remainingTime');
            location.reload();
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.exam = new Exam111();
    console.log('111學年度學測英文互動系統已啟動');
});