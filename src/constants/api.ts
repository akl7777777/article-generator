// src/constants/api.ts
export const DEFAULT_OPENAI_URL = 'https://api.openai.com/v1/chat/completions';
export const DEFAULT_MODEL = 'gpt-3.5-turbo';
// src/constants/api.ts
export const API_CONSTANTS = {
    // OpenAI 配置
    OPENAI: {
        DEFAULT_URL: 'https://api.openai.com/v1/chat/completions',
        MODELS: {
            GPT35: 'gpt-3.5-turbo',
            GPT35_16K: 'gpt-3.5-turbo-16k',
            GPT4: 'gpt-4',
            GPT4_32K: 'gpt-4-32k',
        },
        MAX_TOKENS: {
            'gpt-3.5-turbo': 4096,
            'gpt-3.5-turbo-16k': 16384,
            'gpt-4': 8192,
            'gpt-4-32k': 32768,
        }
    },

    // API 调用配置
    REQUEST: {
        TIMEOUT: 30000, // 30 秒超时
        RETRY_TIMES: 3,  // 重试次数
        RETRY_DELAY: 1000, // 重试延迟（毫秒）
    },

    // 温度设置
    TEMPERATURE: {
        CREATIVE: 0.8,   // 创意写作
        BALANCED: 0.5,   // 平衡模式
        PRECISE: 0.2,    // 精确模式
    }
};

// 错误消息
export const API_ERROR_MESSAGES = {
    INVALID_API_KEY: '无效的 API Key',
    RATE_LIMIT: '请求太频繁，请稍后再试',
    CONTEXT_LENGTH: '内容太长，请减少输入长度',
    NETWORK_ERROR: '网络错误，请检查网络连接',
};

// 提示词模板
export const PROMPT_TEMPLATES = {
    OUTLINE: (topic: string) => `
请为主题"${topic}"生成一个详细的研究性文章大纲，包含以下部分：
1. 引言
2. 文献综述
3. 研究方法
4. 结果分析
5. 结论与建议
`,

    CONTENT: (topic: string, outline: string) => `
请根据以下大纲，为主题"${topic}"生成一篇专业的学术文章：

${outline}

要求：
1. 每个章节要有详细的论述
2. 注意学术用语的准确性
3. 保持逻辑连贯性
`,
};
