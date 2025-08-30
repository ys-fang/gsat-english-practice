/**
 * 106學年度學測英文 - 專業考試系統
 * GSAT 106 English Exam - Professional System
 */

// 106年學測英文正確答案
const answers106 = {
    // 詞彙題 (1-10題) - 每題1分
    q1: 'A',    // innovative - 創新的設計
    q2: 'A',    // contribution - 對氣候變化理解的貢獻
    q3: 'C',    // streamline - 簡化營運以降低成本
    q4: 'A',    // creative - 創新思考
    q5: 'B',    // precious - 珍貴的文物
    q6: 'B',    // rigorous - 嚴格的訓練計畫
    q7: 'A',    // revise - 修改論文
    q8: 'A',    // effective - 藥物有效
    q9: 'B',    // increased - 利潤顯著增加
    q10: 'B',   // enthusiastic - 對實地考察感到興奮

    // 綜合測驗 (11-20題) - 每題1分
    q11: 'A',   // adapt - 適應數位平台
    q12: 'B',   // advantages - 線上學習的主要優點
    q13: 'A',   // beneficial - 對工作成人特別有益
    q14: 'B',   // communicate - 與教師和同儕溝通
    q15: 'C',   // disrupt - 干擾學習體驗
    q16: 'B',   // aware - 意識到環境影響
    q17: 'C',   // degradation - 環境惡化
    q18: 'A',   // promotes - 推廣負責任的旅遊
    q19: 'B',   // support - 支持當地社區
    q20: 'A',   // contributes - 有助於福祉

    // 文意選填 (21-30題) - 每題1分
    q21: 'B',   // constantly - 不斷使用社群媒體
    q22: 'J',   // positive - 從正面角度來看
    q23: 'E',   // directly - 直接接觸客戶
    q24: 'F',   // efficiently - 更有效率地推廣
    q25: 'H',   // negative - 負面影響
    q26: 'G',   // majority - 大多數用戶
    q27: 'D',   // crucial - 關鍵問題
    q28: 'C',   // consequences - 嚴重後果
    q29: 'D',   // crucial - 至關重要
    q30: 'K',   // reduce - 減少社群媒體消費

    // 篇章結構 (31-34題) - 每題2分
    q31: 'A',   // 消費者環保意識推動電動車需求
    q32: 'B',   // 電動車環保效益的說明
    q33: 'C',   // 充電基礎設施不足的挑戰
    q34: 'D',   // 專家預測電動車將成為主流

    // 閱讀測驗 (35-46題) - 每題2分
    q35: 'B',   // 討論數位排毒的概念和效果
    q36: 'B',   // 眼睛疲勞和睡眠困擾
    q37: 'B',   // 錯失恐懼症
    q38: 'C',   // 完全斷開不現實；應該謹慎使用
    q39: 'B',   // 微塑膠：來源、影響和解決方案
    q40: 'B',   // 導致營養不良和消化問題
    q41: 'C',   // 選擇塑膠包裝最少的產品
    q42: 'B',   // 預防是最有效的策略
    q43: 'B',   // 透過數位平台分享資產或服務的經濟模式
    q44: 'B',   // 技術進步、經濟壓力和消費偏好改變
    q45: 'B',   // 缺乏就業保護和福利
    q46: 'B'    // 解決監管、工作條件和用戶信任等挑戰
};

// 106年專用配置
const config106 = {
    totalQuestions: 46,
    timeLimit: 100 * 60 * 1000,
    scores: {
        vocabulary: { range: [1, 10], points: 1 },
        cloze: { range: [11, 20], points: 1 },
        fill: { range: [21, 30], points: 1 },
        structure: { range: [31, 34], points: 2 },
        reading: { range: [35, 46], points: 2 }
    }
};

// 106年專業考試系統類
class Exam106 extends GSATExamBase {
    constructor() {
        super('106', answers106, config106);
    }

    getSectionAdvice(sectionKey) {
        const advice = {
            vocabulary: '106年詞彙重視創新與科技詞彙，建議加強商業和科技相關單字',
            cloze: '綜合測驗強調數位學習和環保議題，多關注時事相關語法',
            fill: '文意選填考查社群媒體主題，需熟悉網路科技詞彙',
            structure: '篇章結構聚焦電動車發展，訓練科技類文章邏輯理解',
            reading: '閱讀測驗涵蓋數位排毒、環保等現代議題，需廣泛閱讀'
        };
        return advice[sectionKey] || super.getSectionAdvice(sectionKey);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (typeof GSATExamBase === 'undefined') {
        console.error('基礎類未載入，請確認 gsat-exam-base.js 已正確引入');
        return;
    }
    window.exam = new Exam106();
    console.log('🎓 106學年度學測英文專業考試系統已啟動');
});