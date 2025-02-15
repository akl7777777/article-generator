// src/constants/index.ts
import {GenerationOptions} from "../types";

export const GENERATION_STYLES = {
    ACADEMIC: 'academic',
    BLOG: 'blog',
    NEWS: 'news'
} as const;

export const GENERATION_LENGTHS = {
    SHORT: 'short',
    MEDIUM: 'medium',
    LONG: 'long'
} as const;

export const DEFAULT_GENERATION_OPTIONS: GenerationOptions = {
    useTemplate: true,
    templateId: 'academic',
    language: 'zh',
    style: 'academic',
    length: 'medium'
};
