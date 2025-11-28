import { DataSource } from 'typeorm';

export type FunctionalTestContext = {
  baseUrl: string;
  dataSource: DataSource;
};

declare global {
  // eslint-disable-next-line no-var
  var __apiFunctionalContext: FunctionalTestContext | undefined;
}

export const setFunctionalTestContext = (context: FunctionalTestContext) => {
  globalThis.__apiFunctionalContext = context;
};

export const clearFunctionalTestContext = () => {
  globalThis.__apiFunctionalContext = undefined;
};

export const getFunctionalTestContext = (): FunctionalTestContext => {
  const context = globalThis.__apiFunctionalContext;

  if (!context) {
    throw new Error(
      'Functional test context has not been initialised. Make sure setup-functional.ts is loaded and its beforeAll has completed.'
    );
  }

  return context;
};

export const waitForFunctionalTestContext = async (
  maxWaitMs = 10000,
  checkIntervalMs = 100
): Promise<FunctionalTestContext> => {
  const startTime = Date.now();

  while (Date.now() - startTime < maxWaitMs) {
    const context = globalThis.__apiFunctionalContext;
    if (context) {
      return context;
    }
    await new Promise((resolve) => setTimeout(resolve, checkIntervalMs));
  }

  throw new Error(
    `Functional test context was not initialised within ${maxWaitMs}ms. Make sure setup-functional.ts is loaded.`
  );
};

export {};
