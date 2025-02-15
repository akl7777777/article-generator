// src/components/APISettings/index.tsx
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Settings2 } from 'lucide-react';
import { DEFAULT_OPENAI_URL } from '@/constants/api';

interface APISettingsProps {
    onSave: (settings: APISettings) => void;
}

export interface APISettings {
    provider: 'openai' | 'custom';
    apiKey: string;
    apiUrl: string;
    model?: string;
}

const APISettings: React.FC<APISettingsProps> = ({ onSave }) => {
    const [settings, setSettings] = useState<APISettings>({
        provider: 'openai',
        apiKey: '',
        apiUrl: DEFAULT_OPENAI_URL,
        model: 'gpt-3.5-turbo'
    });

    const [isVisible, setIsVisible] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSave = () => {
        if (!settings.apiKey) {
            setError('请输入 API Key');
            return;
        }
        if (settings.provider === 'custom' && !settings.apiUrl) {
            setError('请输入自定义 API 地址');
            return;
        }
        onSave(settings);
        setError(null);
        setIsVisible(false);
    };

    return (
        <div className="relative">
            <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => setIsVisible(!isVisible)}
            >
                <Settings2 className="w-4 h-4" />
                API 设置
            </Button>

            {isVisible && (
                <Card className="absolute top-12 right-0 z-50 w-96 bg-white shadow-xl">
                    <CardHeader>
                        <CardTitle className="text-lg">API 设置</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>API 提供商</Label>
                            <Select
                                value={settings.provider}
                                onValueChange={(value: 'openai' | 'custom') => {
                                    setSettings({
                                        ...settings,
                                        provider: value,
                                        apiUrl: value === 'openai' ? DEFAULT_OPENAI_URL : ''
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

                        {settings.provider === 'custom' && (
                            <div className="space-y-2">
                                <Label>API 地址</Label>
                                <Input
                                    placeholder="输入自定义 API 地址"
                                    value={settings.apiUrl}
                                    onChange={(e) => setSettings({
                                        ...settings,
                                        apiUrl: e.target.value
                                    })}
                                />
                                <p className="text-xs text-gray-500">
                                    例如: https://your-api-server.com/v1/chat/completions
                                </p>
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label>API Key</Label>
                            <Input
                                type="password"
                                placeholder="输入 API Key"
                                value={settings.apiKey}
                                onChange={(e) => setSettings({
                                    ...settings,
                                    apiKey: e.target.value
                                })}
                            />
                        </div>

                        {settings.provider === 'custom' && (
                            <div className="space-y-2">
                                <Label>模型名称 (可选)</Label>
                                <Input
                                    placeholder="输入模型名称"
                                    value={settings.model}
                                    onChange={(e) => setSettings({
                                        ...settings,
                                        model: e.target.value
                                    })}
                                />
                            </div>
                        )}

                        {error && (
                            <Alert variant="destructive">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => setIsVisible(false)}>
                                取消
                            </Button>
                            <Button onClick={handleSave}>
                                保存
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default APISettings;
