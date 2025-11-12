// 'use client';
// import { useState, useEffect, useRef, useCallback } from 'react';
// import { useSearchParams } from 'next/navigation';
// import { Loader2, Play, RefreshCw } from 'lucide-react';
// import {Logo} from '@/components/logo';

// export default function EditorPage() {
//   const iframeRef = useRef<HTMLIFrameElement>(null);
//   const [code, setCode] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [isPreviewLoading, setIsPreviewLoading] = useState(false);
//   const searchParams = useSearchParams();
//   const prompt = searchParams.get('prompt');

//   // --- SANITIZE BACKEND CODE ---
//   const sanitizeCode = (raw: string) => {
//     return raw
//       .replace(/```/g, '')
//       .replace(/jsx/g, '')
//       .replace(/```javascript/g, '')
//       .replace(/```/g, '')
//       .trim();
//   };

//   // --- STREAM AI RESPONSE ---
//   useEffect(() => {
//     if (!prompt) return;
//     setIsLoading(true);
//     setCode('');

//     const url = `http://localhost:3001/stream-ai?prompt=${encodeURIComponent(
//       prompt
//     )}`;
//     const eventSource = new EventSource(url);

//     eventSource.onmessage = (event) => {
//       try {
//         const chunk = JSON.parse(event.data);
//         if (chunk && chunk !== 'end') {
//           setCode((prev) => sanitizeCode(prev + chunk));
//         }
//       } catch (e) {
//         console.error('Chunk parse error:', e);
//       }
//     };

//     eventSource.addEventListener('end', () => {
//       eventSource.close();
//       setIsLoading(false);
//     });

//     eventSource.onerror = (err) => {
//       console.error('Stream error:', err);
//       eventSource.close();
//       setIsLoading(false);
//     };

//     return () => {
//       eventSource.close();
//     };
//   }, [prompt]);

//   // --- CREATE REACT HTML WRAPPER ---
//   const createReactHTML = useCallback((reactCode: string) => {
//     return `<!DOCTYPE html>
// <html lang="en">
// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>React Preview</title>
//     <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
//     <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
//     <script src="https://cdn.jsdelivr.net/npm/@babel/standalone@7.23.5/babel.min.js"></script>
//     <script src="https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js"></script>
//    <script>
//   const fontsToUse = [
//   'Roboto:400,700',        
//   'Inter:400,700',         
//   'Poppins:400,500,700',   

//   'Montserrat:400,700',    
//   'Raleway:400,600,800',  
//   'Playfair Display:400,700', 

//   'Orbitron:400,700',      
//   'Fredoka One:400',        
//   'Pacifico:400',           
//   'Dancing Script:400,700'
//   ];
//   WebFont.load({
//     google: { families: fontsToUse },
//     active: () => {
//       document.body.style.fontFamily = fontsToUse.join(',');
//       const root = document.getElementById('root');
//       if(root) root.style.fontFamily = fontsToUse.join(',');
//     }
//   });
// </script>

//     <style>
//         body {
//             margin: 0;
//             padding: 0;
//             font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
//                 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
//                 sans-serif;
//             -webkit-font-smoothing: antialiased;
//             -moz-osx-font-smoothing: grayscale;
//         }
        
//         #root {
//             width: 100%;
//             height: 100vh;
//         }
        
//         .error-boundary {
//             padding: 20px;
//             background: #ffebee;
//             border: 1px solid #f44336;
//             border-radius: 4px;
//             margin: 20px;
//             color: #c62828;
//             font-family: monospace;
//             white-space: pre-wrap;
//         }
        
//         .loading {
//             display: flex;
//             align-items: center;
//             justify-content: center;
//             height: 100vh;
//             color: #666;
//             font-family: Arial, sans-serif;
//             flex-direction: column;
//             gap: 10px;
//         }
        
//         .spinner {
//             width: 40px;
//             height: 40px;
//             border: 4px solid #f3f3f3;
//             border-top: 4px solid #3498db;
//             border-radius: 50%;
//             animation: spin 1s linear infinite;
//         }
        
//         @keyframes spin {
//             0% { transform: rotate(0deg); }
//             100% { transform: rotate(360deg); }
//         }
//     </style>
// </head>
// <body>
//     <div id="root">
//         <div class="loading">
//             <div class="spinner"></div>
//             <div>Loading React & Babel...</div>
//         </div>
//     </div>
    
