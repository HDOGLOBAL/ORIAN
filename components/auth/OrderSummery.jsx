import PdfMaker from "../common/PdfMaker";
import CartInfo from "./CartInfo";

export default function OrderSummery({ order }) {
  const { totalPrice, orderedAt, cartInfo } = order;

  return (
    <>
      <tr className="border-b border-opacity-20 border-white-70 bg-white-900">
        <td className="p-3">
          <strong>#</strong>
        </td>

        <td className="p-3">
          {cartInfo.map((item) => (
            <CartInfo key={item?._id} cart={item} />
          ))}
        </td>
        <td className="p-3">
          <p>{new Date(orderedAt).toLocaleString()}</p>
        </td>
        <td className="p-3">
          <p>${totalPrice}</p>
        </td>
        <td className="p-3">
          <p>pending</p>
        </td>
        <td className="p-3 text-left">
          <PdfMaker order={order} />
        </td>
      </tr>
    </>
  );
}
