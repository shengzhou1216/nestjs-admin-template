import { SetMetadata } from '@nestjs/common';

export const PERMISSION_KEY = 'permission';

export type PermissionMetadata = {
  name?: string;
  desc?: string;
};
/**
 * Permission decorator
 * @constructor
 * @param metadata PermissionMetadata
 */
export const Permission = (metadata: PermissionMetadata) => {
  return SetMetadata(PERMISSION_KEY, metadata);
};