//     <script>
//         // Wait for all dependencies to load
//         function waitForDependencies() {
//             return new Promise((resolve) => {
//                 const checkDeps = () => {
//                     if (window.React && window.ReactDOM && window.Babel) {
//                         resolve();
//                     } else {
//                         setTimeout(checkDeps, 50);
//                     }
//                 };
//                 checkDeps();
//             });
//         }
        
//         waitForDependencies().then(() => {
//             class ErrorBoundary extends React.Component {
//                 constructor(props) {
//                     super(props);
//                     this.state = { hasError: false, error: null };
//                 }
                
//                 static getDerivedStateFromError(error) {
//                     return { hasError: true, error };
//                 }
                
//                 componentDidCatch(error, errorInfo) {
//                     console.error('React Error:', error, errorInfo);
//                 }
                
//                 render() {
//                     if (this.state.hasError) {
//                         return React.createElement('div', { className: 'error-boundary' }, [
//                             React.createElement('h3', { key: 'title' }, '⚠️ Runtime Error'),
//                             React.createElement('p', { key: 'message' }, this.state.error?.message || 'An error occurred'),
//                             React.createElement('details', { key: 'details' }, [
//                                 React.createElement('summary', { key: 'summary' }, 'Error Stack'),
//                                 React.createElement('pre', { key: 'stack' }, this.state.error?.stack || 'No stack trace')
//                             ])
//                         ]);
//                     }
                    
//                     return this.props.children;
//                 }
//             }
            
//             try {
//                 // Transform JSX using Babel
//                 const transformedCode = Babel.transform(\`${sanitizeCode(reactCode)}\`, {
//                     presets: ['react'],
//                     plugins: []
//                 }).code;
                
//                 // Execute transformed code
//                 eval(transformedCode);
                
//                 const root = ReactDOM.createRoot(document.getElementById('root'));
//                 root.render(
//                     React.createElement(ErrorBoundary, null,
//                         React.createElement(App, null)
//                     )
//                 );
//             } catch (error) {
//                 console.error('Code execution error:', error);
//                 const root = ReactDOM.createRoot(document.getElementById('root'));
//                 root.render(
//                     React.createElement('div', { className: 'error-boundary' }, [
//                         React.createElement('h3', { key: 'title' }, '⚠️ Compilation Error'),
//                         React.createElement('p', { key: 'message' }, error.message),
//                         React.createElement('pre', { key: 'stack' }, error.stack || 'No stack trace available')
//                     ])
//                 );
//             }
//         });
//     </script>
// </body>
// </html>`;
//   }, []);

//   // --- UPDATE PREVIEW ---
//   const updatePreview = useCallback(() => {
//     if (iframeRef.current && code.trim()) {
//       setIsPreviewLoading(true);
//       const htmlContent = createReactHTML(code);
      
//       // Use srcdoc to avoid blob URL issues
//       iframeRef.current.srcdoc = htmlContent;
      
//       // Clear loading state after iframe loads
//       const handleLoad = () => {
//         setIsPreviewLoading(false);
//         iframeRef.current?.removeEventListener('load', handleLoad);
//       };
      
//       iframeRef.current.addEventListener('load', handleLoad);
      
//       // Fallback timeout
//       setTimeout(() => setIsPreviewLoading(false), 3000);
//     }
//   }, [code, createReactHTML]);

//   // --- RUN CODE (manual) ---
//   const runCode = useCallback(() => {
//     updatePreview();
//   }, [updatePreview]);

//   // --- RELOAD PREVIEW ---
//   const reloadPreview = useCallback(() => {
//     if (iframeRef.current) {
//       iframeRef.current.srcdoc = '';
//       setTimeout(updatePreview, 100);
//     }
//   }, [updatePreview]);

//   // Auto-update preview when streaming finishes
//   useEffect(() => {
//     if (!isLoading && code.trim()) {
//       // Add a small delay to ensure the final code is complete
//       const timeoutId = setTimeout(updatePreview, 500);
//       return () => clearTimeout(timeoutId);
//     }
//   }, [isLoading, code, updatePreview]);

