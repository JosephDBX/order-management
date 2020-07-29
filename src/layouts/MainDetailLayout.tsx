import React from "react";

interface IMainDetailLayoutProps {
  title?: string;
  subTitle?: string;
  main: any;
  detail: any;
}

const MainDetailLayout: React.FunctionComponent<IMainDetailLayoutProps> = ({
  title,
  subTitle,
  main,
  detail,
}) => {
  return (
    <>
      {(!!title || !!subTitle) && (
        <div>
          {!!title && <h2 className="my-2 text-lg">{title}</h2>}
          {!!subTitle && <p className="my-2 text-justify">{subTitle}</p>}
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4">
        <div className="col-span-1 lg:col-span-1 m-0 md:mx-48 lg:mx-0 lg:mr-2">
          {main}
        </div>
        <div className="col-span-1 lg:col-span-2 xl:col-span-3">{detail}</div>
      </div>
    </>
  );
};

export default MainDetailLayout;
