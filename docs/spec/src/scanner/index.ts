import { StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const scannerSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: /api/user/me
     * PATTERN: Singleton
     */
    id: 'fetch-scanner-details',
    name: 'Fetch Scanner Details',
    entities: [
      {
        resourceName: 'Scanner',
        _type: 'sysdig_scanner',
        _class: ['Service'],
      },
    ],
    relationships: [],
    dependsOn: [],
    implemented: true,
  },
];
