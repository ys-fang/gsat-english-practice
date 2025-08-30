// 109年學測英文試題 - 答案與學習建議
const answers109 = {
    // 詞彙題 (1-10題)
    q1: 'A',    // suffering from - 遭受水資源短缺
    q2: 'A',    // contact - 聯絡銷售人員
    q3: 'B',    // concerned - 擔心母親健康
    q4: 'B',    // lasted - 持續三天下雨
    q5: 'B',    // effective - 藥物有效
    q6: 'C',    // adjust - 調整行銷策略
    q7: 'A',    // guided - 導覽團
    q8: 'A',    // shortage - 化石燃料短缺
    q9: 'A',    // outstanding - 傑出表現
    q10: 'A',   // submit - 提交作業

    // 綜合測驗 (11-20題)
    q11: 'A',   // originated - 慢食運動起源
    q12: 'C',   // social - 社交體驗
    q13: 'A',   // threatens - 威脅傳統農業
    q14: 'B',   // featuring - 以當地食材為特色
    q15: 'A',   // justify - 證明額外成本值得
    q16: 'B',   // confirm - 科學家證實
    q17: 'B',   // extreme - 極端天氣模式
    q18: 'B',   // reduce - 減少溫室氣體排放
    q19: 'B',   // educating - 教育民眾
    q20: 'B',   // through - 通過全球合作

    // 文意選填 (21-30題)
    q21: 'A',   // vulnerable - 容易受到威脅
    q22: 'F',   // steal - 竊取敏感資訊
    q23: 'I',   // entering - 輸入登錄憑證
    q24: 'C',   // preventive - 預防策略
    q25: 'D',   // store - 儲存密碼
    q26: 'E',   // cautious - 謹慎點擊連結
    q27: 'B',   // release - 發布安全補丁
    q28: 'G',   // layer - 額外的保護層
    q29: 'J',   // detect - 偵測可疑網站
    q30: 'H',   // reduce - 降低風險

    // 篇章結構 (31-34題)
    q31: 'B',   // 社群媒體正面效益開場
    q32: 'D',   // 錯誤資訊和極化風險
    q33: 'A',   // 對心理健康的影響
    q34: 'C',   // 數位素養和平台責任

    // 閱讀測驗 (35-46題)
    // 第35-38題: 城市農業
    q35: 'B',   // 城市農業的優點和挑戰
    q36: 'B',   // 減少對遠距食物來源的依賴
    q37: 'D',   // 降低噪音污染未提及
    q38: 'B',   // 高初期投資成本

    // 第39-42題: 人工智慧
    q39: 'B',   // 討論AI發展及其影響
    q40: 'B',   // 無需特定程式就能學習和決策
    q41: 'D',   // 環境影響未提及
    q42: 'C',   // 發展倫理指導原則和透明度

    // 第43-46題: 地中海飲食
    q43: 'B',   // 基於地中海國家傳統飲食模式
    q44: 'B',   // 單元不飽和脂肪
    q45: 'C',   // 改善骨密度未提及
    q46: 'C'    // 促進環境永續性
};

const learningAdvice109 = {
    vocabulary: {
        title: "詞彙題",
        advice: [
            "109年詞彙題注重實用生活詞彙，如contact、adjust、shortage",
            "動詞片語要熟記：suffering from、concerned about等",
            "形容詞程度：effective、outstanding、concerned辨析",
            "動詞時態：lasted、guided注意過去式和過去分詞用法"
        ]
    },
    cloze: {
        title: "綜合測驗",
        advice: [
            "慢食運動主題：originated、featuring、justify等詞彙",
            "環境議題：threatens、extreme、reduce等環保詞彙",
            "動詞+ing形式：featuring、educating注意現在分詞用法",
            "介系詞：through、by注意搭配用法"
        ]
    },
    fill: {
        title: "文意選填",
        advice: [
            "網路安全主題：vulnerable、preventive、cautious等重要詞彙",
            "科技安全概念：steal、detect、layer等技術詞彙",
            "動詞形式變化：entering、release、store注意語境",
            "文章邏輯：從風險→預防→偵測→降低的完整防護思維"
        ]
    },
    structure: {
        title: "篇章結構",
        advice: [
            "社群媒體議題：正面效益vs負面影響的平衡討論",
            "議論文結構：開場論點→風險警示→健康影響→解決方案",
            "轉折關係：注意However、Nevertheless等連接詞",
            "段落順序：從現象描述到問題分析再到解決建議"
        ]
    },
    reading: {
        title: "閱讀測驗",
        advice: [
            "城市農業：urban farming、dependency、initial investment概念",
            "人工智慧：machine learning、ethical guidelines、transparency專業詞彙",
            "地中海飲食：Mediterranean diet、monounsaturated fats營養學詞彙",
            "NOT/EXCEPT題型：注意排除法，找出「未提及」的選項"
        ]
    }
};

// 繼承GSATExamBase建立109年考試
class Exam109 extends GSATExamBase {
    constructor() {
        super('109', answers109, learningAdvice109);
    }
}

// 頁面載入完成後初始化
document.addEventListener('DOMContentLoaded', () => {
    window.exam = new Exam109();
});