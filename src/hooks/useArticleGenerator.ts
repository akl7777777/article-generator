// src/hooks/useArticleGenerator.ts
import { useState, useCallback } from 'react';
import type { GenerationOptions } from '../types';

interface UseArticleGeneratorOptions extends GenerationOptions {
    apiConfig?: {
        provider: 'openai' | 'custom';
        apiKey: string;
        url: string;
        model?: string;
    };
}

export const useArticleGenerator = (options: UseArticleGeneratorOptions = {}) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const makeAPIRequest = async (messages: any[]): Promise<string> => {
        if (!options.apiConfig?.apiKey) {
            throw new Error('请提供 API Key');
        }

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };

        // 根据不同提供商设置认证头
        if (options.apiConfig.provider === 'openai') {
            headers['Authorization'] = `Bearer ${options.apiConfig.apiKey}`;
        } else {
            // 自定义 API 的认证头设置
            headers['Authorization'] = options.apiConfig.apiKey;  // 直接使用 API Key 作为令牌
        }

        console.log('Request Headers:', headers); // 调试用

        const response = await fetch(options.apiConfig.url, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                model: options.apiConfig.model || 'gpt-3.5-turbo',
                messages,
                temperature: 0.7,
                max_tokens: 2000,
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('API Error:', errorData); // 调试用
            throw new Error(errorData.error?.message || `API 调用失败: ${response.status}`);
        }

        const data = await response.json();
        console.log('API Response:', data); // 调试用

        // 处理不同的响应格式
        if (options.apiConfig.provider === 'openai') {
            return data.choices[0].message.content;
        } else {
            // 支持多种可能的响应格式
            return data.response || data.content || data.text || data.message || data.result ||
                (data.choices && data.choices[0]?.message?.content) ||
                JSON.stringify(data);
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

            return await makeAPIRequest(messages);
        } finally {
            setIsLoading(false);
        }
    }, [options.apiConfig]);

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

            return await makeAPIRequest(messages);
        } finally {
            setIsLoading(false);
        }
    }, [options.apiConfig]);

    return {
        isLoading,
        generateOutline,
        generateContent
    };
};
