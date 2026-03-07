import { Loader2, Play, RefreshCw, Zap, ArrowLeft, LogOut } from 'lucide-react';
import { Logo } from '@/components/logo';
import Link from 'next/link';

interface EditorHeaderProps {
    isLoading: boolean;
    isPreviewLoading: boolean;
    onRun: () => void;
    onReload: () => void;
    onDeploy: () => void;
    remainingGenerations: number | null;
    rateLimit: number;
}

export function EditorHeader({
    isLoading,
    isPreviewLoading,
    onRun,
    onReload,
    onDeploy,
    remainingGenerations,
    rateLimit,
}: EditorHeaderProps) {
    return (
        <div className="bg-gray-800/90 backdrop-blur-sm border-b border-gray-700 p-3 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
                <Logo />
                {remainingGenerations !== null && (
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${remainingGenerations <= 0
                        ? "bg-red-500/20 text-red-400"
                        : remainingGenerations === 1
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-green-500/20 text-green-400"
                        }`}>
                        <Zap size={12} />
                        {remainingGenerations}/{rateLimit} left
                    </div>
                )}
                <Link href="/prompt">
                    <button className="flex items-center gap-1 text-gray-400 hover:text-white text-xs transition-colors">
                        <ArrowLeft size={12} /> New Prompt
                    </button>
                </Link>
            </div>
            <div className="flex items-center space-x-3">
                {isLoading && (
                    <div className="flex items-center space-x-2 text-blue-400 text-sm">
                        <Loader2 className="animate-spin" size={14} />
                        <span>Generating code...</span>
                    </div>
                )}
                {isPreviewLoading && (
                    <div className="flex items-center space-x-2 text-yellow-400 text-sm">
                        <Loader2 className="animate-spin" size={14} />
                        <span>Compiling JSX...</span>
                    </div>
                )}
                <button
                    onClick={onRun}
                    disabled={isLoading || isPreviewLoading}
                    className="flex items-center gap-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-3 py-1 rounded transition-all text-sm"
                    title="Run Code"
                >
                    <Play size={14} /> Run
                </button>
                <button
                    onClick={onReload}
                    disabled={isLoading || isPreviewLoading}
                    className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-500 text-white px-2 py-1 rounded transition-colors"
                    title="Reload Preview"
                >
                    <RefreshCw size={14} />
                </button>
                <button
                    onClick={onDeploy}
                    disabled={isLoading || isPreviewLoading}
                    className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-3 py-1 rounded transition-all text-sm"
                    title="Deploy to Netlify"
                >
                    🚀 Deploy
                </button>
            </div>
        </div>
    );
}
