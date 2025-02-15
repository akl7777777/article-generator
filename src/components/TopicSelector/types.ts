// 更新 src/components/TopicSelector/types.ts 添加更详细的类型定义
export interface TopicSelectorProps {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}
