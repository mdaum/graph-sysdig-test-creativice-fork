import {
  createIntegrationEntity,
  Entity,
  parseTimePropertyValue,
} from '@jupiterone/integration-sdk-core';
import { SysdigVulnerability } from '../../types';

import { Entities } from '../constants';

export function getVulnerabilityKey(id: string): string {
  return `sysdig_vulnerability:${id}`;
}

export function createVulnerabilityEntity(
  vulnerability: SysdigVulnerability,
): Entity {
  return createIntegrationEntity({
    entityData: {
      source: vulnerability,
      assign: {
        _key: getVulnerabilityKey(vulnerability.id),
        _type: Entities.VULNERABILITY._type,
        _class: Entities.VULNERABILITY._class,
        id: vulnerability.id,
        name: vulnerability.vuln.name,
        category: vulnerability.package.type,
        severity: vulnerability.vuln.severity.toString(),
        blocking: false,
        open: !vulnerability.fixedInVersion,
        production: false,
        public: true,
        cvssVersion: vulnerability.vuln.cvssVersion,
        cvssScore: vulnerability.vuln.cvssScore,
        exploitable: vulnerability.vuln.exploitable,
        disclosureDate: vulnerability.vuln.disclosureDate,
        fixedInVersion: vulnerability.fixedInVersion,
      },
    },
  });
}
