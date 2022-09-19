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
import { SCANNER_ENTITY_KEY } from '../scanner';
import { createImageScanEntity, createImageScanEntityV2 } from './converter';

export async function fetchImageScans({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);

  await apiClient.iterateImageScans(async (scan) => {
    await jobState.addEntity(createImageScanEntity(scan));
  });

  await apiClient.iterateImageScansV2(async (scan) => {
    const imageScanDetails = await apiClient.fetchImageScansV2Details(scan.id);
    await jobState.addEntity(createImageScanEntityV2(imageScanDetails));
  });
}

export async function buildAccountAndImageScansRelationship({
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const accountEntity = (await jobState.getData(ACCOUNT_ENTITY_KEY)) as Entity;

  await jobState.iterateEntities(
    { _type: Entities.IMAGE_SCAN._type },
    async (imageScanEntity) => {
      if (accountEntity && imageScanEntity) {
        await jobState.addRelationship(
          createDirectRelationship({
            _class: RelationshipClass.HAS,
            from: accountEntity,
            to: imageScanEntity,
          }),
        );
      }
    },
  );
}

export async function buildScannerAndImageScansRelationship({
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const scannerEntity = (await jobState.getData(SCANNER_ENTITY_KEY)) as Entity;

  await jobState.iterateEntities(
    { _type: Entities.IMAGE_SCAN._type },
    async (imageScanEntity) => {
      if (scannerEntity && imageScanEntity) {
        await jobState.addRelationship(
          createDirectRelationship({
            _class: RelationshipClass.PERFORMED,
            from: scannerEntity,
            to: imageScanEntity,
          }),
        );
      }
    },
  );
}

export const scansSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.IMAGE_SCANS,
    name: 'Fetch Image Scans',
    entities: [Entities.IMAGE_SCAN],
    relationships: [],
    dependsOn: [],
    executionHandler: fetchImageScans,
  },
  {
    id: Steps.BUILD_ACCOUNT_AND_IMAGE_SCAN_RELATIONSHIP,
    name: 'Build Account and Image Scan Relationship',
    entities: [],
    relationships: [Relationships.ACCOUNT_HAS_IMAGE_SCAN],
    dependsOn: [Steps.IMAGE_SCANS, Steps.ACCOUNT],
    executionHandler: buildAccountAndImageScansRelationship,
  },
  {
    id: Steps.BUILD_SCANNER_AND_IMAGE_SCAN_RELATIONSHIP,
    name: 'Build Scanner and Image Scan Relationship',
    entities: [],
    relationships: [Relationships.SCANNER_PERFORMED_IMAGE_SCAN],
    dependsOn: [Steps.IMAGE_SCANS, Steps.SCANNER],
    executionHandler: buildScannerAndImageScansRelationship,
  },
];
