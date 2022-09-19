import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';
import { SysdigAccount } from '../../types';

import { Entities } from '../constants';

export function getScannerKey(id: number): string {
  return `sysdig_scanner:${id}`;
}

export function createScannerEntity(data: SysdigAccount): Entity {
  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        _key: getScannerKey(data.id as number),
        _type: Entities.SCANNER._type,
        _class: Entities.SCANNER._class,
        id: (data.id as number).toString(),
        name: data.name,
        displayName: `${data.firstName} ${data.lastName}`,
        username: data.username,
        version: data.version,
        products: data.products,
        category: ['image'],
        function: ['scanning'],
      },
    },
  });
}
