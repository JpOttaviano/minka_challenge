import { Account, Project, Currency } from '../models'
import { PageRequest, PageResponse, ProjectFilter } from '../types'
import { SearchService } from './SearchService'

export class ProjectService {
  public static async getProjectById(
    projectId: string
  ): Promise<Project | null> {
    return await Project.findOne({
      where: {
        id: projectId,
      },
      include: [
        {
          model: Account,
          as: 'account',
          include: [
            {
              model: Currency,
              as: 'currency',
            },
          ],
        },
      ],
    })
  }

  public static async getPaginatedProjectsByUserId(
    search: PageRequest<ProjectFilter>
  ): Promise<PageResponse<Project>> {
    const { filters, page = SearchService.DEFAULT_PAGE } = search
    const pageSize = SearchService.getPageSize(page.size)
    const { userId } = filters

    const { count, rows } = await Project.findAndCountAll({
      ...(userId && {
        where: {
          userId,
        },
      }),
      order: [['createdAt', 'DESC']],
      limit: pageSize,
      offset: SearchService.getOffset(page),
      include: [
        {
          model: Account,
          as: 'account',
          include: [
            {
              model: Currency,
              as: 'currency',
            },
          ],
        },
      ],
    })

    return SearchService.getPageResponse(rows, count, page)
  }

  public static async getProjectByName(name: string): Promise<Project | null> {
    return await Project.findOne({
      where: {
        name,
      },
      include: [
        {
          model: Account,
          as: 'account',
          include: [
            {
              model: Currency,
              as: 'currency',
            },
          ],
        },
      ],
    })
  }

  public static async getProjectByAccountId(
    accountId: string
  ): Promise<Project | null> {
    return await Project.findOne({
      where: {
        accountId,
      },
      include: [
        {
          model: Account,
          as: 'account',
          include: [
            {
              model: Currency,
              as: 'currency',
            },
          ],
        },
      ],
    })
  }

  public static async getAllProjectsByUserId(
    userId: string
  ): Promise<Project[]> {
    return await Project.findAll({
      where: {
        '$account.userId$': userId,
      },
      include: [
        {
          model: Account,
          as: 'account',
          include: [
            {
              model: Currency,
              as: 'currency',
            },
          ],
        },
      ],
    })
  }

  public static async createProject(
    name: string,
    description: string,
    accountId: string
  ): Promise<Project> {
    return await Project.create({
      name,
      description,
      accountId,
    })
  }
}
