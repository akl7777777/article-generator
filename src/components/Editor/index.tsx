// src/components/Editor/index.tsx
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import type { EditorProps } from './types';

const Editor: React.FC<EditorProps> = ({
                                           outline,
                                           content,
                                           onOutlineChange,
                                           onContentChange,
                                           disabled = false
                                       }) => {
    return (
        <div className="flex flex-col space-y-4">
            <div>
                <h3 className="text-lg font-medium mb-2">大纲</h3>
                <Textarea
                    value={outline}
                    onChange={(e) => onOutlineChange(e.target.value)}
                    disabled={disabled}
                    className="min-h-[200px]"
                    placeholder="在这里编辑文章大纲..."
                />
            </div>
            <div>
                <h3 className="text-lg font-medium mb-2">内容</h3>
                <Textarea
                    value={content}
                    onChange={(e) => onContentChange(e.target.value)}
                    disabled={disabled}
                    className="min-h-[400px]"
                    placeholder="在这里编辑文章内容..."
                />
            </div>
        </div>
    );
};

export default Editor;
