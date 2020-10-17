import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { IOrder } from "../models/IOrder";
import { IOrderProfile } from "../models/IOrderProfile";
import { IOrderTest } from "../models/IOrderTest";
import { IPatient } from "../models/IPatient";
import { IProfile } from "../models/IProfile";
import { ITest } from "../models/ITest";
import { IUser } from "../models/IUser";
import moment from "moment";
import "moment/locale/es";

export type DeliveryWorkerPrintable = {
  idPatient: boolean;
  patientName: boolean;
  patientPhone: boolean;
  patientAddress: boolean;
  patientBirthDate: boolean;
  patientDoctor: boolean;
};

moment.relativeTimeRounding(Math.floor);

export class PDFGenerator {
  private doc: jsPDF;

  constructor(
    orientation: any = "portrait",
    unit: any = "in",
    format: any = "letter"
  ) {
    this.doc = new jsPDF({
      orientation: orientation,
      unit: unit,
      format: format,
    });
    this.doc.setFontSize(12);
  }

  private addToFrame() {
    const blobURL = URL.createObjectURL(this.doc.output("blob"));
    const frame: HTMLFrameElement = document.getElementById(
      "pdfFrame"
    ) as HTMLFrameElement;
    frame.src = blobURL;
  }

  printOrders(
    patients: IPatient[],
    orders: IOrder[],
    tests: ITest[],
    orderTests: IOrderTest[],
    profiles: IProfile[],
    orderProfiles: IOrderProfile[],
    doctors: IUser[],
    filter: {
      filter: string;
      state: string;
      doctorId: string;
      selectedPatients: IPatient[];
      startAt?: Date;
      endAt?: Date;
    }
  ) {
    const currentFilter = orders
      .filter((order) => order.id?.includes(filter.filter))
      .filter((order) =>
        filter.state
          ? order.state === filter.state || filter.state === ""
          : true
      )
      .filter((order) =>
        filter.doctorId
          ? order.attendingDoctor && order.attendingDoctor === filter.doctorId
          : true
      )
      .filter((order) =>
        filter.selectedPatients.length > 0
          ? filter.selectedPatients.find((sp) => sp.id === order.patient)
          : true
      )
      .filter((order) =>
        filter.startAt && filter.endAt
          ? moment(order.orderedTo).isSameOrAfter(filter.startAt) &&
            moment(order.orderedTo).isSameOrBefore(filter.endAt)
          : true
      )
      .sort((first, second) => (first.orderedTo > second.orderedTo ? 1 : -1))
      .map((order) => {
        const patient = patients.find((p) => order.patient === p.id);
        const doctor = doctors.find((d) => order.attendingDoctor === d.id);
        return {
          idPatient: patient?.id,
          patientName: `${patient?.name} ${patient?.surname}`,
          patientDNI: patient?.ind,
          patientBirthDate: moment(patient?.birthDate).format(
            "dddd D/MMMM/YYYY"
          ),
          patientAge: moment(patient?.birthDate).fromNow(true),
          patientPhone: patient?.contact.phoneNumber,
          patientAddress: patient?.contact.address,
          doctor: doctor?.userName,
          tests: orderTests
            .filter((ot) => ot.order === order.id)
            .map((ot) => {
              const test = tests.find((t) => ot.test === t.id);
              return {
                name: test?.name,
                cost: ot.cost,
              };
            }),
          profiles: orderProfiles
            .filter((op) => op.order === order.id)
            .map((op) => {
              const profile = profiles.find((p) => op.profile === p.id);
              return {
                name: profile?.name,
                cost: op.cost,
              };
            }),
          delivery: order.delivery,
          discount: order.discount,
          description: order.description,
          orderedTo: moment(order.orderedTo).format(`dddd D/MMMM/YYYY hh:mm a`),
          state: order.state,
          idOrder: order.id,
        };
      });
    this.getTotals(currentFilter);
    this.addToFrame();
  }

