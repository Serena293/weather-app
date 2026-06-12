import { Component, type ReactNode } from "react";

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(): void {
    // A production app can report this error to an observability service.
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="min-vh-100 bg-secondary d-flex align-items-center">
          <div className="container text-center text-dark">
            <h1>Something went wrong</h1>
            <p>The app could not display this page.</p>
            <button
              type="button"
              className="btn btn-dark"
              onClick={() => window.location.reload()}
            >
              Reload the app
            </button>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
