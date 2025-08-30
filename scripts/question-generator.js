// 題目生成工具 - 從PDF資料生成HTML結構
class QuestionGenerator {
    constructor() {
        // 114年完整題目資料
        this.questions114 = {
            // 文意選填 (21-30)
            fillInQuestions: {
                passage: `The Notre-Dame de Paris is one of the most famous cathedrals in Europe. Located at the heart of Paris, this medieval cathedral is <strong>21</strong> for its intricate architecture, stunning stained glass windows, and, above all, its bells.

Mounted in the two tall towers of the cathedral, Notre-Dame's bells have been ringing for over 800 years. In fact, there is documented <strong>22</strong> to the ringing of bells even before the cathedral's construction was completed, dating as far back as the 12th century. The 10 bells vary in size, each <strong>23</strong> a name. The largest one, named "Emmanuel," weighs over 13 tons. It is the only one of the whole group that <strong>24</strong> the French Revolution, while the rest were melted down for weapons. The melted bells were recast in the late 19th century. But due to their poor acoustic quality, all of the bells were replaced in 2013—except for Emmanuel, which <strong>25</strong> its renowned, excellent sound. This particular bell, ringing in F sharp, is considered one of the most harmonically beautiful in Europe.

Over centuries, the bells have become a <strong>26</strong> part of life in Paris, where they are known as "the cathedral's voice." They have been used to mark the hours of the day, to call the <strong>27</strong> to prayer, and to signal emergency situations such as fires and invasions. They have also rung in times of <strong>28</strong> and of mourning, announcing such events as royal weddings and coronations of kings, as well as funerals of heads of state.

However, after the devastating fire that damaged the cathedral in 2019, the bells fell <strong>29</strong>. The building went through a complex and time-consuming process of <strong>30</strong>, and the famous monument was finally reopened on December 8, 2024. The sounds of Notre-Dame bells once again filled the air in Paris, and will be heard for generations to come.`,
                options: [
                    '(A) reference', '(B) bearing', '(C) familiar', '(D) retained', '(E) faithful',
                    '(F) survived', '(G) celebration', '(H) restoration', '(I) noted', '(J) silent'
                ]
            },

            // 篇章結構 (31-34)
            structureQuestions: {
                passage: `A capsule hotel, also known as a pod hotel, is a unique type of basic, affordable accommodation. Originated in Japan, these hotels were initially meant for business professionals to stay close to populated business districts without spending a lot. <strong>31</strong>

A typical room of a capsule hotel is roughly the length and width of a single bed, with sufficient height for a guest to crawl in and sit up on the bed. The walls of each capsule may be made of wood, metal or any rigid material, but are often fiberglass or plastic. <strong>32</strong> Each capsule is equipped with a comfortable mattress, a small light, and sometimes a television or other entertainment options. Such minimalist design is what makes these hotels both inexpensive and efficient, providing only the essential elements for a good night sleep.

The first capsule hotel, the Capsule Inn Osaka, opened in 1979. Since then, capsule hotels have quickly spread to other cities and countries. Chains have emerged in Taiwan, Singapore, and even on resort islands like Bali. Pod hotels are also seen in Europe and North America, especially in big cities like New York, London, and Paris. <strong>33</strong> Instead of the traditional bare pod-sized style, new chains now feature interior design that appeals to digitally connected travelers from around the world. Guests may enjoy facilities such as free Wi-Fi, mobile charging, and even a soundless alarm system that raises the sleeping guests into a seated position while gradually brightening the lights.

While offering budget-conscious travelers a unique option, capsule hotels may not be suitable for everyone. Some hotels may not provide air conditioning in the capsules, leading to poor air flow. <strong>34</strong> Also, you may have to share common facilities (such as bathrooms) with other guests. And, if you're worried about feeling claustrophobic in small spaces, you'd better think twice before making a reservation.`,
                options: [
                    '(A) In response to rising demands, these hotels are embracing a wave of innovation.',
                    '(B) The room\'s thin plastic walls easily transmit the sound of snoring made by neighboring guests.',
                    '(C) The chambers are stacked side-by-side, two units high, with the upper rooms reached by a ladder.',
                    '(D) Today, they provide low-budget, overnight lodging in commerce centers in large cities worldwide.'
                ]
            },

            // 閱讀測驗 (35-38)
            readingPassage1: {
                title: '第35至38題為題組',
                passage: `While waiting to cross the street at busy intersections, have you ever wondered who invented the traffic light? Most people credit the first traffic light to Nottingham engineer John Peake Knight. A railway manager, Knight specialized in designing the signaling system for Britain's growing railway network in the 1860s. He saw no reason why this could not be adapted for use on the busy London intersections. Thus, he proposed a signaling system based on the railway movable-arm signal: Arms extending horizontally commanded drivers to stop, whereas arms lowered to a 45-degree angle told drivers to move on, resembling a traffic director's gestures. Red and green gas lamps were added to the signal for use at night. A police officer was stationed by the side to operate the system.

Knight's traffic signal was installed near London's Westminster Bridge in December 1868, but the system was short-lived. A gas leak one month later caused an explosion in the lights, injuring the policeman operating it. Deemed a public hazard, the project was immediately dropped, and traffic lights were banned until their return in 1929 back to the British streets.

In the early 1900s, versions of the British traffic lights appeared in big cities in America, where traffic was on a sharp rise. Systems using movable arms were popular in Chicago, while those using the red and green lights were adopted in San Francisco. Patents with innovations on Knight's ideas were filed nationwide. A major breakthrough was the yellow light invented by a Detroit police officer William Potts. Installed in Detroit in 1920, Potts' three-color system allowed for the added signal "proceed with caution" to be displayed.

Now, with the emergence of self-driving cars, researchers have begun to suggest that traffic signals are no longer necessary. Intersections will operate in a way that cars automatically adjust their speed to cross through, while maintaining safe distances from other vehicles. In the near future, we may experience a brand new form of traffic management!`,
                questions: [
                    {
                        number: 35,
                        question: 'What is this passage mainly about?',
                        options: [
                            '(A) The evolution of traffic control systems.',
                            '(B) The inventors of traffic lights in history.',
                            '(C) The functions of different traffic signals.',
                            '(D) The development of modern transportation.'
                        ]
                    },
                    {
                        number: 36,
                        question: "Which of the following pictures shows Knight's proposed traffic signal?",
                        options: [
                            '(A) [圖片A: 現代交通燈]',
                            '(B) [圖片B: 鐵路信號臂]',
                            '(C) [圖片C: 可動臂式信號燈]',
                            '(D) [圖片D: 停車標誌]'
                        ]
                    },
                    {
                        number: 37,
                        question: 'Which of the following statements is true, according to the passage?',
                        options: [
                            '(A) Knight was injured in the explosion of his traffic light.',
                            "(B) Potts' traffic light was the first one to appear in the USA.",
                            '(C) The first traffic signal originated from the idea of a traffic director.',
                            '(D) Future vehicles may not need traffic lights to cross an intersection.'
                        ]
                    },
                    {
                        number: 38,
                        question: 'Here is a sentence: "This design was adopted in later traffic light designs across the world." Which paragraph is most suitable to have it as the final sentence?',
                        options: [
                            '(A) Paragraph 1.',
                            '(B) Paragraph 2.',
                            '(C) Paragraph 3.',
                            '(D) Paragraph 4.'
                        ]
                    }
                ]
            }
        };

        this.answers114 = {
            q21: 'I', q22: 'A', q23: 'B', q24: 'F', q25: 'D',
            q26: 'C', q27: 'E', q28: 'G', q29: 'J', q30: 'H',
            q31: 'D', q32: 'C', q33: 'A', q34: 'B',
            q35: 'A', q36: 'C', q37: 'D', q38: 'C'
        };
    }

