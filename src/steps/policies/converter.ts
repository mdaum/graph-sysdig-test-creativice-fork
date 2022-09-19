import {
  createIntegrationEntity,
  Entity,
  parseTimePropertyValue,
} from '@jupiterone/integration-sdk-core';
import { Policy } from '../../types';

import { Entities } from '../constants';

export function getPolicyKey(identifier: string): string {
  return `sysdig_policy:${identifier}`;
}

export function createPolicyEntity(data: Policy): Entity {
  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        _key: getPolicyKey(data.identifier),
        _type: Entities.POLICY._type,
        _class: Entities.POLICY._class,
        id: data.id.toString(),
        name: data.name,
        title: data.name,
        identifier: data.identifier,
        summary: data.description,
        content: data.description,
        creationTimestamp: parseTimePropertyValue(data.creationTimestamp),
        updateTimestamp: parseTimePropertyValue(data.updateTimestamp),
      },
    },
  });
}
