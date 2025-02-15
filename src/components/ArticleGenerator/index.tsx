// src/components/ArticleGenerator/index.tsx
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import TopicSelector from '../TopicSelector';
import Editor from '../Editor';
import Preview from '../Preview';
import { useArticleGenerator } from '../../hooks/useArticleGenerator';
import type { ArticleGeneratorProps } from './types';
import type { Article, GenerationResult } from '../../types';
import './styles.css';

const ArticleGenerator: React.FC<ArticleGeneratorProps> = ({
                                                               defaultTopic = '',
                                                               options = {},
                                                               onGenerate,
                                                               onError
                                                           }) => {
    const [article, setArticle] = useState<Article>({
        topic: defaultTopic,
        outline: '',
        content: '',
        createdAt: new Date(),
        updatedAt: new Date()
    });
    const [isGenerating, setIsGenerating] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const { generateOutline, generateContent } = useArticleGenerator(options);

    const handleTopicChange = (newTopic: string): void => {
        setArticle(prev => ({
            ...prev,
            topic: newTopic,
            updatedAt: new Date()
        }));
        setError(null);
    };

    const handleGenerateOutline = async (): Promise<void> => {
        if (!article.topic) {
            setError('请先选择文章主题');
            return;
        }

        setIsGenerating(true);
        try {
            const result: GenerationResult = await generateOutline(article.topic);
            if (!result.success || !result.data) {
                throw new Error(result.error || '生成失败');
            }

            setArticle(prev => ({
                ...prev,
                outline: result.data?.outline || '',
                updatedAt: new Date()
            }));
            setError(null);
        } catch (err) {
            const error = err as Error;
            setError('生成大纲时出错: ' + error.message);
            onError?.(error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleGenerateContent = async (): Promise<void> => {
        if (!article.outline) {
            setError('请先生成文章大纲');
            return;
        }

        setIsGenerating(true);
        try {
            const result: GenerationResult = await generateContent(article.topic, article.outline);
            if (!result.success || !result.data) {
                throw new Error(result.error || '生成失败');
            }

            setArticle(prev => ({
                ...prev,
                content: result.data?.content || '',
                updatedAt: new Date()
            }));
            setError(null);
            onGenerate?.(result.data);
        } catch (err) {
            const error = err as Error;
            setError('生成文章内容时出错: ' + error.message);
            onError?.(error);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="flex flex-col space-y-4 p-4">
            <Card>
                <CardContent className="p-6">
                    <h1 className="text-2xl font-bold mb-4">专业文章生成器</h1>

                    <TopicSelector
                        value={article.topic}
                        onChange={handleTopicChange}
                    />

                    <div className="flex space-x-4 mt-4">
                        <Button
                            onClick={handleGenerateOutline}
                            disabled={isGenerating || !article.topic}
                        >
                            生成大纲
                        </Button>
                        <Button
                            onClick={handleGenerateContent}
                            disabled={isGenerating || !article.outline}
                        >
                            生成文章
                        </Button>
                    </div>

                    {error && (
                        <Alert variant="destructive" className="mt-4">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <Editor
                            outline={article.outline}
                            content={article.content}
                            onOutlineChange={(newOutline) => setArticle(prev => ({
                                ...prev,
                                outline: newOutline,
                                updatedAt: new Date()
                            }))}
                            onContentChange={(newContent) => setArticle(prev => ({
                                ...prev,
                                content: newContent,
                                updatedAt: new Date()
                            }))}
                        />
                        <Preview
                            outline={article.outline}
                            content={article.content}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ArticleGenerator;
