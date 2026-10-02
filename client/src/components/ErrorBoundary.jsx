import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an unhandled error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-bg flex items-center justify-center p-6 text-dark">
          <div className="max-w-xl w-full bg-white rounded-2xl border border-border p-8 shadow-card text-center space-y-4">
            <div className="w-12 h-12 rounded-xl bg-red-50 text-status-error flex items-center justify-center mx-auto text-xl font-bold border border-red-200">
              !
            </div>
            <h1 className="text-xl font-bold font-heading text-dark">Something went wrong</h1>
            <p className="text-xs text-slate-muted">
              An unexpected error occurred while rendering the page.
            </p>
            {this.state.error && (
              <pre className="text-left p-3 rounded-lg bg-slate-bg border border-border text-[11px] text-status-error overflow-x-auto">
                {this.state.error.toString()}
              </pre>
            )}
            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-hover shadow-xs transition"
              >
                Reload Page
              </button>
              <button
                onClick={() => window.location.href = '/dashboard'}
                className="px-4 py-2 rounded-xl bg-white border border-border text-dark text-xs font-semibold hover:bg-slate-hover transition"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
