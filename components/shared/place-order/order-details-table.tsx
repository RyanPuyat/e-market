'use client';

import { formatId } from '@/lib/utils';
import { Order } from '@/types';

function OrderDetailsTable({ order }: { order: Order }) {
  return (
    <>
      <h1 className="py-4 text-2xl">Order {formatId(order.id)} </h1>
    </>
  );
}

export default OrderDetailsTable;
