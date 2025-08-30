// 107年學測英文試題 - 答案與學習建議
const answers107 = {
    // 詞彙題 (1-10題)
    q1: 'A',    // comprehensive - 全面的課程
    q2: 'A',    // essential - 運動和飲食對健康是必要的
    q3: 'A',    // enhance - 提升員工滿意度和生產力
    q4: 'A',    // efficient - 更高效的再生能源方法
    q5: 'B',    // visitors - 博物館吸引遊客
    q6: 'A',    // demonstrate - 展示理解
    q7: 'A',    // intensive - 密集訓練
    q8: 'A',    // implement - 實施環境保護法
    q9: 'A',    // thorough - 徹底分析
    q10: 'A',   // advantage - 競爭優勢

    // 綜合測驗 (11-20題)
    q11: 'A',   // created - 數位學習創造了機會和挑戰
    q12: 'A',   // attend - 參加課程
    q13: 'A',   // formal - 正式的教室結構
    q14: 'B',   // isolating - 缺乏面對面互動讓人感到孤立
    q15: 'B',   // benefits - 混合學習的好處
    q16: 'B',   // recognizing - 認識到心理健康的重要性
    q17: 'B',   // releases - 運動釋放內啡肽
    q18: 'A',   // get through - 度過困難時期
    q19: 'A',   // strategies - 治療師提供策略
    q20: 'B',   // collective - 集體責任

    // 文意選填 (21-30題)
    q21: 'A',   // steadily - 地球溫度持續上升
    q22: 'C',   // increasing - 二氧化碳濃度增加
    q23: 'E',   // reducing - 森林砍伐減少地球吸收二氧化碳的能力
    q24: 'G',   // evidence - 氣候科學家觀察到證據
    q25: 'F',   // adapt - 物種努力適應環境變化
    q26: 'I',   // urgent - 需要緊急行動
    q27: 'H',   // limit - 限制溫室氣體排放的政策
    q28: 'B',   // alternatives - 化石燃料的替代方案
    q29: 'D',   // essential - 國際合作是必不可少的
    q30: 'J',   // coordinated - 更協調的努力

    // 篇章結構 (31-34題)
    q31: 'A',   // 各種形式的都市農業被實施來最大化有限的都市空間
    q32: 'B',   // 都市農業也有助於環境教育和社區建設
    q33: 'C',   // 幾個實際障礙繼續限制都市農業的擴展
    q34: 'D',   // 創新和技術進步推動都市農業方法的演進

    // 閱讀測驗 (35-46題)
    // 第35-38題: 終身學習
    q35: 'B',   // 主要主題是終身學習和成人教育
    q36: 'C',   // 成人學習者有不同的需求和限制
    q37: 'B',   // 微學習是將主題分解成小單元
    q38: 'D',   // 終身學習無助於減少工作責任

    // 第39-42題: 塑膠污染
    q39: 'B',   // 塑膠污染問題在於不可生物分解
    q40: 'B',   // 微塑膠是直徑小於5毫米的塑膠顆粒
    q41: 'C',   // 塑膠污染導致海洋生物營養不良和受傷
    q42: 'C',   // 解決塑膠污染需要各部門合作

    // 第43-46題: 零工經濟
    q43: 'B',   // 零工經濟的特徵是短期合約和自由工作
    q44: 'C',   // 零工工作的主要優勢是靈活性和自主性
    q45: 'C',   // 零工工作者面臨缺乏傳統員工福利的挑戰
    q46: 'B'    // 政策制定者試圖平衡靈活性和保障
};

const learningAdvice107 = {
    vocabulary: {
        title: "詞彙題",
        advice: [
            "107年詞彙題重點關注形容詞辨析，特別是-ive結尾詞彙",
            "注意comprehensive(全面的)、competitive(競爭的)等易混詞",
            "essential、efficient等高頻學術詞彙須熟記",
            "demonstrate、implement等動詞在學術語境中的正確用法"
        ]
    },
    cloze: {
        title: "綜合測驗",
        advice: [
            "數位學習主題：掌握digital learning相關詞彙",
            "心理健康議題：注意isolating、collective等概念詞",
            "動詞片語：get through、releases等須理解語境用法",
            "注意上下文的邏輯連接與語意一致性"
        ]
    },
    fill: {
        title: "文意選填",
        advice: [
            "氣候變化主題：steadily、urgent、coordinated等副詞重要",
            "環境議題詞彙：reducing、alternatives、essential需熟悉",
            "文章結構邏輯：先因後果、問題與解決方案的組織方式",
            "10個選項中注意相似詞彙的細微差異"
        ]
    },
    structure: {
        title: "篇章結構",
        advice: [
            "都市農業主題：了解urban farming發展脈絡",
            "文章組織：從實施方法→教育效益→挑戰→創新發展",
            "轉折詞與連接詞的邏輯功能要清楚",
            "段落間的因果關係與時間順序"
        ]
    },
    reading: {
        title: "閱讀測驗",
        advice: [
            "終身學習：adult education、microlearning等專業概念",
            "塑膠污染：biodegradable、microplastics科學詞彙",
            "零工經濟：gig economy、flexibility vs security議題",
            "注意NOT/EXCEPT類題型，仔細排除正確選項"
        ]
    }
};

// 繼承GSATExamBase建立107年考試
class Exam107 extends GSATExamBase {
    constructor() {
        super('107', answers107, learningAdvice107);
    }
}

// 頁面載入完成後初始化
document.addEventListener('DOMContentLoaded', () => {
    window.exam = new Exam107();
});