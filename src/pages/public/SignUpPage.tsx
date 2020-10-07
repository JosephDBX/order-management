import React, { useState } from "react";
import UserCreate from "../../components/user/UserCreate";
import { useFirebase, useFirestore } from "react-redux-firebase";
import { IUser } from "../../models/IUser";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import Loading from "../../components/custom/Loading";
import Breadcrumbs from "../../components/custom/Breadcrumbs";

const SignUpPage: React.FunctionComponent = () => {
  const firebase = useFirebase();
  const firestore = useFirestore();
  const history = useHistory();

  const [isLoading, setIsLoading] = useState(false);

  const onCreateUser = (userName: string, email: string, password: string) => {
    setIsLoading(true);
    toast.info("Procesando... por favor espere...");
    const user: IUser = { userName: userName, email: email };

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
        setIsLoading(false);
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
      <Breadcrumbs
        navigations={[{ uri: "/home", text: "Home" }]}
        last="Crear una cuenta"
      />
      <UserCreate onCreateUser={onCreateUser} />
      <Loading isLoading={isLoading} />
    </>
  );
};

export default SignUpPage;
