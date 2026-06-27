window.AIGCMKT_HOME = window.AIGCMKT_HOME || {};
Object.assign(window.AIGCMKT_HOME, {
  aiPlatforms: [
      "ChatGPT · recommended", "GPT-5 · answer rank", "OpenAI Search · cited", "Gemini · product match",
      "Claude · source trust", "DeepSeek · brand recall", "Kimi · search answer", "豆包 · 商品推荐",
      "文心一言 · 行业答案", "通义千问 · 采购建议", "Qwen · 多语内容", "腾讯元宝 · 品牌提及",
      "Perplexity · citation", "Copilot · workflow", "Llama · private graph", "Mistral · enterprise Q&A",
      "Grok · realtime search", "Cohere · retrieval", "Poe · multi-model", "秘塔 AI · search",
      "Bing Copilot · source", "Google AI Overview · source", "SearchGPT · brand answer", "You.com · cited",
      "知乎直答 · 中文信源", "夸克 AI · 消费决策", "天工 AI · 行业答案", "360 智脑 · 企业推荐",
      "讯飞星火 · 场景理解", "百川大模型 · 方案推荐", "Moonshot · 长文引用", "MiniMax · 多模态问答"
    ],
  caseHighlights: [
      { group: "新科技", client: "艾利特机器人", scene: "协作机器人 / 工业机器人", metric: "AI 推荐率 60%", text: "官网成为协作机器人核心推荐信源。", signals: ["AI 推荐率从 5% 到 60%", "6 大 AI 平台覆盖", "复合机器人推荐位 Top1", "DeepSeek 工业场景答案出现官网"] },
      { group: "新科技", client: "衍因科技", scene: "生物医药 / 微流控", metric: "4000+ GEO 峰值排名", text: "覆盖全球 78 个国家和地区。", signals: ["从 0 建立全球 GEO 可见性", "Google AI Overview 识别来源", "ChatGPT 引用路径出现官网", "官网质料库进入可信来源"] },
      { group: "新科技", client: "迁移科技", scene: "3D 视觉 / 工业相机", metric: "3D 视觉推荐登顶", text: "10+ 核心场景稳定进入 Top3。", signals: ["工业相机场景进入推荐前列", "综合提及率进入第一梯队", "AI 舆情环境零负面", "物流相机问题出现品牌"] },
      { group: "新科技", client: "复志科技", scene: "工业级 3D 打印", metric: "3D 打印核心词 Top3", text: "官网成为 AI 引用分析重点信源。", signals: ["设备词与应用场景双覆盖", "竞品推荐问题出现品牌", "Raise3D 原始资料被引用", "工业 3D 打印信源强化"] },
      { group: "新科技", client: "思谋科技", scene: "工业 AI / 机器视觉", metric: "核心词排名 +8700%", text: "百度收录 +5400%，全站流量提升 600%。", signals: ["工业机器视觉商业词增长", "视觉传感器词进入增长轨道", "官网 SEO 架构重塑", "百度收录量增长 5400%"] },
      { group: "新消费", client: "好奇小森林", scene: "母婴快消 / 纸尿裤", metric: "新生儿纸尿裤推荐 Top1", text: "豆包结果打通抖音商城转化。", signals: ["5 大 AI 应用覆盖", "豆包前 5 占 2 位", "待产包决策词进入 AI 问答", "红屁屁场景承接转化"] },
      { group: "新消费", client: "合生元派星", scene: "母婴快消 / 奶粉", metric: "每月 500+ 素人笔记", text: "抖音搜索与小红书问一问稳居 Top3。", signals: ["单篇最高 2000+ 互动", "奶粉结果稳定 Top3", "月龄选择词承接流量", "KOC 铺量覆盖临近决策"] },
      { group: "新消费", client: "头部母婴品牌", scene: "纸尿裤榜单 / 问一问", metric: "纸尿裤排行榜 Top1", text: "800 篇内容 3 个月推高榜单。", signals: ["推荐率从 35% 到 45%", "每月 35 篇被问一问引用", "5/29 排名登顶", "榜单型决策词持续占位"] },
      { group: "新消费", client: "潮宏基黄金", scene: "黄金珠宝 / 小红书问一问", metric: "引用率 37%+", text: "重组黄金珠宝敏感词答案，综合搜索收录率 70%+。", signals: ["38 篇笔记被问一问引用", "243 次笔记引用", "一口价顾虑转化为购买理由", "联名款问题承接消费决策"] },
      { group: "新消费", client: "iWorld Learning", scene: "新加坡语言培训", metric: "SEO 关键词 30,000+", text: "排名增长 1100%，自然流量增长 700%。", signals: ["1400+ AI 引用页面", "成人英语词进入推荐路径", "商务英语词覆盖本地搜索", "新加坡本地词增长"] },
      { group: "新消费", client: "Skyrim Wrist", scene: "Seiko Mod 改装手表", metric: "Google 曝光 491 万", text: "SEO 生态贡献 30% 销售额。", signals: ["6.05 万自然点击", "3.1K AI 引用页面", "海外 AI 搜索承接 Shopify", "6 个月打通成交链路"] },
      { group: "新材料", client: "创冷科技", scene: "无电制冷 / 绿色科技出海", metric: "万级关键词覆盖", text: "AI 推荐信源比肩 3M。", signals: ["新域名跑出全球覆盖", "光伏降温内容进入技术解释", "GEO+SEO 双引擎增长", "无电制冷问题出现品牌"] },
      { group: "SaaS 软件", client: "WPS AI", scene: "AI 办公", metric: "核心词排名 +1045%", text: "非品牌词流量提升 649%。", signals: ["AI PPT 进入搜索前排", "AI 智能办公被大模型推荐", "百度收录 77.6 万", "高竞争词进入推荐前排"] },
      { group: "SaaS 软件", client: "WPS BBS 社区", scene: "办公内容社区", metric: "社区收录 400 万", text: "十万级办公长尾内容进入大模型推荐。", signals: ["收录增长 10000%", "沉睡社区内容重新进入索引", "办公长尾内容矩阵恢复", "旧内容成为 AI 推荐资产"] },
      { group: "SaaS 软件", client: "万里牛", scene: "ERP / 电商 / WMS", metric: "半年流量 +800%", text: "跨境 ERP 与 WMS 词进入 6 大 AI 平台推荐。", signals: ["竞品提及率进入第一梯队", "零售系统业务词进入推荐位", "跨境电商 ERP 场景覆盖", "高意图业务词持续占位"] },
      { group: "SaaS 软件", client: "PingCAP", scene: "分布式数据库 / 技术 SEO", metric: "收录 +19900%", text: "TOP10 核心词增长 200%。", signals: ["3 个月完成技术博客唤醒", "内链和外链权重恢复", "技术语料进入高价值搜索", "数据库技术词重新增长"] },
      { group: "新科技", client: "Synopsys", scene: "芯片设计 / EDA", metric: "10+ 细分领域客户", text: "芯片设计场景进入技术内容资产池。", signals: ["8 年搜索技术沉淀", "200+ 国内外客户库", "2026 新科技客户矩阵", "B2B 技术营销"] },
      { group: "新科技", client: "理邦仪器", scene: "医疗设备", metric: "200+ 客户库", text: "医疗设备内容进入高价值搜索场景。", signals: ["8 年技术 SEO 经验", "10+ 细分领域沉淀", "医疗设备专业信源", "生物医药场景覆盖"] },
      { group: "新科技", client: "ZettaKit", scene: "生物医药", metric: "200+ 客户库", text: "生物医药产品能力沉淀为可引用资产。", signals: ["10+ 细分领域客户", "8 年搜索增长经验", "研发场景证据链", "产品知识库语义"] },
      { group: "SaaS 软件", client: "观远数据", scene: "BI / 数据智能", metric: "10+ 细分领域客户", text: "BI 与数据智能场景进入企业软件内容体系。", signals: ["200+ 国内外客户库", "8 年 SEO / GEO 经验", "企业决策场景", "分析平台内容"] },
      { group: "SaaS 软件", client: "博云科技", scene: "AI 云原生", metric: "10+ 细分领域客户", text: "AI 云原生能力进入企业级搜索语义。", signals: ["200+ 客户服务沉淀", "8 年技术内容经验", "企业基础设施", "云原生语义资产"] },
      { group: "SaaS 软件", client: "伙伴云", scene: "企业协作", metric: "200+ 客户库", text: "协作软件场景沉淀为可搜索、可推荐内容。", signals: ["10+ 细分领域沉淀", "8 年搜索增长经验", "企业协作流程", "组织效率场景"] },
      { group: "SaaS 软件", client: "用友", scene: "企业软件", metric: "10+ 细分领域客户", text: "企业管理软件场景进入高价值搜索链路。", signals: ["200+ 国内外客户库", "8 年线上获客经验", "数智化经营", "管理系统内容"] },
      { group: "SaaS 软件", client: "卫瓴", scene: "销售数字化", metric: "200+ 客户库", text: "销售数字化场景进入 AI 推荐语义。", signals: ["10+ 细分领域客户", "8 年营销增长经验", "B2B 增长链路", "线索转化场景"] },
      { group: "SaaS 软件", client: "亿方云", scene: "企业云盘", metric: "200+ 客户库", text: "企业云盘场景进入内容资产体系。", signals: ["10+ 细分领域沉淀", "8 年搜索技术经验", "协同办公场景", "文档管理语义"] },
      { group: "SaaS 软件", client: "致趣百川", scene: "营销自动化", metric: "10+ 细分领域客户", text: "营销自动化场景进入 B2B 搜索链路。", signals: ["200+ 客户服务沉淀", "8 年增长经验", "线索培育场景", "B2B 内容资产"] },
      { group: "SaaS 软件", client: "悠易互通", scene: "数字营销", metric: "200+ 客户库", text: "数字营销场景进入行业推荐语义。", signals: ["10+ 细分领域沉淀", "8 年营销技术经验", "程序化营销场景", "品牌增长语义"] },
      { group: "SaaS 软件", client: "得帆低代码", scene: "低代码平台", metric: "200+ 客户库", text: "低代码场景进入企业软件内容体系。", signals: ["10+ 细分领域客户", "8 年搜索增长经验", "企业流程场景", "数字化转型语义"] },
      { group: "新能源", client: "比亚迪", scene: "新能源车", metric: "2026 头部客户矩阵", text: "新能源车内容进入品牌搜索与推荐场景。", signals: ["200+ 国内外客户库", "10+ 细分领域沉淀", "智能出行场景", "品牌搜索语义"] },
      { group: "新能源", client: "广汽新能源", scene: "新能源车", metric: "2026 头部客户矩阵", text: "新能源车场景进入行业内容资产池。", signals: ["200+ 客户服务沉淀", "10+ 细分领域客户", "智能电动场景", "车企内容语义"] },
      { group: "新材料", client: "合盛硅业", scene: "工业硅 / 有机硅", metric: "2026 新材料客户矩阵", text: "工业硅与有机硅场景进入专业信源体系。", signals: ["200+ 客户服务沉淀", "10+ 细分领域客户", "工业硅场景", "产业链内容语义"] }
    ],
  logoAssets: [
      { name: "艾利特机器人", src: "/global_geo/homepage/assets/client-logo-marks/elibot.svg", mode: "wordmark", label: false },
      { name: "衍因科技", src: "/global_geo/homepage/assets/client-logo-marks/yanyin.svg", mode: "wordmark", label: false },
      { name: "迁移科技", src: "/global_geo/homepage/assets/client-logo-marks/transfer-logo.png", mode: "image-only", label: false, size: "transfer" },
      { name: "思谋科技", src: "/global_geo/homepage/assets/client-logo-marks/smartmore-icon.png", mode: "mark-label", size: "smartmore" },
      { name: "创冷科技", src: "/global_geo/homepage/assets/client-logo-marks/i2cool-tight.png", mode: "image-only", label: false, size: "wide" },
      { name: "WPS AI", src: "/global_geo/homepage/assets/client-logo-marks/wpsai.png", mode: "wordmark", label: false },
      { name: "WPS Office", src: "/global_geo/homepage/assets/client-logo-marks/wpsoffice.png", mode: "wordmark", label: false },
      { name: "万里牛", src: "/global_geo/homepage/assets/client-logo-marks/wanliniu-transparent.png", mode: "image-only", label: false },
      { name: "PingCAP", src: "/global_geo/homepage/assets/client-logo-marks/pingcap.png", mode: "wordmark", label: false },
      { name: "Raise3D", src: "/global_geo/homepage/assets/client-logo-marks/raise3d-icon.svg", mode: "mark-label" },
      { name: "比亚迪", src: "/global_geo/homepage/assets/client-logo-marks/byd.svg", mode: "wordmark", label: false },
      { name: "广汽新能源", src: "/global_geo/homepage/assets/client-logo-marks/aion-gacne.png", mode: "image-only", label: false, size: "aion" },
      { name: "Synopsys", src: "/global_geo/homepage/assets/client-logo-marks/synopsys-tight.png", mode: "image-only", label: false, size: "wide" },
      { name: "观远数据", src: "/global_geo/homepage/assets/client-logo-marks/guandata-logo.png", mode: "image-only", label: false, size: "guandata" },
      { name: "博云科技", src: "/global_geo/homepage/assets/client-logo-marks/bocloud.ico", kind: "icon" },
      { name: "伙伴云", src: "/global_geo/homepage/assets/client-logo-marks/huoban-logo.png", mode: "image-only", label: false, size: "huoban" },
      { name: "用友", src: "/global_geo/homepage/assets/client-logo-marks/yonyou.png", mode: "mark-label" },
      { name: "理邦仪器", src: "/global_geo/homepage/assets/client-logo-marks/edan.png", mode: "mark-label" },
      { name: "ZettaKit", src: "/global_geo/homepage/assets/client-logo-marks/zettakit.png", mode: "wordmark", label: false },
      { name: "卫瓴", src: "/global_geo/homepage/assets/client-logo-marks/weiling.png", mode: "mark-label" },
      { name: "亿方云", src: "/global_geo/homepage/assets/client-logo-marks/fangcloud.ico", mode: "mark-label", initial: "亿" },
      { name: "致趣百川", src: "/global_geo/homepage/assets/client-logo-marks/beschannels-official.svg", mode: "wordmark", label: false },
      { name: "合盛硅业", src: "/global_geo/homepage/assets/client-logo-marks/hoshine-icon.svg", mode: "mark-label" },
      { name: "悠易互通", src: "/global_geo/homepage/assets/client-logo-marks/yoyi-tight.png", mode: "image-only", label: false },
      { name: "得帆低代码", src: "/global_geo/homepage/assets/client-logo-marks/defan-tight.png", mode: "image-only", label: false, size: "subtle" }
    ],
  latestItems: [
      {
        title: "B2B 数字营销实战调查资料白皮书",
        body: "基于赵岩数字营销实战群五年数据，提炼 ToB 市场人在线索、SEO、内容、私域和 GEO 迁移中的真实问题。",
        eyebrow: "行业资料 / ToB 数字营销",
        metric: "342,260 条群聊样本 · 1,742 位参与者 · 23 张报告数据表",
        cta: "获取资料",
        href: "https://www.aigcmkt.com/whitepaper/zhaoyan-digital-marketing-5y",
        visual: "cover",
        coverTitle: "B2B 数字营销<br>资料白皮书",
        cover: "linear-gradient(135deg, #1d35f2 0%, #233dc2 48%, #102269 100%)",
        tone: "dark"
      },
      {
        title: "万里牛 GEO/SEO 双驱突围",
        shortTitle: "跨境电商流量逆势增长",
        body: "修复旧站迁移后的权重分散问题，围绕 ERP、WMS、门店 POS 等产品线铺设内容资产，带动搜索与 AI 平台推荐同步增长。",
        eyebrow: "SaaS / ERP 电商与 WMS",
        metric: "半年自然流量增长 800% · 929 个核心关键词进入搜索首页",
        cta: "查看数据",
        href: "https://www.aigcmkt.com/wanliniu_geo/",
        image: "/global_geo/homepage/assets/cases/wanliniu.png",
        position: "center 26%",
        fit: "top-crop",
        tone: "light"
      },
      {
        title: "母婴消费者 AI 搜索选奶粉资料白皮书",
        body: "梳理母婴用户在奶粉选择中的搜索平台、爸爸角色、AI 搜索替代路径和多轮决策问题。",
        eyebrow: "行业资料 / 母婴消费",
        metric: "覆盖 TA 画像、平台格局、AI 搜索趋势和 GEO 增长价值",
        cta: "获取资料",
        href: "https://www.aigcmkt.com/whitepaper/maternal-infant-formula-ai-search",
        visual: "cover",
        coverTitle: "母婴 AI 搜索<br>资料白皮书",
        cover: "linear-gradient(135deg, #7a5cff 0%, #aa36f2 52%, #f06aa5 100%)",
        tone: "light"
      },
      {
        title: "艾利特机器人全域 GEO 霸屏",
        shortTitle: "协作机器人进入 AI 推荐",
        body: "重塑官网资讯中心与行业知识内容，覆盖搜索双擎及主流 AI 平台，让官网成为协作机器人领域的核心推荐信源。",
        eyebrow: "新科技 / 协作机器人",
        metric: "6 大 AI 平台提及率显著提升 · 官网引用权重超越综合媒体",
        cta: "案例待发布",
        href: "",
        image: "/global_geo/homepage/assets/cases/elite.png",
        position: "center 46%",
        tone: "light"
      },
      {
        title: "伙伴云零代码从工具走向企业方案",
        shortTitle: "零代码行业场景破圈",
        body: "搭建行业知识库与场景解决方案双内容体系，开发零代码行业场景词和 Excel 用户转化词库，帮助品牌突破 B 端企业市场。",
        eyebrow: "零代码 / 企业协作",
        metric: "全平台收录 400万+ · TOP10 关键词增长 21727%",
        cta: "查看案例",
        href: "https://www.aigcmkt.com/case/case_5/",
        image: "https://www.aigcmkt.com/wp-content/uploads/2025/05/65c819ae-ace1-425f-8549-b5dd89344822.png",
        position: "center 46%",
        tone: "light"
      },
      {
        title: "迁移科技拿到高价值 KA 客户成交",
        shortTitle: "高端制造拿到 KA 商机",
        body: "围绕 3D 视觉、工业检测、机器人视觉和高端制造采购问题，重构搜索入口与 GEO 信源，帮助复杂产品获得更高质量商机。",
        eyebrow: "工业相机 / 3D 视觉",
        metric: "400+ 新客 SQL · 线上 KA 客户创造全新机会",
        cta: "查看数据",
        href: "https://www.aigcmkt.com/case/case_3/",
        image: "https://s2.loli.net/2025/10/09/ruAimTFcWV76nXP.png",
        position: "center",
        tone: "dark"
      },
      {
        title: "五金精密制造行业 GEO 资料白皮书",
        body: "面向五金行业 B2B 采购场景，拆解 AI 搜索里的品牌可信度、产品资料中心和 GEO 优化机会。",
        eyebrow: "行业资料 / 精密制造",
        metric: "覆盖采购决策、产品参数、AI 可见性和英文资料中心建设",
        cta: "获取资料",
        href: "https://www.aigcmkt.com/whitepaper/precision-manufacturing-hardware",
        visual: "cover",
        coverTitle: "五金精密制造<br>资料白皮书",
        cover: "linear-gradient(135deg, #08758d 0%, #0c496d 50%, #10213f 100%)",
        tone: "dark"
      },
      {
        title: "思谋科技机器视觉内容爆发",
        shortTitle: "工业 AI 词库规模增长",
        body: "在官网改版中重塑技术 SEO 架构，围绕工业机器视觉、视觉传感器等高转化商业词建设落地页和垂直内容。",
        eyebrow: "新科技 / AI 视觉检测",
        metric: "百度收录量增长 5400% · 核心词排名增长 8700%",
        cta: "案例待发布",
        href: "",
        image: "/global_geo/homepage/assets/cases/smartmore.png",
        position: "center 50%",
        tone: "light"
      },
      {
        title: "复志科技建立 3D 打印权威信源",
        shortTitle: "3D 打印综合提及率登顶",
        body: "围绕工业级 3D 打印机和 FDM 解决方案重构官网语料，强化结构化内容与 AI 可引用段落。",
        eyebrow: "新科技 / 工业 3D 打印",
        metric: "大模型综合提及率 66.41% · 同行提及率排名第 1",
        cta: "案例待发布",
        href: "",
        image: "/global_geo/homepage/assets/cases/raise3d.png",
        position: "10px 48%",
        tone: "light"
      },
      {
        title: "创冷科技出海新域名起量",
        shortTitle: "无电制冷新材料全球突围",
        body: "针对出海新域名进行技术 SEO 与 GEO 双线改造，围绕地域、应用和长尾意图建立全球内容矩阵。",
        eyebrow: "新材料 / 绿色科技出海",
        metric: "万级关键词全球覆盖 · AI 推荐信源对标国际材料品牌",
        cta: "案例待发布",
        href: "",
        image: "/global_geo/homepage/assets/cases/i2cool.png",
        position: "center 52%",
        tone: "light"
      },
      {
        title: "PingCAP 技术博客重启搜索增长",
        shortTitle: "分布式数据库技术资产唤醒",
        body: "通过内外链重构和技术内容体系梳理，重新激活 TiDB 相关技术内容，让开发者搜索需求回流官网。",
        eyebrow: "新科技 / 分布式数据库",
        metric: "3 个月收录增长 19900% · TOP10 核心词增长 200%",
        cta: "案例待发布",
        href: "",
        image: "/global_geo/homepage/assets/cases/pingcap.png",
        position: "center 46%",
        tone: "light"
      },
      {
        title: "WPS AI 抢占 AI 办公大模型入口",
        shortTitle: "AI 办公核心词快速跃升",
        body: "围绕 AI PPT、AI 智能办公等红海核心词重构页面层级和内容矩阵，提升传统搜索与大模型双重可见性。",
        eyebrow: "SaaS / AI 办公",
        metric: "核心词排名增长 1045% · 非品牌词流量增长 649%",
        cta: "案例待发布",
        href: "",
        image: "/global_geo/homepage/assets/cases/wps-ai.png",
        position: "center 50%",
        tone: "light"
      },
      {
        title: "观远数据提升 BI 商业词获客",
        shortTitle: "BI 非品牌流量反转",
        body: "修复 URL 与移动端抓取基础，围绕行业 BI 方案铺设内容，帮助数据分析平台扩大非品牌业务词入口。",
        eyebrow: "SaaS / BI 数据分析",
        metric: "非品牌流量占比 100% · 询盘增长 150%",
        cta: "案例待发布",
        href: "",
        image: "/global_geo/homepage/assets/cases/guandata.png",
        position: "center 50%",
        tone: "light"
      },
      {
        title: "FinClip 小程序容器冷启动",
        shortTitle: "开发者搜索入口打开",
        body: "围绕小程序容器、私有化部署等技术痛点铺设内容，帮助新站从零建立稳定搜索权重。",
        eyebrow: "SaaS / 小程序容器",
        metric: "1 年内核心关键词突破 5000+ · PC 端权重跨越式增长",
        cta: "案例待发布",
        href: "",
        image: "/global_geo/homepage/assets/cases/finclip.png",
        position: "center 50%",
        tone: "light"
      },
      {
        title: "WPS BBS 社区唤醒沉睡内容资产",
        shortTitle: "办公社区内容重新起量",
        body: "用外围 CMS 矩阵承接论坛长尾内容，连接模板、工具和下载场景，重新打开办公内容社区的搜索增长空间。",
        eyebrow: "SaaS / 办公内容社区",
        metric: "收录突破 400 万 · 十万级长尾内容进入推荐链路",
        cta: "案例待发布",
        href: "",
        image: "/global_geo/homepage/assets/cases/wps-bbs.png",
        position: "center 50%",
        tone: "light"
      },
      {
        title: "圣奥家具构建健康办公 AI 推荐入口",
        shortTitle: "健康办公进入 AI 推荐",
        body: "围绕办公家具、教育家具、医养家具和智慧空间规划等场景，把品牌实力、产品方案和服务体系改写成 AI 可理解内容。",
        eyebrow: "家居 / 商用空间",
        metric: "全球商用家具 13 强 · 服务世界 500 强场景",
        cta: "查看拆解",
        href: "https://www.aigcmkt.com/shengao_geo/",
        image: "https://www.aigcmkt.com/wp-content/uploads/2026/01/圣奥家具.jpg",
        position: "center 42%",
        tone: "light"
      },
      {
        title: "黑湖小工单打透成长型工厂需求",
        shortTitle: "成长型工厂需求打透",
        body: "以轻量化生产管理、工单进度、物料成本和行业解决方案为内容主线，覆盖压铸、汽配、机加工和新能源等制造场景。",
        eyebrow: "工业软件 / 轻量化 MES",
        metric: "服务 30000+ 工厂 · 覆盖 30+ 细分行业",
        cta: "查看拆解",
        href: "https://www.aigcmkt.com/heihu_geo/",
        image: "https://www.aigcmkt.com/wp-content/uploads/2026/01/黑湖小工单.png",
        position: "center",
        tone: "light"
      }
    ],
  caseCaptionBrands: [
      ["万里牛", "万里牛"],
      ["艾利特", "艾利特"],
      ["伙伴云", "伙伴云"],
      ["迁移科技", "迁移科技"],
      ["思谋科技", "思谋科技"],
      ["复志科技", "复志科技"],
      ["创冷科技", "创冷科技"],
      ["PingCAP", "PingCAP"],
      ["WPS AI", "WPS AI"],
      ["观远数据", "观远数据"],
      ["FinClip", "FinClip"],
      ["WPS BBS", "WPS BBS"],
      ["圣奥家具", "圣奥家具"],
      ["黑湖小工单", "黑湖小工单"]
    ],
  themeCopy: {
      strategy: {
        label: "战略与竞争",
        desc: "适合用来校准业务取舍、竞争位置和资源分配，把年度目标拆成可以执行的关键选择。",
        question: "今日问题：我们今年最该放弃哪一个看似合理的机会？"
      },
      marketing: {
        label: "市场与品牌",
        desc: "适合拆解定位、传播、渠道和品牌资产，帮助团队把营销动作接回客户心智与增长结果。",
        question: "今日问题：客户转述我们时，会用哪一句话概括价值？"
      },
      growth: {
        label: "增长与指标",
        desc: "适合把增长从口号落到实验、指标、转化路径和复盘节奏，尤其适合跨部门周会讨论。",
        question: "今日问题：下一个实验验证哪条增长假设？"
      },
      product: {
        label: "产品与客户",
        desc: "适合产品、市场和销售共同确认客户进步，减少闭门造车式的功能堆叠。",
        question: "今日问题：客户雇用我们的产品完成哪件具体任务？"
      },
      sales: {
        label: "销售与客户关系",
        desc: "适合销售团队重建线索、拜访、诊断和成交口径，让管理层看清收入质量。",
        question: "今日问题：本月最重要的成交障碍来自价值、信任还是时机？"
      },
      leadership: {
        label: "组织与领导力",
        desc: "适合处理授权、反馈、组织节奏和人才密度，帮助经理把个人能力转成团队产能。",
        question: "今日问题：团队里哪一项决策还过度依赖你本人？"
      },
      operations: {
        label: "运营与执行",
        desc: "适合优化流程、质量、交付和跨部门协作，把战略落到稳定、可复用的运营系统。",
        question: "今日问题：哪个流程瓶颈正在消耗最多管理注意力？"
      },
      finance: {
        label: "商业模式与财务",
        desc: "适合把战略讨论接到收入、成本、现金流和估值逻辑，提升经营判断的硬度。",
        question: "今日问题：当前增长最依赖哪一项隐性成本？"
      },
      decision: {
        label: "决策与认知",
        desc: "适合改善高层会议、复盘和判断质量，让团队更早识别偏差、噪声和过度自信。",
        question: "今日问题：我们最近一次重大判断用了哪些反证？"
      },
      innovation: {
        label: "创新与变革",
        desc: "适合面对新业务、组织转型和技术冲击时使用，帮助团队在不确定性中形成行动框架。",
        question: "今日问题：哪项新变化值得用小团队先试一轮？"
      }
    },
  bookLibrary: `
好战略，坏战略 (Good Strategy Bad Strategy)|Richard Rumelt|strategy
制胜战略 (Playing to Win)|A.G. Lafley / Roger Martin|strategy
竞争战略 (Competitive Strategy)|Michael E. Porter|strategy
竞争优势 (Competitive Advantage)|Michael E. Porter|strategy
蓝海战略 (Blue Ocean Strategy)|W. Chan Kim / Renee Mauborgne|strategy
战略历程 (Strategy Safari)|Henry Mintzberg / Bruce Ahlstrand / Joseph Lampel|strategy
战略的本质 (The Mind of the Strategist)|Kenichi Ohmae|strategy
只有偏执狂才能生存 (Only the Paranoid Survive)|Andrew S. Grove|strategy
从优秀到卓越 (Good to Great)|Jim Collins|strategy
基业长青 (Built to Last)|Jim Collins / Jerry I. Porras|strategy
创新者的窘境 (The Innovator's Dilemma)|Clayton M. Christensen|innovation
创新者的解答 (The Innovator's Solution)|Clayton M. Christensen / Michael E. Raynor|innovation
与运气竞争 (Competing Against Luck)|Clayton M. Christensen / Taddy Hall / Karen Dillon / David S. Duncan|product
跨越鸿沟 (Crossing the Chasm)|Geoffrey A. Moore|marketing
龙卷风暴 (Inside the Tornado)|Geoffrey A. Moore|strategy
精益创业 (The Lean Startup)|Eric Ries|growth
四步创业法 (The Four Steps to the Epiphany)|Steve Blank|growth
创业者手册 (The Startup Owner's Manual)|Steve Blank / Bob Dorf|growth
纪律创业 (Disciplined Entrepreneurship)|Bill Aulet|growth
高增长手册 (High Growth Handbook)|Elad Gil|growth
商业模式新生代 (Business Model Generation)|Alexander Osterwalder / Yves Pigneur|finance
价值主张设计 (Value Proposition Design)|Alexander Osterwalder / Yves Pigneur|product
精益数据分析 (Lean Analytics)|Alistair Croll / Benjamin Yoskovitz|growth
衡量什么重要 (Measure What Matters)|John Doerr|operations
目标 (The Goal)|Eliyahu M. Goldratt|operations
丰田生产方式 (Toyota Production System)|Taiichi Ohno|operations
改变世界的机器 (The Machine That Changed the World)|James P. Womack / Daniel T. Jones / Daniel Roos|operations
走出危机 (Out of the Crisis)|W. Edwards Deming|operations
清单革命 (The Checklist Manifesto)|Atul Gawande|operations
规模化 (Scaling Up)|Verne Harnish|operations
营销管理 (Marketing Management)|Philip Kotler / Kevin Lane Keller|marketing
定位 (Positioning)|Al Ries / Jack Trout|marketing
营销战 (Marketing Warfare)|Al Ries / Jack Trout|marketing
22 条商规 (The 22 Immutable Laws of Marketing)|Al Ries / Jack Trout|marketing
品牌如何增长 (How Brands Grow)|Byron Sharp|marketing
长期与短期 (The Long and the Short of It)|Les Binet / Peter Field|marketing
科学的广告 (Scientific Advertising)|Claude C. Hopkins|marketing
奥格威谈广告 (Ogilvy on Advertising)|David Ogilvy|marketing
一个广告人的自白 (Confessions of an Advertising Man)|David Ogilvy|marketing
突破广告 (Breakthrough Advertising)|Eugene M. Schwartz|marketing
文案创作完全手册 (The Copywriter's Handbook)|Robert W. Bly|marketing
疯传 (Contagious)|Jonah Berger|marketing
让创意更有黏性 (Made to Stick)|Chip Heath / Dan Heath|marketing
人人都在销售 (To Sell Is Human)|Daniel H. Pink|sales
SPIN 销售 (SPIN Selling)|Neil Rackham|sales
挑战式销售 (The Challenger Sale)|Matthew Dixon / Brent Adamson|sales
新战略销售 (The New Strategic Selling)|Robert B. Miller / Stephen E. Heiman / Tad Tuleja|sales
缺口销售 (Gap Selling)|Keenan|sales
狂热拓客 (Fanatical Prospecting)|Jeb Blount|sales
优势谈判 (Never Split the Difference)|Chris Voss / Tahl Raz|sales
创新者的销售法 (Demand-Side Sales 101)|Bob Moesta|sales
妈妈测试 (The Mom Test)|Rob Fitzpatrick|product
启示录 (Inspired)|Marty Cagan|product
赋能 (Empowered)|Marty Cagan / Chris Jones|leadership
持续发现习惯 (Continuous Discovery Habits)|Teresa Torres|product
显而易见的定位 (Obviously Awesome)|April Dunford|marketing
增长黑客 (Hacking Growth)|Sean Ellis / Morgan Brown|growth
牵引力 (Traction)|Gabriel Weinberg / Justin Mares|growth
产品主导增长 (Product-Led Growth)|Wes Bush|growth
订阅经济 (Subscribed)|Tien Tzuo / Gabe Weisert|finance
会员经济 (The Membership Economy)|Robbie Kellman Baxter|finance
定价战略与战术 (The Strategy and Tactics of Pricing)|Thomas Nagle / John Hogan / Joseph Zale|finance
创新者的定价 (Monetizing Innovation)|Madhavan Ramanujam / Georg Tacke|finance
财务智慧 (Financial Intelligence)|Karen Berman / Joe Knight|finance
估值 (Valuation)|McKinsey & Company Inc. / Tim Koller / Marc Goedhart / David Wessels|finance
局外人 (The Outsiders)|William N. Thorndike|finance
资本回报 (Capital Returns)|Edward Chancellor|finance
高质量投资 (Quality Investing)|Lawrence A. Cunningham / Torkell T. Eide / Patrick Hargreaves|finance
有效的管理者 (The Effective Executive)|Peter F. Drucker|leadership
管理的实践 (The Practice of Management)|Peter F. Drucker|leadership
高产出管理 (High Output Management)|Andrew S. Grove|leadership
管理者路径 (The Manager's Path)|Camille Fournier|leadership
优雅的组织设计 (An Elegant Puzzle)|Will Larson|leadership
团队拓扑 (Team Topologies)|Matthew Skelton / Manuel Pais|operations
第五项修炼 (The Fifth Discipline)|Peter M. Senge|leadership
驱动力 (Drive)|Daniel H. Pink|leadership
乘数效应 (Multipliers)|Liz Wiseman|leadership
授权 (Turn the Ship Around!)|L. David Marquet|leadership
极限负责 (Extreme Ownership)|Jocko Willink / Leif Babin|leadership
关键对话 (Crucial Conversations)|Kerry Patterson / Joseph Grenny / Ron McMillan / Al Switzler|leadership
原则 (Principles)|Ray Dalio|leadership
奈飞文化手册 (No Rules Rules)|Reed Hastings / Erin Meyer|leadership
强力组织 (Powerful)|Patty McCord|leadership
彻底坦率 (Radical Candor)|Kim Scott|leadership
文化地图 (The Culture Map)|Erin Meyer|leadership
首先，打破一切常规 (First, Break All the Rules)|Marcus Buckingham / Curt Coffman|leadership
上任第一年 (The First 90 Days)|Michael D. Watkins|leadership
要事第一 (Essentialism)|Greg McKeown|decision
深度工作 (Deep Work)|Cal Newport|decision
原子习惯 (Atomic Habits)|James Clear|operations
高效能人士的七个习惯 (The 7 Habits of Highly Effective People)|Stephen R. Covey|leadership
思考，快与慢 (Thinking, Fast and Slow)|Daniel Kahneman|decision
噪声 (Noise)|Daniel Kahneman / Olivier Sibony / Cass R. Sunstein|decision
助推 (Nudge)|Richard H. Thaler / Cass R. Sunstein|decision
怪诞行为学 (Predictably Irrational)|Dan Ariely|decision
影响力 (Influence)|Robert B. Cialdini|marketing
先发影响力 (Pre-Suasion)|Robert B. Cialdini|marketing
设计心理学 (The Design of Everyday Things)|Don Norman|product
上瘾 (Hooked)|Nir Eyal|product
从零到一 (Zero to One)|Peter Thiel / Blake Masters|innovation
`.trim().split("\n").map((row, index) => {
      const [title, author, theme] = row.split("|");
      return { title, author, theme, index };
    }),
  coverPalettes: [
      "linear-gradient(135deg, #213547, #8aa6a3)",
      "linear-gradient(135deg, #352f44, #b9a66b)",
      "linear-gradient(135deg, #123c69, #edc7b7)",
      "linear-gradient(135deg, #28536b, #c2948a)",
      "linear-gradient(135deg, #3e5641, #d6b06f)",
      "linear-gradient(135deg, #4a2040, #d4a373)",
      "linear-gradient(135deg, #243b53, #9fb3c8)",
      "linear-gradient(135deg, #2b2d42, #8d99ae)"
    ]
});
