import React, { useState } from "react";
import { IProfile } from "../../models/IProfile";
import { ERol } from "../../models/ERol";
import { useHistory } from "react-router-dom";
import SummaryLayout from "../../layouts/SummaryLayout";
import ModalLayout from "../../layouts/ModalLayout";
import { useFirestoreConnect, isLoaded } from "react-redux-firebase";
import { useSelector } from "react-redux";
import { IProfileTest } from "../../models/IProfileTest";
import { ITest } from "../../models/ITest";

interface IProfileDetailProps {
  profile: IProfile;
  rol: ERol;
  isMain?: boolean;
  onProfileStateChange?(id: string, state: boolean): void;
}

const ProfileDetail: React.FunctionComponent<IProfileDetailProps> = ({
  profile,
  rol,
  isMain,
  onProfileStateChange,
}) => {
  useFirestoreConnect([
    { collection: "profile_tests", where: ["profile", "==", profile.id] },
  ]);
  const profile_tests: IProfileTest[] = useSelector(
    (state: any) => state.firestore.ordered.profile_tests
  );

  const getActives = () => {
    return profile_tests.filter((value) => value.state).length;
  };
  const getCost = () => {
    let sum = 0.0;
    for (let i = 0; i < profile_tests.length; i++) {
      if (profile_tests[i].state) sum += profile_tests[i].cost;
    }
    return sum;
  };
  const getTotalCost = () => {
    let sum = 0.0;
    for (let i = 0; i < profile_tests.length; i++) {
      sum += profile_tests[i].cost;
    }
    return sum;
  };

  const history = useHistory();
  const navigateToSearch = () => {
    if (rol === ERol.Admin) history.push(`/admin-panel/profiles/${profile.id}`);
    else history.push(`/search/?profile=${profile.id}`);
  };
  const navigateToEdit = () => {
    history.push(`/admin-panel/profiles/${profile.id}/edit`);
  };
  const onSwitchActive = () => {
    if (onProfileStateChange)
      onProfileStateChange(profile.id as string, !profile.state);
    setModal(false);
  };

  const [modal, setModal] = useState(false);
  const onOpenModal = () => {
    setModal(true);
  };
  const onCloseModal = () => {
    setModal(false);
  };

  return (
    <>
      <SummaryLayout
        title="Perfil"
        styleTitle={
          rol === ERol.Public
            ? "bg-blue-600 text-white"
            : profile.state
            ? "bg-teal-600 text-white"
            : "bg-red-600 text-white"
        }
        component={
          <>
            <div
              className="h-32 p-8 relative rounded-full mx-auto shadow-md flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(145deg, #3182CEB0 30%, #319795C0 60%), url('/bg_profile.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <h3 className="text-center rounded-sm p-4 text-white text-2xl">
                {profile.name}
              </h3>
              <div className="bg-red-600 rounded-full absolute right-0 top-0">
                <p className="text-white text-center font-semibold p-2 text-lg">
                  USD ${isLoaded(profile_tests) ? getCost() : 0.0}
                </p>
              </div>
            </div>
            {rol === ERol.Admin && (
              <div className="flex justify-end my-4">
                <div
                  className={`rounded-full bg-${
                    profile.state ? "teal-600" : "red-600"
                  }`}
                >
                  <p className="text-white text-center font-semibold p-2">
                    Estado:{" "}
                    <span className="underline">
                      {profile.state ? "A" : "Desa"}ctivado
                    </span>
                  </p>
                </div>
              </div>
            )}
            {!!profile.alternative && (
              <div className="rounded-sm shadow my-4">
                <h4 className="text-center m-2 text-lg">
                  Nombres alternativos del perfil
                </h4>
                <hr className="m-2" />
                <div className="frame" style={{ maxHeight: "8rem" }}>
                  {profile.alternative?.split(/\n/).map((subName, index) => (
                    <div className="rounded-sm m-1 shadow-md p-2" key={index}>
                      <h4 className="flex items-center">
                        <span className="material-icons">bookmark</span>
                        {subName}
                      </h4>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <p className="text-center m-4 font-semibold">Descripción</p>
            <p className="text-justify m-4">{profile.description}</p>
            {isLoaded(profile_tests) ? (
              <p className="text-justify m-4">
                Contiene{" "}
                <b>
                  {getActives()}
                  {rol === ERol.Admin ? `/${profile_tests.length}` : null}
                </b>{" "}
                exámenes activos, por un total de
                <b>
                  USD ${getCost()}
                  {rol === ERol.Admin ? `/${getTotalCost()}` : null}
                </b>
              </p>
            ) : null}
          </>
        }
        code={rol !== ERol.Public ? profile.id : ""}
        controls={
          <>
            {!isMain && (
              <button className="btn btn-secondary" onClick={navigateToSearch}>
                Detalles
              </button>
            )}
            {rol === ERol.Admin && (
              <>
                <button className="btn btn-warning" onClick={navigateToEdit}>
                  {isMain
                    ? "Editar Nombre, nombres alternativos y Descripción"
                    : "Editar"}
                </button>
                {!isMain && (
                  <button
                    className={`btn btn-${
                      profile.state ? "danger" : "primary"
                    }`}
                    onClick={onOpenModal}
                  >
                    {profile.state ? "Desa" : "A"}ctivar
                  </button>
                )}
              </>
            )}
          </>
        }
      />
      <ModalLayout
        title={`¿Estás realmente seguro de ${
          profile.state ? "des" : ""
        }activar el perfil?`}
        open={modal}
        component={
          <>
            <p className="m-2 text-justify pb-2">
              {profile.state
                ? "¡Deshabilitar el perfil no permitirá a los usuarios verlo, pero será visible en las órdenes ya creados! ¡No desactivará los exámenes que contiene!"
                : "Solo se activará el perfil, ¡recuerde que tendrá que activar cada examen por separado!"}
            </p>
            <hr />
            <div className="flex justify-end">
              <button
                className={`btn btn-${
                  profile.state ? "danger" : "primary"
                } m-2`}
                onClick={onSwitchActive}
              >
                {profile.state ? "Desa" : "A"}ctivar
              </button>
              <button className="btn m-2" onClick={onCloseModal}>
                Cancelar
              </button>
            </div>
          </>
        }
        onClose={onCloseModal}
      />
    </>
  );
};

export default ProfileDetail;
