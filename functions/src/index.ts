import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
admin.initializeApp(functions.config().firebase);

import { IArea } from "./models/IArea";
import { ITest } from "./models/ITest";
import { IOrder } from "./models/IOrder";
import { IPatient } from "./models/IPatient";
import { IUser } from "./models/IUser";

export const AreaTestStateChange = functions.firestore
  .document("/areas/{documentId}")
  .onUpdate(async (change, context) => {
    const currentArea: IArea = {
      id: change.after.id,
      ...(change.after.data() as IArea),
    };
    if (!currentArea.state) {
      const query = await admin
        .firestore()
        .collection("tests")
        .where("area", "==", currentArea.id)
        .get();
      query.forEach((documentSnapshot) => {
        const docRef = documentSnapshot.ref;
        return docRef.set({ state: false }, { merge: true });
      });
    }
  });

export const TestStateChange = functions.firestore
  .document("/tests/{documentId}")
  .onUpdate(async (change, contex) => {
    const currentTest: ITest = {
      id: change.after.id,
      ...(change.after.data() as ITest),
    };
    const query = await admin
      .firestore()
      .collection("profile_tests")
      .where("test", "==", currentTest.id)
      .get();
    query.forEach((documentSnapshot) => {
      const docRef = documentSnapshot.ref;
      return docRef.set(
        { cost: currentTest.cost, state: currentTest.state },
        { merge: true }
      );
    });
  });

export const orderCreate = functions.firestore
  .document("/orders/{documentId}")
  .onCreate((snapshot) => {
    const order: IOrder = {
      id: snapshot.id,
      ...(snapshot.data() as IOrder),
    };
    admin
      .firestore()
      .doc(`/patients/${order.patient}`)
      .get()
      .then(async (patientSnapshot) => {
        const patient: IPatient = {
          id: patientSnapshot.id,
          ...(patientSnapshot.data() as IPatient),
        };

        const payload = {
          notification: {
            title: `Se ha creado una orden para el paciente: ${patient.name} ${patient.surname}`,
            body: `Para el día ${new Date(order.orderedTo).toISOString()}`,
            icon: "./logo512.png",
            click_action: `https://${process.env.GCLOUD_PROJECT}.web.app/receptionist-panel/patients/${patient.id}?order=${order.id}`,
          },
        };

        const allTokens = await admin.firestore().collection("fcmTokens").get();
        const tokens: string[] = [];
        allTokens.forEach(async (tokenDoc) => {
          const user: IUser = (
            await admin.firestore().doc(`/users/${tokenDoc.data().uid}`).get()
          ).data() as IUser;
          if (user.roles?.isReceptionist) {
            tokens.push(tokenDoc.id);
          }
        });

        if (tokens.length > 0) {
          await admin.messaging().sendToDevice(tokens, payload);
          // await cleanupTokens(response, tokens);
          console.log(`${tokens.length} notifications have been sent.`);
        }
      });
  });
