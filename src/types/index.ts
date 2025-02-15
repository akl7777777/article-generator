// src/types/index.ts
export interface APIConfig {
    url: string;
    provider: 'openai' | 'custom';
    model?: string;
    apiKey: string;
    headers?: Record<string, string>;
}

export interface GenerationOptions {
    apiConfig?: APIConfig;
    temperature?: number;
    maxTokens?: number;
}
