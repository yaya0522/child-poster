// 提示词生成器模块

class PromptGenerator {
    constructor() {
        // 场景词汇库
        this.vocabularyDatabase = {
            "超市": {
                core: [
                    { hanzi: "收银员", pinyin: "shōu yín yuán" },
                    { hanzi: "货架", pinyin: "huò jià" },
                    { hanzi: "购物车", pinyin: "gòu wù chē" },
                    { hanzi: "收银台", pinyin: "shōu yín tái" },
                    { hanzi: "入口", pinyin: "rù kǒu" }
                ],
                items: [
                    { hanzi: "苹果", pinyin: "píng guǒ" },
                    { hanzi: "牛奶", pinyin: "niú nǎi" },
                    { hanzi: "面包", pinyin: "miàn bāo" },
                    { hanzi: "鸡蛋", pinyin: "jī dàn" },
                    { hanzi: "香蕉", pinyin: "xiāng jiāo" },
                    { hanzi: "饼干", pinyin: "bǐng gān" },
                    { hanzi: "果汁", pinyin: "guǒ zhī" },
                    { hanzi: "巧克力", pinyin: "qiǎo kè lì" }
                ],
                environment: [
                    { hanzi: "出口", pinyin: "chū kǒu" },
                    { hanzi: "灯", pinyin: "dēng" },
                    { hanzi: "墙", pinyin: "qiáng" },
                    { hanzi: "价签", pinyin: "jià qiān" },
                    { hanzi: "购物篮", pinyin: "gòu wù lán" }
                ]
            },
            "医院": {
                core: [
                    { hanzi: "医生", pinyin: "yī shēng" },
                    { hanzi: "护士", pinyin: "hù shi" },
                    { hanzi: "病床", pinyin: "bìng chuáng" },
                    { hanzi: "挂号台", pinyin: "guà hào tái" },
                    { hanzi: "药房", pinyin: "yào fáng" }
                ],
                items: [
                    { hanzi: "听诊器", pinyin: "tīng zhěn qì" },
                    { hanzi: "体温计", pinyin: "tǐ wēn jì" },
                    { hanzi: "针筒", pinyin: "zhēn tǒng" },
                    { hanzi: "药片", pinyin: "yào piàn" },
                    { hanzi: "创可贴", pinyin: "chuàng kě tiē" },
                    { hanzi: "口罩", pinyin: "kǒu zhào" },
                    { hanzi: "洗手液", pinyin: "xǐ shǒu yè" },
                    { hanzi: "病历本", pinyin: "bìng lì běn" }
                ],
                environment: [
                    { hanzi: "病房", pinyin: "bìng fáng" },
                    { hanzi: "候诊室", pinyin: "hòu zhěn shì" },
                    { hanzi: "电梯", pinyin: "diàn tī" },
                    { hanzi: "指示牌", pinyin: "zhǐ shì pái" },
                    { hanzi: "窗", pinyin: "chuāng" }
                ]
            },
            "公园": {
                core: [
                    { hanzi: "滑梯", pinyin: "huá tī" },
                    { hanzi: "秋千", pinyin: "qiū qiān" },
                    { hanzi: "长椅", pinyin: "cháng yǐ" },
                    { hanzi: "花坛", pinyin: "huā tán" },
                    { hanzi: "喷泉", pinyin: "pēn quán" }
                ],
                items: [
                    { hanzi: "气球", pinyin: "qì qiú" },
                    { hanzi: "风筝", pinyin: "fēng zheng" },
                    { hanzi: "足球", pinyin: "zú qiú" },
                    { hanzi: "自行车", pinyin: "zì xíng chē" },
                    { hanzi: "冰淇淋", pinyin: "bīng qí lín" },
                    { hanzi: "饮料", pinyin: "yǐn liào" },
                    { hanzi: "面包", pinyin: "miàn bāo" },
                    { hanzi: "野餐垫", pinyin: "yě cān diàn" }
                ],
                environment: [
                    { hanzi: "树", pinyin: "shù" },
                    { hanzi: "草地", pinyin: "cǎo dì" },
                    { hanzi: "小路", pinyin: "xiǎo lù" },
                    { hanzi: "路灯", pinyin: "lù dēng" },
                    { hanzi: "垃圾桶", pinyin: "lā jī tǒng" }
                ]
            },
            "学校": {
                core: [
                    { hanzi: "老师", pinyin: "lǎo shī" },
                    { hanzi: "黑板", pinyin: "hēi bǎn" },
                    { hanzi: "课桌", pinyin: "kè zhuō" },
                    { hanzi: "讲台", pinyin: "jiǎng tái" },
                    { hanzi: "教室", pinyin: "jiào shì" }
                ],
                items: [
                    { hanzi: "书包", pinyin: "shū bāo" },
                    { hanzi: "铅笔", pinyin: "qiān bǐ" },
                    { hanzi: "橡皮", pinyin: "xiàng pí" },
                    { hanzi: "课本", pinyin: "kè běn" },
                    { hanzi: "笔记本", pinyin: "bǐ jì běn" },
                    { hanzi: "尺子", pinyin: "chǐ zi" },
                    { hanzi: "水彩笔", pinyin: "shuǐ cǎi bǐ" },
                    { hanzi: "地球仪", pinyin: "dì qiú yí" }
                ],
                environment: [
                    { hanzi: "操场", pinyin: "cāo chǎng" },
                    { hanzi: "图书馆", pinyin: "tú shū guǎn" },
                    { hanzi: "食堂", pinyin: "shí táng" },
                    { hanzi: "走廊", pinyin: "zǒu láng" },
                    { hanzi: "校门", pinyin: "xiào mén" }
                ]
            },
            "动物园": {
                core: [
                    { hanzi: "猴子", pinyin: "hóu zi" },
                    { hanzi: "大象", pinyin: "dà xiàng" },
                    { hanzi: "狮子", pinyin: "shī zi" },
                    { hanzi: "熊猫", pinyin: "xióng māo" },
                    { hanzi: "长颈鹿", pinyin: "cháng jǐng lù" }
                ],
                items: [
                    { hanzi: "香蕉", pinyin: "xiāng jiāo" },
                    { hanzi: "竹子", pinyin: "zhú zi" },
                    { hanzi: "苹果", pinyin: "píng guǒ" },
                    { hanzi: "胡萝卜", pinyin: "hú luó bo" },
                    { hanzi: "水桶", pinyin: "shuǐ tǒng" },
                    { hanzi: "饲料", pinyin: "sì liào" },
                    { hanzi: "围栏", pinyin: "wéi lán" },
                    { hanzi: "笼子", pinyin: "lóng zi" }
                ],
                environment: [
                    { hanzi: "水池", pinyin: "shuǐ chí" },
                    { hanzi: "假山", pinyin: "jiǎ shān" },
                    { hanzi: "草地", pinyin: "cǎo dì" },
                    { hanzi: "指示牌", pinyin: "zhǐ shì pái" },
                    { hanzi: "商店", pinyin: "shāng diàn" }
                ]
            },
            "家庭": {
                core: [
                    { hanzi: "爸爸", pinyin: "bà ba" },
                    { hanzi: "妈妈", pinyin: "mā ma" },
                    { hanzi: "沙发", pinyin: "shā fā" },
                    { hanzi: "电视", pinyin: "diàn shì" },
                    { hanzi: "餐桌", pinyin: "cān zhuō" }
                ],
                items: [
                    { hanzi: "玩具", pinyin: "wán jù" },
                    { hanzi: "图书", pinyin: "tú shū" },
                    { hanzi: "抱枕", pinyin: "bào zhěn" },
                    { hanzi: "水杯", pinyin: "shuǐ bēi" },
                    { hanzi: "果盘", pinyin: "guǒ pán" },
                    { hanzi: "遥控器", pinyin: "yáo kòng qì" },
                    { hanzi: "台灯", pinyin: "tái dēng" },
                    { hanzi: "电话", pinyin: "diàn huà" }
                ],
                environment: [
                    { hanzi: "门", pinyin: "mén" },
                    { hanzi: "窗", pinyin: "chuāng" },
                    { hanzi: "墙", pinyin: "qiáng" },
                    { hanzi: "地板", pinyin: "dì bǎn" },
                    { hanzi: "地毯", pinyin: "dì tǎn" }
                ]
            },
            "餐厅": {
                core: [
                    { hanzi: "服务员", pinyin: "fú wù yuán" },
                    { hanzi: "厨师", pinyin: "chú shī" },
                    { hanzi: "餐桌", pinyin: "cān zhuō" },
                    { hanzi: "椅子", pinyin: "yǐ zi" },
                    { hanzi: "菜单", pinyin: "cài dān" }
                ],
                items: [
                    { hanzi: "米饭", pinyin: "mǐ fàn" },
                    { hanzi: "面条", pinyin: "miàn tiáo" },
                    { hanzi: "汤", pinyin: "tāng" },
                    { hanzi: "筷子", pinyin: "kuài zi" },
                    { hanzi: "勺子", pinyin: "sháo zi" },
                    { hanzi: "盘子", pinyin: "pán zi" },
                    { hanzi: "杯子", pinyin: "bēi zi" },
                    { hanzi: "餐巾纸", pinyin: "cān jīn zhǐ" }
                ],
                environment: [
                    { hanzi: "厨房", pinyin: "chú fáng" },
                    { hanzi: "收银台", pinyin: "shōu yín tái" },
                    { hanzi: "洗手间", pinyin: "xǐ shǒu jiān" },
                    { hanzi: "招牌", pinyin: "zhāo pái" },
                    { hanzi: "花瓶", pinyin: "huā píng" }
                ]
            },
            "图书馆": {
                core: [
                    { hanzi: "图书", pinyin: "tú shū" },
                    { hanzi: "书架", pinyin: "shū jià" },
                    { hanzi: "管理员", pinyin: "guǎn lǐ yuán" },
                    { hanzi: "阅览桌", pinyin: "yuè lǎn zhuō" },
                    { hanzi: "电脑", pinyin: "diàn nǎo" }
                ],
                items: [
                    { hanzi: "故事书", pinyin: "gù shi shū" },
                    { hanzi: "杂志", pinyin: "zá zhì" },
                    { hanzi: "报纸", pinyin: "bào zhǐ" },
                    { hanzi: "铅笔", pinyin: "qiān bǐ" },
                    { hanzi: "笔记本", pinyin: "bǐ jì běn" },
                    { hanzi: "书包", pinyin: "shū bāo" },
                    { hanzi: "借书卡", pinyin: "jiè shū kǎ" },
                    { hanzi: "书签", pinyin: "shū qiān" }
                ],
                environment: [
                    { hanzi: "门", pinyin: "mén" },
                    { hanzi: "窗", pinyin: "chuāng" },
                    { hanzi: "椅子", pinyin: "yǐ zi" },
                    { hanzi: "时钟", pinyin: "shí zhōng" },
                    { hanzi: "垃圾桶", pinyin: "lā jī tǒng" }
                ]
            }
        };
    }

