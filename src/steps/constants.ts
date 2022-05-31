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
  PIPELINES: 'fetch-pipelines',
  VULNERABILITIES: 'fetch-vulnerabilities',
  BUILD_ACCOUNT_AND_IMAGE_SCAN_RELATIONSHIP:
    'build-account-and-image-scan-relationship',
  BUILD_ACCOUNT_AND_TEAM_RELATIONSHIP: 'build-account-and-team-relationship',
  BUILD_TEAM_AND_USER_RELATIONSHIP: 'build-team-and-user-relationship',
};

export const Entities: Record<
  'ACCOUNT' | 'USER' | 'TEAM' | 'IMAGE_SCAN' | 'PIPELINE' | 'VULNERABILITY',
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
  PIPELINE: {
    resourceName: 'Pipeline',
    _type: 'sysdig_pipeline',
    _class: ['Image'],
  },
  VULNERABILITY: {
    resourceName: 'Vulnerability',
    _type: 'sysdig_vulnerability',
    _class: ['Vulnerability'],
  },
};

export const Relationships: Record<
  | 'ACCOUNT_HAS_USER'
  | 'ACCOUNT_HAS_PIPELINE'
  | 'ACCOUNT_HAS_TEAM'
  | 'TEAM_HAS_USER'
  | 'ACCOUNT_HAS_IMAGE_SCAN'
  | 'PIPELINE_HAS_VULNERABILITY',
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
  ACCOUNT_HAS_PIPELINE: {
    _type: 'sysdig_account_has_pipeline',
    sourceType: Entities.ACCOUNT._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.PIPELINE._type,
  },
  TEAM_HAS_USER: {
    _type: 'sysdig_team_has_user',
    sourceType: Entities.TEAM._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.USER._type,
  },
  ACCOUNT_HAS_IMAGE_SCAN: {
    _type: 'sysdig_account_has_image_scan',
    sourceType: Entities.ACCOUNT._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.IMAGE_SCAN._type,
  },
  PIPELINE_HAS_VULNERABILITY: {
    _type: 'sysdig_pipeline_has_vulnerability',
    sourceType: Entities.PIPELINE._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.VULNERABILITY._type,
  },
};
