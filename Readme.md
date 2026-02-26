# OrionAI

A Website which makes other websites!!

## Overview

OrionAI is a powerful web application that allows users to generate React JSX code using AI and deploy it instantly to the web. Built with Next.js, Firebase, and Google's Gemini AI, it provides a seamless development experience.

## Features

- **AI-Powered Code Generation**: Generate React JSX code using Google's Gemini AI
- **Real-time Preview**: See your code come to life instantly in a live preview
- **One-Click Deployment**: Deploy your applications to Netlify with a single click
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Code Streaming**: Watch the AI generate code in real-time
- **Error Boundaries**: Safe preview environment with error handling

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, Google Gemini AI
- **Authentication**: Firebase Authentication
- **Deployment**: Netlify (auto-deployment)
- **Code Transformation**: Babel for JSX to JS conversion

## Getting Started

### Prerequisites

- Node.js 18+
- Firebase project with authentication enabled
- Google AI Gemini API key
- Netlify account for deployment

### Installation

1. Clone the repository:
```bash
git clone https://github.com/iamanimeshdev/OrionAI.git
cd OrionAI
```

2. Install dependencies:
```bash
# For the main app
cd my-react-editor
npm install

# For the backend
cd Backend
npm install
```

3. Set up environment variables:

Create `.env.local` in the root:
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id

GEMINI_API_KEY=your_google_gemini_api_key
NETLIFY_AUTH_TOKEN=your_netlify_auth_token
```

Create `.env` in the Backend folder:
```
GEMINI_API_KEY=your_google_gemini_api_key
NETLIFY_AUTH_TOKEN=your_netlify_auth_token
```

### Running the Application

1. Start the backend server:
```bash
cd Backend
npm run dev
```

2. Start the Next.js development server:
```bash
cd my-react-editor
npm run dev
```

3. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
OrionAI/
├── my-react-editor/          # Next.js frontend application
│   ├── app/                   # Next.js App Router
│   │   ├── editor/          # Code editor and preview page
│   │   ├── login/           # Login page
│   │   ├── signup/          # Signup page
│   │   ├── prompt/          # Prompt input page
│   │   └── layout.tsx       # Root layout
│   ├── components/           # Reusable UI components
│   ├── lib/                 # Utility functions and Firebase config
│   └── public/              # Static assets
├── Backend/                 # Node.js backend API
│   ├── index.js            # Main server file
│   ├── deploy.js           # Netlify deployment logic
│   └── package.json        # Backend dependencies
└── Readme.md              # This file
```

## How It Works

1. **User Authentication**: Users sign up/login using Firebase Authentication
2. **Prompt Input**: Users enter a prompt describing the website they want to create
3. **AI Code Generation**: The backend sends the prompt to Google's Gemini AI, which generates React JSX code
4. **Real-time Streaming**: The generated code streams back to the frontend in real-time
5. **Live Preview**: The JSX code is compiled and displayed in a live preview iframe
6. **One-Click Deployment**: Users can deploy their application to Netlify with a single click

## Key Components

### Frontend

- **CodeEditor**: Real-time code editor with syntax highlighting
- **PreviewFrame**: Live preview iframe with error boundaries
- **DeployModal**: Deployment interface with status tracking
- **ProtectedRoute**: Route protection for authenticated users

### Backend

- **Stream AI Endpoint**: SSE endpoint for streaming AI-generated code
- **Deploy Endpoint**: API for bundling and deploying to Netlify
- **Error Handling**: Comprehensive error handling and validation

## Deployment

### Local Development

1. Follow the installation steps above
2. Ensure all environment variables are set
3. Run both frontend and backend servers

### Production

1. Deploy the Next.js app to Vercel
2. Deploy the backend to a Node.js hosting service (e.g., Railway, Heroku)
3. Update environment variables in production
4. Ensure Netlify auth token has deployment permissions

## Security Considerations

- All API calls are authenticated using Firebase tokens
- Code is sanitized before execution in the preview environment
- Error boundaries prevent malicious code from crashing the application
- Environment variables are properly secured and not exposed to the client

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the code comments

---

**Built with ❤️ by the OrionAI Team**