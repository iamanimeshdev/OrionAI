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
        <div className="bg-gray-800/90 backdrop-blur-sm border-b border-gray-700 p-2 sm:p-3 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <div className="hidden sm:block">
                    <Logo />
                </div>
                {remainingGenerations !== null && (
                    <div className={`flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium whitespace-nowrap ${remainingGenerations <= 0
                        ? "bg-red-500/20 text-red-400"
                        : remainingGenerations === 1
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-green-500/20 text-green-400"
                        }`}>
                        <Zap size={10} className="sm:w-3 sm:h-3" />
                        {remainingGenerations}/{rateLimit}
                    </div>
                )}
                <Link href="/prompt">
                    <button className="flex items-center gap-1 text-gray-400 hover:text-white text-[10px] sm:text-xs transition-colors whitespace-nowrap">
                        <ArrowLeft size={12} /> <span className="hidden xs:inline sm:inline">New Prompt</span>
                    </button>
                </Link>
            </div>
            <div className="flex items-center space-x-1.5 sm:space-x-3">
                {isLoading && (
                    <div className="hidden sm:flex items-center space-x-2 text-blue-400 text-sm">
                        <Loader2 className="animate-spin" size={14} />
                        <span className="hidden md:inline">Generating code...</span>
                    </div>
                )}
                {isLoading && (
                    <div className="sm:hidden">
                        <Loader2 className="animate-spin text-blue-400" size={14} />
                    </div>
                )}
                {isPreviewLoading && (
                    <div className="hidden sm:flex items-center space-x-2 text-yellow-400 text-sm">
                        <Loader2 className="animate-spin" size={14} />
                        <span className="hidden md:inline">Compiling JSX...</span>
                    </div>
                )}
                <button
                    onClick={onRun}
                    disabled={isLoading || isPreviewLoading}
                    className="flex items-center gap-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-2 sm:px-3 py-1 rounded transition-all text-xs sm:text-sm"
                    title="Run Code"
                >
                    <Play size={14} /> <span className="hidden sm:inline">Run</span>
                </button>
                <button
                    onClick={onReload}
                    disabled={isLoading || isPreviewLoading}
                    className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-500 text-white px-1.5 sm:px-2 py-1 rounded transition-colors"
                    title="Reload Preview"
                >
                    <RefreshCw size={14} />
                </button>
                <button
                    onClick={onDeploy}
                    disabled={isLoading || isPreviewLoading}
                    className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-2 sm:px-3 py-1 rounded transition-all text-xs sm:text-sm"
                    title="Deploy to Netlify"
                >
                    🚀 <span className="hidden sm:inline">Deploy</span>
                </button>
            </div>
        </div>
    );
}