  private getTotals(currentFilter: any[]) {
    let total: number = 0.0,
      discount: number = 0.0,
      delivery: number = 0.0;
    let data: string[][] = [];
    currentFilter.forEach((order) => {
      let patientData: string = `NOMBRE: ${order.patientName}\nCódigo: ${
        order.idPatient
      }${order.patientDNI ? "\nCédula: " + order.patientDNI : ""}\nEdad: ${
        order.patientBirthDate
      }, ${order.patientAge}\nTeléfono: ${order.patientPhone}\nDirección: ${
        order.patientAddress
      }`;
      let orderData: string = `FECHA VISITA: ${order.orderedTo}\nEstado: ${
        order.state === "pending"
          ? "Pendiente"
          : order.state === "process"
          ? "En proceso"
          : order.state === "complete"
          ? "Completa"
          : ""
      }\nCódigo: ${order.idOrder}\nMédico ordenando el examen: ${
        order.doctor
      }\n_________________________________________\nExámenes: `;

      let auxTest: number = 0.0;
      order.tests.forEach((test: any) => {
        orderData = orderData.concat(
          `\nNombre: ${test.name}\tUSD$ ${test.cost.toFixed(2)}`
        );
        auxTest += Number.parseFloat(test.cost.toString() as string);
        total += Number.parseFloat(test.cost.toString() as string);
      });
      orderData = orderData.concat(
        "\n_________________________________________"
      );
      orderData = orderData.concat("\nPerfiles: ");
      let auxProfile: number = 0.0;
      order.profiles.forEach((profile: any) => {
        orderData = orderData.concat(
          `\nNombre: ${profile.name}\tUSD$ ${profile.cost.toFixed(2)}`
        );
        auxProfile += Number.parseFloat(profile.cost.toString() as string);
        total += Number.parseFloat(profile.cost.toString() as string);
      });

      orderData = orderData.concat(
        "\n_________________________________________"
      );
      orderData = orderData.concat(
        `\nBruto: USD$ ${(auxTest + auxProfile).toFixed(2)}`
      );
      orderData = orderData.concat(
        `\nDescuento: USD$ ${Number.parseFloat(
          order.discount as string
        ).toFixed(2)}`
      );
      orderData = orderData.concat(
        "\n_________________________________________"
      );
      orderData = orderData.concat(
        `\nSubtotal: USD$ ${(
          auxTest +
          auxProfile -
          Number.parseFloat(order.discount as string)
        ).toFixed(2)}`
      );
      orderData = orderData.concat(
        `\nDelivery: USD$ ${Number.parseFloat(order.delivery as string).toFixed(
          2
        )}`
      );
      orderData = orderData.concat(
        "\n_________________________________________"
      );
      orderData = orderData.concat(
        `\nTotal: USD$ ${(
          auxTest +
          auxProfile -
          Number.parseFloat(order.discount as string) +
          Number.parseFloat(order.delivery as string)
        ).toFixed(2)}`
      );
      orderData = orderData.concat(
        "\n_________________________________________"
      );
      orderData = orderData.concat(
        `\nMétodo de pago y otros datos: ${order.description}`
      );

      discount += Number.parseFloat(order.discount as string);
      delivery += Number.parseFloat(order.delivery as string);
      data.push([patientData, orderData]);
    });

    this.doc.text("LABORATORIO CLÍNICO BACTERIOLÓGICO MONCADA", 4.25, 0.5, {
      maxWidth: 7.5,
      align: "center",
    });

    this.doc.text(`Bruto:\tUSD$\t${total.toFixed(2)}`, 7, 0.75, {
      maxWidth: 7.5,
      align: "right",
    });
    this.doc.text(`Descuento:\tUSD$\t(${discount.toFixed(2)})`, 7, 0.95, {
      maxWidth: 7.5,
      align: "right",
    });
    this.doc.text("\t\t______________________________", 7, 0.96, {
      maxWidth: 7.5,
      align: "right",
    });
    this.doc.text(
      `Subtotal:\tUSD$\t${(total - discount).toFixed(2)}`,
      7,
      1.15,
      {
        maxWidth: 7.5,
        align: "right",
      }
    );
    this.doc.text(
      `10% Aplicable:\tUSD$\t(${((total - discount) * 0.1).toFixed(2)})`,
      7,
      1.35,
      {
        maxWidth: 7.5,
        align: "right",
      }
    );
    this.doc.text("\t\t______________________________", 7, 1.36, {
      maxWidth: 7.5,
      align: "right",
    });
    this.doc.text(
      `Total:\tUSD$\t${((total - discount) * 0.9).toFixed(2)}`,
      7,
      1.55,
      {
        maxWidth: 7.5,
        align: "right",
      }
    );
    this.doc.text(
      `Servicio a domicilio total: USD$ ${delivery.toFixed(2)}`,
      0.75,
      1.15,
      {
        maxWidth: 7.5,
        align: "left",
      }
    );
    autoTable(this.doc, {
      head: [["Datos del paciente", "Datos de la orden"]],
      body: data,
      startY: 1.75,
      styles: {
        lineColor: [0, 0, 0],
        lineWidth: 0.01,
      },
      headStyles: {
        fillColor: [100, 100, 100],
        fontStyle: "bolditalic",
        fontSize: 14,
      },
      bodyStyles: {
        fontStyle: "normal",
        textColor: [0, 0, 0],
        fontSize: 12,
      },
    });
  }
}
