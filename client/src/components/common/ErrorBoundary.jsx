import { Component } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary caught:', error, info);
    }
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-screen flex items-center justify-center bg-light-gray px-4">
        <div className="max-w-md text-center bg-white border border-[#E5E7EB] rounded-2xl p-8">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle size={26} className="text-red-600" />
          </div>
          <h1 className="text-xl font-bold text-navy mb-2 font-[family-name:var(--font-heading)]">
            Something went wrong
          </h1>
          <p className="text-om-gray text-sm mb-6 font-[family-name:var(--font-caption)]">
            We hit an unexpected error. Try refreshing — if it persists, please contact us.
          </p>

          {import.meta.env.DEV && this.state.error && (
            <pre className="bg-red-50 text-red-700 text-xs text-left p-3 rounded-lg mb-4 overflow-x-auto font-mono">
              {this.state.error.toString()}
            </pre>
          )}

          <div className="flex gap-3 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 bg-orange hover:bg-orange-light text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors font-[family-name:var(--font-heading)]"
            >
              <RefreshCw size={14} /> Reload Page
            </button>
            <a
              href="/"
              className="inline-flex items-center px-5 py-2.5 bg-white border border-[#E5E7EB] hover:border-navy/30 text-navy text-sm font-semibold rounded-lg transition-colors font-[family-name:var(--font-heading)]"
            >
              Go Home
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
