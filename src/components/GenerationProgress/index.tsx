
import type {GenerationProgress} from "../../types";

// 添加进度显示组件
const GenerationProgress = ({ progress }: { progress: GenerationProgress | null }) => {
    if (!progress) return null;

    const percentage = Math.round((progress.currentSection / progress.totalSections) * 100);

    return (
        <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex justify-between mb-2">
        <span className="text-sm font-medium text-blue-800">
          生成进度 ({percentage}%)
        </span>
                <span className="text-sm text-blue-600">
          {progress.currentSection}/{progress.totalSections}
        </span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2.5">
                <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                />
            </div>
            <p className="text-sm text-blue-600 mt-2">
                {progress.status === 'generating' ? `正在生成: ${progress.sectionTitle}` :
                    progress.status === 'done' ? '生成完成' :
                        progress.status === 'error' ? '生成出错' : ''}
            </p>
        </div>
    );
};

export default GenerationProgress;
