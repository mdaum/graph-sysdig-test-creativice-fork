import {
  createDirectRelationship,
  Entity,
  IntegrationStep,
  IntegrationStepExecutionContext,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';
import { createAPIClient } from '../../client';

import { IntegrationConfig } from '../../config';
import { ACCOUNT_ENTITY_KEY } from '../account';
import { Steps, Entities, Relationships } from '../constants';
import { createPipelineEntity } from './converter';

export async function fetchPipelines({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);
  const accountEntity = (await jobState.getData(ACCOUNT_ENTITY_KEY)) as Entity;

  await apiClient.iteratePipelines(async (pipeline) => {
    const pipelineEntity = await jobState.addEntity(
      createPipelineEntity(pipeline),
    );

    await jobState.addRelationship(
      createDirectRelationship({
        _class: RelationshipClass.HAS,
        from: accountEntity,
        to: pipelineEntity,
      }),
    );
  });
}

export const pipelinesSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.PIPELINES,
    name: 'Fetch Pipelines',
    entities: [Entities.PIPELINE],
    relationships: [Relationships.ACCOUNT_HAS_PIPELINE],
    dependsOn: [Steps.ACCOUNT],
    executionHandler: fetchPipelines,
  },
];
