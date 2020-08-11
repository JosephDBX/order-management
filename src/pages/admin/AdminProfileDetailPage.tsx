import React from "react";
import { useParams, useHistory } from "react-router-dom";
import {
  useFirestore,
  useFirestoreConnect,
  isLoaded,
  isEmpty,
} from "react-redux-firebase";
import { IProfile } from "../../models/IProfile";
import { useSelector } from "react-redux";
import { ITest } from "../../models/ITest";
import { IProfileTest } from "../../models/IProfileTest";
import MainDetailLayout from "../../layouts/MainDetailLayout";
import ProfileDetail from "../../components/profile/ProfileDetail";
import { ERol } from "../../models/ERol";
import TestManagement from "../../components/test/TestManagement";

const AdminProfileDetailPage: React.FunctionComponent = () => {
  const { id } = useParams();
  const history = useHistory();
  const firestore = useFirestore();
  useFirestoreConnect(() => [
    { collection: "profiles", doc: id },
    { collection: "profile_tests", where: ["profile", "==", id] },
    { collection: "tests" },
  ]);

  const currentProfile: IProfile = useSelector(
    ({ firestore: { data } }: any) => data.profiles && data.profiles[id]
  );
  const profile_tests: IProfileTest[] = useSelector(
    (state: any) => state.firestore.ordered.profile_tests
  );
  const tests: ITest[] = useSelector(
    (state: any) => state.firestore.ordered.tests
  );

  const navigateToProfileManagement = () => {
    history.push("/admin-panel/profiles");
  };

  return (
    <>
      {!isLoaded(currentProfile) ||
      !isLoaded(profile_tests) ||
      !isLoaded(tests) ? (
        <p className="m-2 text-center">Cargando perfil...</p>
      ) : isEmpty(currentProfile) ? (
        <div className="flex flex-col justify-center">
          <p className="m-2 text-center font-code">
            ¡El perfil con id:{id}, no existe!
          </p>
          <button
            className="btn btn-secondary my-4 mx-auto"
            onClick={navigateToProfileManagement}
          >
            <span className="material-icons">arrow_back</span>Regresar a la
            gestión de perfiles
          </button>
        </div>
      ) : (
        <>
          <div className="flex justify-start">
            <button className="btn m-2" onClick={navigateToProfileManagement}>
              <span className="material-icons">arrow_back</span>Regresar a la
              gestión de perfiles
            </button>
          </div>
          <MainDetailLayout
            title={`Gestionar exámenes del perfil: ${currentProfile.name}`}
            main={
              <ProfileDetail
                profile={{ id, ...currentProfile }}
                profile_tests={profile_tests}
                rol={ERol.Admin}
                isMain
              />
            }
            detail={
              <>
                {!isLoaded(tests) ? (
                  <p className="m-2 text-center">Cargando exámenes...</p>
                ) : (
                  <TestManagement rol={ERol.Admin} tests={tests} />
                )}
              </>
            }
          />
        </>
      )}
    </>
  );
};

export default AdminProfileDetailPage;