import React, { useState, useEffect } from "react";
import { IPatient } from "../../models/IPatient";
import { IOrder } from "../../models/IOrder";
import { ERol } from "../../models/ERol";
import OrderDetail from "./OrderDetail";
import ManageLayout from "../../layouts/ManageLayout";
import OrderControl from "./OrderControl";
import GridLayout from "../../layouts/GridLayout";

interface IOrderManagementProps {
  patient?: IPatient;
  orders: IOrder[];
  rol: ERol;
  onOrderStateChange?(id: string, state: boolean): void;
}

const OrderManagement: React.FunctionComponent<IOrderManagementProps> = ({
  patient,
  orders,
  rol,
  onOrderStateChange,
}) => {
  // Selected List
  const [list, setList] = useState<any[]>(
    orders.map((order) => (
      <OrderDetail
        order={order}
        rol={rol}
        onOrderStateChange={onOrderStateChange}
        key={order.id}
      />
    ))
  );
  const [filterText, setFilterText] = useState({ filter: "", state: "" });

  const onFilterText = (filter: string, state: string) => {
    setList(
      orders
        .filter((order) => order.id?.includes(filter))
        .filter((order) => order.state === state || state === "")
        .map((order) => (
          <OrderDetail
            order={order}
            rol={rol}
            onOrderStateChange={onOrderStateChange}
            key={order.id}
          />
        ))
    );
    setFilterText({ filter, state });
  };

  useEffect(() => {
    onFilterText(filterText.filter, filterText.state);
  }, [orders]);

  return (
    <ManageLayout
      title="Gestionar órdenes de examen"
      subTitle="¡Todas las órdenes de examen del paciente!"
      controls={
        <OrderControl
          rol={rol}
          onFilterText={onFilterText}
          idPatient={patient?.id as string}
        />
      }
      list={<GridLayout list={list} type={1} defaultText="No hay órdenes!!!" />}
    />
  );
};

export default OrderManagement;
