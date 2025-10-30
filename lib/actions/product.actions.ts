'use server';
import { LATEST_PRODUCTS_LIMIT } from '../constants';
// import { PrismaClient } from '../generated/prisma/client';
import { prisma } from '@/db/prisma';
import { convertToPlainObject } from '../utils';

//Get latestProducts
export async function getLatestProducts() {
  // const prisma = new PrismaClient();

  const data = await prisma.product.findMany({
    take: LATEST_PRODUCTS_LIMIT,
    orderBy: { createdAt: 'desc' },
  });

  return convertToPlainObject(data);
}

// Get single product by it's slug

export async function getProductBySlug(slug: string) {
  return await prisma.product.findFirst({
    where: { slug: slug },
  });
}
