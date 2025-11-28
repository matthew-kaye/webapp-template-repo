import 'reflect-metadata';
import net from 'node:net';
import { jest } from '@jest/globals';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DataSource, DataSourceOptions } from 'typeorm';
import { AppModule } from '@app/app.module';
import { TypeOrmConfigService } from '@app/database/typeorm.config';
import {
  clearFunctionalTestContext,
  setFunctionalTestContext
} from '../functional-tests/context';

const PORT = Number(process.env.PORT ?? 4000);
let startedApp: INestApplication | null = null;
let sharedDataSource: DataSource | null = null;

jest.setTimeout(30_000);

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const applyDefaultEnv = () => {
  process.env.NODE_ENV = process.env.NODE_ENV ?? 'test';
  const databaseType = (process.env.DATABASE_TYPE ?? 'mysql').toLowerCase();
  process.env.DATABASE_TYPE = databaseType;
  process.env.DATABASE_DATABASE =
    process.env.DATABASE_DATABASE ?? (databaseType === 'sqlite' ? ':memory:' : 'webapp');
  process.env.DATABASE_SYNCHRONIZE = process.env.DATABASE_SYNCHRONIZE ?? 'true';
};

const isPortOpen = (port: number): Promise<boolean> =>
  new Promise((resolve) => {
    const socket = net.createConnection({ port }, () => {
      socket.end();
      resolve(true);
    });

    socket.on('error', () => {
      socket.destroy();
      resolve(false);
    });

    socket.setTimeout(500, () => {
      socket.destroy();
      resolve(false);
    });
  });

const waitForPort = async (port: number, attempts = 120, delayMs = 500): Promise<boolean> => {
  for (let i = 0; i < attempts; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    if (await isPortOpen(port)) return true;
    // eslint-disable-next-line no-await-in-loop
    await sleep(delayMs);
  }

  return false;
};

const buildDataSourceFromEnv = async (): Promise<DataSource> => {
  const configService = new ConfigService(process.env);
  const optionsFactory = new TypeOrmConfigService(configService);
  const options = optionsFactory.createTypeOrmOptions() as DataSourceOptions;

  const dataSource = new DataSource(options);
  if (!dataSource.isInitialized) {
    await dataSource.initialize();
  }

  return dataSource;
};

const ensureDatabase = async () => {
  const databaseType = (process.env.DATABASE_TYPE ?? 'mysql').toLowerCase();
  const dbPort = Number(process.env.DATABASE_PORT ?? 3306);
  if (databaseType !== 'mysql') return;

  const dbReady = await waitForPort(dbPort);
  if (!dbReady) {
    throw new Error(
      `Database is not reachable on port ${dbPort}. Ensure services are up via turbo start:docker-compose.`
    );
  }
};

const startApp = async (): Promise<DataSource> => {
  applyDefaultEnv();

  await ensureDatabase();

  const app = await NestFactory.create(AppModule);
  await app.listen(PORT);

  startedApp = app;
  return app.get(DataSource);
};

beforeAll(async () => {
  process.env.TZ = 'UTC';
  applyDefaultEnv();

  await ensureDatabase();

  const portAlreadyOpen = await isPortOpen(PORT);
  const dataSource = await (portAlreadyOpen ? buildDataSourceFromEnv() : startApp());
  sharedDataSource = dataSource;

  if (!portAlreadyOpen) {
    await waitForPort(PORT);
  }

  setFunctionalTestContext({
    baseUrl: `http://localhost:${PORT}`,
    dataSource
  });
});

afterAll(async () => {
  if (sharedDataSource?.isInitialized && sharedDataSource !== startedApp?.get(DataSource)) {
    await sharedDataSource.destroy();
  }

  if (startedApp) {
    await startedApp.close();
    startedApp = null;
  }

  clearFunctionalTestContext();
});
