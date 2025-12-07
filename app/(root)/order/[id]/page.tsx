import { Metadata } from 'next';
import { getOrderById } from '@/lib/actions/order.actions';
import { notFound } from 'next/navigation';
import OrderDetailsTable from '@/components/shared/place-order/order-details-table';
import { ShippingAddress } from '@/types';
import { requireAdmin } from '@/lib/auth-guard';
import { auth } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'Order Details',
};

async function OrderDetailsPage(props: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = await props.params;

  const order = await getOrderById(id);
  if (!order) notFound();

  const session = await auth();

  return (
    <div>
      <OrderDetailsTable
        order={{
          ...order,
          shippingAddress: order.shippingAddress as ShippingAddress,
        }}
        paypalClientId={process.env.PAYPAL_CLIENT_ID || 'sb'}
        isAdmin={session?.user?.role === 'admin' || false}
      />
    </div>
  );
}

export default OrderDetailsPage;
