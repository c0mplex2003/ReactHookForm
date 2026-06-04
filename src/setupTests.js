import '@testing-library/jest-dom';

beforeAll(() => {
  window.alert = jest.fn();
});

beforeEach(() => {
  window.alert.mockClear();
});
