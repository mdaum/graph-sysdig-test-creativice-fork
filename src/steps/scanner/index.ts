import {
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';
import { createAPIClient } from '../../client';

import { IntegrationConfig } from '../../config';
import { Steps, Entities } from '../constants';
import { createScannerEntity } from './converter';

export const SCANNER_ENTITY_KEY = 'entity:scanner';

export async function fetchScannerDetails({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);

  const currentUser = await apiClient.getCurrentUser();
  const scannerEntity = await jobState.addEntity(
    createScannerEntity(currentUser),
  );

  await jobState.setData(SCANNER_ENTITY_KEY, scannerEntity);
}

export const scannerSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.SCANNER,
    name: 'Fetch Scanner Details',
    entities: [Entities.SCANNER],
    relationships: [],
    dependsOn: [],
    executionHandler: fetchScannerDetails,
  },
];
