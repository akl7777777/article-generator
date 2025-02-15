// src/hooks/useArticleGenerator.ts
import { useState, useCallback } from 'react';
import { generateOutlineFromTopic, generateContentFromOutline } from '../utils/templates';
import type { GenerationOptions, GenerationResult } from '../types';

export const useArticleGenerator = (options: GenerationOptions = {}) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const generateOutline = useCallback(async (topic: string): Promise<GenerationResult> => {
        setIsLoading(true);
        try {
            const outline = await generateOutlineFromTopic(topic, options);
            return {
                success: true,
                data: {
                    topic,
                    outline,
                    content: '',
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : '未知错误'
            };
        } finally {
            setIsLoading(false);
        }
    }, [options]);

    const generateContent = useCallback(async (
        topic: string,
        outline: string
    ): Promise<GenerationResult> => {
        setIsLoading(true);
        try {
            const content = await generateContentFromOutline(topic, outline, options);
            return {
                success: true,
                data: {
                    topic,
                    outline,
                    content,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : '未知错误'
            };
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
