import { Entity } from 'typeorm';
import { CasbinRule } from 'typeorm-adapter';

/**
 * Policy Entity
 */
@Entity()
export class Policy extends CasbinRule {}
