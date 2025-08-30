/**
 * 112學年度學測英文 - 專業考試系統
 * GSAT 112 English Exam - Professional System
 * 
 * 基於統一基礎類實現，提供一致的專業考試體驗
 */

// 112年學測英文正確答案
const answers112 = {
    // 詞彙題 (1-10題) - 每題1分
    q1: 'A',    // 詞彙題答案
    q2: 'C',    // 詞彙題答案
    q3: 'C',    // 詞彙題答案
    q4: 'B',    // 詞彙題答案
    q5: 'D',    // 詞彙題答案
    q6: 'D',    // 詞彙題答案
    q7: 'B',    // 詞彙題答案
    q8: 'A',    // 詞彙題答案
    q9: 'A',    // 詞彙題答案
    q10: 'D',   // 詞彙題答案

    // 綜合測驗 (11-20題) - 每題1分
    q11: 'B',   // 綜合測驗答案
    q12: 'D',   // 綜合測驗答案
    q13: 'A',   // 綜合測驗答案
    q14: 'C',   // 綜合測驗答案
    q15: 'B',   // 綜合測驗答案
    q16: 'A',   // 綜合測驗答案
    q17: 'B',   // 綜合測驗答案
    q18: 'D',   // 綜合測驗答案
    q19: 'C',   // 綜合測驗答案
    q20: 'A',   // 綜合測驗答案

    // 文意選填 (21-30題) - 每題1分
    q21: 'D',   // 文意選填答案
    q22: 'G',   // 文意選填答案
    q23: 'J',   // 文意選填答案
    q24: 'B',   // 文意選填答案
    q25: 'F',   // 文意選填答案
    q26: 'A',   // 文意選填答案
    q27: 'H',   // 文意選填答案
    q28: 'I',   // 文意選填答案
    q29: 'E',   // 文意選填答案
    q30: 'C',   // 文意選填答案

    // 篇章結構 (31-34題) - 每題2分
    q31: 'D',   // 篇章結構答案
    q32: 'A',   // 篇章結構答案
    q33: 'C',   // 篇章結構答案
    q34: 'B',   // 篇章結構答案

    // 閱讀測驗 (35-46題) - 每題2分
    q35: 'C',   // 閱讀測驗答案
    q36: 'A',   // 閱讀測驗答案
    q37: 'D',   // 閱讀測驗答案
    q38: 'B',   // 閱讀測驗答案
    q39: 'A',   // 閱讀測驗答案
    q40: 'B',   // 閱讀測驗答案
    q41: 'C',   // 閱讀測驗答案
    q42: 'D',   // 閱讀測驗答案
    q43: 'C',   // 閱讀測驗答案
    q44: 'B',   // 閱讀測驗答案
    q45: 'A',   // 閱讀測驗答案
    q46: 'D'    // 閱讀測驗答案
};

// 112年專用配置
const config112 = {
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

// 112年專業考試系統類
class Exam112 extends GSATExamBase {
    constructor() {
        super('112', answers112, config112);
    }

    /**
     * 112年特有的學習建議
     */
    getSectionAdvice(sectionKey) {
        const advice = {
            vocabulary: '112年詞彙題注重實用詞彙的運用，建議加強生活化和學術詞彙的記憶',
            cloze: '綜合測驗考查語法和語境理解，重點練習動詞時態和語態變化',
            fill: '文意選填強調語義邏輯，需培養快速掌握文章主旨和細節的能力',
            structure: '篇章結構重視段落間的邏輯關係，建議多練習文章組織技巧',
            reading: '閱讀測驗涵蓋多種文體，建議廣泛閱讀不同主題的英語文章'
        };
        
        return advice[sectionKey] || super.getSectionAdvice(sectionKey);
    }

    /**
     * 112年錯誤分析提示
     */
    getCommonMistakes() {
        return {
            vocabulary: ['詞性混淆', '固定用法不熟', '同義詞辨析錯誤'],
            cloze: ['動詞變化錯誤', '語態選擇不當', '連接詞用法錯誤'],
            fill: ['語境理解偏差', '邏輯關係判斷錯誤', '詞彙搭配不當'],
            structure: ['段落順序混亂', '邏輯連接錯誤', '轉折關係不清'],
            reading: ['主旨把握不準', '細節理解錯誤', '推理判斷失誤']
        };
    }

    /**
     * 112年專屬的額外分析
     */
    generatePerformanceAnalysis(totalScore, maxScore, sectionResults) {
        let analysis = super.generatePerformanceAnalysis(totalScore, maxScore, sectionResults);
        
        // 添加112年特有的學習重點提醒
        const year112Tips = `
            <div style="margin-top: 1rem; padding: 1rem; background: #fff8e1; border-left: 4px solid #ff9800;">
                <strong>💡 112年學測特色提醒：</strong>
                <ul style="margin-top: 0.5rem; padding-left: 1.5rem; margin-bottom: 0;">
                    <li>本年度英文科重視詞彙的實際運用和語境判斷</li>
                    <li>文法題目更注重在真實語境中的應用</li>
                    <li>閱讀文章題材多元，涵蓋科技、社會、文化等領域</li>
                    <li>建議加強英語綜合運用能力和批判性思考</li>
                </ul>
            </div>
        `;
        
        return analysis + year112Tips;
    }
}

// 頁面載入完成後初始化112年考試系統
document.addEventListener('DOMContentLoaded', () => {
    // 確保基礎類已載入
    if (typeof GSATExamBase === 'undefined') {
        console.error('基礎類未載入，請確認 gsat-exam-base.js 已正確引入');
        return;
    }
    
    // 建立112年考試實例
    window.exam = new Exam112();
    
    console.log('🎓 112學年度學測英文專業考試系統已啟動');
    console.log('📚 功能特色：');
    console.log('   - 專業考試風格界面');
    console.log('   - 智能進度管理與分析');
    console.log('   - 考試模擬功能（專注模式、書籤）');
    console.log('   - 個人化學習建議');
    console.log('   - 手機優化響應式設計');
});