import { Loader2 } from 'lucide-react';

interface CodeEditorProps {
    code: string;
    onChange: (value: string) => void;
    isLoading: boolean;
}

export function CodeEditor({ code, onChange, isLoading }: CodeEditorProps) {
    return (
        <div className="w-full h-full flex flex-col bg-[#1e1e2e] border-r border-gray-700">
            <div className="px-4 py-2 border-b border-gray-600 flex items-center justify-between text-gray-300 text-sm font-medium">
                App.jsx
                {isLoading && <Loader2 className="animate-spin text-blue-400" size={12} />}
            </div>
            <div className="flex-1 relative">
                <textarea
                    value={code}
                    onChange={(e) => onChange(e.target.value)}
                    className="absolute inset-0 w-full h-full bg-transparent text-green-400 font-mono text-sm p-4 outline-none resize-none leading-relaxed placeholder:text-gray-500"
                    placeholder="Streaming JSX code will appear here..."
                    spellCheck={false}
                />
            </div>
        </div>
    );
}
