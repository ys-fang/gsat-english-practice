// 學測英文年份模板生成器
class YearTemplateGenerator {
    constructor() {
        // 基礎模板結構
        this.baseTemplate = {
            structure: {
                vocabulary: { start: 1, end: 10, points: 1, total: 10 },
                cloze: { start: 11, end: 20, points: 1, total: 10 },
                fillIn: { start: 21, end: 30, points: 1, total: 10 },
                structure: { start: 31, end: 34, points: 2, total: 8 },
                reading: { start: 35, end: 46, points: 2, total: 24 },
                mixed: { start: 47, end: 50, total: 10 }
            },
            timeLimit: 100, // 分鐘
            totalScore: 100
        };
    }

    // 生成年份HTML頁面
    generateYearHTML(year, questionsData = {}) {
        return `<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${year}學年度學測英文 - 互動練習</title>
    <link rel="stylesheet" href="../styles/common.css">
</head>
<body>
    <header class="exam-header">
        <div class="container">
            <div class="exam-info">
                <div class="exam-title">${year}學年度學科能力測驗 - 英文考科</div>
                <div class="timer" id="timer">100:00</div>
                <div class="score-display" id="currentScore" style="display: none;">
                    得分：<span id="scoreValue">0</span>/100
                </div>
            </div>
            <div class="progress-container">
                <div class="progress-bar" id="progressBar"></div>
            </div>
        </div>
    </header>

    <main class="exam-content">
        <div class="container">
            <form id="examForm">
                ${this.generateVocabularySection(year, questionsData.vocabulary)}
                ${this.generateClozeSection(year, questionsData.cloze)}
                ${this.generateFillInSection(year, questionsData.fillIn)}
                ${this.generateStructureSection(year, questionsData.structure)}
                ${this.generateReadingSection(year, questionsData.reading)}
                ${this.generateMixedSection(year, questionsData.mixed)}
            </form>
        </div>
    </main>

    <div class="controls">
        <div class="container">
            <div class="control-buttons">
                <a href="../index.html" class="btn btn-secondary">← 返回首頁</a>
                <button type="button" class="btn btn-primary" id="checkAnswers">檢查答案</button>
                <button type="button" class="btn btn-success" id="submitExam" style="display: none;">提交試卷</button>
            </div>
        </div>
    </div>

    <script src="../scripts/exam-${year}.js"></script>
</body>
</html>`;
    }

    // 生成詞彙題部分
    generateVocabularySection(year, questions = []) {
        return `
        <!-- 第壹部分、選擇題 (占62分) -->
        <!-- 一、詞彙題 (占10分) -->
        <section class="section">
            <h2 class="section-title">第壹部分、選擇題 (占62分)<br>一、詞彙題 (占10分)</h2>
            <p style="margin-bottom: 2rem; color: #666;">說明：第1題至第10題為單選題，每題1分。</p>

            ${this.generateQuestions(1, 10, questions, 'single')}
        </section>`;
    }

    // 生成綜合測驗部分
    generateClozeSection(year, questions = []) {
        return `
        <!-- 二、綜合測驗 (占10分) -->
        <section class="section">
            <h2 class="section-title">二、綜合測驗 (占10分)</h2>
            <p style="margin-bottom: 2rem; color: #666;">說明：第11題至第20題為單選題，每題1分。</p>

            ${questions.passages ? questions.passages.map((passage, index) => `
                <h3 style="margin-bottom: 1.5rem; color: #2c3e50;">${passage.title}</h3>
                <div class="passage" style="background: #f8f9fa; padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem; line-height: 1.8;">
                    ${passage.content}
                </div>
                ${this.generateQuestions(passage.startQ, passage.endQ, passage.questions, 'single')}
            `).join('') : this.generateQuestions(11, 20, questions, 'single')}
        </section>`;
    }

