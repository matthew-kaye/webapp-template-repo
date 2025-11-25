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
    throw new Error('Functional test context has not been initialised');
  }

  return context;
};

export {};
