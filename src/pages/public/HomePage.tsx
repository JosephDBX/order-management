import React, { useState } from "react";
import AreaManagement from "../../components/area/AreaManagement";
import { useFirestoreConnect, isLoaded } from "react-redux-firebase";
import { IArea } from "../../models/IArea";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { ERol } from "../../models/ERol";
import { IProfile } from "../../models/IProfile";
import ProfileManagement from "../../components/profile/ProfileManagement";
import { IProfileTest } from "../../models/IProfileTest";
import Breadcrumbs from "../../components/custom/Breadcrumbs";

const HomePage: React.FunctionComponent = () => {
  useFirestoreConnect([
    { collection: "areas", where: [["state", "==", true]] },
    { collection: "profiles", where: [["state", "==", true]] },
    { collection: "profile_tests", where: [["state", "==", true]] },
  ]);

  const areas: IArea[] = useSelector(
    (state: any) => state.firestore.ordered.areas
  );
  const profiles: IProfile[] = useSelector(
    (state: any) => state.firestore.ordered.profiles
  );
  const profile_tests: IProfileTest[] = useSelector(
    (state: any) => state.firestore.ordered.profile_tests
  );

  const [serviceView, setServiceView] = useState(true);

  const setAreaView = () => {
    setServiceView(true);
  };

  const setProfileView = () => {
    setServiceView(false);
  };

  const history = useHistory();
  const navigateToSearch = () => {
    history.push("/search");
  };

  return (
    <>
      <Breadcrumbs last="Home" />
      <div
        className="h-48 shadow-md rounded-sm bg-auto flex flex-col justify-center md:justify-end p-2 md:p-4"
        style={{
          background:
            "linear-gradient(145deg, #3182CED0 30%, #319795E0 60%), url('/cover.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          zoom: 2,
        }}
      >
        <h1 className="text-white hidden md:block">
          Laboratorio Clínico Bacteriológico Moncada
        </h1>
        <h2 className="text-white text-center block md:hidden">LCBM</h2>
        <p className="text-white text-xs text-center md:text-left font-semibold mx-0 md:mx-1">
          Pruebas de laboratorio y ultrasonido a domicilio.
        </p>
      </div>
      <div className="mt-4">
        <h2 className="text-2xl p-2">Nuestros servicos</h2>
        <hr className="m-2" />
        <div className="flex flex-col md:flex-row items-center">
          <p className="font-semibold m-2">
            Aquí puedes encontrar el examen que estás buscando
          </p>
          <button
            className="btn btn-secondary m-2 mb-4"
            onClick={navigateToSearch}
          >
            <span className="material-icons">search</span>Buscar Examen
          </button>
        </div>
        <div className="rounded-sm shadow-md my-2">
          <div className="flex justify-center bg-blue-600 my-2 rounded-t-sm p-2">
            <button
              className={`btn btn-primary shadow-none mx-2 ${
                serviceView && "border-b-4 border-blue-100 rounded-b-none"
              }`}
              onClick={setAreaView}
            >
              Areas
            </button>
            <button
              className={`btn btn-primary shadow-none mx-2 ${
                !serviceView && "border-b-4 border-blue-100 rounded-b-none"
              }`}
              onClick={setProfileView}
            >
              Perfiles
            </button>
          </div>
          {serviceView ? (
            <>
              {!isLoaded(areas) ? (
                <p className="m-2 text-center">Cargando áreas...</p>
              ) : (
                <AreaManagement areas={areas} rol={ERol.Public} />
              )}
            </>
          ) : (
            <>
              {!isLoaded(profiles) || !isLoaded(profile_tests) ? (
                <p className="m-2 text-center">Cargando perfiles...</p>
              ) : (
                <ProfileManagement
                  profiles={profiles.filter(
                    (profile) =>
                      profile_tests.filter((pt) => pt.profile === profile.id)
                        .length > 0
                  )}
                  profile_tests={profile_tests}
                  rol={ERol.Public}
                />
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default HomePage;
