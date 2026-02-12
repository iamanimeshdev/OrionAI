import { useRef, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { generatePreviewHTML } from '../_utils/generatePreview';

interface PreviewFrameProps {
    code: string;
    isLoading: boolean;
    isPreviewLoading: boolean;
    setIsPreviewLoading: (loading: boolean) => void;
}

export function PreviewFrame({
    code,
    isLoading,
    isPreviewLoading,
    setIsPreviewLoading,
}: PreviewFrameProps) {
    const iframeRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        if (iframeRef.current && code.trim()) {
            setIsPreviewLoading(true);
            const htmlContent = generatePreviewHTML(code);
            iframeRef.current.srcdoc = htmlContent;

            const handleLoad = () => {
                setIsPreviewLoading(false);
                iframeRef.current?.removeEventListener('load', handleLoad);
            };

            iframeRef.current.addEventListener('load', handleLoad);

            // Safety timeout
            const timeoutId = setTimeout(() => setIsPreviewLoading(false), 3000);
            return () => {
                iframeRef.current?.removeEventListener('load', handleLoad);
                clearTimeout(timeoutId);
            };
        }
    }, [code, setIsPreviewLoading]);

    return (
        <div className="w-full h-full flex flex-col bg-white relative">
            <div className="px-4 py-2 border-b border-gray-600 flex items-center justify-between bg-gray-100 text-gray-800 text-sm font-medium shrink-0">
                Preview
                <div className="flex items-center space-x-2">
                    {isPreviewLoading && <Loader2 className="animate-spin text-blue-400" size={14} />}
                    <div className="flex gap-1">
                        <span className="w-3 h-3 bg-red-500 rounded-full" />
                        <span className="w-3 h-3 bg-yellow-500 rounded-full" />
                        <span className="w-3 h-3 bg-green-500 rounded-full" />
                    </div>
                </div>
            </div>

            <iframe
                ref={iframeRef}
                className="w-full flex-1 border-none bg-white"
                sandbox="allow-scripts allow-same-origin"
                title="React Preview"
            />

            {isPreviewLoading && (
                <div className="absolute inset-0 bg-white bg-opacity-70 flex flex-col items-center justify-center gap-2">
                    <Loader2 className="animate-spin text-blue-500" size={32} />
                    <span className="text-gray-600 text-sm">Compiling JSX...</span>
                </div>
            )}
        </div>
    );
}
