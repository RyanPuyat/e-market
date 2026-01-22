'use server';

import { auth } from '../auth';
import { formatError } from '../utils';
import { insertReviewSchema } from '../validators';
import z, { success } from 'zod';
import { prisma } from '@/db/prisma';
import { revalidatePath } from 'next/cache';

//Create & Update Reviews
export async function createUpdateReview(
  data: z.infer<typeof insertReviewSchema>,
) {
  try {
    const session = await auth();
    if (!session) throw new Error('User is not authenticated');

    // Validate and store the review
    const review = insertReviewSchema.parse({
      ...data,
      userId: session?.user?.id,
    });

    //Get product that is being reviewed
    const product = await prisma.product.findFirst({
      where: { id: review.productId },
    });

    if (!product) throw new Error('Product not found');

    //Check if user already reviewd
    const reviewExists = await prisma.review.findFirst({
      where: { productId: review.productId, userId: review.userId },
    });

    await prisma.$transaction(async (tx) => {
      if (reviewExists) {
        //Update a review
        await tx.review.update({
          where: { id: reviewExists.id },
          data: {
            title: review.title,
            description: review.description,
            rating: review.rating,
          },
        });
      } else {
        //Create a review

        await tx.review.create({ data: review });
      }

      //Get the average rating

      const averageRating = await tx.review.aggregate({
        _avg: { rating: true },
        where: { productId: review.productId },
      });

      //Get the number of reviews
      const numReviews = await tx.review.count({
        where: { productId: review.productId },
      });

      //Update the rating and numReviews in product table
      await tx.product.update({
        where: { id: review.productId },
        data: {
          rating: averageRating._avg.rating || 0,
          numReviews,
        },
      });
    });

    revalidatePath(`/product/${product.slug}`);
    return {
      success: true,
      message: 'Review updated sucesfully',
    };
  } catch (error) {
    return { sucess: false, message: formatError(error) };
  }
}
