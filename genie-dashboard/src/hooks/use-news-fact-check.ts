import { useCallback, useEffect, useRef, useState } from 'react';
import { API_BASE_URL } from '@/lib/constants';
import type { FactCheckResponse } from '@/types/fact-check';

const REQUEST_TIMEOUT_MS = 120000;
const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAY_MS = 4000;

interface FetchError extends Error {
  code?: string;
  payload?: unknown;
}

async function fetchNewsFactCheck({
  title,
  description,
  controller,
}: {
  title: string;
  description: string;
  controller: AbortController;
}): Promise<FactCheckResponse> {
  const requestBody = { title, description };
  let didTimeout = false;

  const timeoutId = setTimeout(() => {
    didTimeout = true;
    controller.abort();
  }, REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${API_BASE_URL}/news_fact_check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorText = await response.text();
      const httpError: FetchError = new Error(
        `API request failed with status ${response.status}: ${errorText}`
      );
      httpError.code = 'HTTP_ERROR';
      throw httpError;
    }

    const data = await response.json();

    if (data && typeof data === 'object' && Number(data.code) === 400) {
      const payloadError: FetchError = new Error(
        data.message ?? 'API responded with code 400'
      );
      payloadError.code = 'API_CODE_400';
      payloadError.payload = data;
      throw payloadError;
    }

    return data as FactCheckResponse;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      if (didTimeout) {
        const timeoutError: FetchError = new Error(
          `Request timed out after ${REQUEST_TIMEOUT_MS / 1000} seconds`
        );
        timeoutError.code = 'TIMEOUT';
        throw timeoutError;
      }
      const abortError: FetchError = new Error('Request aborted');
      abortError.code = 'ABORT';
      throw abortError;
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

interface UseNewsFactCheckReturn {
  data: FactCheckResponse | null;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => Promise<FactCheckResponse | null>;
}

export function useNewsFactCheck(
  title: string,
  description: string
): UseNewsFactCheckReturn {
  const [data, setData] = useState<FactCheckResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const controllerRef = useRef<AbortController | null>(null);
  const retryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasSuccessfulFetchRef = useRef(false);

  const clearActiveRetry = useCallback(() => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
  }, []);

  const cancelInFlightRequest = useCallback(() => {
    if (controllerRef.current) {
      controllerRef.current.abort();
      controllerRef.current = null;
    }
  }, []);

  const resetState = useCallback(() => {
    setData(null);
    setIsLoading(false);
    setIsFetching(false);
    setIsError(false);
    setError(null);
    hasSuccessfulFetchRef.current = false;
  }, []);

  const executeFetch = useCallback(
    async ({ forceLoading = false } = {}): Promise<FactCheckResponse | null> => {
      if (!title || !description) {
        resetState();
        return null;
      }

      clearActiveRetry();
      cancelInFlightRequest();

      const controller = new AbortController();
      controllerRef.current = controller;

      if (!hasSuccessfulFetchRef.current || forceLoading) {
        setIsLoading(true);
      } else {
        setIsFetching(true);
      }

      setIsError(false);
      setError(null);

      try {
        const result = await fetchNewsFactCheck({ title, description, controller });
        hasSuccessfulFetchRef.current = true;
        setData(result);
        return result;
      } catch (fetchError) {
        if ((fetchError as FetchError)?.code === 'ABORT') {
          return null;
        }

        const normalizedError =
          fetchError instanceof Error
            ? fetchError
            : new Error('Failed to fetch fact check data');
        setIsError(true);
        setError(normalizedError);
        throw normalizedError;
      } finally {
        setIsLoading(false);
        setIsFetching(false);
      }
    },
    [title, description, cancelInFlightRequest, clearActiveRetry, resetState]
  );

  useEffect(() => {
    if (!title || !description) {
      resetState();
      return () => {
        clearActiveRetry();
        cancelInFlightRequest();
      };
    }

    setData(null);
    hasSuccessfulFetchRef.current = false;
    let isCancelled = false;

    const load = async (attempt = 0) => {
      try {
        await executeFetch();
      } catch (fetchError) {
        if (isCancelled || (fetchError as FetchError)?.code === 'ABORT') {
          return;
        }

        const nextAttempt = attempt + 1;
        if (nextAttempt > MAX_RETRY_ATTEMPTS) {
          console.warn('Max retry attempts reached for news fact check');
          return;
        }

        retryTimeoutRef.current = setTimeout(() => {
          load(nextAttempt);
        }, RETRY_DELAY_MS);
      }
    };

    load();

    return () => {
      isCancelled = true;
      clearActiveRetry();
      cancelInFlightRequest();
    };
  }, [title, description, executeFetch, resetState, clearActiveRetry, cancelInFlightRequest]);

  const refetch = useCallback(async (): Promise<FactCheckResponse | null> => {
    if (!title || !description) {
      return null;
    }
    clearActiveRetry();
    return executeFetch({ forceLoading: true });
  }, [executeFetch, title, description]);

  return { data, isLoading, isFetching, isError, error, refetch };
}
