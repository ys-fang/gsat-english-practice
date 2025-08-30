/**
 * 105學年度學測英文 - 專業考試系統
 * GSAT 105 English Exam - Professional System
 * 
 * 基於統一基礎類實現，提供一致的專業考試體驗
 */

// 105年學測英文正確答案
const answers105 = {
    // 詞彙題 (1-10題) - 每題1分
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

    // 綜合測驗 (11-20題) - 每題1分
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

    // 文意選填 (21-30題) - 每題1分
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

    // 篇章結構 (31-34題) - 每題2分
    q31: 'A',   // COVID-19加速了線上購物的轉變
    q32: 'B',   // 傳統零售商必須快速適應
    q33: 'C',   // 線上購物也有挑戰
    q34: 'D',   // 未來零售業將採用混合方式

    // 閱讀測驗 (35-46題) - 每題2分
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

// 105年專用配置
const config105 = {
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

// 105年專業考試系統類
class Exam105 extends GSATExamBase {
    constructor() {
        super('105', answers105, config105);
    }

    /**
     * 105年特有的學習建議
     */
    getSectionAdvice(sectionKey) {
        const advice = {
            vocabulary: '105年詞彙偏重基礎單字，建議加強高中核心詞彙，注意同義詞辨析',
            cloze: '綜合測驗考查語法和語境理解，多練習時態、語態和連接詞的運用',
            fill: '文意選填著重語義連貫，需培養快速掌握文章主旨的能力',
            structure: '篇章結構題考查邏輯思維，建議練習段落間的因果、轉折關係',
            reading: '閱讀測驗題材多元，建議廣泛閱讀科技、環境、社會等主題文章'
        };
        
        return advice[sectionKey] || super.getSectionAdvice(sectionKey);
    }

    /**
     * 105年錯誤分析提示
     */
    getCommonMistakes() {
        return {
            vocabulary: ['require vs suggest', 'expand vs explain', 'achieve vs receive'],
            cloze: ['分詞構句使用', '名詞子句連接詞', '介系詞片語'],
            fill: ['上下文語義判斷', '詞性變化識別', '邏輯連接理解'],
            structure: ['段落邏輯順序', '轉折關係辨識', '因果關係理解'],
            reading: ['主旨理解偏差', '細節資訊定位', '推論判斷錯誤']
        };
    }

    /**
     * 105年專屬的額外分析
     */
    generatePerformanceAnalysis(totalScore, maxScore, sectionResults) {
        let analysis = super.generatePerformanceAnalysis(totalScore, maxScore, sectionResults);
        
        // 添加105年特有的學習重點提醒
        const year105Tips = `
            <div style="margin-top: 1rem; padding: 1rem; background: #fff3cd; border-left: 4px solid #ffc107;">
                <strong>💡 105年學測特色提醒：</strong>
                <ul style="margin-top: 0.5rem; padding-left: 1.5rem; margin-bottom: 0;">
                    <li>本年度英文科重視實用性，詞彙多為生活常用詞</li>
                    <li>閱讀文章主題涵蓋環保、科技應用等時事議題</li>
                    <li>文法重點在於語境判斷而非純粹規則背誦</li>
                    <li>建議多關注新聞英語和科普文章的閱讀</li>
                </ul>
            </div>
        `;
        
        return analysis + year105Tips;
    }
}

// 頁面載入完成後初始化105年考試系統
document.addEventListener('DOMContentLoaded', () => {
    // 確保基礎類已載入
    if (typeof GSATExamBase === 'undefined') {
        console.error('基礎類未載入，請確認 gsat-exam-base.js 已正確引入');
        return;
    }
    
    // 建立105年考試實例
    window.exam = new Exam105();
    
    console.log('🎓 105學年度學測英文專業考試系統已啟動');
    console.log('📚 功能特色：');
    console.log('   - 專業考試風格界面');
    console.log('   - 智能進度管理與分析');
    console.log('   - 考試模擬功能（專注模式、書籤）');
    console.log('   - 個人化學習建議');
    console.log('   - 手機優化響應式設計');
});