import { v4 as uuidv4 } from 'uuid';
import { ResourcePrefix } from '@src/common/enum/resource.enum';

export const generateResourceId = (prefix: ResourcePrefix) =>
  `${prefix}-${uuidv4()}`;
