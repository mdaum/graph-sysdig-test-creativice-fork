import {
  createMockStepExecutionContext,
  Recording,
} from '@jupiterone/integration-sdk-testing';
import { IntegrationConfig } from '../../config';
import {
  fetchImageScans,
  buildAccountAndImageScansRelationship,
  buildScannerAndImageScansRelationship,
} from '.';
import { integrationConfig } from '../../../test/config';
import { setupSysdigRecording } from '../../../test/recording';
import { fetchAccountDetails } from '../account';
import { Relationships } from '../constants';
import { fetchScannerDetails } from '../scanner';

describe('#fetchImageScans', () => {
  let recording: Recording;

  beforeEach(() => {
    recording = setupSysdigRecording({
      directory: __dirname,
      name: 'fetchImageScans',
    });
  });

  afterEach(async () => {
    await recording.stop();
  });

  test('should collect data', async () => {
    const context = createMockStepExecutionContext<IntegrationConfig>({
      instanceConfig: integrationConfig,
    });

    await fetchImageScans(context);

    expect({
      numCollectedEntities: context.jobState.collectedEntities.length,
      collectedEntities: context.jobState.collectedEntities,
      encounteredTypes: context.jobState.encounteredTypes,
    }).toMatchSnapshot();

    const imageScans = context.jobState.collectedEntities.filter((e) =>
      e._type.includes('sysdig_image_scan'),
    );
    expect(imageScans.length).toBeGreaterThan(0);

    if (imageScans.filter((scan) => !!scan.imageId).length > 0) {
      expect(
        imageScans.filter((scan) => !!scan.imageId),
      ).toMatchGraphObjectSchema({
        _class: ['Assessment'],
        schema: {
          additionalProperties: false,
          properties: {
            _rawData: {
              type: 'array',
              items: { type: 'object' },
            },
            _type: { const: 'sysdig_image_scan' },
            analysisStatus: { type: 'string' },
            analyzedAt: { type: 'number' },
            createdAt: { type: 'number' },
            fullTag: { type: 'string' },
            imageDigest: { type: 'string' },
            imageId: { type: 'string' },
            parentDigest: { type: 'string' },
            tagDetectedAt: { type: 'number' },
            registry: { type: 'string' },
            repository: { type: 'string' },
            tag: { type: 'string' },
            origin: { type: 'string' },
            policyStatus: { type: 'string' },
          },
        },
      });
    }

    if (imageScans.filter((scan) => !!scan.id).length > 0) {
      expect(
        imageScans.filter((scan) => !!scan.imageId),
      ).toMatchGraphObjectSchema({
        _class: ['Assessment'],
        schema: {
          additionalProperties: false,
          properties: {
            _rawData: {
              type: 'array',
              items: { type: 'object' },
            },
            _type: { const: 'sysdig_image_scan' },
            id: { type: 'string' },
            name: { type: 'string' },
            storedAt: { type: 'number' },
            type: { type: 'string' },
            'metadata.imageId': { type: 'string' },
            'metadata.pullString': { type: 'string' },
            'metadata.baseOS': { type: 'string' },
            'metadata.digest': { type: 'string' },
            'metadata.createdAt': { type: 'number' },
            'metadata.author': { type: 'string' },
            'metadata.size': { type: 'number' },
            'metadata.os': { type: 'string' },
            'metadata.architecture': { type: 'string' },
            'metadata.labels': { type: 'string' },
            'metadata.layersCount': { type: 'number' },
            vulnsBySev: { type: 'number' },
            packageCount: { type: 'number' },
            packageTypes: {
              type: 'array',
              items: { type: 'string' },
            },
            fixablePackages: {
              type: 'array',
              items: { type: 'any' },
            },
            runningFixablePackages: { type: 'any' },
            category: { type: 'string' },
            summary: { type: 'string' },
            internal: { type: 'boolean' },
          },
        },
      });
    }
  });
});

