import {
  createMockStepExecutionContext,
  Recording,
} from '@jupiterone/integration-sdk-testing';
import { IntegrationConfig } from '../../config';
import { fetchScannerDetails } from '.';
import { integrationConfig } from '../../../test/config';
import { setupSysdigRecording } from '../../../test/recording';

describe('#fetchScannerDetails', () => {
  let recording: Recording;

  beforeEach(() => {
    recording = setupSysdigRecording({
      directory: __dirname,
      name: 'fetchScannerDetails',
    });
  });

  afterEach(async () => {
    await recording.stop();
  });

  test('should collect data', async () => {
    const context = createMockStepExecutionContext<IntegrationConfig>({
      instanceConfig: integrationConfig,
    });

    await fetchScannerDetails(context);

    expect({
      numCollectedEntities: context.jobState.collectedEntities.length,
      collectedEntities: context.jobState.collectedEntities,
      encounteredTypes: context.jobState.encounteredTypes,
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
  });
});
