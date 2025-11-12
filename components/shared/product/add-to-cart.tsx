'use client';
import { Cart, CartItem } from '@/types';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Plus, Minus } from 'lucide-react';
import { toast } from 'sonner';
import { ToastAction } from '@/components/ui/sonner';
import { addItemToCart, removeItemFromCart } from '@/lib/actions/cart.actions';

function AddToCart({ cart, item }: { cart?: Cart; item: CartItem }) {
  const router = useRouter();
  // const { toast } = useSonner();

  async function handleAddToCart() {
    const res = await addItemToCart(item);

    if (!res?.success) {
      toast.error(res?.message);
      return;
    }

    //Handle success add to cart
    toast(res.message, {
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

  //Handle remove from cart

  async function handleRemoveFromCart() {
    const res = await removeItemFromCart(item.productId);

    if (res.success) {
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }

    return;
  }

  // Check if item is in cart
  const existItem =
    cart && cart.items.find((x) => x.productId === item.productId);

  return existItem ? (
    <div>
      <Button type="button" variant="outline" onClick={handleRemoveFromCart}>
        <Minus className="h-4 w-4" />
      </Button>
      <span className="px-2">{existItem.qty}</span>
      <Button type="button" variant="outline" onClick={handleAddToCart}>
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  ) : (
    <Button className="w-full" type="button" onClick={handleAddToCart}>
      <Plus /> Add To Cart
    </Button>
  );
}

export default AddToCart;
