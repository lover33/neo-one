import { helpers } from '../../../__data__';

describe('BreakStatementCompiler', () => {
  test('Basic for-loop break', async () => {
    await helpers.executeString(`
      let result = 0;
      for (let i = 0; i < 10; i++) {
        result += 10;
        if (i > 1) {
          break;
        }
      }

      if (result != 30) {
        throw 'Failure';
      }
    `);
  });

  test('Nested for-loop break', async () => {
    await helpers.executeString(`
      let result = 0;
      for (let i = 0; i < 10; i++) {
        result += 10;
        for (let j = 0; j < 10; j++) {
          if (j > 0) {
            break;
          } else {
            result += 1;
          }
        }
        if (i > 1) {
          break;
        }
      }

      if (result != 33) {
        throw 'Failure';
      }
    `);
  });

  test('break label', async () => {
    helpers.compileString(
      `
      let result = 0;
      foo:
      for (let i = 0; i < 10; i++) {
        result += 10;
        for (let j = 0; j < 10; j++) {
          if (j > 0) {
            break foo;
          } else {
            result += 1;
          }
        }
        if (i > 1) {
          break foo;
        }
      }

      if (result != 33) {
        throw 'Failure';
      }
    `,
      { type: 'error' },
    );
  });
});
