import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, Home } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // We suppress the raw error trace visually, but log it silently for developers
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-ink-50 flex items-center justify-center p-4">
          <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-2xl max-w-lg w-full text-center border border-ink-100">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-10 h-10 text-red-500" />
            </div>
            <h1 className="text-3xl font-serif text-ink-900 mb-4">Something went wrong.</h1>
            <p className="text-ink-500 mb-8 font-light">
              We encountered an unexpected error while loading this page. Our technical team has been notified. Please return to the homepage to continue browsing.
            </p>
            <button
              onClick={() => window.location.href = '/'}
              className="bg-ink-900 text-white px-8 py-4 rounded-full font-medium tracking-wide uppercase text-sm hover:bg-ink-800 transition-colors flex items-center justify-center gap-2 mx-auto"
            >
              <Home className="w-4 h-4" />
              Return Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
