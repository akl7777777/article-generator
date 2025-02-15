// src/components/ArticleGenerator/index.tsx
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import TopicSelector from '../TopicSelector';
import Editor from '../Editor';
import Preview from '../Preview';
import { useArticleGenerator } from '../../hooks/useArticleGenerator';
import type { ArticleGeneratorProps } from './types';

const ArticleGenerator: React.FC<ArticleGeneratorProps> = ({
                                                               defaultTopic = '',
                                                               options = {}
                                                           }) => {
    const [topic, setTopic] = useState<string>(defaultTopic);
    const [outline, setOutline] = useState<string>('');
    const [content, setContent] = useState<string>('');
    const [isGenerating, setIsGenerating] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [apiKey, setApiKey] = useState<string>('');

    const { generateOutline, generateContent, isLoading } = useArticleGenerator({
        ...options,
        apiKey
    });

    const handleGenerateOutline = async () => {
        if (!apiKey) {
            setError('请先输入 OpenAI API Key');
            return;
        }
        setIsGenerating(true);
        try {
            const result = await generateOutline(topic);
            setOutline(result);
            setError(null);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : '生成失败';
            setError(errorMessage);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleGenerateContent = async () => {
        if (!apiKey) {
            setError('请先输入 OpenAI API Key');
            return;
        }
        setIsGenerating(true);
        try {
            const result = await generateContent(topic, outline);
            setContent(result);
            setError(null);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : '生成失败';
            setError(errorMessage);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <Card className="bg-gradient-to-br from-white to-gray-50 shadow-lg">
                <CardHeader className="space-y-1 pb-4">
                    <CardTitle className="text-3xl font-bold text-gray-900">
                        专业文章生成器
                    </CardTitle>
                    <p className="text-gray-500">
                        基于人工智能的专业文章智能生成工具
                    </p>
                </CardHeader>

                <CardContent>
                    <div className="space-y-4">
                        {/* API Key 输入 */}
                        <div className="p-4 bg-blue-50 rounded-lg">
                            <h3 className="text-sm font-medium text-blue-800 mb-2">
                                OpenAI API 设置
                            </h3>
                            <Input
                                type="password"
                                placeholder="请输入您的 OpenAI API Key"
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                className="max-w-md"
                            />
                            <p className="text-xs text-blue-600 mt-1">
                                您的 API Key 仅在本地使用，不会被保存或传输
                            </p>
                        </div>

                        {/* 主题选择 */}
                        <div className="p-4 bg-white rounded-lg shadow">
                            <h3 className="text-lg font-semibold mb-2">文章主题</h3>
                            <TopicSelector
                                value={topic}
                                onChange={(newTopic) => {
                                    setTopic(newTopic);
                                    setError(null);
                                }}
                                disabled={isGenerating}
                            />
                        </div>

                        {/* 操作按钮 */}
                        <div className="flex space-x-4">
                            <Button
                                onClick={handleGenerateOutline}
                                disabled={isGenerating || !topic || isLoading}
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                {(isGenerating || isLoading) ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        生成大纲中...
                                    </>
                                ) : '生成大纲'}
                            </Button>

                            <Button
                                onClick={handleGenerateContent}
                                disabled={isGenerating || !outline || isLoading}
                                className="bg-green-600 hover:bg-green-700"
                            >
                                {(isGenerating || isLoading) ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        生成文章中...
                                    </>
                                ) : '生成文章'}
                            </Button>
                        </div>

                        {error && (
                            <Alert variant="destructive">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        {/* 编辑器和预览区 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="p-4 bg-white rounded-lg shadow">
                                    <h3 className="text-lg font-semibold mb-2">大纲</h3>
                                    <Editor
                                        value={outline}
                                        onChange={setOutline}
                                        disabled={isGenerating}
                                        placeholder="文章大纲将在这里生成..."
                                        minHeight="200px"
                                    />
                                </div>

                                <div className="p-4 bg-white rounded-lg shadow">
                                    <h3 className="text-lg font-semibold mb-2">内容</h3>
                                    <Editor
                                        value={content}
                                        onChange={setContent}
                                        disabled={isGenerating}
                                        placeholder="文章内容将在这里生成..."
                                        minHeight="400px"
                                    />
                                </div>
                            </div>

                            <div className="p-4 bg-white rounded-lg shadow">
                                <h3 className="text-lg font-semibold mb-2">预览</h3>
                                <Preview outline={outline} content={content} />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ArticleGenerator;
