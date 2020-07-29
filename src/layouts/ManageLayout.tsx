import React from "react";

interface IManageLayoutProps {
  title?: string;
  subTitle?: string;
  controls: any;
  list: any;
}

const ManageLayout: React.FunctionComponent<IManageLayoutProps> = ({
  title,
  subTitle,
  controls,
  list,
}) => {
  return (
    <>
      {(!!title || !!subTitle) && (
        <div>
          {!!title && <h2 className="my-2 text-lg">{title}</h2>}
          {!!subTitle && <p className="my-2 text-justify">{subTitle}</p>}
        </div>
      )}
      <div className="my-2">
        <div className="rounded-sm shadow-sm p-2">{controls}</div>
        <div className="rounded-sm shadow-sm p-2">{list}</div>
      </div>
    </>
  );
};

export default ManageLayout;
