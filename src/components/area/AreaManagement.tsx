import React, { useState, useEffect } from "react";
import ManageLayout from "../../layouts/ManageLayout";
import GridLayout from "../../layouts/GridLayout";
import AreaControl from "./AreaControl";
import { IArea } from "../../models/IArea";
import { ERol } from "../../models/ERol";
import AreaDetail from "./AreaDetail";

interface IAreaManagementProps {
  areas: IArea[];
  rol: ERol;
  onAreaStateChange?(id: string, state: boolean): void;
}

const AreaManagement: React.FunctionComponent<IAreaManagementProps> = ({
  areas,
  rol,
  onAreaStateChange,
}) => {
  const [list, setList] = useState<any[]>(
    areas.map((area) => (
      <AreaDetail
        area={area}
        rol={rol}
        onAreaStateChange={onAreaStateChange}
        key={area.id}
      />
    ))
  );
  const [filterText, setFilterText] = useState("");

  const onFilterText = (filter: string) => {
    setList(
      areas
        .filter(
          (area) =>
            (area.id?.includes(filter) && rol === ERol.Admin) ||
            area.name.toLowerCase().includes(filter.toLowerCase()) ||
            area.description.toLowerCase().includes(filter.toLowerCase())
        )
        .sort((first, second) => (first.name > second.name ? 1 : -1))
        .map((area) => (
          <AreaDetail
            area={area}
            rol={rol}
            onAreaStateChange={onAreaStateChange}
            key={area.id}
          />
        ))
    );
    setFilterText(filter);
  };

  useEffect(() => {
    onFilterText(filterText);
  }, [areas]);

  return (
    <ManageLayout
      title={`${rol === ERol.Admin ? "Gestionar á" : "Á"}reas de exámenes`}
      subTitle="¡Todas nuestras áreas y especializaciones!"
      controls={<AreaControl rol={rol} onFilterText={onFilterText} />}
      list={<GridLayout list={list} defaultText="No hay áreas!!!" />}
    />
  );
};

export default AreaManagement;
