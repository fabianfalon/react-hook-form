import findRemovedFieldAndRemoveListener from './findRemovedFieldAndRemoveListener';

jest.mock('./removeAllEventListeners');

describe('findMissDomAndClean', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should return default fields value if nothing matches', () => {
    document.body.contains = jest.fn(() => true);
    const fields = {
      test: 'test',
    };
    expect(
      // @ts-ignore
      findRemovedFieldAndRemoveListener(fields, () => {}, {
        ref: { name: 'bill', type: 'radio' },
      }),
    ).toEqual(fields);
  });

  it('should remove options completely if option found and no option left', () => {
    document.body.contains = jest.fn(() => false);
    const disconnect = jest.fn();
    const fields = {
      test: {
        name: 'test',
        ref: {},
        options: [
          {
            ref: 'test',
            mutationWatcher: {
              disconnect,
            },
          },
        ],
      },
    };

    expect(
      // @ts-ignore
      findRemovedFieldAndRemoveListener(fields, () => {}, {
        ref: { name: 'test', type: 'radio' },
        options: [
          {
            mutationWatcher: {
              disconnect,
            },
            ref: {},
          },
        ],
      }),
    ).toMatchSnapshot();
  });

  it('should remove none radio field when found', () => {
    document.body.contains = jest.fn(() => false);
    const disconnect = jest.fn();
    const fields = {
      test: {
        name: 'test',
        ref: {},
        mutationWatcher: {
          disconnect,
        },
      },
      test1: {
        name: 'test',
        ref: {},
      },
    };

    expect(
      findRemovedFieldAndRemoveListener(fields, () => {}, {
        ref: { name: 'test', type: 'text' },
        mutationWatcher: {
          disconnect,
        },
      }),
    ).toMatchSnapshot();
  });

  it('should return undefined when empty ref', () => {
    const fields = {
      test: 'test',
    };
    expect(
      // @ts-ignore
      findRemovedFieldAndRemoveListener(fields, () => {}, {}),
    ).toEqual(undefined);
  });

  it('should work for radio type input', () => {
    document.body.contains = jest.fn(() => false);
    const disconnect = jest.fn();
    const fields = {
      test: {
        name: 'test',
        ref: {},
        mutationWatcher: {
          disconnect,
        },
      },
      test1: {
        name: 'test',
        ref: {
          type: 'radio',
        },
      },
    };

    expect(
      findRemovedFieldAndRemoveListener(fields, () => {}, {
        ref: { name: 'test', type: 'radio' },
        options: [
          { ref: 'test'}
        ],
        mutationWatcher: {
          disconnect,
        },
      }),
    ).toMatchSnapshot();
  });
});
