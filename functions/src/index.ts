import * as functions from "firebase-functions";

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

export const AreaTestStateChange = functions.firestore
  .document("/areas/{documentId}")
  .onUpdate((change, context) => {
    const currentArea = change.after.data();
    console.log(currentArea);
  });
