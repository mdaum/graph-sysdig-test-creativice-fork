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
import { createPolicyEvaluationEntity } from './converter';

export async function fetchPolicyEvaluations({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);

  await jobState.iterateEntities(
    { _type: Entities.IMAGE_SCAN._type },
    async (imageScanEntity) => {
      if (imageScanEntity?.id) {
        await apiClient.iteratePolicyEvaluations(
          imageScanEntity.id as string,
          async (policyEvaluation) => {
            const policyEvaluationEntity = await jobState.addEntity(
              createPolicyEvaluationEntity(policyEvaluation, imageScanEntity),
            );
            const policyEntity = (await jobState.findEntity(
              `sysdig_policy:${policyEvaluation.identifier}`,
            )) as Entity;

            await jobState.addRelationships([
              createDirectRelationship({
                _class: RelationshipClass.REVIEWED,
                from: policyEvaluationEntity,
                to: imageScanEntity,
              }),
              createDirectRelationship({
                _class: RelationshipClass.ENFORCES,
                from: policyEvaluationEntity,
                to: policyEntity,
              }),
            ]);
          },
        );
      }
    },
  );
}

export const policyEvaluationsSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.POLICY_EVALUATIONS,
    name: 'Fetch Policy Evaluations',
    entities: [Entities.POLICY_EVALUATION],
    relationships: [
      Relationships.POLICY_EVALUATION_REVIEWED_IMAGE_SCAN,
      Relationships.POLICY_EVALUATION_ENFORCES_POLICY,
    ],
    dependsOn: [Steps.IMAGE_SCANS, Steps.POLICIES],
    executionHandler: fetchPolicyEvaluations,
  },
];
