import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';
import { jest, beforeEach } from '@jest/globals';

import prisma from '../src/prisma';

jest.mock('../src/prisma', () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>(),
}));

beforeEach(() => {
  mockReset(prismaMock);
});

export const prismaMock: any = prisma as unknown as DeepMockProxy<PrismaClient>;
