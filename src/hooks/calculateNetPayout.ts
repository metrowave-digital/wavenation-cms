type CalculateNetPayoutArgs = {
  data: {
    grossEarnings?: number | string
    platformFees?: number | string
    taxesWithheld?: number | string
    netPayout?: number
    [key: string]: any
  }
}

export const calculateNetPayout = ({ data }: CalculateNetPayoutArgs) => {
  const gross = Number(data.grossEarnings || 0)
  const fees = Number(data.platformFees || 0)
  const taxes = Number(data.taxesWithheld || 0)

  data.netPayout = Number((gross - fees - taxes).toFixed(2))

  return data
}
