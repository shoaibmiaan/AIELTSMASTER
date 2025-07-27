'use client';

import React, { Component, ErrorInfo } from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error: string | null;
  info: string | null;
}

class ErrorBoundary extends Component<React.PropsWithChildren, ErrorBoundaryState> {
  constructor(props: React.PropsWithChildren) {
    super(props);
    this.state = { hasError: false, error: '', info: '' };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error.message };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    this.setState({
      error: error.message,
      info: info.componentStack,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-message-container">
          <h1 className="text-xl text-red-600">Something went wrong.</h1>
          <details>
            <summary>Click for details</summary>
            <p>{this.state.error}</p>
            <pre>{this.state.info}</pre>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
