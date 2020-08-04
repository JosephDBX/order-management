import React from "react";
import UserCreate from "../../components/user/UserCreate";
import { useFirebase, useFirestore } from "react-redux-firebase";
import { IUser } from "../../models/IUser";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";

const SignUpPage: React.FunctionComponent = () => {
  const firebase = useFirebase();
  const firestore = useFirestore();
  const history = useHistory();

  const onCreateUser = (email: string, password: string) => {
    toast.info("Procesando... por favor espere...");
    const user: IUser = { email: email };

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
        toast.success(
          "Se le ha enviado un correo electrónico de verificación, revise su bandeja de entrada y luego inicie sesión."
        );
        history.push("/sign-in");
      })
      .catch((error) => {
        if (
          error.message ===
          "The email address is already in use by another account."
        ) {
          toast.error(
            "La dirección de correo electrónico ya está en uso por otra cuenta."
          );
        } else {
          toast.error(error.message);
        }
      });
  };

  return (
    <>
      <UserCreate onCreateUser={onCreateUser} />
    </>
  );
};

export default SignUpPage;
