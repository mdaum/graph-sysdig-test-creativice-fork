import {
  createMockStepExecutionContext,
  Recording,
} from '@jupiterone/integration-sdk-testing';
import { IntegrationConfig } from '../../config';
import { fetchPolicyEvaluations } from '.';
import { integrationConfig } from '../../../test/config';
import { setupSysdigRecording } from '../../../test/recording';
import { fetchImageScans } from '../scans';
import { Relationships } from '../constants';
import { fetchPolicies } from '../policies';
import { fetchAccountDetails } from '../account';

describe('#fetchPolicyEvaluations', () => {
  let recording: Recording;

  beforeEach(() => {
    recording = setupSysdigRecording({
      directory: __dirname,
      name: 'fetchPolicyEvaluations',
    });
  });

  afterEach(async () => {
    await recording.stop();
  });

  test('should collect data', async () => {
    const context = createMockStepExecutionContext<IntegrationConfig>({
      instanceConfig: integrationConfig,
    });

    await fetchAccountDetails(context);
    await fetchPolicies(context);
    await fetchImageScans(context);
    await fetchPolicyEvaluations(context);

    expect({
      numCollectedEntities: context.jobState.collectedEntities.length,
      collectedEntities: context.jobState.collectedEntities,
      encounteredTypes: context.jobState.encounteredTypes,
    }).toMatchSnapshot();

    const policies = context.jobState.collectedEntities.filter(
      (e) => e._type === 'sysdig_policy',
    );
    expect(policies.length).toBeGreaterThan(0);
    expect(policies).toMatchGraphObjectSchema({
      _class: ['Policy'],
      schema: {
        additionalProperties: false,
        properties: {
          _rawData: {
            type: 'array',
            items: { type: 'object' },
          },
          _type: { const: 'sysdig_policy' },
          id: { type: 'string' },
          name: { type: 'string' },
          title: { type: 'string' },
          identifier: { type: 'string' },
          summary: { type: 'string' },
          content: { type: 'string' },
          creationTimestamp: { type: 'number' },
          updateTimestamp: { type: 'number' },
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

    const policyEvaluations = context.jobState.collectedEntities.filter((e) =>
      e._type.includes('sysdig_policy_evaluation'),
    );
    expect(policyEvaluations.length).toBeGreaterThan(0);
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
          _type: { const: 'sysdig_policy_evaluation' },
          id: { type: 'string' },
          name: { type: 'string' },
          category: { type: 'string' },
          summary: { type: 'string' },
          internal: { type: 'boolean' },
          completedOn: { type: 'number' },
          identifier: { type: 'string' },
          policyType: { type: 'string' },
          evaluationResult: { type: 'string' },
          'failuresCount.imageConfigCreationDate': { type: 'number' },
          'failuresCount.imageConfigDefaultUser': { type: 'number' },
          'failuresCount.imageConfigEnvVariable': { type: 'number' },
          'failuresCount.imageConfigLabel': { type: 'number' },
          'failuresCount.imageConfigSensitiveInformationAndSecrets': {
            type: 'number',
          },
          'failuresCount.vulnDenyList': { type: 'number' },
          'failuresCount.imageConfigInstructionNotRecommended': {
            type: 'number',
          },
          'failuresCount.vulnSeverityAndThreats': { type: 'number' },
          creationTimestamp: { type: 'number' },
          updateTimestamp: { type: 'number' },
        },
      },
    });

    expect(
      context.jobState.collectedRelationships.filter(
        (e) =>
          e._type === Relationships.POLICY_EVALUATION_REVIEWED_IMAGE_SCAN._type,
      ),
    ).toMatchDirectRelationshipSchema({
      schema: {
        properties: {
          _class: { const: 'REVIEWED' },
          _type: {
            const: 'sysdig_policy_evaluation_reviewed_image_scan',
          },
        },
      },
    });

    expect(
      context.jobState.collectedRelationships.filter(
        (e) =>
          e._type === Relationships.POLICY_EVALUATION_ENFORCES_POLICY._type,
      ),
    ).toMatchDirectRelationshipSchema({
      schema: {
        properties: {
          _class: { const: 'ENFORCES' },
          _type: {
            const: 'sysdig_policy_evaluation_enforces_policy',
          },
        },
      },
    });
  });
});
