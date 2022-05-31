import { accountSteps } from './account';
import { usersSteps } from './users';
import { teamsSteps } from './teams';
import { scansSteps } from './scans';
import { pipelinesSteps } from './pipelines';
import { vulnerabilitiesSteps } from './vulnerabilities';

const integrationSteps = [
  ...accountSteps,
  ...usersSteps,
  ...teamsSteps,
  ...scansSteps,
  ...pipelinesSteps,
  ...vulnerabilitiesSteps,
];

export { integrationSteps };
