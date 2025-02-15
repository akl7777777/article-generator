// src/components/Editor/types.ts
export interface EditorProps {
    outline: string;
    content: string;
    onOutlineChange: (outline: string) => void;
    onContentChange: (content: string) => void;
    disabled?: boolean;
}
