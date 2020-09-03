import React from "react";
import { IOrder } from "../../models/IOrder";
import { ERol } from "../../models/ERol";

interface IOrderDetailProps {
  order: IOrder;
  rol: ERol;
  onOrderStateChange?(id: string, state: boolean): void;
}

const OrderDetail: React.FunctionComponent<IOrderDetailProps> = ({
  order,
  rol,
  onOrderStateChange,
}) => {
  return <div>OrderDetail</div>;
};

export default OrderDetail;
