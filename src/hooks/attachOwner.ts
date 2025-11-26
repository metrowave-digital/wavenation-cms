// No Payload types needed — self-typed hook
export const attachOwner = ({ req, data }: { req: { user?: { id: string } }; data: any }) => {
  if (!data.owner && req.user) {
    data.owner = req.user.id
  }

  return data
}
