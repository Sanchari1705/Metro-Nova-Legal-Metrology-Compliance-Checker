import {
  Component,
  type ComponentType,
  type ErrorInfo,
  type ReactNode,
} from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  FallbackComponent?: ComponentType<ErrorFallbackProps>;
  /** Changing this clears a caught error. Pass the route to recover on navigation. */
  resetKey?: unknown;
}

interface ErrorBoundaryState {
  error: Error | null;
}

function toError(value: unknown): Error {
  if (value instanceof Error) {
    return value;
  }
  if (typeof value === 'string') {
    return new Error(value);
  }
  try {
    return new Error(JSON.stringify(value));
  } catch {
    return new Error(String(value));
  }
}

function DefaultFallback({ error, resetError }: ErrorFallbackProps) {
  return (
    <div className="flex min-h-[100dvh] w-full items-center justify-center bg-[#f2eee4] p-6 text-[#182735]">
      <div className="w-full max-w-lg text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f6d7c8] text-[#9e493c]">
          <AlertTriangle size={25} aria-hidden="true" />
        </div>
        <p className="mt-7 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#b87535]">Metro Nova / service notice</p>
        <h1 className="mt-3 text-2xl font-bold tracking-[-0.04em]">
          Something needs attention
        </h1>
        <p className="mt-2 text-sm leading-6 text-[#687671]">
          This part of the app hit an error. The rest of the app is still
          running.
        </p>
        {/* Dev only: messages can carry API responses and other internals. */}
        {import.meta.env.DEV ? (
          <pre className="mt-5 overflow-x-auto rounded-xl border border-[#e3c7bd] bg-[#fff7f3] p-3 text-left text-xs text-[#874238]">
            {error.message || String(error)}
          </pre>
        ) : null}
        <button
          type="button"
          onClick={resetError}
          data-testid="button-error-retry"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#182735] px-5 py-3 text-sm font-bold text-[#fbf8f0] hover:bg-[#263e4c]"
        >
          <RotateCcw size={16} aria-hidden="true" />
          Try again
        </button>
      </div>
    </div>
  );
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    return { error: toError(error) };
  }

  componentDidCatch(error: unknown, info: ErrorInfo): void {
    console.error(
      'ErrorBoundary caught an error:',
      toError(error),
      info.componentStack,
    );
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps): void {
    if (
      this.state.error !== null &&
      prevProps.resetKey !== this.props.resetKey
    ) {
      this.resetError();
    }
  }

  resetError = (): void => {
    this.setState({ error: null });
  };

  render(): ReactNode {
    const { error } = this.state;
    if (error === null) {
      return this.props.children;
    }
    const Fallback = this.props.FallbackComponent ?? DefaultFallback;
    return <Fallback error={error} resetError={this.resetError} />;
  }
}
