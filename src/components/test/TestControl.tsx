import React, { useState, ChangeEvent } from "react";
import { ERol } from "../../models/ERol";
import { useHistory } from "react-router-dom";
import { ITest } from "../../models/ITest";
import ModalLayout from "../../layouts/ModalLayout";
import SelectItemLayout from "../../layouts/SelectItemLayout";
import { IProfile } from "../../models/IProfile";

interface ITestControlProps {
  idArea?: string;
  rol: ERol;
  selectables?: ITest[];
  profile?: IProfile;
  onFilterText?(filterText: string): void;
  onSelectableFilterText?(filterText: string): void;
  onAddTestToProfile?(profile: IProfile, test: ITest): void;
}

const TestControl: React.FunctionComponent<ITestControlProps> = ({
  idArea,
  rol,
  selectables,
  profile,
  onFilterText,
  onSelectableFilterText,
  onAddTestToProfile,
}) => {
  const [filterText, setFilterText] = useState("");
  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFilterText(event.target.value);
    if (onFilterText) onFilterText(event.target.value);
  };

  const history = useHistory();
  const navigateToCreate = () => {
    history.push(`/admin-panel/areas/${idArea}/tests/create`);
  };

  const [modal, setModal] = useState(false);
  const onOpenModal = () => {
    setModal(true);
  };
  const onCloseModal = () => {
    setModal(false);
    if (onSelectableFilterText) onSelectableFilterText("");
  };

  const onAdd = (t: ITest) => {
    if (onAddTestToProfile) onAddTestToProfile(profile as IProfile, t);
    onCloseModal();
  };

  return (
    <>
      <div className="m-2">
        <h3 className="m-1 text-center md:text-left">Filtrar examen</h3>
        <div className="flex flex-col md:flex-row">
          <div className="input-group">
            <input
              className="input input-secondary"
              type="text"
              placeholder="Nombre del exámen"
              onChange={onInputChange}
              value={filterText}
            />
            <span className="input-hint">
              {rol === ERol.Admin ? "Código, n" : "N"}ombre, nombres
              alternativos o descripción
            </span>
          </div>
          <div className="flex-grow p-4"></div>
          {rol === ERol.Admin && (
            <div className="flex flex-row md:flex-col justify-center">
              {!!onAddTestToProfile ? (
                <button className="btn btn-primary" onClick={onOpenModal}>
                  <span className="material-icons">add_circle</span>Agregar
                  Exámen
                </button>
              ) : (
                <button className="btn btn-primary" onClick={navigateToCreate}>
                  <span className="material-icons">add_circle</span>Crear Exámen
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      {!!selectables && (
        <ModalLayout
          title="Agregar exámenes al perfil"
          open={modal}
          component={
            <>
              <TestControl
                rol={ERol.Public}
                onFilterText={onSelectableFilterText}
              />
              <div className="frame" style={{ maxHeight: "16rem" }}>
                {selectables.map((s) => (
                  <SelectItemLayout
                    title={s.name}
                    subTitle={`USD $${s.cost} - Estado: ${
                      s.state ? "Activado" : "Desactivado"
                    }`}
                    onAdd={() => onAdd(s)}
                    onRemove={() => {}}
                    navigateTo={`/admin-panel/areas/${s.area}?test=${s.id}`}
                    key={s.id}
                  />
                ))}
              </div>
            </>
          }
          onClose={onCloseModal}
        />
      )}
    </>
  );
};

export default TestControl;
