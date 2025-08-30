class Exam113 {
    constructor() {
        this.answers = {
            // 詞彙題 (1-10題, 每題1分)
            q1: 'B', q2: 'A', q3: 'B', q4: 'B', q5: 'D',
            q6: 'C', q7: 'D', q8: 'C', q9: 'A', q10: 'B',
            // 綜合測驗 (11-20題, 每題1分)
            q11: 'B', q12: 'D', q13: 'D', q14: 'A', q15: 'C',
            q16: 'B', q17: 'C', q18: 'A', q19: 'D', q20: 'C',
            // 文意選填 (21-30題, 每題1分)
            q21: 'E', q22: 'I', q23: 'J', q24: 'C', q25: 'G',
            q26: 'A', q27: 'H', q28: 'B', q29: 'F', q30: 'D',
            // 篇章結構 (31-34題, 每題2分)
            q31: 'D', q32: 'C', q33: 'A', q34: 'B',
            // 閱讀測驗 (35-46題, 每題2分)
            q35: 'B', q36: 'D', q37: 'B', q38: 'A', q39: 'D', q40: 'A',
            q41: 'B', q42: 'C', q43: 'D', q44: 'B', q45: 'C', q46: 'C',
            // 混合題 (47-50題)
            q47: 'collective', // 可能的答案之一
            q48: 'adapting',   // 可能的答案之一
            q49: ['C', 'F'],   // 多選題
            q50: 'presence of predator' // 簡答題的參考答案
        };

        this.points = {
            // 第壹部分選擇題 (62分)
            // 詞彙 (10分): 1-10題, 每題1分
            q1: 1, q2: 1, q3: 1, q4: 1, q5: 1,
            q6: 1, q7: 1, q8: 1, q9: 1, q10: 1,
            // 綜合測驗 (10分): 11-20題, 每題1分
            q11: 1, q12: 1, q13: 1, q14: 1, q15: 1,
            q16: 1, q17: 1, q18: 1, q19: 1, q20: 1,
            // 文意選填 (10分): 21-30題, 每題1分
            q21: 1, q22: 1, q23: 1, q24: 1, q25: 1,
            q26: 1, q27: 1, q28: 1, q29: 1, q30: 1,
            // 篇章結構 (8分): 31-34題, 每題2分
            q31: 2, q32: 2, q33: 2, q34: 2,
            // 閱讀測驗 (24分): 35-46題, 每題2分
            q35: 2, q36: 2, q37: 2, q38: 2, q39: 2, q40: 2,
            q41: 2, q42: 2, q43: 2, q44: 2, q45: 2, q46: 2,
            // 第貳部分混合題 (10分)
            q47: 2, q48: 2, q49: 4, q50: 2
        };

        this.sections = [
            { name: '詞彙題', start: 1, end: 10, points: 10 },
            { name: '綜合測驗', start: 11, end: 20, points: 10 },
            { name: '文意選填', start: 21, end: 30, points: 10 },
            { name: '篇章結構', start: 31, end: 34, points: 8 },
            { name: '閱讀測驗', start: 35, end: 46, points: 24 },
            { name: '混合題', start: 47, end: 50, points: 10 }
        ];

        this.totalQuestions = 46; // 不包含混合題的主要題數
        this.totalPoints = 72; // 總分
        this.timeLimit = 100 * 60; // 100分鐘，轉為秒
        this.timeRemaining = this.timeLimit;
        this.timerInterval = null;
        this.answeredQuestions = new Set();
        this.userAnswers = {};
        this.isAnswersChecked = false;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadProgress();
        this.startTimer();
        this.updateProgress();
    }

    setupEventListeners() {
        // 單選題事件監聽
        document.querySelectorAll('input[type="radio"]').forEach(input => {
            input.addEventListener('change', (e) => {
                this.handleAnswerChange(e.target.name, e.target.value, 'radio');
                this.saveProgress();
                this.updateProgress();
            });
        });

        // 多選題事件監聽
        document.querySelectorAll('input[type="checkbox"]').forEach(input => {
            input.addEventListener('change', (e) => {
                this.handleMultipleChoice(e.target.name, e.target.value, e.target.checked);
                this.saveProgress();
                this.updateProgress();
            });
        });

        // 填空題事件監聽
        document.querySelectorAll('input[type="text"].fill-blank').forEach(input => {
            input.addEventListener('input', (e) => {
                this.handleAnswerChange(e.target.name, e.target.value.trim(), 'text');
                this.saveProgress();
                this.updateProgress();
            });
        });

        // 簡答題事件監聽
        document.querySelectorAll('textarea').forEach(textarea => {
            textarea.addEventListener('input', (e) => {
                this.handleAnswerChange(e.target.name, e.target.value.trim(), 'textarea');
                this.saveProgress();
                this.updateProgress();
            });
        });

        // 按鈕事件監聽
        document.getElementById('checkAnswers')?.addEventListener('click', () => {
            this.checkAnswers();
        });

        document.getElementById('submitExam')?.addEventListener('click', () => {
            this.submitExam();
        });
    }

    handleAnswerChange(questionName, value, type) {
        this.userAnswers[questionName] = value;
        
        if (type === 'radio' && value) {
            this.answeredQuestions.add(questionName);
        } else if (type === 'text' || type === 'textarea') {
            if (value && value.length > 0) {
                this.answeredQuestions.add(questionName);
            } else {
                this.answeredQuestions.delete(questionName);
            }
        }
    }

    handleMultipleChoice(questionName, value, checked) {
        if (!this.userAnswers[questionName]) {
            this.userAnswers[questionName] = [];
        }

        if (checked) {
            if (!this.userAnswers[questionName].includes(value)) {
                this.userAnswers[questionName].push(value);
            }
        } else {
            this.userAnswers[questionName] = this.userAnswers[questionName].filter(v => v !== value);
        }

        // 更新答題狀態
        if (this.userAnswers[questionName].length > 0) {
            this.answeredQuestions.add(questionName);
        } else {
            this.answeredQuestions.delete(questionName);
        }
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            this.timeRemaining--;
            this.updateTimer();
            
            if (this.timeRemaining <= 0) {
                this.timeUp();
            } else if (this.timeRemaining === 10 * 60) { // 剩10分鐘警告
                this.showTimeWarning('剩餘10分鐘！');
            } else if (this.timeRemaining === 5 * 60) { // 剩5分鐘警告
                this.showTimeWarning('剩餘5分鐘！');
            }
        }, 1000);
    }

    updateTimer() {
        const minutes = Math.floor(this.timeRemaining / 60);
        const seconds = this.timeRemaining % 60;
        const timerElement = document.getElementById('timer');
        
        if (timerElement) {
            timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            
            if (this.timeRemaining <= 5 * 60) {
                timerElement.style.color = '#e74c3c';
                timerElement.style.fontWeight = 'bold';
            } else if (this.timeRemaining <= 10 * 60) {
                timerElement.style.color = '#f39c12';
            }
        }
    }

    showTimeWarning(message) {
        const warning = document.createElement('div');
        warning.style.cssText = `
            position: fixed; top: 20px; right: 20px; z-index: 1000;
            background: #e74c3c; color: white; padding: 1rem;
            border-radius: 5px; font-weight: bold; box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        `;
        warning.textContent = message;
        document.body.appendChild(warning);
        
        setTimeout(() => warning.remove(), 3000);
    }

    timeUp() {
        clearInterval(this.timerInterval);
        alert('考試時間結束！系統將自動提交試卷。');
        this.submitExam();
    }

    updateProgress() {
        const progressBar = document.getElementById('progressBar');
        const progressText = document.getElementById('progressText');
        
        const totalAnswerable = this.totalQuestions + 4; // 46個主要選擇題 + 4個混合題
        const progress = (this.answeredQuestions.size / totalAnswerable) * 100;
        
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
        
        if (progressText) {
            progressText.textContent = `${this.answeredQuestions.size}/${totalAnswerable}`;
        }
    }

    checkAnswers() {
        this.isAnswersChecked = true;
        let correctCount = 0;
        let totalScore = 0;

        // 檢查所有答案
        Object.keys(this.answers).forEach(qId => {
            const userAnswer = this.userAnswers[qId];
            const correctAnswer = this.answers[qId];
            const questionElement = document.querySelector(`[name="${qId}"]`)?.closest('.question');
            
            if (questionElement) {
                const isCorrect = this.isAnswerCorrect(qId, userAnswer, correctAnswer);
                
                if (isCorrect) {
                    correctCount++;
                    totalScore += this.points[qId];
                    questionElement.classList.add('correct');
                    questionElement.classList.remove('incorrect');
                } else {
                    questionElement.classList.add('incorrect');
                    questionElement.classList.remove('correct');
                }
                
                // 顯示正確答案
                this.showCorrectAnswer(questionElement, qId, correctAnswer);
            }
        });

        // 更新統計資料
        this.updateStats(correctCount, totalScore);
        
        // 顯示統計區域和提交按鈕
        document.getElementById('statsArea').style.display = 'flex';
        document.getElementById('submitExam').style.display = 'inline-block';
        
        // 顯示得分
        const scoreDisplay = document.getElementById('currentScore');
        if (scoreDisplay) {
            document.getElementById('scoreValue').textContent = totalScore;
            scoreDisplay.style.display = 'block';
        }
    }

    isAnswerCorrect(qId, userAnswer, correctAnswer) {
        if (qId === 'q49') { // 多選題
            if (!userAnswer || !Array.isArray(userAnswer)) return false;
            const sortedUser = [...userAnswer].sort();
            const sortedCorrect = [...correctAnswer].sort();
            return sortedUser.length === sortedCorrect.length && 
                   sortedUser.every(val => sortedCorrect.includes(val));
        } else if (qId === 'q47' || qId === 'q48') { // 填空題
            if (!userAnswer) return false;
            // 對於填空題，接受多種可能的正確答案
            const possibleAnswers = {
                q47: ['collective', 'group', 'cooperative', 'social'],
                q48: ['adapting', 'adjusting', 'responding', 'reacting']
            };
            return possibleAnswers[qId]?.some(answer => 
                userAnswer.toLowerCase().includes(answer.toLowerCase())
            ) || false;
        } else if (qId === 'q50') { // 簡答題
            if (!userAnswer) return false;
            // 對於簡答題，檢查是否包含關鍵詞
            const keywords = ['predator', 'fox', 'danger', 'threat'];
            return keywords.some(keyword => 
                userAnswer.toLowerCase().includes(keyword.toLowerCase())
            );
        } else { // 單選題
            return userAnswer === correctAnswer;
        }
    }

    showCorrectAnswer(questionElement, qId, correctAnswer) {
        const existingAnswer = questionElement.querySelector('.correct-answer');
        if (existingAnswer) existingAnswer.remove();

        const answerDiv = document.createElement('div');
        answerDiv.className = 'correct-answer';
        answerDiv.style.cssText = `
            margin-top: 0.5rem; padding: 0.5rem; background: #e8f5e8;
            border-left: 3px solid #27ae60; font-size: 0.9rem; color: #27ae60;
        `;

        if (qId === 'q49') { // 多選題
            answerDiv.innerHTML = `正確答案：${correctAnswer.join(', ')}`;
        } else if (qId === 'q47' || qId === 'q48') { // 填空題
            const possibleAnswers = {
                q47: ['collective', 'group', 'cooperative', 'social'],
                q48: ['adapting', 'adjusting', 'responding', 'reacting']
            };
            answerDiv.innerHTML = `參考答案：${possibleAnswers[qId]?.join(' / ')}`;
        } else if (qId === 'q50') { // 簡答題
            answerDiv.innerHTML = `參考答案：presence of predator (or fox, danger, threat)`;
        } else { // 單選題
            answerDiv.innerHTML = `正確答案：${correctAnswer}`;
        }

        questionElement.appendChild(answerDiv);
    }

    updateStats(correctCount, totalScore) {
        document.getElementById('correctCount').textContent = correctCount;
        document.getElementById('scoreText').textContent = `${totalScore}/${this.totalPoints}`;
    }

    submitExam() {
        if (!this.isAnswersChecked) {
            const proceed = confirm('尚未檢查答案，確定要提交嗎？');
            if (!proceed) return;
        }

        clearInterval(this.timerInterval);
        
        // 計算最終分數
        let finalScore = 0;
        let correctAnswers = 0;
        
        Object.keys(this.answers).forEach(qId => {
            const isCorrect = this.isAnswerCorrect(qId, this.userAnswers[qId], this.answers[qId]);
            if (isCorrect) {
                correctAnswers++;
                finalScore += this.points[qId];
            }
        });

        // 計算各部分成績
        const sectionScores = this.calculateSectionScores();
        
        // 顯示最終成績
        this.showFinalResults(finalScore, correctAnswers, sectionScores);
        
        // 清除本地存儲
        localStorage.removeItem('exam113_progress');
        localStorage.removeItem('exam113_time');
    }

    calculateSectionScores() {
        const scores = {};
        
        this.sections.forEach(section => {
            let sectionScore = 0;
            let maxSectionScore = 0;
            
            for (let i = section.start; i <= section.end; i++) {
                const qId = `q${i}`;
                if (this.answers[qId]) {
                    maxSectionScore += this.points[qId];
                    if (this.isAnswerCorrect(qId, this.userAnswers[qId], this.answers[qId])) {
                        sectionScore += this.points[qId];
                    }
                }
            }
            
            scores[section.name] = {
                score: sectionScore,
                maxScore: maxSectionScore,
                percentage: maxSectionScore > 0 ? Math.round((sectionScore / maxSectionScore) * 100) : 0
            };
        });
        
        return scores;
    }

    showFinalResults(finalScore, correctAnswers, sectionScores) {
        const percentage = Math.round((finalScore / this.totalPoints) * 100);
        
        const resultModal = document.createElement('div');
        resultModal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.8); display: flex; justify-content: center; align-items: center;
            z-index: 10000; font-family: Arial, 'Microsoft JhengHei', sans-serif;
        `;
        
        const resultContent = document.createElement('div');
        resultContent.style.cssText = `
            background: white; padding: 2rem; border-radius: 10px; max-width: 600px;
            width: 90%; max-height: 80%; overflow-y: auto; box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        `;

        let sectionScoreHTML = '';
        Object.keys(sectionScores).forEach(sectionName => {
            const data = sectionScores[sectionName];
            sectionScoreHTML += `
                <div style="display: flex; justify-content: space-between; margin: 0.5rem 0; padding: 0.5rem; background: #f8f9fa; border-radius: 5px;">
                    <span>${sectionName}</span>
                    <span><strong>${data.score}/${data.maxScore}</strong> (${data.percentage}%)</span>
                </div>
            `;
        });
        
        resultContent.innerHTML = `
            <h2 style="color: #2c3e50; margin-bottom: 1.5rem; text-align: center;">
                📊 113學年度學測英文 - 考試結果
            </h2>
            
            <div style="text-align: center; margin-bottom: 2rem;">
                <div style="font-size: 3rem; color: ${percentage >= 60 ? '#27ae60' : '#e74c3c'}; font-weight: bold;">
                    ${finalScore}/${this.totalPoints}
                </div>
                <div style="font-size: 1.5rem; color: #7f8c8d; margin-top: 0.5rem;">
                    ${percentage}% (${correctAnswers} 題正確)
                </div>
            </div>

            <h3 style="color: #34495e; margin-bottom: 1rem;">📈 各部分成績：</h3>
            ${sectionScoreHTML}

            <div style="margin-top: 2rem; padding: 1rem; background: #ecf0f1; border-radius: 5px;">
                <h4 style="color: #2c3e50; margin-bottom: 0.5rem;">💡 學習建議：</h4>
                <ul style="margin: 0; padding-left: 1.2rem; color: #34495e;">
                    ${this.getStudySuggestions(sectionScores)}
                </ul>
            </div>

            <div style="display: flex; gap: 1rem; justify-content: center; margin-top: 2rem;">
                <button onclick="window.location.reload()" style="
                    background: #3498db; color: white; border: none; padding: 0.8rem 1.5rem;
                    border-radius: 5px; cursor: pointer; font-size: 1rem; font-weight: bold;
                ">🔄 重新開始</button>
                <button onclick="window.location.href='../index.html'" style="
                    background: #95a5a6; color: white; border: none; padding: 0.8rem 1.5rem;
                    border-radius: 5px; cursor: pointer; font-size: 1rem; font-weight: bold;
                ">🏠 返回首頁</button>
            </div>
        `;
        
        resultModal.appendChild(resultContent);
        document.body.appendChild(resultModal);
    }

    getStudySuggestions(sectionScores) {
        const suggestions = [];
        
        Object.keys(sectionScores).forEach(sectionName => {
            const percentage = sectionScores[sectionName].percentage;
            if (percentage < 60) {
                switch(sectionName) {
                    case '詞彙題':
                        suggestions.push('加強基礎單字記憶，建議使用字根字首記憶法');
                        break;
                    case '綜合測驗':
                        suggestions.push('多練習文法結構與句型轉換');
                        break;
                    case '文意選填':
                        suggestions.push('提升閱讀理解能力，注意上下文脈絡');
                        break;
                    case '篇章結構':
                        suggestions.push('加強段落間邏輯關係的理解');
                        break;
                    case '閱讀測驗':
                        suggestions.push('增加英文閱讀量，提升閱讀速度與理解力');
                        break;
                    case '混合題':
                        suggestions.push('練習不同題型的應答技巧與時間分配');
                        break;
                }
            }
        });
        
        if (suggestions.length === 0) {
            suggestions.push('各部分表現良好，繼續保持！可挑戰更難的題目。');
        }
        
        return suggestions.map(s => `<li>${s}</li>`).join('');
    }

    saveProgress() {
        const progress = {
            userAnswers: this.userAnswers,
            answeredQuestions: Array.from(this.answeredQuestions),
            timeRemaining: this.timeRemaining,
            isAnswersChecked: this.isAnswersChecked
        };
        
        localStorage.setItem('exam113_progress', JSON.stringify(progress));
    }

    loadProgress() {
        const saved = localStorage.getItem('exam113_progress');
        if (!saved) return;

        try {
            const progress = JSON.parse(saved);
            this.userAnswers = progress.userAnswers || {};
            this.answeredQuestions = new Set(progress.answeredQuestions || []);
            this.timeRemaining = progress.timeRemaining || this.timeLimit;
            this.isAnswersChecked = progress.isAnswersChecked || false;

            // 恢復答案到表單
            Object.keys(this.userAnswers).forEach(qId => {
                const answer = this.userAnswers[qId];
                
                if (qId === 'q49') { // 多選題
                    if (Array.isArray(answer)) {
                        answer.forEach(value => {
                            const checkbox = document.querySelector(`input[name="${qId}"][value="${value}"]`);
                            if (checkbox) checkbox.checked = true;
                        });
                    }
                } else if (qId === 'q47' || qId === 'q48') { // 填空題
                    const input = document.querySelector(`input[name="${qId}"]`);
                    if (input) input.value = answer;
                } else if (qId === 'q50') { // 簡答題
                    const textarea = document.querySelector(`textarea[name="${qId}"]`);
                    if (textarea) textarea.value = answer;
                } else { // 單選題
                    const radio = document.querySelector(`input[name="${qId}"][value="${answer}"]`);
                    if (radio) radio.checked = true;
                }
            });

            console.log('113年學測英文進度已恢復');
        } catch (error) {
            console.error('恢復進度失敗:', error);
        }
    }
}

// 頁面載入完成後初始化
document.addEventListener('DOMContentLoaded', () => {
    console.log('113學年度學測英文考試系統載入完成');
    new Exam113();
});