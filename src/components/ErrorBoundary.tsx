import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode | ((error: Error, reset: () => void) => ReactNode);
  name?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(
      `[ErrorBoundary${this.props.name ? ` (${this.props.name})` : ''}] Caught error:`,
      error,
      errorInfo
    );
  }

  public handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      if (typeof this.props.fallback === 'function') {
        return this.props.fallback(
          this.state.error || new Error('Unknown error'),
          this.handleReset
        );
      }
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="min-h-[200px] p-8 text-center text-slate-300 bg-[#0D1118] border border-white/[0.1] rounded-2xl m-4 flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-[#FF8A24] mb-3 font-mono font-bold">
            !
          </div>
          <h2 className="font-display text-lg font-bold text-white mb-2">
            Component Render Notice
          </h2>
          <p className="font-body text-xs text-[#A3ADBA] mb-4 max-w-md leading-relaxed">
            {this.state.error?.message || 'A non-fatal rendering issue was safely contained.'}
          </p>
          <button
            type="button"
            onClick={this.handleReset}
            className="px-4 py-2 rounded-xl text-xs font-mono font-medium bg-[#FF8A24] text-white hover:bg-[#FFA04D] transition-colors"
          >
            Retry Component
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
