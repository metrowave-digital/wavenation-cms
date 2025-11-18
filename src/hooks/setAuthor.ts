export const setAuthor = ({ req, data }: { req: any; data: any }) => {
  if (!data) return data

  if (req?.user && !data.author) {
    data.author = req.user.id
  }

  return data
}
