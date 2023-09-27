import { JestConfigWithTsJest } from "ts-jest";

const jestConfig: JestConfigWithTsJest = {
  clearMocks: true,
  preset: "ts-jest",
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/tests/prismaMock.ts"],
  // Ref: https://medium.com/@gokulc/configuring-module-resolution-on-typescript-and-jest-b17a93ebf54d
  moduleNameMapper: {
    "src/(.*)": "<rootDir>/src/$1",
  },
} as JestConfigWithTsJest;

export default jestConfig;
