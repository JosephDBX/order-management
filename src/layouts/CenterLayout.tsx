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
    <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-4">
      <div className="px-2 col-start-1 col-end-2 md:col-start-2 md:col-end-6 lg:col-start-2 lg:col-end-4">
        <h2 className="text-center my-2">{title}</h2>
        {!!subTitle && <p className="text-justify my-2">{subTitle}</p>}
        {component}
      </div>
    </div>
  );
};

export default CenterLayout;
