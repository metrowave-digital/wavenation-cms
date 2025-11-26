type SyncSeriesArgs = {
  data: { season?: string }
  req: any
}

export const syncSeriesMetadata = async ({ data, req }: SyncSeriesArgs) => {
  if (!data.season) return data

  await req.payload.update({
    collection: 'series',
    id: data.season,
    data: {
      updatedAt: new Date().toISOString(),
    },
  })

  return data
}
