import { POST, Path, Errors, GET, QueryParam, PathParam } from 'typescript-rest'
import { BaseController } from './BaseController'
import { Project, Transaction } from '../models'
import { ProjectService } from '../services'
import {
  PageResponse,
  PageRequest,
  CreateProject,
  ProjectInvestment,
  InvestIntent,
} from '../types'
import { UnauthorizedError } from 'typescript-rest/dist/server/model/errors'
import { DataManagerService } from '../services/DataManagerService'

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
  ): Promise<PageResponse<Project>> {
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
    return await ProjectService.getPaginatedProjectsByUserId(searchInput)
  }

  /**
   * Create a new project for investments
   * @param newProject new project details
   * @returns
   */
  @POST
  public async createProject(newProject: CreateProject): Promise<Project> {
    const { roles } = this.getSession()
    if (!roles.includes('MEMBER')) {
      throw new UnauthorizedError('Resource not available')
    }

    return await DataManagerService.createNewProject(newProject)
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
  ): Promise<PageResponse<Project>> {
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
    return await ProjectService.getPaginatedProjectsByUserId(searchInput)
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
  ): Promise<Project | null> {
    const { roles } = this.getSession()
    if (!roles.includes('MEMBER')) {
      throw new UnauthorizedError('Resource not available')
    }

    return await ProjectService.getProjectById(projectId)
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
  ): Promise<Transaction> {
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

    return await DataManagerService.investInProject(investment)
  }
}
