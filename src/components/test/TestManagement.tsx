import React, { useState, useEffect } from "react";
import { ITest } from "../../models/ITest";
import { ERol } from "../../models/ERol";
import ManageLayout from "../../layouts/ManageLayout";
import TestControl from "./TestControl";
import GridLayout from "../../layouts/GridLayout";
import { IArea } from "../../models/IArea";
import TestDetail from "./TestDetail";

interface ITestManagementProps {
  area?: IArea;
  tests: ITest[];
  rol: ERol;
  onTestStateChange?(id: string, state: boolean): void;
}

const TestManagement: React.FunctionComponent<ITestManagementProps> = ({
  area,
  tests,
  rol,
  onTestStateChange,
}) => {
  const [list, setList] = useState<any[]>(
    tests.map((test) => (
      <TestDetail
        test={test}
        rol={rol}
        onTestStateChange={onTestStateChange}
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
        .map((test) => (
          <TestDetail
            test={test}
            rol={rol}
            onTestStateChange={onTestStateChange}
            key={test.id}
          />
        ))
    );
    setFilterText(filter);
  };

  useEffect(() => {
    onFilterText(filterText);
  }, [tests]);

  return (
    <ManageLayout
      title={`${rol === ERol.Admin ? "Gestionar e" : "E"}xámenes`}
      subTitle={`¡Todos nuestros exámenes${
        rol === ERol.Admin
          ? ` del área${area?.name ? " de " + area.name : ""}`
          : ""
      }!`}
      controls={
        <TestControl rol={rol} onFilterText={onFilterText} idArea={area?.id} />
      }
      list={
        <GridLayout list={list} type={1} defaultText="No hay exámenes!!!" />
      }
    />
  );
};

export default TestManagement;
