import {
  createIntegrationEntity,
  Entity,
  parseTimePropertyValue,
} from '@jupiterone/integration-sdk-core';
import { PolicyEvaluation } from '../../types';
import { Entities } from '../constants';

export function getPolicyEvaluationKey(id: string): string {
  return `sysdig_finding:${id}`;
}

export function createPolicyEvaluationEntity(
  data: PolicyEvaluation,
  imageScan: Entity,
): Entity {
  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        _key: getPolicyEvaluationKey(data.id),
        _type: Entities.POLICY_EVALUATION._type,
        _class: Entities.POLICY_EVALUATION._class,
        id: data.id,
        name: data.name,
        category: 'Vulnerability Scan',
        summary: data.name,
        internal: true,
        completedOn: imageScan.storedAt ?? 0,
        identifier: data.identifier,
        policyType: data.policyType,
        evaluationResult: data.evaluationResult,
        'failuresCount.imageConfigCreationDate':
          data.failuresCount.imageConfigCreationDate,
        'failuresCount.imageConfigDefaultUser':
          data.failuresCount.imageConfigDefaultUser,
        'failuresCount.imageConfigEnvVariable':
          data.failuresCount.imageConfigEnvVariable,
        'failuresCount.imageConfigInstructionIsPkgManager':
          data.failuresCount.imageConfigInstructionIsPkgManager,
        'failuresCount.imageConfigLabel': data.failuresCount.imageConfigLabel,
        'failuresCount.imageConfigSensitiveInformationAndSecrets':
          data.failuresCount.imageConfigSensitiveInformationAndSecrets,
        'failuresCount.vulnDenyList': data.failuresCount.vulnDenyList,
        'failuresCount.imageConfigInstructionNotRecommended':
          data.failuresCount.imageConfigInstructionNotRecommended,
        'failuresCount.vulnSeverityAndThreats':
          data.failuresCount.vulnSeverityAndThreats,
        creationTimestamp: parseTimePropertyValue(data.creationTimestamp),
        updateTimestamp: parseTimePropertyValue(data.updateTimestamp),
      },
    },
  });
}