//   return (
//     <div className="h-screen flex flex-col bg-gray-900">
//   {/* Header */}
//   <div className="bg-gray-800/90 backdrop-blur-sm border-b border-gray-700 p-3 flex items-center justify-between shadow-sm">
//     <Logo />
//     <div className="flex items-center space-x-3">
//       {isLoading && (
//         <div className="flex items-center space-x-2 text-blue-400 text-sm">
//           <Loader2 className="animate-spin" size={14} />
//           <span>Generating code...</span>
//         </div>
//       )}
//       {isPreviewLoading && (
//         <div className="flex items-center space-x-2 text-yellow-400 text-sm">
//           <Loader2 className="animate-spin" size={14} />
//           <span>Compiling JSX...</span>
//         </div>
//       )}
//       <button
//         onClick={runCode}
//         disabled={isLoading || isPreviewLoading}
//         className="flex items-center gap-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-3 py-1 rounded transition-all text-sm"
//         title="Run Code"
//       >
//         <Play size={14} /> Run
//       </button>
//       <button
//         onClick={reloadPreview}
//         disabled={isLoading || isPreviewLoading}
//         className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-500 text-white px-2 py-1 rounded transition-colors"
//         title="Reload Preview"
//       >
//         <RefreshCw size={14} />
//       </button>
//       <button
//   onClick={async () => {
//     try {
//       if (!code.trim()) {
//         alert("No code to deploy!");
//         return;
//       }

//       // show small loader
//       setIsLoading(true);

//       const res = await fetch("http://localhost:3001/deploy", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ jsxCode: code }),
//       });

//       const data = await res.json();
//       if (data.url) {
//         window.open(data.url, "_blank");
//       } else {
//         alert("Deployment failed: " + data.error);
//       }
//     } catch (err) {
//       console.error("Deploy error", err);
//       alert("Deployment failed.");
//     } finally {
//       setIsLoading(false);
//     }
//   }}
//   disabled={isLoading || isPreviewLoading}
//   className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-3 py-1 rounded transition-all text-sm"
//   title="Deploy to Netlify"
// >
//   🚀 Deploy
// </button>

//     </div>
//   </div>

//   {/* Main Content */}
//   <div className="flex-1 flex overflow-hidden">
//     {/* Code Editor */}
//     <div className="w-1/2 flex flex-col bg-[#1e1e2e] border-r border-gray-700">
//       <div className="px-4 py-2 border-b border-gray-600 flex items-center justify-between text-gray-300 text-sm font-medium">
//         App.jsx
//         {isLoading && <Loader2 className="animate-spin text-blue-400" size={12} />}
//       </div>
//       <div className="flex-1 relative">
//         <textarea
//           value={code}
//           onChange={(e) => setCode(sanitizeCode(e.target.value))}
//           className="absolute inset-0 w-full h-full bg-transparent text-green-400 font-mono text-sm p-4 outline-none resize-none leading-relaxed placeholder:text-gray-500"
//           placeholder="Streaming JSX code will appear here..."
//         />
//       </div>
//     </div>

//     {/* Preview */}
//     <div className="w-1/2 relative bg-white">
//       <div className="px-4 py-2 border-b border-gray-600 flex items-center justify-between bg-gray-100 text-gray-800 text-sm font-medium">
//         Preview
//         <div className="flex items-center space-x-2">
//           {isPreviewLoading && <Loader2 className="animate-spin text-blue-400" size={14} />}
//           <div className="flex gap-1">
//             <span className="w-3 h-3 bg-red-500 rounded-full" />
//             <span className="w-3 h-3 bg-yellow-500 rounded-full" />
//             <span className="w-3 h-3 bg-green-500 rounded-full" />
//           </div>
//         </div>
//       </div>

//       <iframe
//         ref={iframeRef}
//         className="w-full h-full border-none bg-white"
//         style={{ height: 'calc(100% - 36px)' }}
//         sandbox="allow-scripts allow-same-origin"
//         title="React Preview"
//       />

//       {isPreviewLoading && (
//         <div className="absolute inset-0 bg-white bg-opacity-70 flex flex-col items-center justify-center gap-2">
//           <Loader2 className="animate-spin text-blue-500" size={32} />
//           <span className="text-gray-600 text-sm">Compiling JSX...</span>
//         </div>
//       )}
//     </div>
//   </div>
// </div>

//   );
// }

'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Loader2, Play, RefreshCw } from 'lucide-react';
import {Logo} from '@/components/logo';

