import * as path from 'path';

import { newEnforcer } from 'casbin';

describe('Casbin Test', () => {
  test('test rbac', async () => {
    const enforcer = await newEnforcer(
      path.resolve(__dirname, './rbac_model.conf'),
      path.resolve(__dirname, './rbac_policy.csv'),
    );

    let res = await enforcer.enforce('alice', 'data1', 'read');
    expect(res).toBe(true);

    res = await enforcer.enforce('alice', 'data1', 'write');
    expect(res).toBe(false);

    res = await enforcer.enforce('bob', 'data2', 'write');
    expect(res).toBe(true);

    expect(await enforcer.enforce('data2_admin', 'data2', 'read')).toBe(true);
    expect(await enforcer.enforce('data2_admin', 'data2', 'write')).toBe(true);

    expect(await enforcer.getRolesForUser('alice')).toEqual(['data2_admin']);

    expect(await enforcer.enforce('alice', 'data2', 'write')).toBe(true);
    expect(await enforcer.enforce('alice', 'data2', 'read')).toBe(true);
  });
});
