import { RelationshipClass, StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const policiesSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: /api/scanning/policies/v2/policies
     * PATTERN: Fetch Entities
     */
    id: 'fetch-policies',
    name: 'Fetch Policies',
    entities: [
      {
        resourceName: 'Policy',
        _type: 'sysdig_policy',
        _class: ['Policy'],
      },
    ],
    relationships: [
      {
        _type: 'sysdig_account_has_policy',
        sourceType: 'sysdig_account',
        _class: RelationshipClass.HAS,
        targetType: 'sysdig_policy',
      },
    ],
    dependsOn: ['fetch-account-details'],
    implemented: true,
  },
];
