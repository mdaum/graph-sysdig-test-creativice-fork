import {
  createMockStepExecutionContext,
  Recording,
} from '@jupiterone/integration-sdk-testing';
import { IntegrationConfig } from '../../config';
import { fetchFindings } from '.';
import { integrationConfig } from '../../../test/config';
import { setupSysdigRecording } from '../../../test/recording';
import { Relationships } from '../constants';
import { fetchImageScans } from '../scans';

describe('#fetchFindings', () => {
  let recording: Recording;

  beforeEach(() => {
    recording = setupSysdigRecording({
      directory: __dirname,
      name: 'fetchFindings',
    });
  });

  afterEach(async () => {
    await recording.stop();
  });

  test('should collect data and build relationships with image scan and cve', async () => {
    const context = createMockStepExecutionContext<IntegrationConfig>({
      instanceConfig: integrationConfig,
    });

    await fetchImageScans(context);
    await fetchFindings(context);

    expect({
      numCollectedEntities: context.jobState.collectedEntities.length,
      collectedEntities: context.jobState.collectedEntities,
      encounteredTypes: context.jobState.encounteredTypes,
    }).toMatchSnapshot();

    const imageScans = context.jobState.collectedEntities.filter((e) =>
      e._type.includes('sysdig_image_scan'),
    );
    expect(imageScans.length).toBeGreaterThan(0);

    const findings = context.jobState.collectedEntities.filter((e) =>
      e._type.includes('sysdig_finding'),
    );
    expect(findings.length).toBeGreaterThan(0);
    expect(findings).toMatchGraphObjectSchema({
      _class: ['Finding'],
      schema: {
        additionalProperties: false,
        properties: {
          _rawData: {
            type: 'array',
            items: { type: 'object' },
          },
          _type: { const: 'sysdig_finding' },
          id: { type: 'string' },
          name: { type: 'string' },
          category: { type: 'string' },
          severity: { type: 'string' },
          numericSeverity: { type: 'number' },
          open: { type: 'boolean' },
          'vulnerability.name': { type: 'string' },
          'vulnerability.severity.reporter.name': { type: 'string' },
          'vulnerability.severity.reporter.url': { type: 'string' },
          'vulnerability.severity.value': { type: 'number' },
          'vulnerability.cvssScore.reporter.name': { type: 'string' },
          'vulnerability.cvssScore.reporter.url': { type: 'string' },
          'vulnerability.cvssScore.value.version': { type: 'string' },
          'vulnerability.cvssScore.value.score': { type: 'number' },
          'vulnerability.cvssScore.value.vector': { type: 'string' },
          'vulnerability.exploitable': { type: 'boolean' },
          'vulnerability.exploit': { type: 'string' },
          'vulnerability.description': { type: 'string' },
          'vulnerability.disclosureDate': { type: 'number' },
          'vulnerability.solutionDate': { type: 'number' },
          'package.id': { type: 'string' },
          'package.name': { type: 'string' },
          'package.version': { type: 'string' },
          'package.type': { type: 'string' },
          'package.path': { type: 'string' },
          'package.running': { type: 'string' },
          fixedInVersion: { type: 'string' },
        },
      },
    });

    expect(
      context.jobState.collectedRelationships.filter(
        (e) => e._type === Relationships.IMAGE_SCAN_IDENTIFIED_FINDING._type,
      ),
    ).toMatchDirectRelationshipSchema({
      schema: {
        properties: {
          _class: { const: 'IDENTIFIED' },
          _type: {
            const: 'sysdig_image_scan_identified_finding',
          },
        },
      },
    });

    expect(
      context.jobState.collectedRelationships.filter(
        (e) => e._type === Relationships.FINDING_IS_CVE._type,
      ),
    ).toMatchDirectRelationshipSchema({
      schema: {
        properties: {
          _class: { const: 'IS' },
          _type: {
            const: 'sysdig_image_scan_identified_finding',
          },
        },
      },
    });
  });
});
