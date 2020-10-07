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
import { IUser } from "../../models/IUser";

interface IOrderManagementProps {
  patients: IPatient[];
  orders: IOrder[];
  orderTests: IOrderTest[];
  orderProfiles: IOrderProfile[];
  tests: ITest[];
  profiles: IProfile[];
  rol: ERol;
  doctors: IUser[];
  isFull?: boolean;
  onOrderStateChange?(id: string, state: string): void;
}

const OrderManagement: React.FunctionComponent<IOrderManagementProps> = ({
  patients,
  orders,
  orderTests,
  orderProfiles,
  tests,
  profiles,
  rol,
  doctors,
  isFull,
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
              .includes(filter.toLowerCase()) ||
            (order.attendingDoctor &&
              order.attendingDoctor ===
                doctors.find((d) =>
                  d.userName?.toLowerCase().includes(filter.toLowerCase())
                )?.uid) ||
            order.patient ===
              patients.find((p) =>
                `${p.name} ${p.surname}`
                  .toLowerCase()
                  .includes(filter.toLowerCase())
              )?.id
        )
        .filter((order) =>
          state ? order.state === state || state === "" : true
        )
        .map((order) => (
          <OrderDetail
            order={order}
            orderTests={orderTests.filter((ot) => ot.order === order.id)}
            orderProfiles={orderProfiles.filter((op) => op.order === order.id)}
            tests={tests}
            profiles={profiles}
            rol={rol}
            doctor={doctors.find((d) => d.uid === order.attendingDoctor)}
            patient={patients?.find((p) => p.id === order.patient) as IPatient}
            onOrderStateChange={onOrderStateChange}
            key={order.id}
          />
        ))
    );
    setFilterText({ filter, state });
  };

  useEffect(() => {
    onFilterText(filterText.filter, filterText.state);
  }, [orders, orderTests, orderProfiles, doctors]);

  return (
    <ManageLayout
      title="Gestionar órdenes de examen"
      subTitle={`¡Todas las órdenes de examen${
        rol !== ERol.Laboratorist
          ? rol === ERol.DeliveryWorker
            ? " pendientes"
            : " del paciente"
          : " en proceso"
      }!`}
      controls={
        <OrderControl
          rol={rol}
          onFilterText={onFilterText}
          patient={patients[0]}
        />
      }
      list={<GridLayout list={list} type={isFull ? 0 : 1} defaultText="No hay órdenes!!!" />}
    />
  );
};

export default OrderManagement;