    /**
     * 生成完整的AI绘图提示词
     * @param {string} theme - 主题/场景
     * @param {string} title - 小报标题
     * @returns {string} 生成的提示词
     */
    generatePrompt(theme, title) {
        const words = this.getWordsForTheme(theme);

        return `请生成一张儿童识字小报《${theme}》，竖版 A4，学习小报版式，适合 5–9 岁孩子 认字与看图识物。

# 一、小报标题区（顶部）

**顶部居中大标题**：《${title}》
* **风格**：十字小报 / 儿童学习报感
* **文本要求**：大字、醒目、卡通手写体、彩色描边
* **装饰**：周围添加与 ${theme} 相关的贴纸风装饰，颜色鲜艳

# 二、小报主体（中间主画面）

画面中心是一幅 **卡通插画风的「${theme}」场景**：
* **整体气氛**：明亮、温暖、积极
* **构图**：物体边界清晰，方便对应文字，不要过于拥挤。

**场景分区与核心内容**
1.  **核心区域 A（主要对象）**：表现 ${theme} 的核心活动。
2.  **核心区域 B（配套设施）**：展示相关的工具或物品。
3.  **核心区域 C（环境背景）**：体现环境特征（如墙面、指示牌等）。

**主题人物**
* **角色**：1 位可爱卡通人物（职业/身份：与 ${theme} 匹配）。
* **动作**：正在进行与场景相关的自然互动。

# 三、必画物体与识字清单（Generated Content）

**请务必在画面中清晰绘制以下物体，并为其预留贴标签的位置：**

**1. 核心角色与设施：**
${this.formatWords(words.core)}

**2. 常见物品/工具：**
${this.formatWords(words.items)}

**3. 环境与装饰：**
${this.formatWords(words.environment)}

*(注意：画面中的物体数量不限于此，但以上列表必须作为重点描绘对象)*

# 四、识字标注规则

对上述清单中的物体，贴上中文识字标签：
* **格式**：两行制（第一行拼音带声调，第二行简体汉字）。
* **样式**：彩色小贴纸风格，白底黑字或深色字，清晰可读。
* **排版**：标签靠近对应的物体，不遮挡主体。

# 五、画风参数
* **风格**：儿童绘本风 + 识字小报风
* **色彩**：高饱和、明快、温暖 (High Saturation, Warm Tone)
* **质量**：8k resolution, high detail, vector illustration style, clean lines.`;
    }