    // 生成文意選填HTML
    generateFillInSection() {
        const data = this.questions114.fillInQuestions;
        
        return `
        <!-- 三、文意選填 (占10分) -->
        <section class="section">
            <h2 class="section-title">三、文意選填 (占10分)</h2>
            <p style="margin-bottom: 2rem; color: #666;">說明：第21題至第30題為單選題，每題1分。</p>

            <h3 style="margin-bottom: 1.5rem; color: #2c3e50;">第21至30題為題組</h3>
            <div class="passage" style="background: #f8f9fa; padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem; line-height: 1.8;">
                ${data.passage}
            </div>

            <div class="fill-options" style="background: #f0f8ff; padding: 1rem; border-radius: 8px; margin-bottom: 2rem;">
                <p style="margin-bottom: 0.5rem; font-weight: bold;">選項：</p>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.5rem;">
                    ${data.options.map(option => `<span>${option}</span>`).join('')}
                </div>
            </div>

            ${this.generateFillInQuestions()}
        </section>`;
    }

    generateFillInQuestions() {
        let html = '';
        for (let i = 21; i <= 30; i++) {
            html += `
            <div class="question">
                <div class="question-number">${i}</div>
                <div class="options">
                    <label class="option">
                        <input type="radio" name="q${i}" value="A">
                        <span class="option-text">(A)</span>
                    </label>
                    <label class="option">
                        <input type="radio" name="q${i}" value="B">
                        <span class="option-text">(B)</span>
                    </label>
                    <label class="option">
                        <input type="radio" name="q${i}" value="C">
                        <span class="option-text">(C)</span>
                    </label>
                    <label class="option">
                        <input type="radio" name="q${i}" value="D">
                        <span class="option-text">(D)</span>
                    </label>
                    <label class="option">
                        <input type="radio" name="q${i}" value="E">
                        <span class="option-text">(E)</span>
                    </label>
                    <label class="option">
                        <input type="radio" name="q${i}" value="F">
                        <span class="option-text">(F)</span>
                    </label>
                    <label class="option">
                        <input type="radio" name="q${i}" value="G">
                        <span class="option-text">(G)</span>
                    </label>
                    <label class="option">
                        <input type="radio" name="q${i}" value="H">
                        <span class="option-text">(H)</span>
                    </label>
                    <label class="option">
                        <input type="radio" name="q${i}" value="I">
                        <span class="option-text">(I)</span>
                    </label>
                    <label class="option">
                        <input type="radio" name="q${i}" value="J">
                        <span class="option-text">(J)</span>
                    </label>
                </div>
            </div>`;
        }
        return html;
    }

