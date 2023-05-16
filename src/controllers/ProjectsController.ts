import { POST, Path, GET, QueryParam, PathParam } from 'typescript-rest'
import { BaseController } from './BaseController'
import { ProjectService, DataManagerService } from '../services'
import {
  PageResponse,
  PageRequest,
  CreateProject,
  ProjectInvestment,
  InvestIntent,
  ProjectResponse,
  TransactionResponse,
} from '../types'
import { UnauthorizedError } from 'typescript-rest/dist/server/model/errors'
import { mapProjectResponse } from './mappers/projects'
import { mapTransactionResponse } from './mappers/transactions'

@Path('/projects')
export class ProjectsController extends BaseController {
  /**
   * Get a list of all projects
   * @param pageSize
   * @param page
   * @returns
   */
  @GET
  public async listProjects(
    @QueryParam('pageSize') pageSize?: number,
    @QueryParam('page') page?: number
  ): Promise<PageResponse<ProjectResponse>> {
    const { roles } = this.getSession()
    if (!roles.includes('MEMBER')) {
      throw new UnauthorizedError('Resource not available')
    }

    const searchInput: PageRequest<{}> = {
      filters: {},
      page: {
        size: pageSize,
        page,
      },
    }
    const paginatedResponse = await ProjectService.getPaginatedProjectsByUserId(
      searchInput
    )
    const { results } = paginatedResponse
    return {
      ...paginatedResponse,
      results: results.map((project) => mapProjectResponse(project)),
    }
  }

  /**
   * Create a new project for investments
   * @param newProject new project details
   * @returns
   */
  @POST
  public async createProject(
    newProject: CreateProject
  ): Promise<ProjectResponse> {
    const { roles, userId } = this.getSession()
    if (!roles.includes('MEMBER')) {
      throw new UnauthorizedError('Resource not available')
    }

    const project = await DataManagerService.createNewProject(
      newProject,
      userId
    )
    return mapProjectResponse(project)
  }

  /**
   * Get all rpojects for a user
   * @param userId
   * @param pageSize
   * @param page
   * @returns
   */
  @GET
  @Path('/users/:userId')
  public async listUsersProjects(
    @PathParam('userId') userId: string,
    @QueryParam('pageSize') pageSize?: number,
    @QueryParam('page') page?: number
  ): Promise<PageResponse<ProjectResponse>> {
    const { roles } = this.getSession()
    if (!roles.includes('MEMBER')) {
      throw new UnauthorizedError('Resource not available')
    }

    const searchInput: PageRequest<{}> = {
      filters: {
        userId,
      },
      page: {
        size: pageSize,
        page,
      },
    }
    const paginatedResponse = await ProjectService.getPaginatedProjectsByUserId(
      searchInput
    )
    const { results } = paginatedResponse
    return {
      ...paginatedResponse,
      results: results.map((project) => mapProjectResponse(project)),
    }
  }

  /**
   *  Get a specific project details
   * @param projectId
   * @returns
   */
  @GET
  @Path('/:projectId')
  public async getProjectById(
    @PathParam('projectId') projectId: string
  ): Promise<ProjectResponse | null> {
    const { roles } = this.getSession()
    if (!roles.includes('MEMBER')) {
      throw new UnauthorizedError('Resource not available')
    }

    const project = await ProjectService.getProjectById(projectId)
    if (!project) {
      return null
    }
    return mapProjectResponse(project)
  }

  /**
   * Invest in a project
   * @param projectId
   * @param body
   * @returns
   */
  @POST
  @Path('/:projectId/invest')
  public async investInProject(
    @PathParam('projectId') projectId: string,
    body: InvestIntent
  ): Promise<TransactionResponse> {
    const { roles, userId } = this.getSession()
    const { amount } = body
    if (!roles.includes('MEMBER')) {
      throw new UnauthorizedError('Resource not available')
    }

    const investment: ProjectInvestment = {
      projectId,
      userId,
      amount,
    }

    const transaction = await DataManagerService.investInProject(investment)
    return mapTransactionResponse(transaction)
  }
}
