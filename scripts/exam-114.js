/**
 * 114學年度學測英文 - 專業考試系統
 * GSAT 114 English Exam - Professional System
 * 
 * 基於統一基礎類實現，提供一致的專業考試體驗
 */

// 114年學測英文正確答案
const answers114 = {
    // 詞彙題 (1-10題) - 每題1分
    q1: 'C',    // container - 容器放在漏水龍頭下
    q2: 'A',    // produce - 農夫市集提供新鮮季節性農產品
    q3: 'A',    // blurring - 童年記憶正在模糊
    q4: 'C',    // offensive - 種族主義言論本質上是冒犯性的
    q5: 'C',    // draft - 論文的第一份草稿
    q6: 'D',    // vacant - 空置多年的廢棄房屋
    q7: 'D',    // enormous - 高中生展現巨大的勇氣
    q8: 'A',    // halted - 公共項目被停止或延遲
    q9: 'B',    // graced - 總統以出席為典禮增光
    q10: 'A',   // verbally - 口頭辱罵同事

    // 綜合測驗 (11-20題) - 每題1分
    q11: 'B',   // would spread - 未來會傳播到世界各地
    q12: 'B',   // disrupted - 計劃被雨水打亂
    q13: 'A',   // circulate - 想法可能流通和加深
    q14: 'C',   // gave rise to - 產生了新形式的集體努力
    q15: 'D',   // thus - 因此創造了世界咖啡廳
    q16: 'D',   // strike - 暈車可以突然發作
    q17: 'C',   // do not match - 大腦接收的信號不匹配
    q18: 'C',   // don't - 其他部分沒有檢測到移動
    q19: 'B',   // preventive measures - 預防措施
    q20: 'A',   // as well - 眺望遠方也有幫助

    // 文意選填 (21-30題) - 每題1分
    q21: 'I',   // noted - 以其建築而聞名
    q22: 'A',   // reference - 有文獻記載鐘聲
    q23: 'B',   // bearing - 每個鐘都有名字
    q24: 'F',   // survived - 唯一倖存法國革命的鐘
    q25: 'D',   // retained - 保持其著名的優秀音質
    q26: 'C',   // familiar - 成為巴黎生活中熟悉的一部分
    q27: 'E',   // faithful - 呼召信徒祈禱
    q28: 'G',   // celebration - 慶祝和哀悼時刻
    q29: 'J',   // silent - 鐘聲沉寂
    q30: 'H',   // restoration - 修復過程

    // 篇章結構 (31-34題) - 每題2分
    q31: 'D',   // 今天，它們在世界各地大城市的商業中心提供低預算過夜住宿
    q32: 'C',   // 房間並排堆疊，兩單位高，上層房間通過梯子到達
    q33: 'A',   // 為了回應不斷增長的需求，這些酒店正在擁抱創新浪潮
    q34: 'B',   // 房間的薄塑料牆容易傳播鄰居的鼾聲

    // 閱讀測驗 (35-46題) - 每題2分
    // 第35-38題: 交通燈的發展
    q35: 'A',   // 交通控制系統的演進
    q36: 'C',   // 可動臂式交通信號燈
    q37: 'D',   // 未來車輛在十字路口可能不需要交通燈
    q38: 'C',   // 第三段最適合作為最後一句

    // 第39-42題: 恐怖電影的影響
    q39: 'A',   // 心理學研究
    q40: 'B',   // 通過觀察學習
    q41: 'D',   // 看恐怖電影可能對人格有長期影響
    q42: 'B',   // 通過展示問題的對立觀點

    // 第43-46題: 俄羅斯的酒精歷史
    q43: 'C',   // 反駁俄羅斯人天生是飲酒者的假設
    q44: 'A',   // 俄羅斯的伏特加生產始於15世紀
    q45: 'D',   // 國家壟斷
    q46: 'A'    // 提供更多事實
};

// 114年專用配置
const config114 = {
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

// 114年專業考試系統類
class Exam114 extends GSATExamBase {
    constructor() {
        super('114', answers114, config114);
    }

    /**
     * 114年特有的學習建議
     */
    getSectionAdvice(sectionKey) {
        const advice = {
            vocabulary: '114年詞彙題涵蓋生活化詞彙，建議重點練習情境式單字記憶和詞性辨析',
            cloze: '綜合測驗重視語法邏輯和語境理解，多練習時態運用和連接詞搭配',
            fill: '文意選填考驗語義連貫性，需加強上下文語境判斷和詞彙搭配能力',
            structure: '篇章結構著重邏輯發展，建議練習文章段落間的連貫性和轉折關係',
            reading: '閱讀測驗題材豐富多元，建議廣泛閱讀科技、歷史、文化等不同領域文章'
        };
        
        return advice[sectionKey] || super.getSectionAdvice(sectionKey);
    }

    /**
     * 114年錯誤分析提示
     */
    getCommonMistakes() {
        return {
            vocabulary: ['container vs contents', 'produce vs product', 'blurring vs blasting'],
            cloze: ['would vs will時態選擇', 'disrupted vs disturbed語境', '片語動詞gave rise to'],
            fill: ['noted vs famous同義詞', 'survived vs remained', 'familiar vs similar詞義辨析'],
            structure: ['段落邏輯連接', '時間順序判斷', '因果關係理解'],
            reading: ['主旨歸納能力', '細節推理判斷', '作者意圖理解']
        };
    }

    /**
     * 114年專屬的額外分析
     */
    generatePerformanceAnalysis(totalScore, maxScore, sectionResults) {
        let analysis = super.generatePerformanceAnalysis(totalScore, maxScore, sectionResults);
        
        // 添加114年特有的學習重點提醒
        const year114Tips = `
            <div style="margin-top: 1rem; padding: 1rem; background: #e8f5e8; border-left: 4px solid #4caf50;">
                <strong>💡 114年學測特色提醒：</strong>
                <ul style="margin-top: 0.5rem; padding-left: 1.5rem; margin-bottom: 0;">
                    <li>本年度英文科強調實用性和生活化應用</li>
                    <li>詞彙題多考查情境中的詞彙運用能力</li>
                    <li>閱讀文章涵蓋科技發展、文化歷史等多元主題</li>
                    <li>建議加強跨領域英語閱讀和語境判斷能力</li>
                </ul>
            </div>
        `;
        
        return analysis + year114Tips;
    }
}

// 頁面載入完成後初始化114年考試系統
document.addEventListener('DOMContentLoaded', () => {
    // 確保基礎類已載入
    if (typeof GSATExamBase === 'undefined') {
        console.error('基礎類未載入，請確認 gsat-exam-base.js 已正確引入');
        return;
    }
    
    // 建立114年考試實例
    window.exam = new Exam114();
    
    console.log('🎓 114學年度學測英文專業考試系統已啟動');
    console.log('📚 功能特色：');
    console.log('   - 專業考試風格界面');
    console.log('   - 智能進度管理與分析');
    console.log('   - 考試模擬功能（專注模式、書籤）');
    console.log('   - 個人化學習建議');
    console.log('   - 手機優化響應式設計');
});