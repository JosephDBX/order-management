import React from "react";
import {
  useFirestoreConnect,
  isLoaded,
  isEmpty,
  useFirestore,
} from "react-redux-firebase";
import { useSelector } from "react-redux";
import { IUser } from "../models/IUser";

const HomePage: React.FunctionComponent = () => {
  const id = "N7evE64CQtREqFS75X09";
  const firestore = useFirestore().collection("users");
  useFirestoreConnect([{ collection: "users" }]);
  const users: IUser[] = useSelector(
    (state: any) => state.firestore.ordered.users
  );
  /*const user: IUser = useSelector(
    ({ firestore: { data } }: any) => data.users && data.users[id]
  );*/
  const addUser = () => {
    const aux: IUser = {
      email: "test@gmail.com",
      state: true,
    };
    firestore.doc(id).set(aux, { merge: true }).then(value => console.log(value));
  };
  return (
    <>
      <div
        className="h-48 shadow-md rounded-sm bg-auto flex flex-col justify-center md:justify-end p-2 md:p-4"
        style={{
          background:
            "linear-gradient(145deg, #3182CED0 30%, #319795E0 60%), url('cover.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          zoom: 2,
        }}
      >
        <h1 className="text-white opacity-0 md:opacity-100">
          Laboratorio Clínico Bacteriológico Moncada
        </h1>
        <h2 className="text-white opacity-100 md:opacity-0">LCBM</h2>
        <p className="text-white text-xs font-semibold mx-0 md:mx-2">
          Pruebas de laboratorio y ultrasonido a domicilio.
        </p>
      </div>
      {
        <div>
          {!isLoaded(users) ? (
            <p>Loading...</p>
          ) : isEmpty(users) ? (
            <p>Users List is Empty.</p>
          ) : (
            <ul>
              {Object.keys(users).map((key, id) => (
                <li key={key}>{users[id].email}</li>
              ))}
            </ul>
          )}
        </div>
      }
      {/*<div>
        {!isLoaded(user) ? (
          <p>Loading...</p>
        ) : isEmpty(user) ? (
          <p>User is Empty.</p>
        ) : (
          user.email
        )}
      </div>*/}
      <button onClick={addUser}>Add</button>
    </>
  );
};

export default HomePage;
