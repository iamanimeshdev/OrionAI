import { useState } from 'react';
import { Loader2, Check, Copy, ExternalLink, AlertCircle } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeployModalProps {
    isOpen: boolean;
    onClose: () => void;
    deployUrl: string | null;
    isLoading: boolean;
    error: string | null;
}

export function DeployModal({ isOpen, onClose, deployUrl, isLoading, error }: DeployModalProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        if (deployUrl) {
            navigator.clipboard.writeText(deployUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-gray-900 border-gray-800 text-gray-100 sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold text-white">
                        {isLoading ? 'Deploying your App...' : error ? 'Deployment Failed' : 'Deployment Successful!'}
                    </DialogTitle>
                    <DialogDescription className="text-gray-400">
                        {isLoading
                            ? 'Please wait while we bundle and deploy your application to the cloud.'
                            : error
                                ? 'Something went wrong during deployment. Please try again.'
                                : 'Your app is live! You can share this link with anyone.'}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col items-center justify-center py-6 space-y-4">
                    {isLoading && (
                        <div className="flex flex-col items-center space-y-4">
                            <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
                            <p className="text-sm text-gray-400">Building and optimizing...</p>
                        </div>
                    )}

                    {error && (
                        <div className="flex flex-col items-center space-y-2 text-center">
                            <AlertCircle className="h-12 w-12 text-red-500" />
                            <p className="text-red-400 text-sm bg-red-950/30 p-3 rounded-md border border-red-900/50 w-full font-mono">
                                {error}
                            </p>
                        </div>
                    )}

                    {!isLoading && !error && deployUrl && (
                        <div className="w-full space-y-4">
                            <div className="flex items-center justify-center">
                                <div className="h-16 w-16 bg-green-500/10 rounded-full flex items-center justify-center mb-2">
                                    <Check className="h-8 w-8 text-green-500" />
                                </div>
                            </div>

                            <div className="flex items-center space-x-2 mt-4">
                                <div className="grid flex-1 gap-2">
                                    <div className="bg-gray-950 border border-gray-800 rounded-md p-3 text-sm font-mono text-gray-300 break-all select-all">
                                        {deployUrl}
                                    </div>
                                </div>
                                <Button size="icon" variant="outline" onClick={handleCopy} className="shrink-0 border-gray-700 bg-gray-800 hover:bg-gray-700 text-gray-300">
                                    {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                                </Button>
                            </div>

                            <div className="flex justify-center pt-2">
                                <a href={deployUrl} target="_blank" rel="noopener noreferrer" className="w-full">
                                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium">
                                        <ExternalLink className="mr-2 h-4 w-4" /> Open Live Site
                                    </Button>
                                </a>
                            </div>
                        </div>
                    )}
                </div>

                {!isLoading && (
                    <DialogFooter className="sm:justify-start">
                        {/* Footer content if needed, basically close button is handled by open change or clicking outside */}
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    );
}
