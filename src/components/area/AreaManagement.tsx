import React, { useState, useEffect } from "react";
import ManageLayout from "../../layouts/ManageLayout";
import GridLayout from "../../layouts/GridLayout";
import AreaControl from "./AreaControl";
import { IArea } from "../../models/IArea";
import { ERol } from "../../models/ERol";
import SummaryLayout from "../../layouts/SummaryLayout";
import AreaDetail from "./AreaDetail";

interface IAreaManagementProps {
  areas: IArea[];
  rol: ERol;
}

const AreaManagement: React.FunctionComponent<IAreaManagementProps> = ({
  areas,
  rol,
}) => {
  const [list, setList] = useState<any[]>(
    areas.map((area) => <AreaDetail area={area} rol={rol} key={area.id} />)
  );
  const [filterText, setFilterText] = useState("");

  const onFilterText = (filter: string) => {
    setFilterText(filter);
    setList(
      areas.map((area) => {
        if (
          area.id?.includes(filter) ||
          area.name.toLowerCase().includes(filter.toLowerCase()) ||
          area.description.toLowerCase().includes(filter.toLowerCase())
        )
          return <AreaDetail area={area} rol={rol} key={area.id} />;
      })
    );
  };

  useEffect(() => {
    onFilterText(filterText);
  }, [areas]);

  return (
    <ManageLayout
      title="Áreas de exámenes"
      subTitle="Todas nuestras áreas y especializaciones!!!"
      controls={<AreaControl rol={rol} onFilterText={onFilterText} />}
      list={<GridLayout list={list} defaultText="Aún no hay áreas!!!" />}
    />
  );
};

export default AreaManagement;
