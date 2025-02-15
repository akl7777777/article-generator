// src/components/Preview/index.tsx
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import type { PreviewProps } from './types';

const Preview: React.FC<PreviewProps> = ({ outline, content }) => {
    const renderMarkdown = (text: string): string => {
        // 这里可以集成 markdown 渲染库
        return text.replace(/\n/g, '<br />');
    };

    return (
        <div className="flex flex-col space-y-4">
            <Card>
                <CardContent className="p-4">
                    <h3 className="text-lg font-medium mb-2">大纲预览</h3>
                    <div
                        className="prose"
                        dangerouslySetInnerHTML={{ __html: renderMarkdown(outline) }}
                    />
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-4">
                    <h3 className="text-lg font-medium mb-2">内容预览</h3>
                    <div
                        className="prose"
                        dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
                    />
                </CardContent>
            </Card>
        </div>
    );
};

export default Preview;
