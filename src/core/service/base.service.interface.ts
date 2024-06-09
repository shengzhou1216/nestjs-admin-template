import { ICrudService } from '@app/core/service/crud.service.interface';

export interface IBaseService<T, ID> extends ICrudService<T, ID> {}
