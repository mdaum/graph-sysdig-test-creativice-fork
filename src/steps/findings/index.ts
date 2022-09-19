import {
  createDirectRelationship,
  IntegrationStep,
  IntegrationStepExecutionContext,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';
import { createAPIClient } from '../../client';

import { IntegrationConfig } from '../../config';
import { Steps, Entities, Relationships } from '../constants';
import { createFindingCveRelationship, createFindingEntity } from './converter';

export async function fetchFindings({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);

  await jobState.iterateEntities(
    { _type: Entities.IMAGE_SCAN._type },
    async (imageScanEntity) => {
      if (imageScanEntity?.id) {
        apiClient.iterateFindings(
          imageScanEntity.id as string,
          async (vulnerability) => {
            // console.log(JSON.stringify(vulnerability));
            const vulnerabilityDetails = await apiClient.fetchFindingDetails(
              imageScanEntity.id as string,
              vulnerability.id,
            );

            // console.log(vulnerabilityDetails);
            const findingEntity = createFindingEntity(vulnerabilityDetails);

            await jobState.addEntity(findingEntity);
            console.log('findingEntity added');

            await jobState.addRelationships([
              createDirectRelationship({
                _class: RelationshipClass.IDENTIFIED,
                from: imageScanEntity,
                to: findingEntity,
              }),
              createFindingCveRelationship(
                findingEntity,
                vulnerabilityDetails.vuln,
              ),
            ]);
          },
        );
      }
    },
  );
}

export const findingsSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.FINDINGS,
    name: 'Fetch Findings',
    entities: [Entities.FINDING, Entities.CVE],
    relationships: [Relationships.IMAGE_SCAN_IDENTIFIED_FINDING],
    dependsOn: [Steps.IMAGE_SCANS],
    executionHandler: fetchFindings,
  },
];
