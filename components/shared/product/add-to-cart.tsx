'use client';
import { CartItem } from '@/types';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { ToastAction } from '@/components/ui/sonner';
import { addItemToCart } from '@/lib/actions/cart.actions';

function AddToCart({ item }: { item: CartItem }) {
  const router = useRouter();
  // const { toast } = useSonner();

  async function handleAddToCart() {
    const res = await addItemToCart(item);

    if (!res?.success) {
      toast.error(res?.message);
      return;
    }

    //Handle success add to cart
    toast(`${item.name} added to cart`, {
      action: (
        <ToastAction
          className="bg-primary text-white hover:bg-gray-800"
          altText="Go to Cart"
          onClick={() => router.push('/cart')}
        >
          Go To Cart
        </ToastAction>
      ),
    });
  }

  return (
    <Button className="w-full" type="button" onClick={handleAddToCart}>
      <Plus /> Add To Cart
    </Button>
  );
}

export default AddToCart;
