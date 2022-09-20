import { RelationshipClass, StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const findingsSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: /api/scanning/scanresults/v2/results/{imageScanId}/policyEvaluations
     * PATTERN: Fetch Relationships
     */
    id: 'fetch-policy-evaluations',
    name: 'Fetch Policy Evaluations',
    entities: [
      {
        resourceName: 'Policy Evaluation',
        _type: 'sysdig_policy_evaluation',
        _class: ['Assessment'],
      },
    ],
    relationships: [
      {
        _type: 'sysdig_policy_evaluation_reviewed_image_scan',
        sourceType: 'sysdig_policy_evaluation',
        _class: RelationshipClass.REVIEWED,
        targetType: 'sysdig_image_scan',
      },
      {
        _type: 'sysdig_policy_evaluation_enforces_policy',
        sourceType: 'sysdig_policy_evaluation',
        _class: RelationshipClass.ENFORCES,
        targetType: 'sysdig_policy',
      },
    ],
    dependsOn: ['fetch-image-scans', 'fetch-policies'],
    implemented: true,
  },
];
