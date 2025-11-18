// src/hooks/preventUnauthorizedDelete.ts

interface BeforeDeleteArgs {
  req: {
    user?: {
      role?: string
      [key: string]: any
    }
    [key: string]: any
  }
  id: string | number
}

/**
 * Only allow admins to delete.
 */
export const preventUnauthorizedDelete = ({ req }: BeforeDeleteArgs) => {
  const role = req.user?.role

  if (role === 'admin') {
    return true
  }

  throw new Error('You are not allowed to delete this item.')
}