    // 生成文意選填部分
    generateFillInSection(year, data = {}) {
        const options = data.options || ['(A)', '(B)', '(C)', '(D)', '(E)', '(F)', '(G)', '(H)', '(I)', '(J)'];
        
        return `
        <!-- 三、文意選填 (占10分) -->
        <section class="section">
            <h2 class="section-title">三、文意選填 (占10分)</h2>
            <p style="margin-bottom: 2rem; color: #666;">說明：第21題至第30題為單選題，每題1分。</p>

            <h3 style="margin-bottom: 1.5rem; color: #2c3e50;">第21至30題為題組</h3>
            ${data.passage ? `
            <div class="passage" style="background: #f8f9fa; padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem; line-height: 1.8;">
                ${data.passage}
            </div>` : '<!-- 待補充文章內容 -->'}

            <div class="fill-options" style="background: #f0f8ff; padding: 1rem; border-radius: 8px; margin-bottom: 2rem;">
                <p style="margin-bottom: 0.5rem; font-weight: bold;">選項：</p>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.5rem; font-size: 0.9rem;">
                    ${options.map(option => `<span>${option}</span>`).join('')}
                </div>
            </div>

            ${this.generateFillInQuestions()}
        </section>`;
    }

    // 生成文意選填題目
    generateFillInQuestions() {
        let html = '';
        for (let i = 21; i <= 30; i++) {
            html += `
            <div class="question">
                <div class="question-number">${i}</div>
                <div class="options" style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 0.5rem;">
                    ${['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'].map(letter => `
                    <label class="option">
                        <input type="radio" name="q${i}" value="${letter}">
                        <span class="option-text">(${letter})</span>
                    </label>`).join('')}
                </div>
            </div>`;
        }
        return html;
    }

    // 生成篇章結構部分
    generateStructureSection(year, data = {}) {
        const options = data.options || [
            '(A) 選項A內容',
            '(B) 選項B內容', 
            '(C) 選項C內容',
            '(D) 選項D內容'
        ];

        return `
        <!-- 四、篇章結構 (占8分) -->
        <section class="section">
            <h2 class="section-title">四、篇章結構 (占8分)</h2>
            <p style="margin-bottom: 2rem; color: #666;">說明：第31題至第34題為單選題，每題2分。</p>

            <h3 style="margin-bottom: 1.5rem; color: #2c3e50;">第31至34題為題組</h3>
            ${data.passage ? `
            <div class="passage" style="background: #f8f9fa; padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem; line-height: 1.8;">
                ${data.passage}
            </div>` : '<!-- 待補充文章內容 -->'}

            ${[31, 32, 33, 34].map(num => `
            <div class="question">
                <div class="question-number">${num}</div>
                <div class="options">
                    ${options.map((option, index) => `
                    <label class="option">
                        <input type="radio" name="q${num}" value="${String.fromCharCode(65 + index)}">
                        <span class="option-text">${option}</span>
                    </label>`).join('')}
                </div>
            </div>`).join('')}
        </section>`;
    }

    // 生成閱讀測驗部分
    generateReadingSection(year, data = {}) {
        return `
        <!-- 五、閱讀測驗 (占24分) -->
        <section class="section">
            <h2 class="section-title">五、閱讀測驗 (占24分)</h2>
            <p style="margin-bottom: 2rem; color: #666;">說明：第35題至第46題為單選題，每題2分。</p>

            ${data.passages ? data.passages.map(passage => `
                <h3 style="margin-bottom: 1.5rem; color: #2c3e50;">${passage.title}</h3>
                <div class="passage" style="background: #f8f9fa; padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem; line-height: 1.8;">
                    ${passage.content}
                </div>
                ${passage.questions ? passage.questions.map(q => `
                <div class="question">
                    <div class="question-number">${q.number}</div>
                    <div class="question-text">${q.question}</div>
                    <div class="options">
                        ${q.options.map(option => `
                        <label class="option">
                            <input type="radio" name="q${q.number}" value="${option.charAt(1)}">
                            <span class="option-text">${option}</span>
                        </label>`).join('')}
                    </div>
                </div>`).join('') : '<!-- 待補充題目 -->'}
            `).join('') : '<!-- 待補充閱讀測驗內容 -->'}
        </section>`;
    }

    // 生成混合題部分
    generateMixedSection(year, data = {}) {
        return `
        <!-- 第貳部分、混合題 (占10分) -->
        <section class="section">
            <h2 class="section-title">第貳部分、混合題 (占10分)</h2>
            <p style="margin-bottom: 2rem; color: #666;">說明：本部分共有1題組，限在標示題號的作答區內作答。</p>

            ${data.questions ? data.questions.map(q => `
            <div class="question">
                <div class="question-number">${q.number}</div>
                <div class="question-text">${q.text}</div>
                ${this.generateMixedQuestionInput(q)}
            </div>`).join('') : '<!-- 待補充混合題內容 -->'}
        </section>`;
    }

