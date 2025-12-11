'use client';

import { productDefaultValues } from '@/lib/constants';
import {
  insertProductSchema,
  ProductFormValues,
  updateProductSchema,
} from '@/lib/validators';
import { Product } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';
import { Form } from '../ui/form';

function ProductForm({
  type,
  product,
  productId,
}: {
  type: 'Create' | 'Update';
  product?: Product;
  productId?: string;
}) {
  const router = useRouter();
  const form = useForm<z.infer<typeof insertProductSchema>>({
    resolver:
      type === 'Update'
        ? zodResolver(updateProductSchema)
        : zodResolver(insertProductSchema),
    defaultValues:
      product && type === 'Update' ? product : productDefaultValues,
  });

  //   Error Here please check

  //   const form = useForm<ProductFormValues>({
  //     resolver: zodResolver(updateProductSchema),
  //     defaultValues:
  //       type === 'Update' && product
  //         ? { ...product, id: product.id }
  //         : productDefaultValues,
  //   });

  return (
    <Form {...form}>
      <form className="space-y-8">
        <div className="flex flex-col md:flex-row gap-5">
          {/* Name */}
          {/* Slug */}
        </div>
        <div className="flex flex-col md:flex-row gap-5">
          {/* Category */}
          {/* Brand */}
        </div>
        <div className="flex flex-col md:flex-row gap-5">
          {/* Price */}
          {/* Stock */}
        </div>
        <div className="flex flex-col md:flex-row gap-5 upload-field">
          {/* Images */}
        </div>
        <div className="upload-field">{/* Features */}</div>
        <div>{/*Description */}</div>
        <div>{/*Submit */}</div>
      </form>
    </Form>
  );
}

export default ProductForm;
