export const generatePreviewHTML = (code: string) => {
    // 1. Serialize the code safely to JSON to avoid syntax errors and XSS vectors
    // We escape '<' to prevent the browser from interpreting '</script>' inside the string.
    const safeCode = JSON.stringify(code).replace(/</g, '\\u003C');

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
            <div>Loading Preview...</div>
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
                // 2. Retrieve the safely injected code
                const userCode = ${safeCode};
                
                // Transform JSX using Babel
                // We wrap it in a try-catch block for transformation errors
                const transformedCode = Babel.transform(userCode, {
                    presets: ['react'],
                    // You can add more plugins here if needed
                }).code;
                
                // Execute transformed code
                // We execute at global scope so 'App' becomes available
                eval(transformedCode);
                
                const rootElement = document.getElementById('root');
                const root = ReactDOM.createRoot(rootElement);
                
                // We assume the user code defines a component named 'App'
                if (typeof App === 'undefined') {
                    throw new Error("No 'App' component found. Please define 'function App() { ... }'");
                }

                root.render(
                    React.createElement(ErrorBoundary, null,
                        React.createElement(App, null)
                    )
                );
            } catch (error) {
                console.error('Code execution error:', error);
                const rootElement = document.getElementById('root');
                // Check if root exists (it should)
                if (rootElement) {
                     // If ReactDOM root already exists we might need to unmount or just overwrite. 
                     // For simplicity in this error case, we'll just clear innerHTML and render error.
                     // But strictly speaking we should use createRoot again or reuse it.
                     const root = ReactDOM.createRoot(rootElement);
                     
                     root.render(
                        React.createElement('div', { className: 'error-boundary' }, [
                            React.createElement('h3', { key: 'title' }, '⚠️ Compilation/Execution Error'),
                            React.createElement('p', { key: 'message' }, error.message),
                            React.createElement('pre', { key: 'stack' }, error.stack || 'No stack trace available')
                        ])
                    );
                }
            }
        });
    </script>
</body>
</html>`;
};
