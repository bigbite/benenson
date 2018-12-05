import Expose from '../Expose';

describe('Expose', () => {
  test('Use a single module exposed', () => {
    const mockFn = jest.fn();
    const using = Expose({ mockFn });

    using('mockFn');

    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  test('Use multiple modules exposed', () => {
    const mockFn1 = jest.fn();
    const mockFn2 = jest.fn();
    const using = Expose({ mockFn1, mockFn2 });

    using(['mockFn1', 'mockFn2']);

    expect(mockFn1).toHaveBeenCalledTimes(1);
    expect(mockFn2).toHaveBeenCalledTimes(1);
  });

  test('Pass in params to a module exposed', () => {
    const mockFn1 = jest.fn();
    const mockFn2 = jest.fn();
    const using = Expose({ mockFn1, mockFn2 });

    using([
      ['mockFn1', 'param1', 'param2'],
      'mockFn2',
    ]);

    expect(mockFn1).toHaveBeenCalledWith('param1', 'param2');
    expect(mockFn2).toHaveBeenCalledTimes(1);
  });

  test('Pass in object params to a module exposed', () => {
    const mockFn1 = jest.fn();
    const mockFn2 = jest.fn();
    const using = Expose({ mockFn1, mockFn2 });

    using([
      ['mockFn1', 'param1', 'param2'],
      ['mockFn2', { one: 1, two: 2 }],
    ]);

    expect(mockFn1).toHaveBeenCalledWith('param1', 'param2');
    expect(mockFn2).toHaveBeenCalledWith({ one: 1, two: 2 });
  });

  test('Pass in params to all module exposed', () => {
    const mockFn1 = jest.fn();
    const mockFn2 = jest.fn();
    const using = Expose({ mockFn1, mockFn2 });

    using([
      'mockFn1',
      'mockFn2',
    ], 'all');

    expect(mockFn1).toHaveBeenCalledWith('all');
    expect(mockFn2).toHaveBeenCalledWith('all');
  });

  test('Module specific params overrides params passed into all', () => {
    const mockFn1 = jest.fn();
    const mockFn2 = jest.fn();
    const using = Expose({ mockFn1, mockFn2 });

    using([
      ['mockFn1', 'ownParams'],
      'mockFn2',
    ], 'all');

    expect(mockFn1).toHaveBeenCalledWith('ownParams');
    expect(mockFn2).toHaveBeenCalledWith('all');
  });

  test('Throw error if module is not exposed', () => {
    const using = Expose();
    const fnName = 'mockFn';

    expect(() => {
      using(fnName);
    }).toThrowError(`The module \`${fnName}\` does not exist, or is not exposed for using.`);
  });
});
