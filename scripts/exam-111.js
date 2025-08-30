// 111年學測英文試題 - 答案與學習建議
const answers111 = {
    // 詞彙題 (1-10題)
    q1: 'B', q2: 'A', q3: 'C', q4: 'A', q5: 'A',
    q6: 'C', q7: 'B', q8: 'D', q9: 'D', q10: 'B',
    
    // 綜合測驗 (11-20題)
    q11: 'A', q12: 'D', q13: 'C', q14: 'B', q15: 'D',
    q16: 'D', q17: 'A', q18: 'D', q19: 'C', q20: 'A',
    
    // 文意選填 (21-30題)
    q21: 'C', q22: 'I', q23: 'F', q24: 'H', q25: 'D',
    q26: 'G', q27: 'J', q28: 'E', q29: 'A', q30: 'B',
    
    // 篇章結構 (31-34題)
    q31: 'D', q32: 'A', q33: 'C', q34: 'B',
    
    // 閱讀測驗 (35-46題)
    q35: 'B', q36: 'A', q37: 'C', q38: 'C', q39: 'D',
    q40: 'A', q41: 'B', q42: 'B', q43: 'D', q44: 'C',
    q45: 'A', q46: 'D',
    
    // 混合題型 (47-49題)
    q47: 'participating',  // 第47題填空
    'q47b': 'abuse',       // 第47題第二空
    q48: 'asylum',         // 第48題填空
    q49: ['C', 'D']        // 第49題多選
};

const learningAdvice111 = {
    vocabulary: {
        title: "詞彙題",
        advice: [
            "111年詞彙題注重基礎詞彙的精確掌握",
            "詞彙搭配和語境理解是關鍵",
            "名詞、動詞、形容詞的詞性轉換要熟練",
            "同義詞辨析和反義詞對比練習"
        ]
    },
    cloze: {
        title: "綜合測驗",
        advice: [
            "綜合測驗涵蓋多元主題的語境理解",
            "上下文邏輯關係和語意連貫重要",
            "動詞時態、語態的正確選用",
            "連接詞和轉承詞的適當運用"
        ]
    },
    fill: {
        title: "文意選填",
        advice: [
            "文意選填需要整體文章結構的理解",
            "段落間的邏輯關係和語意銜接",
            "關鍵詞彙的前後呼應關係",
            "主題句和支撐句的識別能力"
        ]
    },
    structure: {
        title: "篇章結構",
        advice: [
            "篇章結構著重文章組織邏輯",
            "段落順序和論述層次的安排",
            "引言、發展、結論的完整架構",
            "轉折、因果、對比關係的掌握"
        ]
    },
    reading: {
        title: "閱讀測驗",
        advice: [
            "閱讀測驗涵蓋不同文體和主題",
            "事實細節和推論理解並重",
            "作者意圖和文章主旨的掌握",
            "圖表資訊和文字內容的整合理解"
        ]
    },
    mixed: {
        title: "混合題",
        advice: [
            "混合題結合填空和選擇題型",
            "第47-48題注重詞彙的正確拼寫",
            "第49題為多選題，需選出所有正確答案",
            "仔細閱讀題目要求，避免作答錯誤"
        ]
    }
};

// 111年考試結構配置
const examConfig111 = {
    year: '111',
    totalQuestions: 49,
    sections: {
        vocabulary: { start: 1, end: 10, points: 1 },
        cloze: { start: 11, end: 20, points: 1 },
        fill: { start: 21, end: 30, points: 1 },
        structure: { start: 31, end: 34, points: 2 },
        reading: { start: 35, end: 46, points: 2 },
        mixed: { start: 47, end: 49, points: 2 }
    }
};

// 繼承GSATExamBase建立111年考試
class Exam111 extends GSATExamBase {
    constructor() {
        super('111', answers111, learningAdvice111, examConfig111);
    }
    
