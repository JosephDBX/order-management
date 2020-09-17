import React, { useState, useEffect } from "react";
import { IPatient } from "../../models/IPatient";
import { IOrder } from "../../models/IOrder";
import { ERol } from "../../models/ERol";
import OrderDetail from "./OrderDetail";
import ManageLayout from "../../layouts/ManageLayout";
import OrderControl from "./OrderControl";
import GridLayout from "../../layouts/GridLayout";
import { IOrderTest } from "../../models/IOrderTest";
import { IOrderProfile } from "../../models/IOrderProfile";
import moment from "moment";
import "moment/locale/es";
import { ITest } from "../../models/ITest";
import { IProfile } from "../../models/IProfile";

interface IOrderManagementProps {
  patient?: IPatient;
  orders: IOrder[];
  orderTests: IOrderTest[];
  orderProfiles: IOrderProfile[];
  tests: ITest[];
  profiles: IProfile[];
  rol: ERol;
  onOrderStateChange?(id: string, state: string): void;
}

const OrderManagement: React.FunctionComponent<IOrderManagementProps> = ({
  patient,
  orders,
  orderTests,
  orderProfiles,
  tests,
  profiles,
  rol,
  onOrderStateChange,
}) => {
  // Selected List
  const [list, setList] = useState<any[]>([]);
  const [filterText, setFilterText] = useState({ filter: "", state: "" });

  const onFilterText = (filter: string, state: string) => {
    setList(
      orders
        .filter(
          (order) =>
            order.id?.includes(filter) ||
            moment(order.orderedTo)
              .format("dddd D/MMMM/YYYY hh:mm a")
              .includes(filter.toLowerCase())
        )
        .filter((order) => order.state === state || state === "")
        .map((order) => (
          <OrderDetail
            order={order}
            orderTests={orderTests.filter((ot) => ot.order === order.id)}
            orderProfiles={orderProfiles.filter((op) => op.order === order.id)}
            tests={tests}
            profiles={profiles}
            rol={rol}
            idPatient={patient?.id as string}
            onOrderStateChange={onOrderStateChange}
            key={order.id}
          />
        ))
    );
    setFilterText({ filter, state });
  };

  useEffect(() => {
    onFilterText(filterText.filter, filterText.state);
  }, [orders, orderTests, orderProfiles]);

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
