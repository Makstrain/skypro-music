// jest.config.ts

import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./",
});

const config = {
  testEnvironment: "jsdom",

  testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],

  // Покрытие
  collectCoverageFrom: [
    "src/utils/filters.ts",
    "src/utils/formatTime.ts",
    "src/components/LikeButton/LikeButton.tsx",
    "src/components/Search/Search.tsx",
    "src/components/CenterBlock/CenterBlock.tsx",
  ],

  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "html"],

  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],

  testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/.next/"],

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};

export default createJestConfig(config);
