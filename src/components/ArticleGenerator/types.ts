// src/components/ArticleGenerator/types.ts
import type { Article } from '../../types';

export interface ArticleGeneratorProps {
    defaultTopic?: string;
    options?: {
        templateId?: string;
        style?: 'academic' | 'blog' | 'news';
        length?: 'short' | 'medium' | 'long';
    };
    onGenerate?: (article: Article) => void;
    onError?: (error: Error) => void;
}
