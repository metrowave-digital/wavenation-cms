import { recalculateShowMetadata } from './recalculateShowMetadata'

type SyncShowArgs = {
  data: {
    id?: string
    [key: string]: any
  }
  req: any
}

export const syncShow = async ({ data, req }: SyncShowArgs) => {
  const showId = data.id
  if (!showId) return data

  await recalculateShowMetadata({
    showId,
    req,
  })

  return data
}
