import Stripe from 'stripe'

export const stripe = new Stripe(
  'sk_test_51NTkzmGMjfBDhdiDeoy4AQbDaIMTU65DcORAkRGvdph7LW3kEZZqxlsv0pNkTcHDIpmdMNCDXi2GS2pFTYofisQV009Oj7Wl94'?? '',
  {
    apiVersion: '2023-10-16',
    typescript: true,
  }
)
