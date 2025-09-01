// Mock localStorage for Node.js environment
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn(),
};

global.localStorage = localStorageMock;

// Mock Date.now for consistent timing tests
global.mockDate = (timestamp) => {
  jest.spyOn(Date, 'now').mockReturnValue(timestamp);
};

// Mock performance.now for timing tests
global.performance = {
  now: jest.fn(() => Date.now()),
};

// Setup DOM environment
global.document.head.innerHTML = `
  <title>GSAT English Practice Test</title>
  <meta charset="UTF-8">
`;

global.document.body.innerHTML = `
  <div id="test-container"></div>
  <div id="chart-container"></div>
`;

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Reset all mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
  document.body.innerHTML = `
    <div id="test-container"></div>
    <div id="chart-container"></div>
  `;
});

// Cleanup after each test
afterEach(() => {
  jest.restoreAllMocks();
});