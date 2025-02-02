import { Component, ErrorInfo, ReactNode } from "react";

interface ErrorBoundaryProps {
    children: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(): ErrorBoundaryState {
        // Update state so the next render shows the fallback UI.
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        // You can also log the error to an error reporting service
        console.error("ErrorBoundary caught an error", error, errorInfo);
    }

    render(): ReactNode {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <div>
                    <h1>Something went wrong.</h1>
                    <p>Please try again later.</p>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
