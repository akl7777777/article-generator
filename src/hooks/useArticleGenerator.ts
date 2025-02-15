// src/hooks/useArticleGenerator.ts
import { useState, useCallback } from 'react';
import type { GenerationOptions } from '../types';

const DEFAULT_OPENAI_URL = 'https://api.openai.com/v1/chat/completions';
const DEFAULT_MODEL = 'gpt-3.5-turbo';

export const useArticleGenerator = (options: GenerationOptions = {}) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // 处理API请求的通用函数
    const makeAPIRequest = async (messages: any[], config: GenerationOptions) => {
        const apiConfig = config.apiConfig;
        if (!apiConfig?.apiKey) {
            throw new Error('请提供 API Key');
        }

        const apiUrl = apiConfig.url || DEFAULT_OPENAI_URL;
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...apiConfig.headers
        };

        // 根据不同提供商设置认证头
        if (apiConfig.provider === 'openai') {
            headers['Authorization'] = `Bearer ${apiConfig.apiKey}`;
        } else {
            headers['x-api-key'] = apiConfig.apiKey;
        }

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                model: apiConfig.model || DEFAULT_MODEL,
                messages,
                temperature: config.temperature || 0.7,
                max_tokens: config.maxTokens || 2000,
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error?.message || 'API 调用失败');
        }

        const data = await response.json();

        // 处理不同API返回格式
        if (apiConfig.provider === 'openai') {
            return data.choices[0].message.content;
        } else {
            // 自定义API的返回格式处理
            return data.content || data.text || data.generated_text || data.result;
        }
    };

    const generateOutline = useCallback(async (topic: string): Promise<string> => {
        setIsLoading(true);
        try {
            const messages = [{
                role: "system",
                content: "你是一个专业的文章大纲生成助手。请为给定的主题生成一个详细的学术风格大纲。"
            }, {
                role: "user",
                content: `请为主题"${topic}"生成一个详细的研究性文章大纲，包含引言、文献综述、研究方法、结果分析和结论等部分。`
            }];

            return await makeAPIRequest(messages, options);
        } finally {
            setIsLoading(false);
        }
    }, [options]);

    const generateContent = useCallback(async (
        topic: string,
        outline: string
    ): Promise<string> => {
        setIsLoading(true);
        try {
            const messages = [{
                role: "system",
                content: "你是一个专业的学术论文写作助手。请根据提供的大纲生成详细的文章内容。"
            }, {
                role: "user",
                content: `请根据以下大纲，为主题"${topic}"生成一篇详细的学术文章：\n\n${outline}`
            }];

            return await makeAPIRequest(messages, options);
        } finally {
            setIsLoading(false);
        }
    }, [options]);

    return {
        isLoading,
        generateOutline,
        generateContent
    };
};
