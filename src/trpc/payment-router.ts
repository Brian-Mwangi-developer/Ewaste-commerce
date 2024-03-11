import { z } from 'zod';
import { privateProcedure, publicProcedure, router } from './trpc';
import { TRPCError } from '@trpc/server';
import { getPayloadClient } from '../get-payload';
import { stripe } from '../lib/stripe';
import type Stripe from 'stripe';
import { mpesaClient } from '../lib/mpesa';

const date = new Date();

export const paymentRouter = router({
    createSession: privateProcedure
        .input(z.object({ productIds: z.array(z.string()) }))
        .mutation(async ({ ctx, input }) => {
            const { user } = ctx;
            let { productIds } = input;

            if (productIds.length === 0) {
                throw new TRPCError({ code: 'BAD_REQUEST' });
            }

            const payload = await getPayloadClient();

            const { docs: products } = await payload.find({
                collection: 'products',
                where: {
                    id: { in: productIds },
                },
            });

            const filteredProducts = products.filter((prod) =>
                Boolean(prod.priceId)
            );

            const order = await payload.create({
                collection: 'orders',
                data: {
                    _isPaid: false,
                    products: filteredProducts.map((prod) => prod.id),
                    user: user.id,
                },
            });

            const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

            filteredProducts.forEach((product) => {
                line_items.push({
                    price: product.priceId!,
                    quantity: 1,
                });
            });

            line_items.push({
                price: 'price_1OCeBwA19umTXGu8s4p2G3aX',
                quantity: 1,
                adjustable_quantity: {
                    enabled: false,
                },
            });

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
                    accountReference: order.id,
                    TransactionType: 'CustomerPayBillOnline',
                    partyA: '254715322600',
                    partyB: process.env.MPESA_BUSINESS_SHORT_CODE!,
                    phoneNumber: '254715322600',
                    callBackURL: `${process.env.NEXT_PUBLIC_SERVER_URL}/mpesa-callback`,
                    TransactionDesc: 'Payment for products',
                    Password: Password,
                    Timestamp: timestamp
                });
            } catch (err) {
                throw new TRPCError({ code: 'CONFLICT', message: 'Failed to initiate M-Pesa payment' });
            }
        }),

    pollOrderStatus: privateProcedure
        .input(z.object({ orderId: z.string() }))
        .query(async ({ input }) => {
            const { orderId } = input;

            const payload = await getPayloadClient();

            const { docs: orders } = await payload.find({
                collection: 'orders',
                where: {
                    id: { equals: orderId },
                },
            });

            if (!orders.length) {
                throw new TRPCError({ code: 'NOT_FOUND' });
            }

            const [order] = orders;

            return { isPaid: order._isPaid };
        }),
});
