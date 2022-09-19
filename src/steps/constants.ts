import {
  RelationshipClass,
  StepEntityMetadata,
  StepRelationshipMetadata,
} from '@jupiterone/integration-sdk-core';

export const Steps = {
  ACCOUNT: 'fetch-account-details',
  USERS: 'fetch-users',
  BUILD_ACCOUNT_AND_USER_RELATIONSHIP: 'build-account-and-user-relationship',
  TEAMS: 'fetch-teams',
  IMAGE_SCANS: 'fetch-image-scans',
  SCANNER: 'fetch-scanner',
  FINDINGS: 'fetch-findings',
  POLICIES: 'fetch-policies',
  POLICY_EVALUATIONS: 'fetch-policy-evaluations',
  BUILD_ACCOUNT_AND_IMAGE_SCAN_RELATIONSHIP:
    'build-account-and-image-scan-relationship',
  BUILD_ACCOUNT_AND_TEAM_RELATIONSHIP: 'build-account-and-team-relationship',
  BUILD_TEAM_AND_USER_RELATIONSHIP: 'build-team-and-user-relationship',
  BUILD_SCANNER_AND_IMAGE_SCAN_RELATIONSHIP:
    'build-scanner-and-image-scan-relationship',
};

export const Entities: Record<
  | 'ACCOUNT'
  | 'USER'
  | 'TEAM'
  | 'IMAGE_SCAN'
  | 'POLICY'
  | 'POLICY_EVALUATION'
  | 'SCANNER'
  | 'FINDING'
  | 'CVE',
  StepEntityMetadata
> = {
  ACCOUNT: {
    resourceName: 'Account',
    _type: 'sysdig_account',
    _class: ['Account'],
  },
  USER: {
    resourceName: 'User',
    _type: 'sysdig_user',
    _class: ['User'],
  },
  TEAM: {
    resourceName: 'Team',
    _type: 'sysdig_team',
    _class: ['Team'],
  },
  IMAGE_SCAN: {
    resourceName: 'Image Scan',
    _type: 'sysdig_image_scan',
    _class: ['Assessment'],
  },
  SCANNER: {
    resourceName: 'Scanner',
    _type: 'sysdig_scanner',
    _class: ['Service'],
  },
  FINDING: {
    resourceName: 'Finding',
    _type: 'sysdig_finding',
    _class: ['Finding'],
  },
  CVE: {
    resourceName: 'CVE',
    _type: 'cve',
    _class: ['Vulnerability'],
  },
  POLICY: {
    resourceName: 'Policy',
    _type: 'sysdig_policy',
    _class: ['Policy'],
  },
  POLICY_EVALUATION: {
    resourceName: 'Policy Evaluation',
    _type: 'sysdig_policy_evaluation',
    _class: ['Assessment'],
  },
};

export const Relationships: Record<
  | 'ACCOUNT_HAS_USER'
  | 'ACCOUNT_HAS_TEAM'
  | 'TEAM_HAS_USER'
  | 'ACCOUNT_HAS_IMAGE_SCAN'
  | 'ACCOUNT_HAS_POLICY'
  | 'SCANNER_PERFORMED_IMAGE_SCAN'
  | 'IMAGE_SCAN_IDENTIFIED_FINDING'
  | 'IMAGE_SCAN_SCANS_MAPPED_IMAGE'
  | 'MAPPED_IMAGE_IDENTIFIED_FINDING'
  | 'FINDING_IS_CVE'
  | 'POLICY_EVALUATION_REVIEWED_IMAGE_SCAN'
  | 'POLICY_EVALUATION_ENFORCES_POLICY',
  StepRelationshipMetadata
> = {
  ACCOUNT_HAS_USER: {
    _type: 'sysdig_account_has_user',
    sourceType: Entities.ACCOUNT._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.USER._type,
  },
  ACCOUNT_HAS_TEAM: {
    _type: 'sysdig_account_has_team',
    sourceType: Entities.ACCOUNT._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.TEAM._type,
  },
  TEAM_HAS_USER: {
    _type: 'sysdig_team_has_user',
    sourceType: Entities.TEAM._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.USER._type,
  },
  ACCOUNT_HAS_POLICY: {
    _type: 'sysdig_account_has_policy',
    sourceType: Entities.ACCOUNT._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.POLICY._type,
  },
  ACCOUNT_HAS_IMAGE_SCAN: {
    _type: 'sysdig_account_has_image_scan',
    sourceType: Entities.ACCOUNT._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.IMAGE_SCAN._type,
  },
  SCANNER_PERFORMED_IMAGE_SCAN: {
    _type: 'sysdig_scanner_performed_image_scan',
    sourceType: Entities.SCANNER._type,
    _class: RelationshipClass.PERFORMED,
    targetType: Entities.IMAGE_SCAN._type,
  },
  IMAGE_SCAN_IDENTIFIED_FINDING: {
    _type: 'sysdig_image_scan_identified_finding',
    sourceType: Entities.IMAGE_SCAN._type,
    _class: RelationshipClass.IDENTIFIED,
    targetType: Entities.FINDING._type,
  },
  IMAGE_SCAN_SCANS_MAPPED_IMAGE: {
    _type: 'sysdig_image_scan_scans_mapped_image',
    sourceType: Entities.IMAGE_SCAN._type,
    _class: RelationshipClass.HAS,
    targetType: 'Mapped Image',
  },
  MAPPED_IMAGE_IDENTIFIED_FINDING: {
    _type: 'mapped_image_identified_sysdig_finding',
    sourceType: 'Mapped Image',
    _class: RelationshipClass.HAS,
    targetType: Entities.FINDING._type,
  },
  FINDING_IS_CVE: {
    _type: 'sysdig_finding_is_cve',
    sourceType: Entities.FINDING._type,
    _class: RelationshipClass.IS,
    targetType: Entities.CVE._type,
  },
  POLICY_EVALUATION_REVIEWED_IMAGE_SCAN: {
    _type: 'sysdig_policy_evaluation_reviewed_image_scan',
    sourceType: Entities.POLICY_EVALUATION._type,
    _class: RelationshipClass.REVIEWED,
    targetType: Entities.IMAGE_SCAN._type,
  },
  POLICY_EVALUATION_ENFORCES_POLICY: {
    _type: 'sysdig_policy_evaluation_enforces_policy',
    sourceType: Entities.POLICY_EVALUATION._type,
    _class: RelationshipClass.ENFORCES,
    targetType: Entities.POLICY._type,
  },
};
