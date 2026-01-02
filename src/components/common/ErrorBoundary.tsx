import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class CommonErrorBoundary extends Component<Props, State> {
  state = { hasError: false };

  override static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('Error:', error, info);
  }

  override render() {
    if (this.state.hasError) {
      return <div>Error occurred</div>;
    }
    return this.props.children;
  }
}

export default CommonErrorBoundary;
