'use server';
import { LATEST_PRODUCTS_LIMIT, PAGE_SIZE } from '../constants';
// import { PrismaClient } from '../generated/prisma/client';
import { prisma } from '@/db/prisma';
import { convertToPlainObject, formatError } from '../utils';
import { revalidatePath } from 'next/cache';
import { insertProductSchema, updateProductSchema } from '../validators';
import z from 'zod';
import { Prisma } from '@prisma/client';

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
// Get single product by ID

export async function getProductById(productId: string) {
  const data = await prisma.product.findFirst({
    where: { id: productId },
  });

  return convertToPlainObject(data);
}

// Get all products
export async function getAllProducts({
  query,
  limit = PAGE_SIZE,
  page,
  category,
  price,
  rating,
  sort,
}: {
  page: number;
  query: string;
  limit?: number;
  category?: string;
  price?: string;
  rating?: string;
  sort?: string;
}) {
  // console.log('Query:', query);
  const where: Prisma.ProductWhereInput = {};

  // Apply search filter
  if (query && query.trim() !== '') {
    where.OR = [
      { name: { contains: query, mode: 'insensitive' } },
      { category: { contains: query, mode: 'insensitive' } },
      // add description if your model has it
      { description: { contains: query, mode: 'insensitive' } },
    ];
  }

  // Apply category filter
  if (category && category.trim() !== '') {
    where.category = category;
  }

  const data = await prisma.product.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    skip: (page - 1) * limit,
    take: limit,
  });

  const dataCount = await prisma.product.count({ where });
  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
}

//Delete a product

export async function deleteProduct(id: string) {
  try {
    const productExists = await prisma.product.findFirst({
      where: { id },
    });

    if (!productExists) throw new Error('Product not found');

    await prisma.product.delete({ where: { id } });

    revalidatePath('/admin/products');

    return {
      success: true,
      message: 'Products deleted successfully',
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

//Create a product
export async function createProduct(data: z.infer<typeof insertProductSchema>) {
  try {
    const product = insertProductSchema.parse(data);
    await prisma.product.create({ data: product });
    revalidatePath('/admin/products');

    return {
      success: true,
      message: 'Product created succesfully',
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

//Update a product
export async function updateProduct(data: z.infer<typeof updateProductSchema>) {
  try {
    const product = updateProductSchema.parse(data);
    const productExists = await prisma.product.findFirst({
      where: { id: product.id },
    });

    if (!productExists) throw new Error('Product not found');
    await prisma.product.update({
      where: { id: product.id },
      data: product,
    });

    revalidatePath('/admin/products');

    return {
      success: true,
      message: 'Product updated succesfully',
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

//Get all categories
export async function getAllCategories() {
  const data = await prisma.product.groupBy({
    by: ['category'],
    _count: true,
  });

  return data;
}

//Get featured products
export async function getFeaturedProducts() {
  const data = await prisma.product.findMany({
    where: { isFeatured: true },
    orderBy: { createdAt: 'desc' },
    take: 4,
  });

  return convertToPlainObject(data);
}
