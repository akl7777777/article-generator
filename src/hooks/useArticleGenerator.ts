// src/hooks/useArticleGenerator.ts
import { useState, useCallback } from 'react';
import {GenerationProgress} from "../types";



export const useArticleGenerator = (options: any = {}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState<GenerationProgress | null>(null);

    const makeAPIRequest = async (messages: any[], maxTokens: number = 4000): Promise<string> => {
        if (!options.apiConfig?.apiKey) {
            throw new Error('请提供 API Key');
        }

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };

        if (options.apiConfig.provider === 'openai') {
            headers['Authorization'] = `Bearer ${options.apiConfig.apiKey}`;
        } else {
            headers['Authorization'] = options.apiConfig.apiKey;
        }

        try {
            const response = await fetch(options.apiConfig.url, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    model: options.apiConfig.model || 'gpt-3.5-turbo',
                    messages,
                    temperature: 0.7,
                    max_tokens: maxTokens,
                    // 添加其他可能有助于生成更长内容的参数
                    presence_penalty: 0.1,  // 降低重复内容的可能性
                    frequency_penalty: 0.1, // 鼓励使用更多样的词汇
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error?.message || `API 调用失败: ${response.status}`);
            }

            const data = await response.json();

            if (options.apiConfig.provider === 'openai') {
                return data.choices[0].message.content;
            } else {
                return data.response || data.content || data.text || data.message || data.result ||
                    (data.choices && data.choices[0]?.message?.content) ||
                    JSON.stringify(data);
            }
        } catch (error) {
            console.error('API Request Error:', error);
            throw error;
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
                content: `请为主题"${topic}"生成一个详细的研究性文章大纲，包含引言、文献综述、研究方法、结果分析和结论等部分。要求层次分明，每个部分都要有详细的子项目。`
            }];

            return await makeAPIRequest(messages, 2000); // 大纲不需要太长
        } finally {
            setIsLoading(false);
        }
    }, [options.apiConfig]);

    const generateContent = useCallback(async (
        topic: string,
        outline: string,
        onSectionComplete: (sectionContent: string) => void
    ): Promise<string> => {
        setIsLoading(true);
        try {
            // 将大纲分解成章节
            const sections = outline.split(/\d+\./g).filter(Boolean);
            let fullContent = '';

            // 更新总章节数
            setProgress({
                currentSection: 0,
                totalSections: sections.length + 1, // +1 for conclusion
                sectionTitle: '准备生成',
                status: 'generating'
            });

            // 为每个章节生成内容
            for (let i = 0; i < sections.length; i++) {
                const section = sections[i].trim();
                const sectionNumber = i + 1;
                const sectionTitle = section.split('\n')[0];

                // 更新进度
                setProgress({
                    currentSection: sectionNumber,
                    totalSections: sections.length + 1,
                    sectionTitle,
                    status: 'generating'
                });

                const messages = [{
                    role: "system",
                    content: `你是一个专业的学术论文写作助手。请基于大纲生成详细的文章内容。
要求：
1. 内容要专业、深入且详实
2. 使用学术性的语言和表达
3. 每个观点都要有充分的论述
4. 保持逻辑性和连贯性
5. 如果可能，适当引用一些研究或数据支持论点`
                }, {
                    role: "user",
                    content: `这是一篇关于"${topic}"的学术文章的第${sectionNumber}部分。
请基于以下大纲生成这一部分的详细内容：

${section}

请生成至少1000字的内容，要求内容充实、论述深入、逻辑清晰。每个子项目都要有详细的展开和论述。`
                }];

                // 为每个章节生成内容
                const sectionContent = await makeAPIRequest(messages, 4000);
                const formattedSection = `\n\n# ${sectionNumber}. ${sectionTitle}\n\n${sectionContent}`;
                fullContent += formattedSection;

                // 通知上层组件更新内容
                onSectionComplete(fullContent);

                // 如果不是最后一个章节，添加延迟
                if (i < sections.length - 1) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }

            // 更新进度为生成结论
            setProgress({
                currentSection: sections.length + 1,
                totalSections: sections.length + 1,
                sectionTitle: '生成结论',
                status: 'generating'
            });

            // 生成结论
            const conclusionMessages = [{
                role: "system",
                content: "你是一个专业的学术论文写作助手。请为整篇文章生成一个有力的结论。"
            }, {
                role: "user",
                content: `请为这篇关于"${topic}"的文章生成一个总结性的结论，要包含主要发现、研究意义和未来展望。要求结论有力且有见地。`
            }];

            const conclusion = await makeAPIRequest(conclusionMessages, 2000);
            const finalContent = fullContent + `\n\n# 结论\n\n${conclusion}`;

            // 通知结论生成完成
            onSectionComplete(finalContent);

            // 更新进度为完成
            setProgress({
                currentSection: sections.length + 1,
                totalSections: sections.length + 1,
                sectionTitle: '生成完成',
                status: 'done'
            });

            return finalContent;
        } catch (error) {
            setProgress(prev => prev ? { ...prev, status: 'error' } : null);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [options.apiConfig]);

    return {
        isLoading,
        progress,
        generateOutline,
        generateContent
    };
};
