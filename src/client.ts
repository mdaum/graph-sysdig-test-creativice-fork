import fetch, { Response } from 'node-fetch';

import {
  IntegrationProviderAPIError,
  IntegrationProviderAuthenticationError,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from './config';
import {
  PaginatedTeams,
  PaginatedUsers,
  SysdigAccount,
  SysdigPipeline,
  SysdigPipelineResponse,
  SysdigResult,
  SysdigResultResponse,
  SysdigTeam,
  SysdigUser,
  SysdigVulnerability,
  SysdigVulnerabilityResponse,
} from './types';
import regionHostnames from './util/regionHostnames';

export type ResourceIteratee<T> = (page: T) => Promise<void>;

export class APIClient {
  constructor(readonly config: IntegrationConfig) {}

  private readonly paginateEntitiesPerPage = 100;

  private withBaseUri(path: string): string {
    return `${regionHostnames[this.config.region]}${path}`;
  }

  private async request(
    uri: string,
    method: 'GET' | 'HEAD' = 'GET',
  ): Promise<Response> {
    const response = await fetch(uri, {
      method,
      headers: {
        Authorization: `Bearer ${this.config.apiToken}`,
        Accept: 'application/json',
        'Content-Type': 'application/json;charset=UTF-8',
      },
    });

    if (!response.ok) {
      throw new IntegrationProviderAPIError({
        endpoint: uri,
        status: response.status,
        statusText: response.statusText,
      });
    }
    return response;
  }

  public async verifyAuthentication(): Promise<void> {
    const statusRoute = this.withBaseUri('api/v1/secure/overview/status');
    try {
      await this.request(statusRoute, 'GET');
    } catch (err) {
      throw new IntegrationProviderAuthenticationError({
        endpoint: statusRoute,
        status: err.code,
        statusText: err.message,
      });
    }
  }

  public async getCurrentUser(): Promise<SysdigAccount> {
    const response = await this.request(this.withBaseUri(`api/user/me`), 'GET');
    const userResponse = await response.json();
    return userResponse.user;
  }

  public async getUserById(userId: string): Promise<SysdigAccount> {
    const response = await this.request(
      this.withBaseUri(`api/users/${userId}`),
      'GET',
    );
    const userResponse = await response.json();
    return userResponse.user;
  }

  /**
   * Iterates each user resource in the provider.
   *
   * @param pageIteratee receives each resource to produce entities/relationships
   */
  public async iterateUsers(
    pageIteratee: ResourceIteratee<SysdigUser>,
  ): Promise<void> {
    let body: PaginatedUsers;
    let offset = -1;

    do {
      offset += 1;
      const endpoint = this.withBaseUri(
        `api/v2/users/light?limit=${this.paginateEntitiesPerPage}&offset=${offset}`,
      );
      const response = await this.request(endpoint, 'GET');

      if (!response.ok) {
        throw new IntegrationProviderAPIError({
          endpoint,
          status: response.status,
          statusText: response.statusText,
        });
      }

      body = await response.json();

      if (body.users)
        for (const user of body.users) {
          await pageIteratee(user);
        }
    } while ((offset + 1) * this.paginateEntitiesPerPage < body.total);
  }

  /**
   * Iterates each team resource in the provider.
   *
   * @param pageIteratee receives each resource to produce entities/relationships
   */
  public async iterateTeams(
    pageIteratee: ResourceIteratee<SysdigTeam>,
  ): Promise<void> {
    let body: PaginatedTeams;
    let offset = -1;

    do {
      offset += 1;
      const endpoint = this.withBaseUri(
        `api/v2/teams/light?limit=${this.paginateEntitiesPerPage}&offset=${offset}`,
      );
      const response = await this.request(endpoint, 'GET');

      if (!response.ok) {
        throw new IntegrationProviderAPIError({
          endpoint,
          status: response.status,
          statusText: response.statusText,
        });
      }

      body = await response.json();

      if (body.teams)
        for (const team of body.teams) {
          await pageIteratee(team);
        }
    } while ((offset + 1) * this.paginateEntitiesPerPage < body.total);
  }

  /**
   * Iterates each image scan resource in the provider.
   *
   * @param pageIteratee receives each resource to produce entities/relationships
   */
  public async iterateImageScans(
    pageIteratee: ResourceIteratee<SysdigResult>,
  ): Promise<void> {
    let body: SysdigResultResponse;
    let offset = -1;

    do {
      offset += 1;
      const endpoint = this.withBaseUri(
        `api/scanning/v1/resultsDirect?limit=${this.paginateEntitiesPerPage}&offset=${offset}`,
      );
      const response = await this.request(endpoint, 'GET');

      if (!response.ok) {
        throw new IntegrationProviderAPIError({
          endpoint,
          status: response.status,
          statusText: response.statusText,
        });
      }

      body = await response.json();

      if (body.results)
        for (const result of body.results) {
          await pageIteratee(result);
        }
    } while ((offset + 1) * this.paginateEntitiesPerPage < body.metadata.total);
  }

  /**
   * Iterates each pipeline resource in the provider.
   *
   * @param pageIteratee receives each resource to produce entities/relationships
   */
  public async iteratePipelines(
    pageIteratee: ResourceIteratee<SysdigPipeline>,
  ): Promise<void> {
    let body: SysdigPipelineResponse;
    let next = '';

    do {
      const endpoint = this.withBaseUri(
        `api/scanning/scanresults/v2/results?cursor=${next}&limit=${this.paginateEntitiesPerPage}`,
      );
      const response = await this.request(endpoint, 'GET');

      if (!response.ok) {
        throw new IntegrationProviderAPIError({
          endpoint,
          status: response.status,
          statusText: response.statusText,
        });
      }

      body = await response.json();
      next = body.page.next;

      if (body.data)
        for (const pipeline of body.data) {
          await pageIteratee(pipeline);
        }
    } while (next);
  }

  /**
   * Iterates each vulnerability resource in the provider.
   *
   * @param pageIteratee receives each resource to produce entities/relationships
   * @param id resource id
   */
  public async iterateVulnerabilities(
    id: string,
    pageIteratee: ResourceIteratee<SysdigVulnerability>,
  ): Promise<void> {
    let body: SysdigVulnerabilityResponse;
    let offset = 0;

    do {
      const endpoint = this.withBaseUri(
        `api/scanning/scanresults/v2/results/${id}/vulnPkgs?filter&&limit=${20}&offset=${offset}&order=asc&sort=vulnSeverity`,
      );
      const response = await this.request(endpoint, 'GET');

      if (!response.ok) {
        throw new IntegrationProviderAPIError({
          endpoint,
          status: response.status,
          statusText: response.statusText,
        });
      }

      body = await response.json();
      offset = body.page.returned + body.page.offset;

      if (body.data)
        for (const vulnerability of body.data) {
          await pageIteratee(vulnerability);
        }
    } while (offset < body.page.matched);
  }
}

export function createAPIClient(config: IntegrationConfig): APIClient {
  return new APIClient(config);
}
