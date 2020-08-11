import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
admin.initializeApp(functions.config().firebase);

import { IArea } from "./models/IArea";
import { ITest } from "./models/ITest";

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
