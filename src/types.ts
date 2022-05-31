type PaginationData = {
  offset: number;
  total: number;
};

export type SysdigAccount = SysdigUser & {
  firstName: string;
  id: number;
  lastName: string;
  username: string;
  name: string;
  teamRoles: {
    teamId: number;
    teamName: string;
    teamTheme: string;
    userId: number;
    userName: string;
    role: string;
    admin: boolean;
  }[];
};

export type SysdigUser = {
  id: number;
  version: number;
  username: string;
  enabled: boolean;
  systemRole: string;
  firstName: string;
  lastName: string;
  lastSeenOnSecure: number;
  dateCreated: number;
  status: string;
  products: string[];
};

export type PaginatedUsers = {
  users: SysdigUser[];
} & PaginationData;

export type SysdigTeam = {
  id: number;
  version: number;
  dateCreated: number;
  lastUpdated: number;
  customerId: number;
  immutable: boolean;
  name: string;
  theme: string;
  description: string;
  show: string;
  origin: string;
  canUseSysdigCapture: boolean;
  canUseAgentCli: boolean;
  canUseCustomEvents: boolean;
  canUseAwsMetrics: boolean;
  canUseBeaconMetrics: boolean;
  canUseRapidResponse: boolean;
  defaultTeamRole: string;
  userCount: number;
  entryPoint: {
    module: string;
  };
  products: string[];
  default: boolean;
};

export type PaginatedTeams = {
  teams: SysdigTeam[];
} & PaginationData;

export type SysdigResult = {
  analysisStatus: string;
  analyzedAt: number;
  createdAt: number;
  fullTag: string;
  imageDigest: string;
  imageId: string;
  parentDigest: string;
  tagDetectedAt: number;
  registry: string;
  repository: string;
  tag: string;
  origin: string;
  policyStatus: string;
};

export type SysdigResultMetadata = {
  total: number;
  policyStatus: {
    totalPassed: number;
    totalFailed: number;
    totalNotEvaluated: number;
  };
  origins: {
    'sysdig-secure-ui': number;
  };
  allOrigins: string[];
  allRegistries: string[];
};

export type SysdigResultOptions = {
  sort: string;
  sortBy: string;
  offset: number;
  limit: number;
  canLoadMore: boolean;
};

export type SysdigResultResponse = {
  options: SysdigResultOptions;
  results: SysdigResult[];
  totalRows: number;
  metadata: SysdigResultMetadata;
};

export type SysdigMetadataV2 = {};

export type SysdigPipeline = {
  id: string;
  storedAt: string;
  imageId: string;
  imagePullString: string;
  vulnsBySev: number[];
  exploitCount: number;
  policyEvaluationsPassed: boolean;
};

export type SysdigPipelineResponse = {
  page: {
    returned: number;
    matched: number;
    next: string;
  };
  data: SysdigPipeline[];
};

export type SysdigVulnerability = {
  id: string;
  vuln: {
    name: string;
    severity: number;
    cvssVersion: string;
    cvssScore: number;
    exploitable: boolean;
    disclosureDate: string;
  };
  package: {
    id: string;
    name: string;
    version: string;
    type: string;
    running: boolean;
  };
  fixedInVersion: string;
};

export type SysdigVulnerabilityResponse = {
  page: {
    returned: number;
    matched: number;
    offset: number;
  };
  data: SysdigVulnerability[];
};
