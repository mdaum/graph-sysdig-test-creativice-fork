import {
  createDirectRelationship,
  Entity,
  IntegrationStep,
  IntegrationStepExecutionContext,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';
import { createAPIClient } from '../../client';

import { IntegrationConfig } from '../../config';
import { Steps, Entities, Relationships } from '../constants';
import { createVulnerabilityEntity } from './converter';

export async function fetchVulnerabilities({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);

  await jobState.iterateEntities(
    { _type: Entities.PIPELINE._type },
    async (pipelineEntity) => {
      await apiClient.iterateVulnerabilities(
        pipelineEntity.id as string,
        async (vulnerability) => {
          console.log(vulnerability);
          const vulnerabilityEntity = await jobState.addEntity(
            createVulnerabilityEntity(vulnerability),
          );

          await jobState.addRelationship(
            createDirectRelationship({
              _class: RelationshipClass.HAS,
              from: pipelineEntity,
              to: vulnerabilityEntity,
            }),
          );
        },
      );
    },
  );
}

export const vulnerabilitiesSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.VULNERABILITIES,
    name: 'Fetch Vulnerabilities',
    entities: [Entities.VULNERABILITY],
    relationships: [Relationships.PIPELINE_HAS_VULNERABILITY],
    dependsOn: [Steps.PIPELINES],
    executionHandler: fetchVulnerabilities,
  },
];
