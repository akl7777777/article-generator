// src/types/index.ts
export interface Article {
    topic: string;
    outline: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface GenerationOptions {
    useTemplate?: boolean;
    templateId?: string;
    language?: 'zh' | 'en';
    style?: 'academic' | 'blog' | 'news';
    length?: 'short' | 'medium' | 'long';
}

export interface GenerationResult {
    success: boolean;
    data?: Article;
    error?: string;
}
