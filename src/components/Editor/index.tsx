// src/components/Editor/index.tsx
import React from 'react';
import { Textarea } from '@/components/ui/textarea';

interface EditorProps {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
    placeholder?: string;
    minHeight?: string;
}

const Editor: React.FC<EditorProps> = ({
                                           value,
                                           onChange,
                                           disabled = false,
                                           placeholder = '',
                                           minHeight = '200px'
                                       }) => {
    return (
        <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            placeholder={placeholder}
            className="w-full font-mono"
            style={{ minHeight }}
        />
    );
};

export default Editor;
