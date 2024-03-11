import { z } from 'zod'
import { privateProcedure, router } from './trpc'
import { TRPCError } from '@trpc/server'
import { getPayloadClient } from '../get-payload'
import { mpesaClient } from '../lib/mpesa' // Hypothetical M-Pesa client module

export const paymentRouter = router({
  createMpesaPayment: privateProcedure
    .input(z.object({ productIds: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx
      let { productIds } = input

      if (productIds.length === 0) {
        throw new TRPCError({ code: 'BAD_REQUEST' })
      }

      const payload = await getPayloadClient()

      const date =new Date()
      const timestamp =
        date.getFullYear() +
        ('0' + (date.getMonth() + 1)).slice(-2) +
        ('0' + date.getDate()).slice(-2) +
        ('0' + date.getHours()).slice(-2) +
        ('0' + date.getMinutes()).slice(-2) +
        ('0' + date.getSeconds()).slice(-2);

      const businessShortCode = process.env.MPESA_BUSINESS_SHORT_CODE;
      const passkey = process.env.MPESA_PASSKEY;

      if (!businessShortCode || !passkey) {
        throw new Error('Required environment variables are not set!');
      }

      const Password = Buffer.from(businessShortCode + passkey + timestamp).toString('base64');

      try {
        const mpesaResponse = await mpesaClient.createPayment({
          amount: 1,
          businessShortCode: process.env.MPESA_BUSINESS_SHORT_CODE!,
          accountReference: "254715322600",
          TransactionType: 'CustomerPayBillOnline',
          partyA: '254715322600',
          partyB: process.env.MPESA_BUSINESS_SHORT_CODE!,
          phoneNumber: '254715322600',
          callBackURL: `${process.env.NEXT_PUBLIC_SERVER_URL}/mpesa-callback`,
          TransactionDesc: 'Payment for products',
          Password: Password,
          Timestamp: timestamp
      });
      return mpesaResponse
        } catch (err) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to initiate M-Pesa payment',
          })
        }
      }),

  // ... other procedures, such as polling for order status
})
