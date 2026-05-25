import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', backgroundColor: '#fee2e2', color: '#991b1b', border: '1px solid #ef4444', borderRadius: '8px', margin: '20px', fontFamily: 'monospace' }}>
          <h1 style={{fontSize: '20px', fontWeight: 'bold'}}>React UI Crashed</h1>
          <p style={{marginTop: '10px'}}>{this.state.error?.message}</p>
          <pre style={{marginTop: '10px', fontSize: '12px', overflow: 'auto'}}>{this.state.error?.stack}</pre>
        </div>
      );
    }

    return this.props.children;
  }
}
