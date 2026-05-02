import { getProductById } from "@/database/queries";

export default async function CartInfo({ cart }) {
  const product = await getProductById(cart?.itemId);
  return (
    <>
      <span>
        <p>
          <strong>Product Name:</strong> {product?.name}
        </p>
        <p>
          <strong>Quantity:</strong> {cart.itemQuantity}
        </p>
      </span>
    </>
  );
}
