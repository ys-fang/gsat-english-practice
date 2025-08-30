/**
 * 113學年度學測英文 - 專業考試系統
 * GSAT 113 English Exam - Professional System
 * 
 * 基於統一基礎類實現，提供一致的專業考試體驗
 */

// 113年學測英文正確答案
const answers113 = {
    // 詞彙題 (1-10題) - 每題1分
    q1: 'B',    // 詞彙題答案
    q2: 'A',    // 詞彙題答案
    q3: 'B',    // 詞彙題答案
    q4: 'B',    // 詞彙題答案
    q5: 'D',    // 詞彙題答案
    q6: 'C',    // 詞彙題答案
    q7: 'D',    // 詞彙題答案
    q8: 'C',    // 詞彙題答案
    q9: 'A',    // 詞彙題答案
    q10: 'B',   // 詞彙題答案

    // 綜合測驗 (11-20題) - 每題1分
    q11: 'B',   // 綜合測驗答案
    q12: 'D',   // 綜合測驗答案
    q13: 'D',   // 綜合測驗答案
    q14: 'A',   // 綜合測驗答案
    q15: 'C',   // 綜合測驗答案
    q16: 'B',   // 綜合測驗答案
    q17: 'C',   // 綜合測驗答案
    q18: 'A',   // 綜合測驗答案
    q19: 'D',   // 綜合測驗答案
    q20: 'C',   // 綜合測驗答案

    // 文意選填 (21-30題) - 每題1分
    q21: 'E',   // 文意選填答案
    q22: 'I',   // 文意選填答案
    q23: 'J',   // 文意選填答案
    q24: 'C',   // 文意選填答案
    q25: 'G',   // 文意選填答案
    q26: 'A',   // 文意選填答案
    q27: 'H',   // 文意選填答案
    q28: 'B',   // 文意選填答案
    q29: 'F',   // 文意選填答案
    q30: 'D',   // 文意選填答案

    // 篇章結構 (31-34題) - 每題2分
    q31: 'D',   // 篇章結構答案
    q32: 'C',   // 篇章結構答案
    q33: 'A',   // 篇章結構答案
    q34: 'B',   // 篇章結構答案

    // 閱讀測驗 (35-46題) - 每題2分
    q35: 'B',   // 閱讀測驗答案
    q36: 'D',   // 閱讀測驗答案
    q37: 'B',   // 閱讀測驗答案
    q38: 'A',   // 閱讀測驗答案
    q39: 'D',   // 閱讀測驗答案
    q40: 'A',   // 閱讀測驗答案
    q41: 'B',   // 閱讀測驗答案
    q42: 'C',   // 閱讀測驗答案
    q43: 'D',   // 閱讀測驗答案
    q44: 'B',   // 閱讀測驗答案
    q45: 'C',   // 閱讀測驗答案
    q46: 'C'    // 閱讀測驗答案
};

// 113年專用配置
const config113 = {
    totalQuestions: 46,
    timeLimit: 100 * 60 * 1000, // 100分鐘
    scores: {
        vocabulary: { range: [1, 10], points: 1 },      // 詞彙題 1-10
        cloze: { range: [11, 20], points: 1 },          // 綜合測驗 11-20  
        fill: { range: [21, 30], points: 1 },           // 文意選填 21-30
        structure: { range: [31, 34], points: 2 },      // 篇章結構 31-34
        reading: { range: [35, 46], points: 2 }         // 閱讀測驗 35-46
    }
};

// 113年專業考試系統類
class Exam113 extends GSATExamBase {
    constructor() {
        super('113', answers113, config113);
    }

    /**
     * 113年特有的學習建議
     */
    getSectionAdvice(sectionKey) {
        const advice = {
            vocabulary: '113年詞彙題偏重同義詞辨析，建議加強相近詞彙的區別和語境運用',
            cloze: '綜合測驗著重語法邏輯和句型結構，多練習複合句和分詞構句',
            fill: '文意選填強調語義連貫，需培養快速理解文章脈絡的能力',
            structure: '篇章結構考查段落邏輯，建議練習文章組織和段落關係',
            reading: '閱讀測驗題材廣泛，建議多閱讀學術文章和科普材料'
        };
        
        return advice[sectionKey] || super.getSectionAdvice(sectionKey);
    }

    /**
     * 113年錯誤分析提示
     */
    getCommonMistakes() {
        return {
            vocabulary: ['同義詞混淆', '詞性變化錯誤', '固定搭配不熟'],
            cloze: ['時態語態判斷', '關係代名詞選擇', '介系詞使用'],
            fill: ['語境理解偏差', '詞彙搭配錯誤', '邏輯關係判斷'],
            structure: ['段落順序錯誤', '轉折關係混淆', '因果邏輯不清'],
            reading: ['主旨理解不準', '細節定位錯誤', '推論判斷失誤']
        };
    }

    /**
     * 113年專屬的額外分析
     */
    generatePerformanceAnalysis(totalScore, maxScore, sectionResults) {
        let analysis = super.generatePerformanceAnalysis(totalScore, maxScore, sectionResults);
        
        // 添加113年特有的學習重點提醒
        const year113Tips = `
            <div style="margin-top: 1rem; padding: 1rem; background: #f0f8ff; border-left: 4px solid #2196f3;">
                <strong>💡 113年學測特色提醒：</strong>
                <ul style="margin-top: 0.5rem; padding-left: 1.5rem; margin-bottom: 0;">
                    <li>本年度英文科注重語境理解和邏輯分析</li>
                    <li>詞彙題強調近義詞辨析和詞彙搭配</li>
                    <li>閱讀測驗涵蓋多元主題，重視批判思考</li>
                    <li>建議加強學術英語閱讀和邏輯推理能力</li>
                </ul>
            </div>
        `;
        
        return analysis + year113Tips;
    }
}

// 頁面載入完成後初始化113年考試系統
document.addEventListener('DOMContentLoaded', () => {
    // 確保基礎類已載入
    if (typeof GSATExamBase === 'undefined') {
        console.error('基礎類未載入，請確認 gsat-exam-base.js 已正確引入');
        return;
    }
    
    // 建立113年考試實例
    window.exam = new Exam113();
    
    console.log('🎓 113學年度學測英文專業考試系統已啟動');
    console.log('📚 功能特色：');
    console.log('   - 專業考試風格界面');
    console.log('   - 智能進度管理與分析');
    console.log('   - 考試模擬功能（專注模式、書籤）');
    console.log('   - 個人化學習建議');
    console.log('   - 手機優化響應式設計');
});