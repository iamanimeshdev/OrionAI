// deploy.js
import fetch from "node-fetch";
import AdmZip from "adm-zip";
import * as babel from "@babel/core";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function deployToNetlify(jsxCode) {
  try {
    // 1️⃣ Clean the JSX code
    let cleanedJSX = jsxCode.trim();

    // Remove markdown code blocks if present
    if (cleanedJSX.startsWith('```')) {
      cleanedJSX = cleanedJSX.replace(/```jsx?\n?/g, '').replace(/```\n?$/g, '');
    }

    console.log("Original JSX (first 200 chars):", cleanedJSX.substring(0, 200));

    // 2️⃣ Transform JSX to plain JavaScript using Babel
    let transformedCode;
    try {
      const result = babel.transformSync(cleanedJSX, {
        presets: ['@babel/preset-react'],
        filename: 'app.jsx'
      });
      transformedCode = result.code;

      console.log("✅ Babel transformation successful");

    } catch (babelError) {
      console.error("❌ Babel transformation error:", babelError);
      throw new Error(`JSX compilation failed: ${babelError.message}`);
    }

    // 3️⃣ Create index.html content
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>AI Generated App</title>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js"></script>
  <style>
    body { 
      margin: 0; 
      padding: 0; 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
    }
    .error-boundary {
      padding: 20px;
      background: #1a1a1a;
      color: #ff6b6b;
      min-height: 100vh;
      font-family: 'Courier New', monospace;
    }
    .error-boundary h3 { 
      color: #ff6b6b; 
      margin: 0 0 10px 0; 
      font-size: 24px; 
    }
    .error-boundary p { 
      color: #ffa07a; 
      margin: 10px 0; 
      font-size: 16px; 
    }
    .error-boundary pre {
      background: #2d2d2d;
      padding: 15px;
      border-radius: 5px;
      overflow-x: auto;
      color: #e0e0e0;
      font-size: 14px;
      line-height: 1.5;
      white-space: pre-wrap;
      word-wrap: break-word;
    }
  </style>
</head>
<body>
  <div id="root"></div>
  
  <script>
    // Error Boundary Component
    class ErrorBoundary extends React.Component {
      constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
      }

      static getDerivedStateFromError(error) {
        return { hasError: true };
      }

      componentDidCatch(error, errorInfo) {
        console.error('React Error Boundary caught:', error, errorInfo);
        this.setState({ error, errorInfo });
      }

      render() {
        if (this.state.hasError) {
          return React.createElement('div', { className: 'error-boundary' },
            React.createElement('h3', null, '⚠️ Runtime Error'),
            React.createElement('p', null, 'Error: ' + (this.state.error?.toString() || 'Unknown error')),
            React.createElement('pre', null, this.state.errorInfo?.componentStack || 'No stack trace available')
          );
        }
        return this.props.children;
      }
    }
  </script>
  
  <!-- Load the compiled app code -->
  <script src="app.js"></script>
  
  <script>
    // Render the app after it's loaded
    (function() {
      try {
        console.log('Rendering app...');
        
        if (typeof App === 'undefined') {
          throw new Error('App component is not defined. Check your JSX code.');
        }
        
        const rootElement = document.getElementById('root');
        const root = ReactDOM.createRoot(rootElement);
        root.render(
          React.createElement(ErrorBoundary, null,
            React.createElement(App, null)
          )
        );
        
        console.log('✅ App rendered successfully');
        
      } catch (error) {
        console.error('❌ Initialization error:', error);
        const rootElement = document.getElementById('root');
        const root = ReactDOM.createRoot(rootElement);
        root.render(
          React.createElement('div', { className: 'error-boundary' },
            React.createElement('h3', null, '⚠️ Compilation Error'),
            React.createElement('p', null, 'Error: ' + error.message),
            React.createElement('pre', null, error.stack || 'No stack trace available')
          )
        );
      }
    })();
  </script>
</body>
</html>`;

    // 4️⃣ Create Zip in memory (No FS operations)
    const zip = new AdmZip();
    zip.addFile("app.js", Buffer.from(transformedCode, "utf8"));
    zip.addFile("index.html", Buffer.from(htmlContent, "utf8"));

    // Get zip as buffer
    const zipBuffer = zip.toBuffer();

    console.log("📦 Zip created in memory, size:", zipBuffer.length);

    // 5️⃣ Create a new site on Netlify
    const siteResponse = await fetch("https://api.netlify.com/api/v1/sites", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.NETLIFY_AUTH_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: `ai-app-${Date.now()}`,
      }),
    });

    if (!siteResponse.ok) {
      const errorText = await siteResponse.text();
      throw new Error(`Failed to create site: ${errorText}`);
    }

    const siteData = await siteResponse.json();
    console.log("✅ Site created:", siteData.id);

    // 6️⃣ Deploy the zip buffer
    const deployUrl = `https://api.netlify.com/api/v1/sites/${siteData.id}/deploys`;

    const deployResponse = await fetch(deployUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.NETLIFY_AUTH_TOKEN}`,
        "Content-Type": "application/zip",
      },
      body: zipBuffer,
    });

    if (!deployResponse.ok) {
      const errorText = await deployResponse.text();
      throw new Error(`Failed to deploy: ${errorText}`);
    }

    const deployData = await deployResponse.json();
    console.log("✅ Deploy successful:", deployData.id);

    return {
      success: true,
      url: deployData.ssl_url || deployData.url || `https://${siteData.name}.netlify.app`,
      deployId: deployData.id,
      siteId: siteData.id
    };
  } catch (error) {
    console.error("❌ Netlify Deploy Error:", error);
    return { success: false, error: error.message };
  }
}