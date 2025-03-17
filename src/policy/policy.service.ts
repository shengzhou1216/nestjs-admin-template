import path from 'path';

import { Injectable, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { Enforcer, newEnforcer } from 'casbin';
import { DataSource } from 'typeorm';
import TypeORMAdapter from 'typeorm-adapter';

import { Policy } from '@app/policy/policy.entity';
import { Role } from '@app/roles/role.entity';
import { User } from '@app/users/user.entity';

@Injectable()
export class PolicyService {
  private enforcer: Enforcer = null;
  private readonly logger = new Logger(PolicyService.name);

  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) { }

  async init() {
    await this.initEnforcer();
    await this.initPolicy();
  }

  private async initEnforcer() {
    const a = await TypeORMAdapter.newAdapter(
      {
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: 'root',
        database: 'nestjs-admin-tpl',
      },
      {
        customCasbinRuleEntity: Policy,
      },
    );
    this.enforcer = await newEnforcer(
      path.join(__dirname, '../config/casbin/rbac_model.conf'),
      a,
    );
  }

  private async initPolicy() {
    this.logger.log('Initializing policy ...');
    // get all user + role relations
    const users = await this.dataSource
      .getRepository(User)
      .createQueryBuilder()
      .relation('roles')
      .loadMany<User>();
    const groupPolicies = [];
    for (const user of users) {
      const roles = user.roles;
      for (const role of roles) {
        // g, alice, data2_admin
        groupPolicies.push([user.id, role.id]);
      }
    }
    const policies: string[][] = [];
    const roles = await this.dataSource
      .getRepository(Role)
      .createQueryBuilder()
      .relation('permissions')
      .loadMany<Role>();
    for (const role of roles) {
      const permissions = role.permissions;
      for (const permission of permissions) {
        // p, data2_admin, data2, read
        policies.push([role.id.toString(), permission.path, permission.method]);
      }
    }
    await this.enforcer.addPolicies(policies);
    await this.enforcer.addGroupingPolicies(groupPolicies);
    this.logger.log('Policy initialized');
  }

  /**
   * addRoleForUser adds a role for a user.
   * @param uid
   * @param rids
   */
  async addRolesForUser(uid: bigint, ...rids: bigint[]) {
    rids.forEach((rid) => {
      this.enforcer.addRoleForUser(uid.toString(), rid.toString());
    });
  }

  /**
   * deleteRoleForUser deletes a role for a user.
   * @param uid
   * @param rid
   */
  async deleteRoleForUser(uid: bigint, rid: bigint) {
    return this.enforcer.deleteRoleForUser(uid.toString(), rid.toString());
  }

  /**
   * addPolicy adds a rule to role.
   * @param sub role id
   * @param obj
   * @param act
   */
  async addPolicy(sub: string, obj: string, act: string) {
    return this.enforcer.addPolicy(sub, obj, act);
  }

  /**
   * deletePolicy deletes a rule from role.
   * @param sub
   * @param obj
   * @param act
   */
  async deletePolicy(sub: string, obj: string, act: string) {
    return this.enforcer.removePolicy(sub, obj, act);
  }

  /**
   * hasPermissionForUser determines whether a user has a permission.
   * Params:
   * whether the user has the permission.
   * @param uid user id
   * @param permissions  the permission, usually be (obj, act). It is actually the rule without the subject.
   */
  async hasPermissionForUser(uid: bigint, ...permissions: string[]) {
    return this.enforcer.hasPermissionForUser(uid.toString(), ...permissions);
  }
}