    /**
     * 根据主题获取词汇列表
     * @param {string} theme - 主题
     * @returns {Object} 包含核心词汇、物品词汇、环境词汇的对象
     */
    getWordsForTheme(theme) {
        // 如果有预定义的词汇库，使用预定义的
        if (this.vocabularyDatabase[theme]) {
            return this.vocabularyDatabase[theme];
        }

        // 对于自定义主题，生成通用词汇
        return {
            core: [
                { hanzi: "人物", pinyin: "rén wù" },
                { hanzi: "设施", pinyin: "shè shī" },
                { hanzi: "设备", pinyin: "shè bèi" },
                { hanzi: "建筑", pinyin: "jiàn zhù" },
                { hanzi: "场所", pinyin: "chǎng suǒ" }
            ],
            items: [
                { hanzi: "物品", pinyin: "wù pǐn" },
                { hanzi: "工具", pinyin: "gōng jù" },
                { hanzi: "材料", pinyin: "cái liào" },
                { hanzi: "产品", pinyin: "chǎn pǐn" },
                { hanzi: "设备", pinyin: "shè bèi" },
                { hanzi: "用品", pinyin: "yòng pǐn" },
                { hanzi: "器具", pinyin: "qì jù" },
                { hanzi: "材料", pinyin: "cái liào" }
            ],
            environment: [
                { hanzi: "环境", pinyin: "huán jìng" },
                { hanzi: "装饰", pinyin: "zhuāng shì" },
                { hanzi: "标识", pinyin: "biāo shí" },
                { hanzi: "设施", pinyin: "shè shī" },
                { hanzi: "背景", pinyin: "bèi jǐng" }
            ]
        };
    }

