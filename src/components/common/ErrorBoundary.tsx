import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
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
    console.error('Uncaught error in ErrorBoundary:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="error-boundary" style={{ padding: '2rem', textAlign: 'center', background: 'var(--surface)', border: '1px solid var(--danger)', borderRadius: '12px', margin: '1rem 0' }}>
          <AlertTriangle size={48} style={{ color: 'var(--danger)', margin: '0 auto 1rem' }} />
          <h3>Something went wrong</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
            The {this.props.name || 'component'} failed to load.
          </p>
          <button 
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'var(--surface-hover)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', cursor: 'pointer' }}
          >
            <RefreshCw size={16} /> Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
