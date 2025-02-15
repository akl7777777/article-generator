// src/hooks/useArticleGenerator.ts
import { useState, useCallback } from 'react';
import type { GenerationOptions } from '../types';

interface UseArticleGeneratorOptions extends GenerationOptions {
    apiKey?: string;
}

export const useArticleGenerator = (options: UseArticleGeneratorOptions = {}) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const generateOutline = useCallback(async (topic: string): Promise<string> => {
        if (!options.apiKey) {
            throw new Error('请提供 OpenAI API Key');
        }

        setIsLoading(true);
        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${options.apiKey}`
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [{
                        role: "system",
                        content: "你是一个专业的文章大纲生成助手。请为给定的主题生成一个详细的学术风格大纲。"
                    }, {
                        role: "user",
                        content: `请为主题"${topic}"生成一个详细的研究性文章大纲，包含引言、文献综述、研究方法、结果分析和结论等部分。`
                    }]
                })
            });

            if (!response.ok) {
                throw new Error('API 调用失败');
            }

            const data = await response.json();
            return data.choices[0].message.content;
        } finally {
            setIsLoading(false);
        }
    }, [options.apiKey]);

    const generateContent = useCallback(async (
        topic: string,
        outline: string
    ): Promise<string> => {
        if (!options.apiKey) {
            throw new Error('请提供 OpenAI API Key');
        }

        setIsLoading(true);
        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${options.apiKey}`
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [{
                        role: "system",
                        content: "你是一个专业的学术论文写作助手。请根据提供的大纲生成详细的文章内容。"
                    }, {
                        role: "user",
                        content: `请根据以下大纲，为主题"${topic}"生成一篇详细的学术文章：\n\n${outline}`
                    }]
                })
            });

            if (!response.ok) {
                throw new Error('API 调用失败');
            }

            const data = await response.json();
            return data.choices[0].message.content;
        } finally {
            setIsLoading(false);
        }
    }, [options.apiKey]);

    return {
        isLoading,
        generateOutline,
        generateContent
    };
};
