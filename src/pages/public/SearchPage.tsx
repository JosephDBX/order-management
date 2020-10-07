import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { isLoaded, useFirestoreConnect } from "react-redux-firebase";
import { useLocation } from "react-router-dom";
import AreaDetail from "../../components/area/AreaDetail";
import Breadcrumbs from "../../components/custom/Breadcrumbs";
import ProfileDetail from "../../components/profile/ProfileDetail";
import TestDetail from "../../components/test/TestDetail";
import GridLayout from "../../layouts/GridLayout";
import ManageLayout from "../../layouts/ManageLayout";
import { ERol } from "../../models/ERol";
import { IArea } from "../../models/IArea";
import { IProfile } from "../../models/IProfile";
import { IProfileTest } from "../../models/IProfileTest";
import { ITest } from "../../models/ITest";

type Inputs = {
  filterText: string;
  type: string;
};

const SearchPage: React.FunctionComponent = () => {
  const location = useLocation();
  const getQueryParams = () => {
    const params: string[] = location.search.substr(1).split("&");
    const type: string[] = params[0].split("=") as string[];
    return {
      type: type ? type[0] : "",
      id: type ? type[1] : "",
    };
  };

  useFirestoreConnect(() => [
    { collection: "tests", where: [["state", "==", true]] },
    { collection: "areas", where: [["state", "==", true]] },
    { collection: "profiles", where: [["state", "==", true]] },
    { collection: "profile_tests", where: [["state", "==", true]] },
  ]);

  const tests: ITest[] = useSelector(
    (state: any) => state.firestore.ordered.tests
  );
  const areas: IArea[] = useSelector(
    (state: any) => state.firestore.ordered.areas
  );
  const profiles: IProfile[] = useSelector(
    (state: any) => state.firestore.ordered.profiles
  );
  const profile_tests: IProfileTest[] = useSelector(
    (state: any) => state.firestore.ordered.profile_tests
  );

  const getCurrentProfileTests = (idProfile: string) => {
    return profile_tests.filter((pt) => pt.profile === idProfile);
  };

  const { register, watch, setValue } = useForm<Inputs>();

  const [list, setList] = useState<any[]>([]);

  const onSubmit = () => {
    //onFilterText(watch("filterText"), watch("state"));
    switch (watch("type")) {
      case "": {
        setList([
          ...tests
            .filter(
              (t) =>
                t.id?.includes(watch("filterText")) ||
                t.name
                  .toLowerCase()
                  .includes(watch("filterText").toLowerCase()) ||
                t.description
                  .toLowerCase()
                  .includes(watch("filterText").toLowerCase()) ||
                t.alternative
                  ?.toLocaleLowerCase()
                  .includes(watch("filterText").toLowerCase())
            )
            .map((t) => (
              <TestDetail test={t} loadArea rol={ERol.Public} key={t.id} />
            )),
          ...areas
            .filter(
              (area) =>
                area.id?.includes(watch("filterText")) ||
                area.name
                  .toLowerCase()
                  .includes(watch("filterText").toLowerCase()) ||
                area.description
                  .toLowerCase()
                  .includes(watch("filterText").toLowerCase())
            )
            .map((area) => (
              <AreaDetail area={area} rol={ERol.Public} key={area.id} />
            )),
          ...profiles
            .filter(
              (profile) =>
                profile.id?.includes(watch("filterText")) ||
                profile.name
                  .toLowerCase()
                  .includes(watch("filterText").toLowerCase()) ||
                profile.alternative
                  ?.toLowerCase()
                  .includes(watch("filterText").toLowerCase()) ||
                profile.description
                  .toLowerCase()
                  .includes(watch("filterText").toLowerCase())
            )
            .map((profile) => (
              <ProfileDetail
                profile={profile}
                rol={ERol.Public}
                profile_tests={getCurrentProfileTests(profile.id as string)}
                key={profile.id}
              />
            )),
        ]);
        break;
      }
      case "test": {
        setList(
          tests
            .filter(
              (t) =>
                t.id?.includes(watch("filterText")) ||
                t.name.toLowerCase().includes(watch("filterText").toLowerCase())
            )
            .map((t) => (
              <TestDetail test={t} loadArea rol={ERol.Public} key={t.id} />
            ))
        );
        break;
      }
      case "area": {
        setList(
          tests
            .filter((t) => t.area.includes(watch("filterText")))
            .map((t) => <TestDetail test={t} rol={ERol.Public} key={t.id} />)
        );
        break;
      }
      case "profile": {
        setList(
          tests
            .filter((t) =>
              profile_tests.find(
                (pt) => pt.profile === watch("filterText") && pt.test === t.id
              )
            )
            .map((t) => (
              <TestDetail test={t} loadArea rol={ERol.Public} key={t.id} />
            ))
        );
        break;
      }
    }
  };

  useEffect(() => {
    onSubmit();
  }, [tests, areas, profiles, profile_tests]);
  useEffect(() => {
    setValue("filterText", getQueryParams().id);
    setValue("type", getQueryParams().type);
    onSubmit();
  }, [location]);

  return (
    <>
      {!isLoaded(tests) ||
      !isLoaded(areas) ||
      !isLoaded(profiles) ||
      !isLoaded(profile_tests) ? (
        <p className="m-2 text-center">Cargando exámenes...</p>
      ) : (
        <>
          <Breadcrumbs
            navigations={[{ uri: "/home", text: "Home" }]}
            last="Buscar"
          />
          <ManageLayout
            title="Buscar examen, area de examen o perfil"
            controls={
              <div className="m-2">
                <h3 className="m-1 text-center">
                  {watch("type") === "area"
                    ? `Exámenes del area de ${
                        areas.find((a) => a.id === watch("filterText"))?.name
                      }`
                    : watch("type") === "profile"
                    ? `Exámenes del perfil ${
                        profiles.find((p) => p.id === watch("filterText"))?.name
                      }`
                    : watch("type") === "test"
                    ? "Filtrar exámenes"
                    : "Filtrar exámenes, areas de examen o perfiles"}
                </h3>
                <hr />
                <div className="flex flex-col justify-between sm:flex-row">
                  <form className="flex flex-grow flex-col justify-start sm:flex-row">
                    <div className="input-group mt-8">
                      <input
                        className="input input-secondary"
                        type="text"
                        name="filterText"
                        placeholder={
                          watch("type") === "area" ||
                          watch("type") === "profile"
                            ? "Código"
                            : "Nombre"
                        }
                        onChange={onSubmit}
                        ref={register}
                        defaultValue={getQueryParams().id}
                      />
                      <span className="input-hint">
                        {watch("type") === "area" || watch("type") === "profile"
                          ? "Código"
                          : "Nombre, nombres alternativos o descripción"}
                      </span>
                    </div>
                    <div className="p-2 mx-auto">
                      <h3 className="text-center">Tipo de filtro</h3>
                      <hr className="ml-2 my-2" />
                      <div className="input-group flex-row items-center justify-center">
                        <select
                          className="input input-secondary"
                          name="type"
                          ref={register}
                          onChange={onSubmit}
                          defaultValue={getQueryParams().type}
                        >
                          <option
                            className="text-gray-700 font-semibold"
                            value=""
                          >
                            Todos...
                          </option>
                          <option
                            className="text-gray-700 font-semibold"
                            value="test"
                          >
                            Examen
                          </option>
                          <option
                            className="text-gray-700 font-semibold"
                            value="area"
                          >
                            Area
                          </option>
                          <option
                            className="text-gray-700 font-semibold"
                            value="profile"
                          >
                            Perfil
                          </option>
                        </select>
                      </div>
                    </div>
                  </form>
                  <div className="flex flex-col justify-end p-2"></div>
                </div>
              </div>
            }
            list={<GridLayout list={list} defaultText="No hay exámenes!!!" />}
          />
        </>
      )}
    </>
  );
};

export default SearchPage;
