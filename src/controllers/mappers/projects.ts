import { Project } from '../../models'
import { ProjectResponse } from '../../types'
import { mapAccountResponse } from './accounts'

export function mapProjectResponse(project: Project): ProjectResponse {
  const { id, name, description, account } = project

  return {
    id,
    name,
    description,
    account: mapAccountResponse(account),
  }
}
