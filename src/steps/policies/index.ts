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
import { createPolicyEntity } from './converter';

export async function fetchPolicies({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);
  const accountEntity = (await jobState.getData(ACCOUNT_ENTITY_KEY)) as Entity;

  await apiClient.iteratePolicies(async (policy) => {
    const policyEntity = await jobState.addEntity(createPolicyEntity(policy));

    await jobState.addRelationship(
      createDirectRelationship({
        _class: RelationshipClass.HAS,
        from: accountEntity,
        to: policyEntity,
      }),
    );
  });
}

export const policiesSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.POLICIES,
    name: 'Fetch Policies',
    entities: [Entities.POLICY],
    relationships: [Relationships.ACCOUNT_HAS_POLICY],
    dependsOn: [Steps.ACCOUNT],
    executionHandler: fetchPolicies,
  },
];
