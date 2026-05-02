import { orderModel } from "@/models/order-models";
import OrderSummery from "./OrderSummery";

const OrderList = async ({ userId }) => {
  const orderList = await orderModel.find({ userId: userId });

  return (
    <div className="container">
      <div className="container p-2 mx-auto sm:p-4 ">
        <h2 className="mb-4 text-2xl font-semibold leadi">Order History</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full ">
            <colgroup>
              <col />
              <col />
              <col />
              <col />
              <col />
              <col className="w-24" />
            </colgroup>
            <thead className="bg-gray-200 ">
              <tr className="text-left">
                <th className="p-3">Invoice #</th>
                <th className="p-3">Product</th>
                <th className="p-3">Order Date/Time</th>
                <th className="p-3">Amount</th>
                <th className="p-2">Status</th>
                <th className="p-4">Download Invoice</th>
              </tr>
            </thead>
            <tbody>
              {orderList?.map((order) => (
                <OrderSummery key={order.id} order={order} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderList;