describe('#buildAccountAndImageScansRelationship', () => {
  let recording: Recording;

  beforeEach(() => {
    recording = setupSysdigRecording({
      directory: __dirname,
      name: 'buildAccountAndImageScansRelationship',
    });
  });

  afterEach(async () => {
    await recording.stop();
  });

  test('should build image scans and account relationship', async () => {
    const context = createMockStepExecutionContext<IntegrationConfig>({
      instanceConfig: integrationConfig,
    });

    await fetchAccountDetails(context);
    await fetchImageScans(context);
    await buildAccountAndImageScansRelationship(context);

    expect({
      numCollectedEntities: context.jobState.collectedEntities.length,
      collectedEntities: context.jobState.collectedEntities,
      encounteredTypes: context.jobState.encounteredTypes,
      collectedRelationships: context.jobState.collectedRelationships,
    }).toMatchSnapshot();

    const account = context.jobState.collectedEntities.filter((e) =>
      e._type.includes('sysdig_account'),
    );
    expect(account.length).toBe(1);
    expect(account).toMatchGraphObjectSchema({
      _class: ['Account'],
      schema: {
        additionalProperties: false,
        properties: {
          _rawData: {
            type: 'array',
            items: { type: 'object' },
          },
          _type: { const: 'sysdig_account' },
          name: { type: 'string' },
          username: { type: 'string' },
          displayName: { type: 'string' },
          id: { type: 'string' },
        },
      },
    });

    const imageScans = context.jobState.collectedEntities.filter((e) =>
      e._type.includes('sysdig_image_scan'),
    );
    expect(imageScans.length).toBeGreaterThan(0);

    if (imageScans.filter((scan) => !!scan.imageId).length > 0) {
      expect(
        imageScans.filter((scan) => !!scan.imageId),
      ).toMatchGraphObjectSchema({
        _class: ['Assessment'],
        schema: {
          additionalProperties: false,
          properties: {
            _rawData: {
              type: 'array',
              items: { type: 'object' },
            },
            _type: { const: 'sysdig_image_scan' },
            analysisStatus: { type: 'string' },
            analyzedAt: { type: 'number' },
            createdAt: { type: 'number' },
            fullTag: { type: 'string' },
            imageDigest: { type: 'string' },
            imageId: { type: 'string' },
            parentDigest: { type: 'string' },
            tagDetectedAt: { type: 'number' },
            registry: { type: 'string' },
            repository: { type: 'string' },
            tag: { type: 'string' },
            origin: { type: 'string' },
            policyStatus: { type: 'string' },
          },
        },
      });
    }

    if (imageScans.filter((scan) => !!scan.id).length > 0) {
      expect(
        imageScans.filter((scan) => !!scan.imageId),
      ).toMatchGraphObjectSchema({
        _class: ['Assessment'],
        schema: {
          additionalProperties: false,
          properties: {
            _rawData: {
              type: 'array',
              items: { type: 'object' },
            },
            _type: { const: 'sysdig_image_scan' },
            id: { type: 'string' },
            name: { type: 'string' },
            storedAt: { type: 'number' },
            type: { type: 'string' },
            'metadata.imageId': { type: 'string' },
            'metadata.pullString': { type: 'string' },
            'metadata.baseOS': { type: 'string' },
            'metadata.digest': { type: 'string' },
            'metadata.createdAt': { type: 'number' },
            'metadata.author': { type: 'string' },
            'metadata.size': { type: 'number' },
            'metadata.os': { type: 'string' },
            'metadata.architecture': { type: 'string' },
            'metadata.labels': { type: 'string' },
            'metadata.layersCount': { type: 'number' },
            vulnsBySev: { type: 'number' },
            packageCount: { type: 'number' },
            packageTypes: {
              type: 'array',
              items: { type: 'string' },
            },
            fixablePackages: {
              type: 'array',
              items: { type: 'any' },
            },
            runningFixablePackages: { type: 'any' },
            category: { type: 'string' },
            summary: { type: 'string' },
            internal: { type: 'boolean' },
          },
        },
      });
    }

    expect(
      context.jobState.collectedRelationships.filter(
        (e) => e._type === Relationships.ACCOUNT_HAS_IMAGE_SCAN._type,
      ),
    ).toMatchDirectRelationshipSchema({
      schema: {
        properties: {
          _class: { const: 'HAS' },
          _type: {
            const: 'sysdig_account_has_image_scan',
          },
        },
      },
    });
  });
});

