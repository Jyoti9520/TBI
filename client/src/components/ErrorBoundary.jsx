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
        <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-6 text-[#243447]">
          <div className="max-w-xl w-full bg-white rounded-2xl border border-[#D9CAB3] p-8 shadow-card text-center space-y-4">
            <div className="w-12 h-12 rounded-xl bg-red-100 text-red-700 flex items-center justify-center mx-auto text-xl font-bold">
              !
            </div>
            <h1 className="text-xl font-extrabold text-[#7A0B1A]">Something went wrong</h1>
            <p className="text-xs text-[#647C98]">
              An unexpected error occurred while rendering the page.
            </p>
            {this.state.error && (
              <pre className="text-left p-3 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-red-600 overflow-x-auto">
                {this.state.error.toString()}
              </pre>
            )}
            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 rounded-xl bg-[#7A0B1A] text-white text-xs font-bold hover:bg-[#5B0712] transition"
              >
                Reload Page
              </button>
              <button
                onClick={() => window.location.href = '/dashboard'}
                className="px-4 py-2 rounded-xl bg-white border border-[#D9CAB3] text-[#7A0B1A] text-xs font-bold hover:bg-slate-50 transition"
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
