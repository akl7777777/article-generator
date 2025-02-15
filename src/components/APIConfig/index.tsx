// src/components/APIConfig/index.tsx
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { DEFAULT_OPENAI_URL } from '@/constants/api';
import type { APIConfig } from '../../types';

interface APIConfigProps {
    config: APIConfig;
    onChange: (config: APIConfig) => void;
}

const APIConfig: React.FC<APIConfigProps> = ({ config, onChange }) => {
    return (
        <div className="space-y-4">
            <div className="grid gap-2">
                <Label htmlFor="provider">API 提供商</Label>
                <Select
                    value={config.provider}
                    onValueChange={(value: 'openai' | 'custom') =>
                        onChange({ ...config, provider: value })
                    }
                >
                    <SelectTrigger id="provider">
                        <SelectValue placeholder="选择 API 提供商" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="openai">OpenAI</SelectItem>
                        <SelectItem value="custom">自定义 API</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="grid gap-2">
                <Label htmlFor="apiUrl">API 地址</Label>
                <Input
                    id="apiUrl"
                    placeholder={config.provider === 'openai' ? DEFAULT_OPENAI_URL : '输入自定义 API 地址'}
                    value={config.url || ''}
                    onChange={(e) => onChange({ ...config, url: e.target.value })}
                    disabled={config.provider === 'openai'}
                />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="apiKey">API Key</Label>
                <Input
                    id="apiKey"
                    type="password"
                    placeholder="输入 API Key"
                    value={config.apiKey || ''}
                    onChange={(e) => onChange({ ...config, apiKey: e.target.value })}
                />
            </div>

            {config.provider === 'custom' && (
                <div className="grid gap-2">
                    <Label htmlFor="model">模型名称（可选）</Label>
                    <Input
                        id="model"
                        placeholder="输入模型名称"
                        value={config.model || ''}
                        onChange={(e) => onChange({ ...config, model: e.target.value })}
                    />
                </div>
            )}
        </div>
    );
};

export default APIConfig;
