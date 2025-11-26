type GenerateUsernameArgs = {
  data: {
    username?: string
    firstName?: string
    lastName?: string
    [key: string]: any
  }
}

export const generateUsername = async ({ data }: GenerateUsernameArgs) => {
  if (!data.username || data.username.trim() === '') {
    const first = data.firstName ?? ''
    const last = data.lastName ?? ''

    const base = `${first}.${last}`.toLowerCase().replace(/\s+/g, '')

    data.username = `${base}-${Math.floor(Math.random() * 10000)}`
  }

  return data
}
