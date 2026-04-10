// Mock localStorage for Node.js test environment
const store: Record<string, string> = {};

const localStorageMock = {
  getItem: (key: string): string | null => store[key] ?? null,
  setItem: (key: string, value: string): void => {
    store[key] = value;
  },
  removeItem: (key: string): void => {
    delete store[key];
  },
  clear: (): void => {
    Object.keys(store).forEach((key) => delete store[key]);
  },
  get length(): number {
    return Object.keys(store).length;
  },
  key: (index: number): string | null => {
    return Object.keys(store)[index] ?? null;
  },
};

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

// Mock AsyncStorage
const asyncStore: Record<string, string> = {};

const AsyncStorageMock = {
  getItem: async (key: string): Promise<string | null> => asyncStore[key] ?? null,
  setItem: async (key: string, value: string): Promise<void> => {
    asyncStore[key] = value;
  },
  removeItem: async (key: string): Promise<void> => {
    delete asyncStore[key];
  },
  clear: async (): Promise<void> => {
    Object.keys(asyncStore).forEach((key) => delete asyncStore[key]);
  },
  getAllKeys: async (): Promise<string[]> => Object.keys(asyncStore),
  multiGet: async (keys: string[]): Promise<[string, string | null][]> =>
    keys.map((key) => [key, asyncStore[key] ?? null]),
  multiSet: async (keyValuePairs: [string, string][]): Promise<void> => {
    keyValuePairs.forEach(([key, value]) => {
      asyncStore[key] = value;
    });
  },
  multiRemove: async (keys: string[]): Promise<void> => {
    keys.forEach((key) => delete asyncStore[key]);
  },
};

// Mock @react-native-async-storage/async-storage
import { vi } from 'vitest';
vi.mock('@react-native-async-storage/async-storage', () => ({
  default: AsyncStorageMock,
}));

// Mock expo-haptics
vi.mock('expo-haptics', () => ({
  impactAsync: vi.fn(),
  notificationAsync: vi.fn(),
  ImpactFeedbackStyle: { Light: 'Light', Medium: 'Medium', Heavy: 'Heavy' },
  NotificationFeedbackType: { Success: 'Success', Error: 'Error', Warning: 'Warning' },
}));

// Mock expo-file-system
vi.mock('expo-file-system/legacy', () => ({
  documentDirectory: '/mock/documents/',
  writeAsStringAsync: vi.fn(),
  readAsStringAsync: vi.fn(),
  deleteAsync: vi.fn(),
  getInfoAsync: vi.fn().mockResolvedValue({ exists: false }),
  makeDirectoryAsync: vi.fn(),
  EncodingType: { UTF8: 'utf8', Base64: 'base64' },
}));

// Mock expo-sharing
vi.mock('expo-sharing', () => ({
  isAvailableAsync: vi.fn().mockResolvedValue(false),
  shareAsync: vi.fn(),
}));

// Mock react-native Platform
vi.mock('react-native', () => ({
  Platform: { OS: 'ios', select: (obj: any) => obj.ios ?? obj.default },
  Alert: { alert: vi.fn() },
  Dimensions: { get: () => ({ width: 390, height: 844 }) },
}));

// Mock expo-print
vi.mock('expo-print', () => ({
  printToFileAsync: vi.fn().mockResolvedValue({ uri: '/mock/file.pdf' }),
}));
