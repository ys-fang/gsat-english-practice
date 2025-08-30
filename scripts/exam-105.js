// 105年學測英文試題 - 互動功能
class Exam105 {
    constructor() {
        // 正確答案
        this.answers = {
            // 詞彙題 (1-10題)
            q1: 'A',    // require - 要求員工穿制服
            q2: 'A',    // heavily - 下大雨
            q3: 'A',    // balance - 平衡學習與工作
            q4: 'A',    // numerous - 眾多的遊客
            q5: 'A',    // contribution - 對理解氣候變化的貢獻
            q6: 'A',    // conveniently - 位置便利
            q7: 'A',    // revise - 修改論文
            q8: 'A',    // achieved - 實現夢想
            q9: 'A',    // expand - 擴大生產
            q10: 'A',   // carefully - 仔細地修復

            // 綜合測驗 (11-20題)
            q11: 'A',   // allowing - 分詞結構，允許人們連接
            q12: 'B',   // that - worry that的名詞子句
            q13: 'A',   // more likely - 更可能感到孤獨
            q14: 'A',   // promote - 推廣產品和服務
            q15: 'B',   // and - 並列連接詞
            q16: 'B',   // facing - 現在分詞修飾issues
            q17: 'C',   // causing - 分詞結構表示結果
            q18: 'A',   // unless - 除非採取行動
            q19: 'A',   // more and more - 越來越負擔得起
            q20: 'A',   // solving - contribute to + V-ing

            // 文意選填 (21-30題)
            q21: 'A',   // beneficial - AI提供許多有益的應用
            q22: 'B',   // constantly - 不斷演進和變得更複雜
            q23: 'E',   // directly - 直接協助醫師診斷疾病
            q24: 'H',   // negative - 帶來負面影響
            q25: 'D',   // crucial - 至關重要的準備
            q26: 'G',   // majority - 大多數人仍不確定
            q27: 'E',   // directly - 直接影響個人隱私
            q28: 'J',   // positive - 最大化AI的正面層面
            q29: 'K',   // reduce - 減少負面影響
            q30: 'I',   // obviously - 顯然會成為日常生活的一部分

            // 篇章結構 (31-34題)
            q31: 'A',   // COVID-19加速了線上購物的轉變
            q32: 'B',   // 傳統零售商必須快速適應
            q33: 'C',   // 線上購物也有挑戰
            q34: 'D',   // 未來零售業將採用混合方式

            // 閱讀測驗 (35-46題)
            // 第35-38題: 都市農業
            q35: 'B',   // 介紹都市農業並討論其利弊
            q36: 'C',   // 溫室栽培未被提及
            q37: 'B',   // 減少運輸的碳排放
            q38: 'B',   // 政府支持和社區參與是必要的

            // 第39-42題: 睡眠
            q39: 'B',   // REM睡眠的主要功能是記憶鞏固和情緒調節
            q40: 'B',   // 過度使用螢幕會抑制褪黑激素產生
            q41: 'C',   // 記憶喪失未被提及為長期後果
            q42: 'B',   // 接近就寢時間應避免運動

            // 第43-46題: 永續旅遊
            q43: 'B',   // 平衡經濟效益與環境社會保護
            q44: 'B',   // 經濟效益可能無法惠及當地社區
            q45: 'B',   // 實施遊客限制和開發替代景點
            q46: 'B'    // 旅遊利害關係人之間的合作
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

            const minutes = Math.floor(remaining / (60 * 1000));
            const seconds = Math.floor((remaining % (60 * 1000)) / 1000);
            
            timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            // 剩餘10分鐘時變為警告色
            if (remaining <= 10 * 60 * 1000) {
                timerElement.style.color = '#e74c3c';
            }
        }, 1000);
    }

    timeUp() {
        clearInterval(this.timerInterval);
        alert('時間到！系統將自動提交你的答案。');
        this.submitExam();
    }

    bindEvents() {
        // 綁定所有選項變更事件
        document.querySelectorAll('input[type="radio"], select').forEach(input => {
            input.addEventListener('change', () => {
                this.saveProgress();
                this.updateProgress();
                this.checkAnswer(input);
            });
        });
    }

    checkAnswer(input) {
        if (this.isSubmitted) return;

        const questionName = input.name;
        const selectedValue = input.value;
        const correctAnswer = this.answers[questionName];

        // 移除之前的樣式
        const questionContainer = input.closest('.question, .question-inline');
        if (questionContainer) {
            questionContainer.classList.remove('correct', 'incorrect');
        }
    }

    saveProgress() {
        const formData = new FormData(document.getElementById('examForm'));
        const progress = {};
        
        for (let [key, value] of formData.entries()) {
            progress[key] = value;
        }
        
        localStorage.setItem('exam105_progress', JSON.stringify({
            answers: progress,
            startTime: this.startTime,
            timestamp: Date.now()
        }));
    }

    loadProgress() {
        const saved = localStorage.getItem('exam105_progress');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                
                // 恢復答案
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

                // 恢復開始時間
                if (data.startTime) {
                    this.startTime = data.startTime;
                }

                this.updateProgress();
            } catch (error) {
                console.error('載入進度失敗:', error);
            }
        }
    }

    updateProgress() {
        const form = document.getElementById('examForm');
        const formData = new FormData(form);
        const answeredQuestions = new Set();
        
        for (let [key, value] of formData.entries()) {
            if (value && value !== '') {
                answeredQuestions.add(key);
            }
        }

        const progress = (answeredQuestions.size / this.totalQuestions) * 100;
        const progressBar = document.getElementById('progressBar');
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
    }

    showAnswers() {
        this.isSubmitted = true;
        const form = document.getElementById('examForm');
        const formData = new FormData(form);
        let score = 0;
        let maxScore = 0;

        // 計算各部分分數
        const sectionScores = {
            vocabulary: { correct: 0, total: 10, points: 1 },
            cloze: { correct: 0, total: 10, points: 1 },
            fill: { correct: 0, total: 10, points: 1 },
            structure: { correct: 0, total: 4, points: 2 },
            reading: { correct: 0, total: 12, points: 2 }
        };

        // 檢查所有答案
        Object.entries(this.answers).forEach(([questionName, correctAnswer]) => {
            const questionNumber = parseInt(questionName.replace('q', ''));
            const userAnswer = formData.get(questionName);
            const isCorrect = userAnswer === correctAnswer;
            
            // 確定題目所屬部分
            let section, points;
            if (questionNumber <= 10) {
                section = 'vocabulary';
                points = 1;
            } else if (questionNumber <= 20) {
                section = 'cloze';
                points = 1;
            } else if (questionNumber <= 30) {
                section = 'fill';
                points = 1;
            } else if (questionNumber <= 34) {
                section = 'structure';
                points = 2;
            } else {
                section = 'reading';
                points = 2;
            }

            maxScore += points;

            if (isCorrect) {
                score += points;
                sectionScores[section].correct++;
            }

            // 顯示答案結果
            this.highlightAnswer(questionName, userAnswer, correctAnswer, isCorrect);
        });

        // 顯示總分
        this.showScore(score, maxScore, sectionScores);
        
        // 清除計時器
        clearInterval(this.timerInterval);
    }

    highlightAnswer(questionName, userAnswer, correctAnswer, isCorrect) {
        // 處理單選題
        const radioInputs = document.querySelectorAll(`input[name="${questionName}"]`);
        radioInputs.forEach(input => {
            const container = input.closest('.option');
            const questionContainer = input.closest('.question, .question-inline');
            
            if (input.value === correctAnswer) {
                container.classList.add('correct-answer');
            }
            
            if (input.checked) {
                if (isCorrect) {
                    container.classList.add('user-correct');
                    questionContainer.classList.add('correct');
                } else {
                    container.classList.add('user-incorrect');
                    questionContainer.classList.add('incorrect');
                }
            }
        });

        // 處理下拉選單
        const selectElement = document.querySelector(`select[name="${questionName}"]`);
        if (selectElement) {
            const questionContainer = selectElement.closest('.question-inline');
            if (isCorrect) {
                selectElement.classList.add('correct');
                questionContainer.classList.add('correct');
            } else {
                selectElement.classList.add('incorrect');
                questionContainer.classList.add('incorrect');
            }
            
            // 顯示正確答案
            const correctOption = selectElement.querySelector(`option[value="${correctAnswer}"]`);
            if (correctOption) {
                correctOption.style.backgroundColor = '#d4edda';
                correctOption.style.color = '#155724';
            }
        }
    }

    showScore(score, maxScore, sectionScores) {
        const percentage = ((score / maxScore) * 100).toFixed(1);
        
        let resultHTML = `
            <div style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 2rem; border-radius: 15px; text-align: center; margin: 2rem 0;">
                <h2 style="margin-bottom: 1rem;">105學年度學測英文 - 作答結果</h2>
                <div style="font-size: 2rem; font-weight: bold; margin-bottom: 1rem;">
                    ${score} / ${maxScore} 分 (${percentage}%)
                </div>
        `;

        // 計算等級
        let grade = '';
        if (percentage >= 90) grade = 'A+ 優秀';
        else if (percentage >= 80) grade = 'A 良好';
        else if (percentage >= 70) grade = 'B+ 中上';
        else if (percentage >= 60) grade = 'B 中等';
        else if (percentage >= 50) grade = 'C+ 待加強';
        else grade = 'C 需努力';

        resultHTML += `<div style="font-size: 1.2rem; opacity: 0.9;">等級: ${grade}</div></div>`;

        // 各部分詳細分數
        resultHTML += `
            <div style="background: white; padding: 1.5rem; border-radius: 10px; margin: 1rem 0; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <h3 style="color: #2d3436; margin-bottom: 1rem;">各部分得分統計</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
        `;

        const sectionNames = {
            vocabulary: '詞彙題 (1-10)',
            cloze: '綜合測驗 (11-20)', 
            fill: '文意選填 (21-30)',
            structure: '篇章結構 (31-34)',
            reading: '閱讀測驗 (35-46)'
        };

        Object.entries(sectionScores).forEach(([key, data]) => {
            const sectionScore = data.correct * data.points;
            const sectionMax = data.total * data.points;
            const sectionPercent = ((sectionScore / sectionMax) * 100).toFixed(1);
            
            resultHTML += `
                <div style="text-align: center; padding: 1rem; background: #f8f9fa; border-radius: 8px;">
                    <div style="font-weight: bold; color: #2d3436; margin-bottom: 0.5rem;">${sectionNames[key]}</div>
                    <div style="font-size: 1.1rem; color: #0984e3;">${sectionScore}/${sectionMax} 分</div>
                    <div style="font-size: 0.9rem; color: #636e72;">${sectionPercent}%</div>
                </div>
            `;
        });

        resultHTML += '</div></div>';

        // 顯示結果
        const resultDiv = document.createElement('div');
        resultDiv.innerHTML = resultHTML;
        document.querySelector('.exam-content .container').insertBefore(resultDiv, document.getElementById('examForm'));

        // 更新標題顯示分數
        const scoreDisplay = document.getElementById('currentScore');
        const scoreValue = document.getElementById('scoreValue');
        if (scoreDisplay && scoreValue) {
            scoreValue.textContent = `${score}/${maxScore}`;
            scoreDisplay.style.display = 'block';
        }
    }

    submitExam() {
        const form = document.getElementById('examForm');
        const formData = new FormData(form);
        const answeredCount = Array.from(formData.entries()).filter(([key, value]) => value !== '').length;
        
        if (answeredCount < this.totalQuestions) {
            const unanswered = this.totalQuestions - answeredCount;
            if (!confirm(`還有 ${unanswered} 題未作答，確定要提交嗎？`)) {
                return;
            }
        }

        this.showAnswers();
        
        // 滾動到結果區域
        document.querySelector('.exam-content').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }

    resetExam() {
        if (confirm('確定要重新開始嗎？這將清除所有答案。')) {
            localStorage.removeItem('exam105_progress');
            location.reload();
        }
    }
}

// 初始化考試系統
document.addEventListener('DOMContentLoaded', () => {
    window.exam = new Exam105();
    console.log('105學年度學測英文互動系統已載入');
});