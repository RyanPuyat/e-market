import { Metadata } from 'next';
import { auth } from '@/lib/auth';
import { getUserById } from '@/lib/actions/user.actions';
import PaymentMethodForm from '@/components/shared/payment-method/payment-method-form';
import CheckoutSteps from '@/components/shared/cart/checkout-steps';

export const metadata: Metadata = {
  title: 'Select Payment Method',
};

async function PaymentMethodPage() {
  const session = await auth();

  const userID = session?.user?.id;

  if (!userID) throw new Error('User not found');

  const user = await getUserById(userID);

  return (
    <>
      <CheckoutSteps current={2} />
      <PaymentMethodForm preferredPaymentMethod={user.paymentMethod} />
    </>
  );
}

export default PaymentMethodPage;
