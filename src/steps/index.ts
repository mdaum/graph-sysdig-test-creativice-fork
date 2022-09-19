import { accountSteps } from './account';
import { usersSteps } from './users';
import { teamsSteps } from './teams';
import { scansSteps } from './scans';
import { findingsSteps } from './findings';
import { policiesSteps } from './policies';
import { policyEvaluationsSteps } from './policyEvaluations';
import { scannerSteps } from './scanner';

const integrationSteps = [
  ...accountSteps,
  ...usersSteps,
  ...teamsSteps,
  ...scansSteps,
  ...findingsSteps,
  ...policiesSteps,
  ...policyEvaluationsSteps,
  ...scannerSteps,
];

export { integrationSteps };
