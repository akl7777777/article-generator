// src/utils/validators.ts
export const validateTopic = (topic: string): boolean => {
    if (!topic || topic.trim().length === 0) {
        throw new Error('主题不能为空');
    }
    if (topic.length > 100) {
        throw new Error('主题长度不能超过100个字符');
    }
    return true;
};

export const validateOutline = (outline: string): boolean => {
    if (!outline || outline.trim().length === 0) {
        throw new Error('大纲不能为空');
    }
    // 可以添加更多验证逻辑
    return true;
};