describe('#buildScannerAndImageScansRelationship', () => {
  let recording: Recording;

  beforeEach(() => {
    recording = setupSysdigRecording({
      directory: __dirname,
      name: 'buildScannerAndImageScansRelationship',
    });
  });

  afterEach(async () => {
    await recording.stop();
  });

  test('should build image scans and scanner relationship', async () => {
    const context = createMockStepExecutionContext<IntegrationConfig>({
      instanceConfig: integrationConfig,
    });

    await fetchScannerDetails(context);
    await fetchImageScans(context);
    await buildScannerAndImageScansRelationship(context);

    expect({
      numCollectedEntities: context.jobState.collectedEntities.length,
      collectedEntities: context.jobState.collectedEntities,
      encounteredTypes: context.jobState.encounteredTypes,
      collectedRelationships: context.jobState.collectedRelationships,
    }).toMatchSnapshot();

    const scanner = context.jobState.collectedEntities.filter((e) =>
      e._type.includes('sysdig_scanner'),
    );
    expect(scanner.length).toBe(1);
    expect(scanner).toMatchGraphObjectSchema({
      _class: ['Service'],
      schema: {
        additionalProperties: false,
        properties: {
          _rawData: {
            type: 'array',
            items: { type: 'object' },
          },
          _type: { const: 'sysdig_scanner' },
          name: { type: 'string' },
          username: { type: 'string' },
          displayName: { type: 'string' },
          id: { type: 'string' },
          version: { type: 'number' },
          products: {
            type: 'array',
            items: { type: 'string' },
          },
          category: {
            type: 'array',
            items: { type: 'string' },
          },
          function: {
            type: 'array',
            items: { type: 'string' },
          },
        },
      },
    });

    const imageScans = context.jobState.collectedEntities.filter((e) =>
      e._type.includes('sysdig_image_scan'),
    );
    expect(imageScans.length).toBeGreaterThan(0);

    if (imageScans.filter((scan) => !!scan.imageId).length > 0) {
      expect(
        imageScans.filter((scan) => !!scan.imageId),
      ).toMatchGraphObjectSchema({
        _class: ['Assessment'],
        schema: {
          additionalProperties: false,
          properties: {
            _rawData: {
              type: 'array',
              items: { type: 'object' },
            },
            _type: { const: 'sysdig_image_scan' },
            analysisStatus: { type: 'string' },
            analyzedAt: { type: 'number' },
            createdAt: { type: 'number' },
            fullTag: { type: 'string' },
            imageDigest: { type: 'string' },
            imageId: { type: 'string' },
            parentDigest: { type: 'string' },
            tagDetectedAt: { type: 'number' },
            registry: { type: 'string' },
            repository: { type: 'string' },
            tag: { type: 'string' },
            origin: { type: 'string' },
            policyStatus: { type: 'string' },
          },
        },
      });
    }

    if (imageScans.filter((scan) => !!scan.id).length > 0) {
      expect(
        imageScans.filter((scan) => !!scan.imageId),
      ).toMatchGraphObjectSchema({
        _class: ['Assessment'],
        schema: {
          additionalProperties: false,
          properties: {
            _rawData: {
              type: 'array',
              items: { type: 'object' },
            },
            _type: { const: 'sysdig_image_scan' },
            id: { type: 'string' },
            name: { type: 'string' },
            storedAt: { type: 'number' },
            type: { type: 'string' },
            'metadata.imageId': { type: 'string' },
            'metadata.pullString': { type: 'string' },
            'metadata.baseOS': { type: 'string' },
            'metadata.digest': { type: 'string' },
            'metadata.createdAt': { type: 'number' },
            'metadata.author': { type: 'string' },
            'metadata.size': { type: 'number' },
            'metadata.os': { type: 'string' },
            'metadata.architecture': { type: 'string' },
            'metadata.labels': { type: 'string' },
            'metadata.layersCount': { type: 'number' },
            vulnsBySev: { type: 'number' },
            packageCount: { type: 'number' },
            packageTypes: {
              type: 'array',
              items: { type: 'string' },
            },
            fixablePackages: {
              type: 'array',
              items: { type: 'any' },
            },
            runningFixablePackages: { type: 'any' },
            category: { type: 'string' },
            summary: { type: 'string' },
            internal: { type: 'boolean' },
          },
        },
      });
    }

    expect(
      context.jobState.collectedRelationships.filter(
        (e) => e._type === Relationships.SCANNER_PERFORMED_IMAGE_SCAN._type,
      ),
    ).toMatchDirectRelationshipSchema({
      schema: {
        properties: {
          _class: { const: 'PERFORMED' },
          _type: {
            const: 'sysdig_scanner_performed_image_scan',
          },
        },
      },
    });
  });
});