    /**
     * 格式化词汇为字符串
     * @param {Array} words - 词汇数组
     * @returns {string} 格式化后的字符串
     */
    formatWords(words) {
        return words.map(word => `${word.pinyin} ${word.hanzi}`).join(', ');
    }

    /**
     * 获取所有可用主题列表
     * @returns {Array} 主题列表
     */
    getAvailableThemes() {
        return Object.keys(this.vocabularyDatabase);
    }

    /**
     * 添加自定义主题词汇
     * @param {string} theme - 主题名称
     * @param {Object} vocabulary - 词汇对象
     */
    addCustomTheme(theme, vocabulary) {
        this.vocabularyDatabase[theme] = vocabulary;
        // 保存到本地存储
        saveToLocalStorage('customThemes', this.vocabularyDatabase);
    }

    /**
     * 加载自定义主题词汇
     */
    loadCustomThemes() {
        const customThemes = loadFromLocalStorage('customThemes', {});
        this.vocabularyDatabase = { ...this.vocabularyDatabase, ...customThemes };
    }

    /**
     * 验证输入
     * @param {string} theme - 主题
     * @param {string} title - 标题
     * @returns {boolean} 是否有效
     */
    validateInput(theme, title) {
        if (!theme || theme.trim() === '') {
            showError('请输入主题或选择一个预设主题');
            return false;
        }

        if (!title || title.trim() === '') {
            showError('请输入小报标题');
            return false;
        }

        if (title.length > 50) {
            showError('标题长度不能超过50个字符');
            return false;
        }

        return true;
    }

    /**
     * 获取主题的词汇总数
     * @param {string} theme - 主题
     * @returns {number} 词汇总数
     */
    getWordCount(theme) {
        const words = this.getWordsForTheme(theme);
        return words.core.length + words.items.length + words.environment.length;
    }

    /**
     * 预览提示词（截取前200个字符）
     * @param {string} theme - 主题
     * @param {string} title - 标题
     * @returns {string} 提示词预览
     */
    previewPrompt(theme, title) {
        const fullPrompt = this.generatePrompt(theme, title);
        return fullPrompt.substring(0, 200) + '...';
    }
}

// 创建全局提示词生成器实例
const promptGenerator = new PromptGenerator();

// 页面加载时加载自定义主题
document.addEventListener('DOMContentLoaded', () => {
    promptGenerator.loadCustomThemes();
});