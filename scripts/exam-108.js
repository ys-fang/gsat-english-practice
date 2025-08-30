// 108年學測英文試題 - 互動功能
class Exam108 {
    constructor() {
        // 正確答案 (基於題目分析推測)
        this.answers = {
            // 詞彙題 (1-10題)
            q1: 'A',    // recall - 召回有缺陷的產品
            q2: 'C',    // initiative - 新員工展現主動性
            q3: 'A',    // carefully - 博物館文物被小心保存
            q4: 'B',    // realized - 實現成為鋼琴家的夢想
            q5: 'A',    // declining - 氣溫下降
            q6: 'A',    // contribution - 對氣候變化理解的貢獻
            q7: 'A',    // submit - 提交作業
            q8: 'A',    // create - 創造就業機會
            q9: 'D',    // abstain - 戒煙
            q10: 'A',   // exceptional - 傑出的烹飪技巧

            // 綜合測驗 (11-20題)
            q11: 'A',   // access - 接觸產品
            q12: 'B',   // drawback - 缺點
            q13: 'A',   // flexible - 靈活的退貨政策
            q14: 'A',   // contributed - 貢獻於改善服務
            q15: 'B',   // sophisticated - 更精密的購物體驗
            q16: 'A',   // increasing - 日益增加的關注
            q17: 'A',   // achieved - 透過各種方法達成
            q18: 'C',   // minimizing - 減少廢物產生
            q19: 'A',   // instead - 代替傳統汽車
            q20: 'B',   // worthwhile - 值得的選擇

            // 文意選填 (21-30題)
            q21: 'D',   // essential - 在日常生活中越來越重要
            q22: 'A',   // instantly - 即時連接他人
            q23: 'G',   // feasible - 使遠距關係更可行
            q24: 'H',   // transformed - 改變資訊取得方式
            q25: 'E',   // informed - 讓人們更了解時事
            q26: 'C',   // mobility - 工作場所的靈活性和流動性
            q27: 'I',   // privacy - 隱私和社交互動的擔憂
            q28: 'J',   // reducing - 減少面對面溝通
            q29: 'F',   // evolve - 智慧手機持續演進
            q30: 'B',   // integrated - 更整合到生活各方面

            // 篇章結構 (31-34題)
            q31: 'A',   // 數位轉變改變度假方式
            q32: 'B',   // 網紅行銷創造新的推廣機會
            q33: 'C',   // 實施遊客限制和推廣冷門景點
            q34: 'E',   // 當地社區更參與觀光規劃

            // 閱讀測驗 (35-46題)
            // 第35-38題: 遠端工作
            q35: 'B',   // 遠端工作的優點和挑戰
            q36: 'B',   // 更好的工作生活平衡
            q37: 'C',   // 擴大人才庫
            q38: 'D',   // 增加培訓成本未提及

            // 第39-42題: 食物浪費
            q39: 'B',   // 約三分之一的食物被浪費
            q40: 'B',   // 已開發國家主要在消費層面浪費
            q41: 'C',   // 開發中國家的基礎設施不足
            q42: 'C',   // 改善包裝技術

            // 第43-46題: 再生能源
            q43: 'B',   // 技術進步和環境意識推動成長
            q44: 'C',   // 太陽能裝置成本下降超過80%
            q45: 'B',   // 離岸風場有更強且穩定的風力
            q46: 'B'    // 複雜的電網整合
        };

        // 題目配分
        this.scores = {
            vocabulary: 10,     // 詞彙題 1-10 (每題1分)
            cloze: 10,          // 綜合測驗 11-20 (每題1分)
            fill: 10,           // 文意選填 21-30 (每題1分)
            structure: 8,       // 篇章結構 31-34 (每題2分)
            reading: 24         // 閱讀測驗 35-46 (每題2分)
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
        
        localStorage.setItem('exam108_progress', JSON.stringify({
            answers: answers,
            timestamp: Date.now()
        }));
    }

    loadProgress() {
        const saved = localStorage.getItem('exam108_progress');
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
            vocabulary: 0,  // 1-10
            cloze: 0,       // 11-20
            fill: 0,        // 21-30
            structure: 0,   // 31-34
            reading: 0      // 35-46
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
                if (i <= 10) {
                    sectionScores.vocabulary += 1;
                } else if (i <= 20) {
                    sectionScores.cloze += 1;
                } else if (i <= 30) {
                    sectionScores.fill += 1;
                } else if (i <= 34) {
                    sectionScores.structure += 2; // 篇章結構每題2分
                } else {
                    sectionScores.reading += 2; // 閱讀測驗每題2分
                }
            }
            
            // 顯示答案反饋
            this.showQuestionFeedback(i, isCorrect, correctAnswer, userAnswers);
        }

        totalScore = sectionScores.vocabulary + sectionScores.cloze + 
                    sectionScores.fill + sectionScores.structure + sectionScores.reading;

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
            <div style="background: linear-gradient(135deg, #ff9ff3, #f368e0); color: white; padding: 2rem; border-radius: 15px; margin: 2rem 0; text-align: center;">
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
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 1rem;">
                        <div>詞彙題：${sectionScores.vocabulary}/10分</div>
                        <div>綜合測驗：${sectionScores.cloze}/10分</div>
                        <div>文意選填：${sectionScores.fill}/10分</div>
                        <div>篇章結構：${sectionScores.structure}/8分</div>
                        <div>閱讀測驗：${sectionScores.reading}/24分</div>
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
            year: '108',
            correct: correct,
            total: this.totalQuestions,
            score: totalScore,
            sectionScores: sectionScores,
            timestamp: Date.now(),
            timeSpent: Date.now() - this.startTime
        };
        
        localStorage.setItem('exam108_result', JSON.stringify(result));
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
            localStorage.removeItem('exam108_progress');
            localStorage.removeItem('exam108_result');
            location.reload();
        }
    }
}

// 頁面載入完成後初始化
document.addEventListener('DOMContentLoaded', () => {
    window.exam = new Exam108();
});