import React from "react";

interface ICenterLayoutProps {
  title?: any;
  subTitle?: any;
  component: any;
}

const CenterLayout: React.FunctionComponent<ICenterLayoutProps> = ({
  title,
  subTitle,
  component,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-4 xl:grid-cols-3">
      <div className="col-start-1 col-end-2 md:col-start-2 md:col-end-6 lg:col-start-2 lg:col-end-4 xl:col-start-2 xl:col-end-3">
        <h2 className="m-2 text-lg">{title}</h2>
        {!!subTitle && <p className="text-justify m-2">{subTitle}</p>}
        <hr className="mx-2" />
        <div className="p-2">{component}</div>
      </div>
    </div>
  );
};

export default CenterLayout;
