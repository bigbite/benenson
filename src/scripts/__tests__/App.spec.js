import App from '../App';
import Attribution from '../modules/Attribution';

// Mock the module calls.
jest.mock('../modules/Attribution', () => jest.fn());

describe('App', () => {
  beforeAll(() => {
    App();
  });

  test('Attribution has been called', () => {
    expect(Attribution.mock.calls.length).toBe(1);
  });
});
