// 107年學測英文試題 - 互動功能
class Exam107 {
    constructor() {
        // 正確答案 (基於題目分析推測)
        this.answers = {
            // 詞彙題 (1-10題)
            q1: 'A',    // comprehensive - 全面的課程
            q2: 'A',    // essential - 運動和飲食對健康是必要的
            q3: 'A',    // enhance - 提升員工滿意度和生產力
            q4: 'A',    // efficient - 更高效的再生能源方法
            q5: 'B',    // visitors - 博物館吸引遊客
            q6: 'A',    // demonstrate - 展示理解
            q7: 'A',    // intensive - 密集訓練
            q8: 'A',    // implement - 實施環境保護法
            q9: 'A',    // thorough - 徹底分析
            q10: 'A',   // advantage - 競爭優勢

            // 綜合測驗 (11-20題)
            q11: 'A',   // created - 數位學習創造了機會和挑戰
            q12: 'A',   // attend - 參加課程
            q13: 'A',   // formal - 正式的教室結構
            q14: 'B',   // isolating - 缺乏面對面互動讓人感到孤立
            q15: 'B',   // benefits - 混合學習的好處
            q16: 'B',   // recognizing - 認識到心理健康的重要性
            q17: 'B',   // releases - 運動釋放內啡肽
            q18: 'A',   // get through - 度過困難時期
            q19: 'A',   // strategies - 治療師提供策略
            q20: 'B',   // collective - 集體責任

            // 文意選填 (21-30題)
            q21: 'A',   // steadily - 地球溫度持續上升
            q22: 'C',   // increasing - 二氧化碳濃度增加
            q23: 'E',   // reducing - 森林砍伐減少地球吸收二氧化碳的能力
            q24: 'G',   // evidence - 氣候科學家觀察到證據
            q25: 'F',   // adapt - 物種努力適應環境變化
            q26: 'I',   // urgent - 需要緊急行動
            q27: 'H',   // limit - 限制溫室氣體排放的政策
            q28: 'B',   // alternatives - 化石燃料的替代方案
            q29: 'D',   // essential - 國際合作是必不可少的
            q30: 'J',   // coordinated - 更協調的努力

            // 篇章結構 (31-34題)
            q31: 'A',   // 各種形式的都市農業被實施來最大化有限的都市空間
            q32: 'B',   // 都市農業也有助於環境教育和社區建設
            q33: 'C',   // 幾個實際障礙繼續限制都市農業的擴展
            q34: 'D',   // 創新和技術進步推動都市農業方法的演進

            // 閱讀測驗 (35-46題)
            // 第35-38題: 終身學習
            q35: 'B',   // 主要主題是終身學習和成人教育
            q36: 'C',   // 成人學習者有不同的需求和限制
            q37: 'B',   // 微學習是將主題分解成小單元
            q38: 'D',   // 終身學習無助於減少工作責任

            // 第39-42題: 塑膠污染
            q39: 'B',   // 塑膠污染問題在於不可生物分解
            q40: 'B',   // 微塑膠是直徑小於5毫米的塑膠顆粒
            q41: 'C',   // 塑膠污染導致海洋生物營養不良和受傷
            q42: 'C',   // 解決塑膠污染需要各部門合作

            // 第43-46題: 零工經濟
            q43: 'B',   // 零工經濟的特徵是短期合約和自由工作
            q44: 'C',   // 零工工作的主要優勢是靈活性和自主性
            q45: 'C',   // 零工工作者面臨缺乏傳統員工福利的挑戰
            q46: 'B'    // 政策制定者試圖平衡靈活性和保障
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
        
        localStorage.setItem('exam107_progress', JSON.stringify({
            answers: answers,
            timestamp: Date.now()
        }));
    }

    loadProgress() {
        const saved = localStorage.getItem('exam107_progress');
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
            <div style="background: linear-gradient(135deg, #81ecec, #00cec9); color: white; padding: 2rem; border-radius: 15px; margin: 2rem 0; text-align: center;">
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
            year: '107',
            correct: correct,
            total: this.totalQuestions,
            score: totalScore,
            sectionScores: sectionScores,
            timestamp: Date.now(),
            timeSpent: Date.now() - this.startTime
        };
        
        localStorage.setItem('exam107_result', JSON.stringify(result));
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
            localStorage.removeItem('exam107_progress');
            localStorage.removeItem('exam107_result');
            location.reload();
        }
    }
}

// 頁面載入完成後初始化
document.addEventListener('DOMContentLoaded', () => {
    window.exam = new Exam107();
});