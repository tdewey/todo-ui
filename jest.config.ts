import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^components/(.*)$': '<rootDir>/src/components/$1',
    '^hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^services/(.*)$': '<rootDir>/src/services/$1',
    '^helpers/(.*)$': '<rootDir>/src/helpers/$1',
    '^pages/(.*)$': '<rootDir>/src/pages/$1',
    '^types$': '<rootDir>/src/types/index.ts',
    '^enums$': '<rootDir>/src/enums/index.ts',
    '\\.(css|scss)$': 'identity-obj-proxy',
    '\\.(png|svg|jpg|jpeg|gif)$': '<rootDir>/src/__mocks__/fileMock.js',
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: '<rootDir>/tsconfig.jest.json',
    }],
  },
};

export default config;
