import React from "react";

interface ISelectListLayoutProps {
  title: string;
  selected?: any[];
  onAdd: Function;
}

const SelectListLayout: React.FunctionComponent<ISelectListLayoutProps> = ({
  title,
  selected,
  onAdd,
}) => {
  return (
    <div className="rounded-sm shadow p-2">
      <div className="flex items-center">
        <div className="flex-grow py-1 px-2">
          <h3 className="text-center">{title}</h3>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => onAdd()}
        >
          Agregar
        </button>
      </div>
      <hr className="m-1" />
      <div className="frame" style={{ maxHeight: "16rem" }}>
        {!!selected && selected.length > 0 ? (
          <>
            {selected}
            <p>Última línea!!!</p>
          </>
        ) : (
          <p>Todavía nada por aquí!!!</p>
        )}
      </div>
    </div>
  );
};

export default SelectListLayout;
