import React, { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Music2 } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Tubeflow UI Error caught by ErrorBoundary:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-6 text-cyan-400">
            <Music2 className="w-8 h-8 animate-pulse" />
          </div>

          <h1 className="text-2xl font-black text-white font-display mb-2">
            Tubeflow Encountered a Display Issue
          </h1>
          <p className="text-slate-400 text-sm max-w-md mx-auto mb-6">
            An unexpected error occurred while rendering the page. You can reload the application to restore your session.
          </p>

          <div className="flex items-center gap-3">
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-sm flex items-center gap-2 hover:opacity-90 transition-opacity shadow-lg shadow-cyan-500/20 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reload Application</span>
            </button>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
              }}
              className="px-5 py-2.5 rounded-xl bg-[#141a26] text-slate-300 hover:text-white border border-[#242f44] font-medium text-sm transition-colors cursor-pointer"
            >
              Try Again
            </button>
          </div>

          {this.state.error && (
            <div className="mt-8 p-4 rounded-xl bg-[#101520] border border-red-500/20 max-w-lg text-left overflow-auto text-xs text-red-400 font-mono">
              <div className="flex items-center gap-1.5 font-bold mb-1 text-red-300">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Error details:</span>
              </div>
              <p>{this.state.error.message || String(this.state.error)}</p>
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
