// import { NextRequest, NextResponse } from 'next/server';
// import Stripe from 'stripe';
// import { updateOrderToPaid } from '@/lib/actions/order.actions';

// export async function POST(req: NextRequest) {
//   //Buil the webhook event
//   const event = Stripe.webhooks.constructEvent(
//     await req.text(),
//     req.headers.get('stripe-signature') as string,
//     process.env.STRIPE_WEBHOOK_SECRET as string,
//   );

//   //Check for successfull payment

//   if (event.type === 'charge.succeeded') {
//     const { object } = event.data;

//     //Update order status

//     await updateOrderToPaid({
//       orderId: object.metadata.orderId,
//       paymentResult: {
//         id: object.id,
//         status: 'COMPLETED',
//         email_address: object.billing_details.email!,
//         pricePaid: (object.amount / 100).toFixed(),
//       },
//     });

//     return NextResponse.json({
//       message: 'updateOrderToPaid was successful',
//     });
//   }

//   return NextResponse.json({
//     message: 'event is not charge.succeeded',
//   });
// }
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { updateOrderToPaid } from '@/lib/actions/order.actions';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  // apiVersion: '2025-07-30.basil', // use the latest supported version
});

export async function POST(req: NextRequest) {
  let event: Stripe.Event;

  try {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature') as string;

    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string,
    );
  } catch (error) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // ✅ Handle only charge.succeeded
  if (event.type === 'charge.succeeded') {
    const charge = event.data.object as Stripe.Charge;

    try {
      await updateOrderToPaid({
        orderId: charge.metadata.orderId,
        paymentResult: {
          id: charge.id,
          status: 'COMPLETED',
          email_address: charge.billing_details?.email ?? '',
          pricePaid: (charge.amount / 100).toFixed(),
        },
      });

      return NextResponse.json({ message: 'updateOrderToPaid was successful' });
    } catch (error) {
      return NextResponse.json(
        { error: 'Order update failed' },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ message: `Unhandled event type: ${event.type}` });
}
