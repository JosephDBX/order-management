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
import { useLocation } from "react-router-dom";
import { PDFGenerator } from "../../helper/PDFGenerator";

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
  const location = useLocation();
  const getQueryParams = () => {
    const params: string[] = location.search.substr(1).split("&");
    const type: string[] = params[0].split("=") as string[];
    return {
      type: type[0] ? type[0] : "",
      id: type[1] ? type[1] : "",
    };
  };
  // Selected List
  const [list, setList] = useState<any[]>([]);
  const [filterText, setFilterText] = useState<{
    filter: string;
    state: string;
    doctorId: string;
    selectedPatients: IPatient[];
    startAt?: Date;
    endAt?: Date;
  }>({
    filter: "",
    state: "",
    doctorId: "",
    selectedPatients: [],
    startAt: undefined,
    endAt: undefined,
  });

  const onFilterText = (
    filter: string,
    state: string,
    doctorId: string,
    selectedPatients: IPatient[],
    startAt?: Date,
    endAt?: Date
  ) => {
    setList(
      orders
        .filter((order) => order.id?.includes(filter))
        .filter((order) =>
          state ? order.state === state || state === "" : true
        )
        .filter((order) =>
          doctorId
            ? order.attendingDoctor && order.attendingDoctor === doctorId
            : true
        )
        .filter((order) =>
          selectedPatients.length > 0
            ? selectedPatients.find((sp) => sp.id === order.patient)
            : true
        )
        .filter((order) =>
          startAt && endAt
            ? moment(order.orderedTo).isSameOrAfter(startAt) &&
              moment(order.orderedTo).isSameOrBefore(endAt)
            : true
        )
        .sort((first, second) => (first.orderedTo > second.orderedTo ? 1 : -1))
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
    setFilterText({
      filter,
      state,
      doctorId: doctorId,
      selectedPatients: selectedPatients,
      startAt: startAt,
      endAt: endAt,
    });
  };

  const [isPDF, setIsPDF] = useState(false);

  const onPrintFilterResult = () => {
    setIsPDF(true);
    const pdf = new PDFGenerator();
    pdf.printOrders(
      patients,
      orders,
      tests,
      orderTests,
      profiles,
      orderProfiles,
      doctors,
      filterText
    );
  };

  useEffect(() => {
    onFilterText(
      filterText.filter,
      filterText.state,
      filterText.doctorId,
      filterText.selectedPatients,
      filterText.startAt as Date,
      filterText.endAt as Date
    );
  }, [orders, orderTests, orderProfiles, doctors]);
  useEffect(() => {
    onFilterText(
      getQueryParams().id,
      filterText.state,
      filterText.doctorId,
      filterText.selectedPatients,
      filterText.startAt as Date,
      filterText.endAt as Date
    );
  }, [location]);

  return (
    <>
      {isPDF ? (
        <div className="w-full flex justify-end">
          <button
            className="btn btn-danger m-2"
            onClick={() => setIsPDF(false)}
          >
            <span className="material-icons">delete</span>Descartar Reporte
          </button>
        </div>
      ) : null}
      <iframe
        id="pdfFrame"
        className={`${isPDF ? "w-full h-screen" : "w-0 h-0"}`}
      ></iframe>
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
            defaultText={getQueryParams().id}
            doctors={doctors.filter((doctor) =>
              orders.find((o) => o.attendingDoctor === doctor.id)
            )}
            patient={patients[0]}
            patients={patients}
            onPrintFilterResult={onPrintFilterResult}
          />
        }
        list={
          <GridLayout
            list={list}
            type={isFull ? 0 : 1}
            defaultText="No hay órdenes!!!"
          />
        }
      />
    </>
  );
};

export default OrderManagement;
