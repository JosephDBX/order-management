import React from "react";
import UserCreate from "../components/user/UserCreate";
import { useFirebase, useFirestore } from "react-redux-firebase";
import { IUser } from "../models/IUser";

const SignUpPage: React.FunctionComponent = () => {
  const firebase = useFirebase();
  const firestore = useFirestore();

  const onCreateUser = (email: string, password: string) => {
    const user: IUser = { email: email, state: true };

    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        user.uid = result.user?.uid;
        return result.user?.sendEmailVerification();
      })
      .then(() => {
        return firestore
          .collection("users")
          .doc(user.uid)
          .set(user, { merge: true });
      })
      .then(() => {
        return firebase.auth().signOut();
      })
      .then(() => {
        console.log("Mail Sent!!!");
      })
      .catch((error) => {
        console.error("ERROR: ", error.message);
      });
  };

  return (
    <>
      <UserCreate onCreateUser={onCreateUser} />
    </>
  );
};

export default SignUpPage;
