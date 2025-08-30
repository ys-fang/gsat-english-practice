// 110年學測英文試題 - 答案與學習建議
const answers110 = {
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

const learningAdvice110 = {
    vocabulary: {
        title: "詞彙題",
        advice: [
            "110年詞彙題增加至15題，涵蓋範圍更廣泛",
            "注重日常生活和學術情境的實用詞彙",
            "形容詞、動詞、名詞的多元辨析練習",
            "詞彙搭配和慣用語的正確運用"
        ]
    },
    cloze: {
        title: "綜合測驗",
        advice: [
            "110年綜合測驗同樣增加至15題",
            "主題涵蓋環境、科技、社會議題等",
            "上下文語境理解和邏輯推理能力",
            "連接詞、介系詞、動詞時態的正確選用"
        ]
    },
    fill: {
        title: "文意選填",
        advice: [
            "文意選填維持10題，但選項豐富度提升",
            "文章主題更貼近時事和生活經驗",
            "段落邏輯和語意連貫性的掌握",
            "詞性變化和語法結構的正確理解"
        ]
    },
    reading: {
        title: "閱讀測驗",
        advice: [
            "110年閱讀測驗擴增至16題，閱讀量增加",
            "文章類型多樣：科普、社會、文化等主題",
            "推論題和細節題的平衡配置",
            "快速定位關鍵資訊和理解作者意圖的能力"
        ]
    }
};

// 110年考試結構配置
const examConfig110 = {
    year: '110',
    totalQuestions: 56,
    sections: {
        vocabulary: { start: 1, end: 15, points: 1 },
        cloze: { start: 16, end: 30, points: 1 },
        fill: { start: 31, end: 40, points: 1 },
        reading: { start: 41, end: 56, points: 2 }
    }
};

// 繼承GSATExamBase建立110年考試
class Exam110 extends GSATExamBase {
    constructor() {
        super('110', answers110, learningAdvice110, examConfig110);
    }
    
    // 重寫計分方法以適應110年的題目結構
    calculateSectionScores(formData) {
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
                isCorrect = correctAnswer.length === userAnswers.length && 
                           correctAnswer.every(ans => userAnswers.includes(ans));
            } else {
                isCorrect = userAnswers.length === 1 && userAnswers[0] === correctAnswer;
            }
            
            if (isCorrect) {
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
        }
        
        return sectionScores;
    }
    
    // 重寫結果顯示方法
    generateResultSummary(sectionScores) {
        return `
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 1rem;">
                <div>詞彙題：${sectionScores.vocabulary}/15分</div>
                <div>綜合測驗：${sectionScores.cloze}/15分</div>
                <div>文意選填：${sectionScores.fill}/10分</div>
                <div>閱讀測驗：${sectionScores.reading}/32分</div>
            </div>
        `;
    }
}

// 頁面載入完成後初始化
document.addEventListener('DOMContentLoaded', () => {
    window.exam = new Exam110();
});