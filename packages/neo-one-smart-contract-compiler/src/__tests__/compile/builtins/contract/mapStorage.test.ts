import { helpers } from '../../../../__data__';

describe('MapStorage', () => {
  test('get, set, delete', async () => {
    const node = await helpers.startNode();

    const contract = await node.addContract(`
      import { MapStorage } from '@neo-one/smart-contract-internal';

      const storage = new MapStorage<string, number>(Buffer.from('prefix', 'utf8'));
      assertEqual(storage.get('foo'), undefined);

      storage.delete('foo');
      storage.set('foo', 10);
      assertEqual(storage.get('foo'), 10);

      storage.delete('foo');
      assertEqual(storage.get('foo'), undefined);
    `);

    await node.executeString(`
      import { Address, SmartContract } from '@neo-one/smart-contract';

      interface Contract {
        run(): void;
      }
      const contract = SmartContract.for<Contract>(Address.from('${contract.address}'));
      contract.run();
    `);
  });
});