    // 生成混合題輸入類型
    generateMixedQuestionInput(question) {
        switch (question.type) {
            case 'fill':
                return `<input type="text" name="q${question.number}" style="width: 200px; padding: 0.5rem; border: 2px solid #ddd; border-radius: 5px;" placeholder="請輸入答案...">`;
            
            case 'multiple':
                return `
                <div class="options">
                    ${question.options.map(option => `
                    <label class="option">
                        <input type="checkbox" name="q${question.number}" value="${option.value}">
                        <span class="option-text">${option.text}</span>
                    </label>`).join('')}
                </div>`;
            
            default:
                return '<!-- 待補充題目類型 -->';
        }
    }

    // 生成基本題目結構
    generateQuestions(start, end, questions = [], type = 'single') {
        let html = '';
        
        for (let i = start; i <= end; i++) {
            const question = questions[i - start] || {};
            const questionText = question.text || `第${i}題 - 待補充題目內容`;
            const options = question.options || ['(A) 選項A', '(B) 選項B', '(C) 選項C', '(D) 選項D'];
            
            html += `
            <div class="question">
                <div class="question-number">${i}</div>
                <div class="question-text">${questionText}</div>
                <div class="options">
                    ${options.map(option => `
                    <label class="option">
                        <input type="radio" name="q${i}" value="${option.charAt(1)}">
                        <span class="option-text">${option}</span>
                    </label>`).join('')}
                </div>
            </div>`;
        }
        
        return html;
    }

    // 生成對應的JavaScript文件
    generateExamJS(year, answers = {}) {
        return `// ${year}學年度學測英文試題 - 互動功能
class Exam${year} {
    constructor() {
        // 正確答案 (需要填入實際答案)
        this.answers = ${JSON.stringify(answers, null, 8)};

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
            
            timerElement.textContent = \`\${minutes}:\${seconds.toString().padStart(2, '0')}\`;
            
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
            const questionName = \`q\${i}\`;
            const inputs = document.querySelectorAll(\`input[name="\${questionName}"]\`);
            
            if (inputs.length > 0) {
                const isAnswered = Array.from(inputs).some(input => input.checked);
                if (isAnswered) answeredQuestions++;
            }
        }

        // 更新進度條
        const progressPercentage = (answeredQuestions / totalQuestions) * 100;
        document.getElementById('progressBar').style.width = \`\${progressPercentage}%\`;
    }

    saveProgress() {
        const formData = new FormData(document.getElementById('examForm'));
        const progress = {};
        
        for (let [key, value] of formData.entries()) {
            progress[key] = value;
        }
        
        localStorage.setItem('exam${year}_progress', JSON.stringify({
            answers: progress,
            timestamp: Date.now(),
            startTime: this.startTime
        }));
    }

    loadProgress() {
        const saved = localStorage.getItem('exam${year}_progress');
        if (!saved) return;

        try {
            const progress = JSON.parse(saved);
            
            // 恢復答案
            for (let [questionName, answer] of Object.entries(progress.answers)) {
                const input = document.querySelector(\`input[name="\${questionName}"][value="\${answer}"]\`);
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
        // 檢查答案邏輯 - 與114年版本類似
        console.log('檢查${year}年答案...');
        // TODO: 實作檢查答案功能
    }

    submitExam() {
        // 提交考試邏輯 - 與114年版本類似
        console.log('提交${year}年試卷...');
        // TODO: 實作提交功能
    }
}

// 初始化考試
document.addEventListener('DOMContentLoaded', () => {
    new Exam${year}();
});`;
    }

    // 生成完整年份資料夾
    generateYearFiles(year, questionsData = {}, answers = {}) {
        return {
            html: this.generateYearHTML(year, questionsData),
            js: this.generateExamJS(year, answers),
            filename: {
                html: `${year}.html`,
                js: `exam-${year}.js`
            }
        };
    }
}

// 如果在Node.js環境中
if (typeof module !== 'undefined' && module.exports) {
    module.exports = YearTemplateGenerator;
}

// 如果在瀏覽器環境中
if (typeof window !== 'undefined') {
    window.YearTemplateGenerator = YearTemplateGenerator;
}