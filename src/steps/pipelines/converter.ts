import {
  createIntegrationEntity,
  Entity,
  parseTimePropertyValue,
} from '@jupiterone/integration-sdk-core';
import { SysdigPipeline } from '../../types';

import { Entities } from '../constants';

export function getPipelineKey(id: string): string {
  return `sysdig_image_scan:${id}`;
}

export function createPipelineEntity(pipeline: SysdigPipeline): Entity {
  return createIntegrationEntity({
    entityData: {
      source: pipeline,
      assign: {
        _key: getPipelineKey(pipeline.id),
        _type: Entities.PIPELINE._type,
        _class: Entities.PIPELINE._class,
        id: pipeline.id,
        storedAt: parseTimePropertyValue(pipeline.storedAt),
        imageId: pipeline.imageId,
        name: pipeline.imagePullString,
        imagePullString: pipeline.imagePullString,
        vulnsBySev: pipeline.vulnsBySev,
        exploitCount: pipeline.exploitCount,
        policyEvaluationsPassed: pipeline.policyEvaluationsPassed,
      },
    },
  });
}
