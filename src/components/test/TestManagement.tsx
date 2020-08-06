import React, { useState, useEffect } from "react";
import { ITest } from "../../models/ITest";
import { ERol } from "../../models/ERol";
import ManageLayout from "../../layouts/ManageLayout";
import TestControl from "./TestControl";
import GridLayout from "../../layouts/GridLayout";
import { IArea } from "../../models/IArea";

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
  const [list, setList] = useState<any[]>([]);
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
        .map((area) => <div key={area.id}></div>)
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
          ? ` del área${area?.name ? ": " + area.name : ""}`
          : ""
      }!`}
      controls={
        <TestControl rol={rol} onFilterText={onFilterText} idArea={area?.id} />
      }
      list={<GridLayout list={list} defaultText="Aún no hay exámenes!!!" />}
    />
  );
};

export default TestManagement;
