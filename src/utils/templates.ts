// src/utils/templates.ts
import type { GenerationOptions } from '../types';

interface Template {
    id: string;
    name: string;
    getOutline: (topic: string) => string;
    getContent: (topic: string) => string;
}

const templates: Template[] = [
    {
        id: 'academic',
        name: '学术论文',
        getOutline: (topic: string) => `1. ${topic}研究概述
- 研究背景
- 研究意义
- 研究目的

2. 文献综述
- ${topic}相关研究回顾
- 研究现状
- 存在问题

3. 研究方法
- 研究设计
- 数据收集
- 分析方法

4. ${topic}研究结果
- 数据分析
- 结果呈现
- 结果讨论

5. 结论与建议
- 主要结论
- 研究局限
- 未来展望`,
        getContent: (topic: string) => `# ${topic}研究

## 1. 研究概述

### 研究背景
${topic}在当前领域具有重要的研究价值...

### 研究意义
本研究对于推进${topic}的发展具有以下意义...

### 研究目的
本研究旨在探索${topic}的关键因素...

## 2. 文献综述
...`
    },
    {
        id: 'blog',
        name: '博客文章',
        getOutline: (topic: string) => `1. ${topic}简介
- 背景介绍
- 主要问题
- 写作目的

2. ${topic}核心内容
- 关键概念
- 实践案例
- 解决方案

3. 总结与展望
- 主要观点回顾
- 实践建议
- 未来趋势`,
        getContent: (topic: string) => `# ${topic}详解

## 1. 引言
在这个快速发展的时代，${topic}越来越受到人们的关注...

## 2. 核心内容
让我们深入了解${topic}的几个关键方面...

## 3. 总结
通过以上分析，我们可以看到${topic}的重要性...`
    }
];

export const generateOutlineFromTopic = async (
    topic: string,
    options: GenerationOptions = {}
): Promise<string> => {
    const selectedTemplate = templates.find(t => t.id === options.templateId)
        ?? templates[0];

    // 使用模板的 getOutline 方法生成大纲
    return selectedTemplate.getOutline(topic);
};

export const generateContentFromOutline = async (
    topic: string,
    outline: string,
    options: GenerationOptions = {}
): Promise<string> => {
    const selectedTemplate = templates.find(t => t.id === options.templateId)
        ?? templates[0];

    // 生成基础内容
    let content = selectedTemplate.getContent(topic);

    // 解析大纲结构
    const outlinePoints = outline.split('\n')
        .filter(line => line.trim())
        .map(line => line.trim());

    // 根据大纲构建内容结构
    let structuredContent = '';
    let currentSection = '';
    let currentPoints: string[] = [];

    outlinePoints.forEach(point => {
        if (point.match(/^\d+\./)) {
            // 如果当前section不为空，添加到结构化内容中
            if (currentSection) {
                structuredContent += `\n## ${currentSection}\n`;
                currentPoints.forEach(p => {
                    structuredContent += `\n### ${p.replace('- ', '')}\n`;
                    structuredContent += `关于${topic}的${p.replace('- ', '')}分析...\n`;
                });
                currentPoints = [];
            }
            currentSection = point.replace(/^\d+\./, '').trim();
        } else if (point.startsWith('- ')) {
            currentPoints.push(point);
        }
    });

    // 添加最后一个section
    if (currentSection) {
        structuredContent += `\n## ${currentSection}\n`;
        currentPoints.forEach(p => {
            structuredContent += `\n### ${p.replace('- ', '')}\n`;
            structuredContent += `关于${topic}的${p.replace('- ', '')}分析...\n`;
        });
    }

    // 根据不同的文章风格调整内容
    switch(options.style) {
        case 'academic':
            structuredContent = `${content}\n\n## 参考文献\n1. ...`;
            break;
        case 'blog':
            structuredContent = `${content}\n\n## 写在最后\n欢迎在评论区讨论...`;
            break;
        case 'news':
            structuredContent = `${content}\n\n## 相关报道\n- ...`;
            break;
        default:
            break;
    }

    // 根据长度选项调整内容
    if (options.length === 'short') {
        // 生成简短版本
        structuredContent = structuredContent.split('\n').slice(0, 10).join('\n');
    } else if (options.length === 'long') {
        // 添加更多详细内容
        structuredContent = `${structuredContent}\n\n## 扩展阅读\n...`;
    }

    return structuredContent;
};

// 新增：主题建议功能
export const suggestTopics = (keyword: string): string[] => {
    const suggestions = [
        '人工智能发展趋势',
        '可持续发展策略',
        '数字化转型实践',
        '健康生活方式',
        '教育创新方法'
    ];

    return suggestions.filter(topic =>
        topic.toLowerCase().includes(keyword.toLowerCase())
    );
};

// 新增：获取所有可用模板
export const getAvailableTemplates = (): Array<{ id: string; name: string }> => {
    return templates.map(({ id, name }) => ({ id, name }));
};