export default function EditorPage() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
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

  // --- PROPERLY ESCAPE CODE FOR TEMPLATE LITERAL ---
  const escapeForTemplate = (code: string) => {
    return code
      .replace(/\\/g, '\\\\')  // Escape backslashes first
      .replace(/`/g, '\\`')    // Escape backticks
      .replace(/\$/g, '\\$');  // Escape dollar signs
  };

  // --- STREAM AI RESPONSE ---
  useEffect(() => {
    if (!prompt) return;
    setIsLoading(true);
    setCode('');

    const url = `http://localhost:3001/stream-ai?prompt=${encodeURIComponent(
      prompt
    )}`;
    const eventSource = new EventSource(url);

    eventSource.onmessage = (event) => {
      try {
        const chunk = JSON.parse(event.data);
        if (chunk && chunk !== 'end') {
          setCode((prev) => sanitizeCode(prev + chunk));
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

  // --- CREATE REACT HTML WRAPPER ---
  const createReactHTML = useCallback((reactCode: string) => {
    const escapedCode = escapeForTemplate(reactCode);
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>React Preview</title>
    <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@babel/standalone@7.23.5/babel.min.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js"></script>
   <script>
  const fontsToUse = [
  'Roboto:400,700',        
  'Inter:400,700',         
  'Poppins:400,500,700',   
  'Montserrat:400,700',    
  'Raleway:400,600,800',  
  'Playfair Display:400,700', 
  'Orbitron:400,700',      
  'Fredoka One:400',        
  'Pacifico:400',           
  'Dancing Script:400,700'
  ];
  WebFont.load({
    google: { families: fontsToUse },
    active: () => {
      document.body.style.fontFamily = fontsToUse.join(',');
      const root = document.getElementById('root');
      if(root) root.style.fontFamily = fontsToUse.join(',');
    }
  });
</script>

    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
                'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
                sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }
        
        #root {
            width: 100%;
            height: 100vh;
        }
        
        .error-boundary {
            padding: 20px;
            background: #ffebee;
            border: 1px solid #f44336;
            border-radius: 4px;
            margin: 20px;
            color: #c62828;
            font-family: monospace;
            white-space: pre-wrap;
        }
        
        .loading {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            color: #666;
            font-family: Arial, sans-serif;
            flex-direction: column;
            gap: 10px;
        }
        
        .spinner {
            width: 40px;
            height: 40px;
            border: 4px solid #f3f3f3;
            border-top: 4px solid #3498db;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>
</head>
<body>
    <div id="root">
        <div class="loading">
            <div class="spinner"></div>
            <div>Loading React & Babel...</div>
        </div>
    </div>
    
    <script>
        // Wait for all dependencies to load
        function waitForDependencies() {
            return new Promise((resolve) => {
                const checkDeps = () => {
                    if (window.React && window.ReactDOM && window.Babel) {
                        resolve();
                    } else {
                        setTimeout(checkDeps, 50);
                    }
                };
                checkDeps();
            });
        }
        
        waitForDependencies().then(() => {
            class ErrorBoundary extends React.Component {
                constructor(props) {
                    super(props);
                    this.state = { hasError: false, error: null };
                }
                
                static getDerivedStateFromError(error) {
                    return { hasError: true, error };
                }
                
                componentDidCatch(error, errorInfo) {
                    console.error('React Error:', error, errorInfo);
                }
                
                render() {
                    if (this.state.hasError) {
                        return React.createElement('div', { className: 'error-boundary' }, [
                            React.createElement('h3', { key: 'title' }, '⚠️ Runtime Error'),
                            React.createElement('p', { key: 'message' }, this.state.error?.message || 'An error occurred'),
                            React.createElement('details', { key: 'details' }, [
                                React.createElement('summary', { key: 'summary' }, 'Error Stack'),
                                React.createElement('pre', { key: 'stack' }, this.state.error?.stack || 'No stack trace')
                            ])
                        ]);
                    }
                    
                    return this.props.children;
                }
            }
            
            try {
                // The code is passed as an escaped string
                const reactCode = \`${escapedCode}\`;
                
                // Transform JSX using Babel
                const transformedCode = Babel.transform(reactCode, {
                    presets: ['react'],
                    plugins: []
                }).code;
                
                // Execute transformed code
                eval(transformedCode);
                
                const root = ReactDOM.createRoot(document.getElementById('root'));
                root.render(
                    React.createElement(ErrorBoundary, null,
                        React.createElement(App, null)
                    )
                );
            } catch (error) {
                console.error('Code execution error:', error);
                const root = ReactDOM.createRoot(document.getElementById('root'));
                root.render(
                    React.createElement('div', { className: 'error-boundary' }, [
                        React.createElement('h3', { key: 'title' }, '⚠️ Compilation Error'),
                        React.createElement('p', { key: 'message' }, error.message),
                        React.createElement('pre', { key: 'stack' }, error.stack || 'No stack trace available')
                    ])
                );
            }
        });
    </script>
</body>
</html>`;
  }, []);

  // --- UPDATE PREVIEW ---
  const updatePreview = useCallback(() => {
    if (iframeRef.current && code.trim()) {
      setIsPreviewLoading(true);
      const htmlContent = createReactHTML(code);
      
      // Use srcdoc to avoid blob URL issues
      iframeRef.current.srcdoc = htmlContent;
      
      // Clear loading state after iframe loads
      const handleLoad = () => {
        setIsPreviewLoading(false);
        iframeRef.current?.removeEventListener('load', handleLoad);
      };
      
      iframeRef.current.addEventListener('load', handleLoad);
      
      // Fallback timeout
      setTimeout(() => setIsPreviewLoading(false), 3000);
    }
  }, [code, createReactHTML]);

  // --- RUN CODE (manual) ---
  const runCode = useCallback(() => {
    updatePreview();
  }, [updatePreview]);

  // --- RELOAD PREVIEW ---
  const reloadPreview = useCallback(() => {
    if (iframeRef.current) {
      iframeRef.current.srcdoc = '';
      setTimeout(updatePreview, 100);
    }
  }, [updatePreview]);

  // Auto-update preview when streaming finishes
  useEffect(() => {
    if (!isLoading && code.trim()) {
      // Add a small delay to ensure the final code is complete
      const timeoutId = setTimeout(updatePreview, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [isLoading, code, updatePreview]);

  return (
    <div className="h-screen flex flex-col bg-gray-900">
  {/* Header */}
  <div className="bg-gray-800/90 backdrop-blur-sm border-b border-gray-700 p-3 flex items-center justify-between shadow-sm">
    <Logo />
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
        onClick={runCode}
        disabled={isLoading || isPreviewLoading}
        className="flex items-center gap-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-3 py-1 rounded transition-all text-sm"
        title="Run Code"
      >
        <Play size={14} /> Run
      </button>
      <button
        onClick={reloadPreview}
        disabled={isLoading || isPreviewLoading}
        className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-500 text-white px-2 py-1 rounded transition-colors"
        title="Reload Preview"
      >
        <RefreshCw size={14} />
      </button>
      <button
  onClick={async () => {
    try {
      if (!code.trim()) {
        alert("No code to deploy!");
        return;
      }

      // show small loader
      setIsLoading(true);

      const res = await fetch("http://localhost:3001/deploy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jsxCode: code }),
      });

      const data = await res.json();
      if (data.url) {
        window.open(data.url, "_blank");
      } else {
        alert("Deployment failed: " + data.error);
      }
    } catch (err) {
      console.error("Deploy error", err);
      alert("Deployment failed.");
    } finally {
      setIsLoading(false);
    }
  }}
  disabled={isLoading || isPreviewLoading}
  className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-3 py-1 rounded transition-all text-sm"
  title="Deploy to Netlify"
>
  🚀 Deploy
</button>

    </div>
  </div>

  {/* Main Content */}
  <div className="flex-1 flex overflow-hidden">
    {/* Code Editor */}
    <div className="w-1/2 flex flex-col bg-[#1e1e2e] border-r border-gray-700">
      <div className="px-4 py-2 border-b border-gray-600 flex items-center justify-between text-gray-300 text-sm font-medium">
        App.jsx
        {isLoading && <Loader2 className="animate-spin text-blue-400" size={12} />}
      </div>
      <div className="flex-1 relative">
        <textarea
          value={code}
          onChange={(e) => setCode(sanitizeCode(e.target.value))}
          className="absolute inset-0 w-full h-full bg-transparent text-green-400 font-mono text-sm p-4 outline-none resize-none leading-relaxed placeholder:text-gray-500"
          placeholder="Streaming JSX code will appear here..."
        />
      </div>
    </div>

    {/* Preview */}
    <div className="w-1/2 relative bg-white">
      <div className="px-4 py-2 border-b border-gray-600 flex items-center justify-between bg-gray-100 text-gray-800 text-sm font-medium">
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
        className="w-full h-full border-none bg-white"
        style={{ height: 'calc(100% - 36px)' }}
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
  </div>
</div>
  );
}