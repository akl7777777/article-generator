// src/components/ArticleGenerator/index.tsx
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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

    // API 设置状态
    const [apiSettings, setApiSettings] = useState({
        provider: 'openai' as 'openai' | 'custom',
        apiKey: '',
        apiUrl: 'https://api.openai.com/v1/chat/completions',
        model: 'gpt-3.5-turbo'
    });

    const { generateOutline, generateContent, isLoading } = useArticleGenerator({
        ...options,
        apiConfig: {
            provider: apiSettings.provider,
            apiKey: apiSettings.apiKey,
            url: apiSettings.apiUrl,
            model: apiSettings.model
        }
    });

    const handleGenerateOutline = async () => {
        if (!apiSettings.apiKey) {
            setError('请先输入 API Key');
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
        if (!apiSettings.apiKey) {
            setError('请先输入 API Key');
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
                        {/* API 设置 */}
                        <div className="p-4 bg-blue-50 rounded-lg">
                            <h3 className="text-sm font-medium text-blue-800 mb-2">
                                API 设置
                            </h3>
                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <div className="w-1/3">
                                        <label className="text-sm text-gray-600 mb-1 block">
                                            API 提供商
                                        </label>
                                        <Select
                                            value={apiSettings.provider}
                                            onValueChange={(value: 'openai' | 'custom') => {
                                                setApiSettings({
                                                    ...apiSettings,
                                                    provider: value,
                                                    apiUrl: value === 'openai'
                                                        ? 'https://api.openai.com/v1/chat/completions'
                                                        : ''
                                                });
                                            }}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="选择 API 提供商" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="openai">OpenAI</SelectItem>
                                                <SelectItem value="custom">自定义 API</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex-1">
                                        <label className="text-sm text-gray-600 mb-1 block">
                                            API Key
                                        </label>
                                        <Input
                                            type="password"
                                            placeholder="请输入 API Key"
                                            value={apiSettings.apiKey}
                                            onChange={(e) => setApiSettings({
                                                ...apiSettings,
                                                apiKey: e.target.value
                                            })}
                                        />
                                    </div>
                                </div>

                                {apiSettings.provider === 'custom' && (
                                    <div className="space-y-2">
                                        <label className="text-sm text-gray-600 mb-1 block">
                                            自定义 API 地址
                                        </label>
                                        <Input
                                            placeholder="输入自定义 API 地址"
                                            value={apiSettings.apiUrl}
                                            onChange={(e) => setApiSettings({
                                                ...apiSettings,
                                                apiUrl: e.target.value
                                            })}
                                        />
                                        <p className="text-xs text-gray-500">
                                            例如: https://your-api-server.com/v1/chat/completions
                                        </p>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <label className="text-sm text-gray-600 mb-1 block">
                                        模型 {apiSettings.provider === 'custom' && '(可选)'}
                                    </label>
                                    <Input
                                        placeholder="输入模型名称"
                                        value={apiSettings.model}
                                        onChange={(e) => setApiSettings({
                                            ...apiSettings,
                                            model: e.target.value
                                        })}
                                    />
                                </div>
                            </div>
                            <p className="text-xs text-blue-600 mt-2">
                                您的 API 设置仅在本地使用，不会被保存或传输
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
