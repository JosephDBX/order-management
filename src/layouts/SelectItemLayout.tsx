import React from "react";

interface ISelectItemLayoutProps {
  title: string;
  subTitle: string;
  removable?: boolean;
  onAdd: Function;
  onRemove: Function;
}

const SelectItemLayout: React.FunctionComponent<ISelectItemLayoutProps> = ({
  title,
  subTitle,
  removable = false,
  onAdd,
  onRemove,
}) => {
  return (
    <div className="flex items-center rounded-sm shadow-md p-2">
      <div className="flex-grow">
        <h4 className="mx-2">{title}</h4>
        <hr className="mx-1" />
        <div className="flex items-center mx-2">
          <button className="material-icons btn-icon btn-icon-secondary p-0 border-0">
            pageview
          </button>
          <span className="input-hint">{subTitle}</span>
        </div>
      </div>
      <div>
        {removable ? (
          <button
            className="material-icons btn-icon btn-icon-danger p-0"
            onClick={() => onRemove()}
          >
            remove
          </button>
        ) : (
          <button
            className="material-icons btn-icon btn-icon-primary p-0"
            onClick={() => onAdd()}
          >
            add
          </button>
        )}
      </div>
    </div>
  );
};

export default SelectItemLayout;