    // 生成完整的114年HTML內容
    generateComplete114HTML() {
        return `
        ${this.generateFillInSection()}
        ${this.generateStructureSection()}
        ${this.generateReadingSection()}
        ${this.generateMixedSection()}
        `;
    }

    generateStructureSection() {
        const data = this.questions114.structureQuestions;
        
        return `
        <!-- 四、篇章結構 (占8分) -->
        <section class="section">
            <h2 class="section-title">四、篇章結構 (占8分)</h2>
            <p style="margin-bottom: 2rem; color: #666;">說明：第31題至第34題為單選題，每題2分。</p>

            <h3 style="margin-bottom: 1.5rem; color: #2c3e50;">第31至34題為題組</h3>
            <div class="passage" style="background: #f8f9fa; padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem; line-height: 1.8;">
                ${data.passage}
            </div>

            ${[31, 32, 33, 34].map(num => `
            <div class="question">
                <div class="question-number">${num}</div>
                <div class="options">
                    ${data.options.map((option, index) => `
                    <label class="option">
                        <input type="radio" name="q${num}" value="${String.fromCharCode(65 + index)}">
                        <span class="option-text">${option}</span>
                    </label>
                    `).join('')}
                </div>
            </div>
            `).join('')}
        </section>`;
    }

    generateReadingSection() {
        return `
        <!-- 五、閱讀測驗 (占24分) -->
        <section class="section">
            <h2 class="section-title">五、閱讀測驗 (占24分)</h2>
            <p style="margin-bottom: 2rem; color: #666;">說明：第35題至第46題為單選題，每題2分。</p>

            <h3 style="margin-bottom: 1.5rem; color: #2c3e50;">${this.questions114.readingPassage1.title}</h3>
            <div class="passage" style="background: #f8f9fa; padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem; line-height: 1.8;">
                ${this.questions114.readingPassage1.passage}
            </div>

            ${this.questions114.readingPassage1.questions.map(q => `
            <div class="question">
                <div class="question-number">${q.number}</div>
                <div class="question-text">${q.question}</div>
                <div class="options">
                    ${q.options.map(option => `
                    <label class="option">
                        <input type="radio" name="q${q.number}" value="${option.charAt(1)}">
                        <span class="option-text">${option}</span>
                    </label>
                    `).join('')}
                </div>
            </div>
            `).join('')}
        </section>`;
    }

