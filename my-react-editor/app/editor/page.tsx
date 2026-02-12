'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { EditorHeader } from './_components/EditorHeader';
import { CodeEditor } from './_components/CodeEditor';
import { PreviewFrame } from './_components/PreviewFrame';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

import { DeployModal } from './_components/DeployModal';

import ProtectedRoute from "@/components/ProtectedRoute";

export default function EditorPage() {
  const [code, setCode] = useState('');


  const [executedCode, setExecutedCode] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  // Deployment State
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [deployUrl, setDeployUrl] = useState<string | null>(null);
  const [deployError, setDeployError] = useState<string | null>(null);
  const [isDeploying, setIsDeploying] = useState(false);

  const searchParams = useSearchParams();
  const prompt = searchParams.get('prompt');

  // --- SANITIZE BACKEND CODE ---
  const sanitizeCode = (raw: string) => {
    return raw
      .replace(/```/g, '')
      .replace(/jsx/g, '')
      .replace(/```javascript/g, '')
      .replace(/```/g, '')
      .trim();
  };

  // --- STREAM AI RESPONSE ---
  useEffect(() => {
    if (!prompt) return;
    setIsLoading(true);
    setCode('');
    setExecutedCode(''); // Clear preview?

    const url = `http://localhost:3001/stream-ai?prompt=${encodeURIComponent(
      prompt
    )}`;
    const eventSource = new EventSource(url);

    eventSource.onmessage = (event) => {
      try {
        const chunk = JSON.parse(event.data);
        if (chunk && chunk !== 'end') {
          setCode((prev) => {
            const newCode = sanitizeCode(prev + chunk);
            return newCode;
          });
        }
      } catch (e) {
        console.error('Chunk parse error:', e);
      }
    };

    eventSource.addEventListener('end', () => {
      eventSource.close();
      setIsLoading(false);
    });

    eventSource.onerror = (err) => {
      console.error('Stream error:', err);
      eventSource.close();
      setIsLoading(false);
    };

    return () => {
      eventSource.close();
    };
  }, [prompt]);

  // --- SYNC PREVIEW ON STREAM END ---
  useEffect(() => {
    // just auto-update when stream is done.
    if (!isLoading && code.trim()) {
      const timeout = setTimeout(() => {
        setExecutedCode(code);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [isLoading, code]);

  const handleRun = useCallback(() => {
    setExecutedCode(code);
  }, [code]);

  const handleReload = useCallback(() => {

    setExecutedCode('');
    setTimeout(() => setExecutedCode(code), 10);
  }, [code]);

  const handleDeploy = async () => {
    if (!code.trim()) {
      alert("No code to deploy!");
      return;
    }

    setIsDeployModalOpen(true);
    setIsDeploying(true);
    setDeployError(null);
    setDeployUrl(null);

    try {
      const res = await fetch("http://localhost:3001/deploy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jsxCode: code }),
      });

      const data = await res.json();
      if (data.url) {
        // Defensive check in case backend sends an object
        const urlStr = typeof data.url === 'object' ? data.url.url : data.url;
        setDeployUrl(urlStr);
      } else {
        setDeployError(data.error || "Unknown deployment error");
      }
    } catch (err: any) {
      console.error("Deploy error", err);
      setDeployError(err.message || "Failed to deploy. Check backend connection.");
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="h-screen flex flex-col bg-gray-900">
        <EditorHeader
          isLoading={isLoading}
          isPreviewLoading={isPreviewLoading}
          onRun={handleRun}
          onReload={handleReload}
          onDeploy={handleDeploy}
        />

        <div className="flex-1 overflow-hidden">
          <ResizablePanelGroup orientation="horizontal">
            <ResizablePanel defaultSize={50} minSize={20}>
              <CodeEditor
                code={code}
                onChange={setCode}
                isLoading={isLoading}
              />
            </ResizablePanel>
            <ResizableHandle withHandle className="bg-gray-700 w-1 hover:bg-blue-500 transition-colors" />
            <ResizablePanel defaultSize={50} minSize={20}>
              <PreviewFrame
                code={executedCode}
                isLoading={isLoading}
                isPreviewLoading={isPreviewLoading}
                setIsPreviewLoading={setIsPreviewLoading}
              />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>

        <DeployModal
          isOpen={isDeployModalOpen}
          onClose={() => setIsDeployModalOpen(false)}
          deployUrl={deployUrl}
          isLoading={isDeploying}
          error={deployError}
        />
      </div>
    </ProtectedRoute>
  );
}