    // 重寫計分方法以適應111年的混合題型
    calculateSectionScores(formData) {
        const sectionScores = {
            vocabulary: 0,  // 1-10
            cloze: 0,       // 11-20
            fill: 0,        // 21-30
            structure: 0,   // 31-34
            reading: 0,     // 35-46
            mixed: 0        // 47-49
        };
        
        // 檢查每一題
        for (let i = 1; i <= this.totalQuestions; i++) {
            const questionName = `q${i}`;
            const correctAnswer = this.answers[questionName];
            const userAnswers = formData.getAll(questionName);
            
            let isCorrect = false;
            
            // 處理不同類型的題目
            if (Array.isArray(correctAnswer)) {
                // 多選題
                isCorrect = correctAnswer.length === userAnswers.length && 
                           correctAnswer.every(ans => userAnswers.includes(ans));
            } else if (typeof correctAnswer === 'string' && correctAnswer.length > 1 && !['A','B','C','D'].includes(correctAnswer)) {
                // 填空題
                isCorrect = userAnswers.length === 1 && userAnswers[0].toLowerCase() === correctAnswer.toLowerCase();
            } else {
                // 單選題
                isCorrect = userAnswers.length === 1 && userAnswers[0] === correctAnswer;
            }
            
            // 處理47題的特殊格式(q47b)
            if (i === 47) {
                const q47bAnswer = this.answers['q47b'];
                const q47bUserAnswer = formData.getAll('q47b');
                const q47bCorrect = q47bUserAnswer.length === 1 && q47bUserAnswer[0].toLowerCase() === q47bAnswer.toLowerCase();
                
                // 47題需要兩個空格都對才算對
                isCorrect = isCorrect && q47bCorrect;
            }
            
            if (isCorrect) {
                // 計算得分
                if (i <= 10) {
                    sectionScores.vocabulary += 1;
                } else if (i <= 20) {
                    sectionScores.cloze += 1;
                } else if (i <= 30) {
                    sectionScores.fill += 1;
                } else if (i <= 34) {
                    sectionScores.structure += 2;
                } else if (i <= 46) {
                    sectionScores.reading += 2;
                } else {
                    sectionScores.mixed += 2;
                }
            }
        }
        
        return sectionScores;
    }
    
    // 重寫結果顯示方法
    generateResultSummary(sectionScores) {
        return `
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 1rem;">
                <div>詞彙題：${sectionScores.vocabulary}/10分</div>
                <div>綜合測驗：${sectionScores.cloze}/10分</div>
                <div>文意選填：${sectionScores.fill}/10分</div>
                <div>篇章結構：${sectionScores.structure}/8分</div>
                <div>閱讀測驗：${sectionScores.reading}/24分</div>
                <div>混合題：${sectionScores.mixed}/6分</div>
            </div>
        `;
    }
    
    // 重寫問題反饋顯示方法，處理特殊題型
    showQuestionFeedback(questionNum, isCorrect, correctAnswer, userAnswers) {
        const questionDiv = document.querySelector(`.question:has(input[name="q${questionNum}"])`);
        if (!questionDiv) return;

        // 移除舊的反饋
        const oldFeedback = questionDiv.querySelector('.feedback');
        if (oldFeedback) oldFeedback.remove();

        // 創建反饋元素
        const feedback = document.createElement('div');
        feedback.className = 'feedback';
        feedback.style.cssText = 'margin-top: 10px; padding: 10px; border-radius: 5px; font-size: 14px;';

        if (isCorrect) {
            feedback.style.backgroundColor = '#d4edda';
            feedback.style.color = '#155724';
            feedback.innerHTML = '✓ 正確！';
        } else {
            feedback.style.backgroundColor = '#f8d7da';
            feedback.style.color = '#721c24';
            
            let correctText;
            if (Array.isArray(correctAnswer)) {
                correctText = correctAnswer.join(', ');
            } else if (typeof correctAnswer === 'string' && correctAnswer.length > 1 && !['A','B','C','D'].includes(correctAnswer)) {
                correctText = correctAnswer;
            } else {
                correctText = correctAnswer;
            }
            
            // 處理47題特殊格式
            if (questionNum === 47) {
                const q47bAnswer = this.answers['q47b'];
                correctText = `第一空: ${correctAnswer}, 第二空: ${q47bAnswer}`;
            }
            
            feedback.innerHTML = `✗ 錯誤。正確答案：${correctText}`;
        }

        questionDiv.appendChild(feedback);

        // 標記選項（僅針對選擇題）
        if (['A','B','C','D'].includes(correctAnswer) || Array.isArray(correctAnswer)) {
            const options = questionDiv.querySelectorAll('.option');
            options.forEach(option => {
                const input = option.querySelector('input');
                if (!input) return;
                
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
    }
}

// 頁面載入完成後初始化
document.addEventListener('DOMContentLoaded', () => {
    window.exam = new Exam111();
});