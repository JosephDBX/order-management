import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
admin.initializeApp(functions.config().firebase);

import { IArea } from "./models/IArea";

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
