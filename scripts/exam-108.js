// 108年學測英文試題 - 答案與學習建議
const answers108 = {
    // 詞彙題 (1-10題)
    q1: 'A',    // recall - 召回有缺陷的產品
    q2: 'C',    // initiative - 新員工展現主動性
    q3: 'A',    // carefully - 博物館文物被小心保存
    q4: 'B',    // realized - 實現成為鋼琴家的夢想
    q5: 'A',    // declining - 氣溫下降
    q6: 'A',    // contribution - 對氣候變化理解的貢獻
    q7: 'A',    // submit - 提交作業
    q8: 'A',    // create - 創造就業機會
    q9: 'D',    // abstain - 戒煙
    q10: 'A',   // exceptional - 傑出的烹飪技巧

    // 綜合測驗 (11-20題)
    q11: 'A',   // access - 接觸產品
    q12: 'B',   // drawback - 缺點
    q13: 'A',   // flexible - 靈活的退貨政策
    q14: 'A',   // contributed - 貢獻於改善服務
    q15: 'B',   // sophisticated - 更精密的購物體驗
    q16: 'A',   // increasing - 日益增加的關注
    q17: 'A',   // achieved - 透過各種方法達成
    q18: 'C',   // minimizing - 減少廢物產生
    q19: 'A',   // instead - 代替傳統汽車
    q20: 'B',   // worthwhile - 值得的選擇

    // 文意選填 (21-30題)
    q21: 'D',   // essential - 在日常生活中越來越重要
    q22: 'A',   // instantly - 即時連接他人
    q23: 'G',   // feasible - 使遠距關係更可行
    q24: 'H',   // transformed - 改變資訊取得方式
    q25: 'E',   // informed - 讓人們更了解時事
    q26: 'C',   // mobility - 工作場所的靈活性和流動性
    q27: 'I',   // privacy - 隱私和社交互動的擔憂
    q28: 'J',   // reducing - 減少面對面溝通
    q29: 'F',   // evolve - 智慧手機持續演進
    q30: 'B',   // integrated - 更整合到生活各方面

    // 篇章結構 (31-34題)
    q31: 'A',   // 數位轉變改變度假方式
    q32: 'B',   // 網紅行銷創造新的推廣機會
    q33: 'C',   // 實施遊客限制和推廣冷門景點
    q34: 'E',   // 當地社區更參與觀光規劃

    // 閱讀測驗 (35-46題)
    // 第35-38題: 遠端工作
    q35: 'B',   // 遠端工作的優點和挑戰
    q36: 'B',   // 更好的工作生活平衡
    q37: 'C',   // 擴大人才庫
    q38: 'D',   // 增加培訓成本未提及

    // 第39-42題: 食物浪費
    q39: 'B',   // 約三分之一的食物被浪費
    q40: 'B',   // 已開發國家主要在消費層面浪費
    q41: 'C',   // 開發中國家的基礎設施不足
    q42: 'C',   // 改善包裝技術

    // 第43-46題: 再生能源
    q43: 'B',   // 技術進步和環境意識推動成長
    q44: 'C',   // 太陽能裝置成本下降超過80%
    q45: 'B',   // 離岸風場有更強且穩定的風力
    q46: 'B'    // 複雜的電網整合
};

const learningAdvice108 = {
    vocabulary: {
        title: "詞彙題",
        advice: [
            "108年詞彙題涵蓋商業和環境議題詞彙",
            "recall、initiative、contribution等商業用語須熟記",
            "carefully、declining、exceptional形容詞和副詞辨析",
            "submit、abstain、realize等動詞在不同語境的用法"
        ]
    },
    cloze: {
        title: "綜合測驗",
        advice: [
            "消費者行為主題：access、flexible、sophisticated等概念",
            "環保意識議題：minimizing、worthwhile、instead等詞彙",
            "動詞時態：contributed、achieved注意完成式用法",
            "形容詞比較級：more sophisticated等結構要熟悉"
        ]
    },
    fill: {
        title: "文意選填",
        advice: [
            "科技主題文章：essential、instantly、feasible等詞彙",
            "社會變遷概念：transformed、mobility、privacy重要",
            "演進過程描述：evolve、integrated表達變化的詞彙",
            "因果關係字詞：reducing、informed等連接邏輯"
        ]
    },
    structure: {
        title: "篇章結構",
        advice: [
            "觀光業變化主題：掌握digital transformation概念",
            "文章發展脈絡：改變→新機會→挑戰→社區參與",
            "段落連接邏輯：時間順序與因果關係並重",
            "注意However、Therefore等轉折詞的位置"
        ]
    },
    reading: {
        title: "閱讀測驗",
        advice: [
            "遠端工作：work-life balance、talent pool等職場概念",
            "食物浪費：developed countries vs developing countries對比",
            "再生能源：offshore wind、grid integration技術詞彙",
            "數據題：注意80%、三分之一等具體數字的理解"
        ]
    }
};

// 繼承GSATExamBase建立108年考試
class Exam108 extends GSATExamBase {
    constructor() {
        super('108', answers108, learningAdvice108);
    }
}

// 頁面載入完成後初始化
document.addEventListener('DOMContentLoaded', () => {
    window.exam = new Exam108();
});