    generateMixedSection() {
        return `
        <!-- 第貳部分、混合題 (占10分) -->
        <section class="section">
            <h2 class="section-title">第貳部分、混合題 (占10分)</h2>
            <p style="margin-bottom: 2rem; color: #666;">說明：本部分共有1題組，限在標示題號的作答區內作答。</p>

            <h3 style="margin-bottom: 1.5rem; color: #2c3e50;">第47至50題為題組</h3>
            <div class="passage" style="background: #f8f9fa; padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem; line-height: 1.8;">
                <p>A zoo is a place where animals in captivity are put on display for humans to see. While early zoos put emphasis on displaying as many unusual creatures as possible, most modern zoos now focus on conservation and education. Still, many animal rights activists believe the cost of confining animals outweighs the benefits. What are your opinions? Feel free to share your ideas on this forum.</p>
                
                <!-- 論壇討論內容 -->
                <div style="background: white; padding: 1rem; border-radius: 5px; margin: 1rem 0;">
                    <strong>A. Amy</strong><br>
                    Personally I'm against zoos, though I do understand some of the arguments why they should exist. I don't agree with caging animals for our entertainment.
                </div>
                
                <!-- 其他論壇參與者的意見... -->
            </div>

            <div class="question">
                <div class="question-number">47-48</div>
                <div class="question-text">請根據選文內容，從文章中選出兩個單詞，分別填入下列句子空格，並視句型結構需要作適當的字形變化，使句子語意完整、語法正確，且符合全文文意。每格限填一個單詞（word）。（填充，4分）</div>
                <div style="background: #f0f8ff; padding: 1rem; border-radius: 5px; margin: 1rem 0;">
                    <p>Modern zoos serve the purposes of conserving endangered species as well as <input type="text" name="q47" style="border: none; border-bottom: 2px solid #3498db; padding: 0.2rem; background: transparent; width: 100px;"> visitors.</p>
                    <p>However, some people are against zoos because the animals <input type="text" name="q48" style="border: none; border-bottom: 2px solid #3498db; padding: 0.2rem; background: transparent; width: 100px;"> there will lose the freedom they enjoy in the wild.</p>
                </div>
            </div>

            <div class="question">
                <div class="question-number">49</div>
                <div class="question-text">From (A) to (J) in the above forum discussion, which ONES show a positive attitude toward zoos? （多選題，4分）</div>
                <div class="options">
                    ${['C', 'D', 'G', 'I'].map(letter => `
                    <label class="option">
                        <input type="checkbox" name="q49" value="${letter}">
                        <span class="option-text">(${letter})</span>
                    </label>
                    `).join('')}
                </div>
            </div>

            <div class="question">
                <div class="question-number">50</div>
                <div class="question-text">Which phrase on the forum discussion carries the meaning of "building the ability to understand and share the feelings of others"?（簡答題，2分）</div>
                <div style="margin: 1rem 0;">
                    <input type="text" name="q50" style="width: 100%; padding: 0.5rem; border: 2px solid #ddd; border-radius: 5px;" placeholder="請輸入答案...">
                </div>
            </div>
        </section>`;
    }
}

// 匯出給其他腳本使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = QuestionGenerator;
}