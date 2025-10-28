// import sampleData from '@/db/sample-data';
import { getLatestProducts } from '@/lib/actions/product.actions';
import ProductList from '@/components/shared/product/product-list';

async function Homepage() {
  const latestProduct = await getLatestProducts();
  return (
    <>
      <ProductList data={latestProduct} title="Newest Arrival" limit={4} />
    </>
  );
}

export default Homepage;
