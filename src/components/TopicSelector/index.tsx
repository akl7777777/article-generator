// src/components/TopicSelector/index.tsx
import React from 'react';
import { Input } from '@/components/ui/input';
import type { TopicSelectorProps } from './types';

const TopicSelector: React.FC<TopicSelectorProps> = ({
                                                         value,
                                                         onChange,
                                                         disabled = false
                                                     }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
    };

    return (
        <div className="w-full">
            <Input
                type="text"
                placeholder="请输入文章主题"
                value={value}
                onChange={handleChange}
                disabled={disabled}
                className="w-full"
            />
        </div>
    );
};

export default TopicSelector;
