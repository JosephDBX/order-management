import React from "react";
import { Link } from "react-router-dom";

interface ISelectItemLayoutProps {
  title: string;
  subTitle: string;
  removable?: boolean;
  onAdd: Function;
  onRemove: Function;
  navigateTo?: string;
  isDanger?: boolean;
}

const SelectItemLayout: React.FunctionComponent<ISelectItemLayoutProps> = ({
  title,
  subTitle,
  removable = false,
  onAdd,
  onRemove,
  navigateTo,
  isDanger,
}) => {
  return (
    <div
      className={`flex items-center rounded-sm shadow-md p-2${
        isDanger ? " border-red-600 border-2" : ""
      }`}
    >
      <div className="flex-grow">
        <h4 className="mx-2">{title}</h4>
        <hr className="mx-1" />
        <div className="flex items-center mx-2">
          {navigateTo ? (
            <Link
              to={navigateTo}
              target="_blank"
              className="material-icons btn-icon btn-icon-secondary p-0 border-0"
            >
              pageview
            </Link>
          ) : null}
          <span className="input-hint">{subTitle}</span>
        </div>
      </div>
      <div>
        {removable ? (
          <button
            type="button"
            className="material-icons btn-icon btn-icon-danger p-0"
            onClick={() => onRemove()}
          >
            remove
          </button>
        ) : (
          <button
            type="button"
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
