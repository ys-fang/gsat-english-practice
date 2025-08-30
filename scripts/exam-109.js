// 109年學測英文試題 - 互動功能
class Exam109 {
    constructor() {
        // 正確答案 (基於題目分析推測)
        this.answers = {
            // 詞彙題 (1-10題)
            q1: 'A',    // suffering from - 遭受水資源短缺
            q2: 'A',    // contact - 聯絡銷售人員
            q3: 'B',    // concerned - 擔心母親健康
            q4: 'B',    // lasted - 持續三天下雨
            q5: 'B',    // effective - 藥物有效
            q6: 'C',    // adjust - 調整行銷策略
            q7: 'A',    // guided - 導覽團
            q8: 'A',    // shortage - 化石燃料短缺
            q9: 'A',    // outstanding - 傑出表現
            q10: 'A',   // submit - 提交作業

            // 綜合測驗 (11-20題)
            q11: 'A',   // originated - 慢食運動起源
            q12: 'C',   // social - 社交體驗
            q13: 'A',   // threatens - 威脅傳統農業
            q14: 'B',   // featuring - 以當地食材為特色
            q15: 'A',   // justify - 證明額外成本值得
            q16: 'B',   // confirm - 科學家證實
            q17: 'B',   // extreme - 極端天氣模式
            q18: 'B',   // reduce - 減少溫室氣體排放
            q19: 'B',   // educating - 教育民眾
            q20: 'B',   // through - 通過全球合作

            // 文意選填 (21-30題)
            q21: 'A',   // vulnerable - 容易受到威脅
            q22: 'F',   // steal - 竊取敏感資訊
            q23: 'I',   // entering - 輸入登錄憑證
            q24: 'C',   // preventive - 預防策略
            q25: 'D',   // store - 儲存密碼
            q26: 'E',   // cautious - 謹慎點擊連結
            q27: 'B',   // release - 發布安全補丁
            q28: 'G',   // layer - 額外的保護層
            q29: 'J',   // detect - 偵測可疑網站
            q30: 'H',   // reduce - 降低風險

            // 篇章結構 (31-34題)
            q31: 'B',   // 社群媒體正面效益開場
            q32: 'D',   // 錯誤資訊和極化風險
            q33: 'A',   // 對心理健康的影響
            q34: 'C',   // 數位素養和平台責任

            // 閱讀測驗 (35-46題)
            // 第35-38題: 城市農業
            q35: 'B',   // 城市農業的優點和挑戰
            q36: 'B',   // 減少對遠距食物來源的依賴
            q37: 'D',   // 降低噪音污染未提及
            q38: 'B',   // 高初期投資成本

            // 第39-42題: 人工智慧
            q39: 'B',   // 討論AI發展及其影響
            q40: 'B',   // 無需特定程式就能學習和決策
            q41: 'D',   // 環境影響未提及
            q42: 'C',   // 發展倫理指導原則和透明度

            // 第43-46題: 地中海飲食
            q43: 'B',   // 基於地中海國家傳統飲食模式
            q44: 'B',   // 單元不飽和脂肪
            q45: 'C',   // 改善骨密度未提及
            q46: 'C'    // 促進環境永續性
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
        
        localStorage.setItem('exam109_progress', JSON.stringify({
            answers: answers,
            timestamp: Date.now()
        }));
    }

    loadProgress() {
        const saved = localStorage.getItem('exam109_progress');
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
            <div style="background: linear-gradient(135deg, #a29bfe, #6c5ce7); color: white; padding: 2rem; border-radius: 15px; margin: 2rem 0; text-align: center;">
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
            year: '109',
            correct: correct,
            total: this.totalQuestions,
            score: totalScore,
            sectionScores: sectionScores,
            timestamp: Date.now(),
            timeSpent: Date.now() - this.startTime
        };
        
        localStorage.setItem('exam109_result', JSON.stringify(result));
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
            localStorage.removeItem('exam109_progress');
            localStorage.removeItem('exam109_result');
            location.reload();
        }
    }
}

// 頁面載入完成後初始化
document.addEventListener('DOMContentLoaded', () => {
    window.exam = new Exam109();
});