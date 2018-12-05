/* eslint-disable no-underscore-dangle */
import Attribution from '../Attribution';

describe('Attribution', () => {
  test('Check __DEV__ output is as expected', () => {
    global.__DEV__ = true;
    const expectedOutput = 'WARNING: Development mode';

    expect(Attribution()).toBe(expectedOutput);
  });

  test('Check non __DEV__ output is as expected', () => {
    global.__DEV__ = false;
    const expectedOutput = 'Made by Big Bite Creative <https://bigbitecreative.com>';

    expect(Attribution()).toBe(expectedOutput);
  });
});
