import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { BaseEntity } from '@app/common/entities/base.entity';
import { IBaseService } from '@app/core/service/base.service.interface';

@Injectable()
export class BaseService<T> implements IBaseService<T> {
  // protected readonly logger = new Logger(this.constructor.name);

  constructor(
    @InjectRepository(BaseEntity)
    protected readonly repository: Repository<T>,
  ) { }
  

  async create(entity: T): Promise<T> {
    return this.repository.save(entity);
  }

  async findAll(): Promise<T[]> {
    return this.repository.find();
  }

  async findById(id: ID): Promise<T> {
    return this.repository.findOneBy({ id } as unknown as FindOptionsWhere<T>);
  }

  async updateById(id: ID, entity: QueryDeepPartialEntity<T>): Promise<void> {
    await this.repository.update(id as any, entity);
  }

  async deleteById(id: ID): Promise<void> {
    await this.repository.softDelete(id as any);
  }

  saveOrUpdate(entity: T): Promise<T> {
    return this.repository.save(entity);
  }
}
