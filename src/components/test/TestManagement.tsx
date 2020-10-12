import React, { useState, useEffect } from "react";
import { ITest } from "../../models/ITest";
import { ERol } from "../../models/ERol";
import ManageLayout from "../../layouts/ManageLayout";
import TestControl from "./TestControl";
import GridLayout from "../../layouts/GridLayout";
import { IArea } from "../../models/IArea";
import TestDetail from "./TestDetail";
import { IProfile } from "../../models/IProfile";
import { useLocation } from "react-router-dom";

interface ITestManagementProps {
  area?: IArea;
  profile?: IProfile;
  tests: ITest[];
  selectables?: ITest[];
  rol: ERol;
  loadArea?: boolean;
  onTestStateChange?(id: string, state: boolean): void;
  onAddTestToProfile?(profile: IProfile, test: ITest): void;
  onRemoveTestToProfile?(profile: IProfile, test: ITest): void;
}

const TestManagement: React.FunctionComponent<ITestManagementProps> = ({
  area,
  profile,
  tests,
  selectables,
  rol,
  loadArea,
  onTestStateChange,
  onAddTestToProfile,
  onRemoveTestToProfile,
}) => {
  const location = useLocation();
  const getQueryParams = () => {
    const params: string[] = location.search.substr(1).split("&");
    const type: string[] = params[0].split("=") as string[];
    return {
      type: type[0] ? type[0] : "",
      id: type[1] ? type[1] : "",
    };
  };
  // Selected List
  const [list, setList] = useState<any[]>(
    tests.map((test) => (
      <TestDetail
        test={test}
        rol={rol}
        profile={profile}
        loadArea={loadArea}
        onTestStateChange={onTestStateChange}
        onRemoveTestToProfile={onRemoveTestToProfile}
        key={test.id}
      />
    ))
  );
  const [filterText, setFilterText] = useState("");

  const onFilterText = (filter: string) => {
    setList(
      tests
        .filter(
          (test) =>
            (test.id?.includes(filter) && rol === ERol.Admin) ||
            test.name.toLowerCase().includes(filter.toLowerCase()) ||
            test.alternative
              ?.toLowerCase()
              .includes(filter.toLocaleLowerCase()) ||
            test.description.toLowerCase().includes(filter.toLowerCase())
        )
        .sort((first, second) => (first.name > second.name ? 1 : -1))
        .map((test) => (
          <TestDetail
            test={test}
            rol={rol}
            profile={profile}
            loadArea={loadArea}
            onTestStateChange={onTestStateChange}
            onRemoveTestToProfile={onRemoveTestToProfile}
            key={test.id}
          />
        ))
    );
    setFilterText(filter);
  };

  // Selectables List
  const [selectableList, setSelectableList] = useState<ITest[]>(
    selectables as ITest[]
  );
  const [selectableFilterText, setSelectableFilterText] = useState("");

  const onSelectableFilterText = (filter: string) => {
    setSelectableList(
      (selectables as ITest[])?.filter(
        (test) =>
          (test.id?.includes(filter) && rol === ERol.Admin) ||
          test.name.toLowerCase().includes(filter.toLowerCase()) ||
          test.alternative
            ?.toLowerCase()
            .includes(filter.toLocaleLowerCase()) ||
          test.description.toLowerCase().includes(filter.toLowerCase())
      )
    );
    setSelectableFilterText(filter);
  };

  useEffect(() => {
    onFilterText(filterText);
    onSelectableFilterText(selectableFilterText);
  }, [tests, selectables]);
  useEffect(() => {
    onFilterText(getQueryParams().id);
  }, [location]);

  return (
    <ManageLayout
      title={`${rol === ERol.Admin ? "Gestionar e" : "E"}xámenes`}
      subTitle={`¡Todos nuestros exámenes${
        rol === ERol.Admin
          ? !!profile
            ? ` del perfil${profile?.name ? " de " + profile.name : ""}`
            : ` del área${area?.name ? " de " + area.name : ""}`
          : ""
      }!`}
      controls={
        <TestControl
          rol={rol}
          onFilterText={onFilterText}
          onSelectableFilterText={onSelectableFilterText}
          profile={profile}
          idArea={area?.id}
          defaultText={getQueryParams().id}
          onAddTestToProfile={onAddTestToProfile}
          selectables={selectableList}
        />
      }
      list={
        <GridLayout list={list} type={1} defaultText="No hay exámenes!!!" />
      }
    />
  );
};

export default TestManagement;
