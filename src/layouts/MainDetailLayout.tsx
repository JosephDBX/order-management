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
          {!!title && <h2 className="m-2 text-xl text-center">{title}</h2>}
          {!!subTitle && <p className="m-2 text-justify">{subTitle}</p>}
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4">
        <div className="col-span-1 lg:col-span-1 mx-2 my-4 md:mx-48 lg:mx-2">
          {main}
        </div>
        <div className="col-span-1 lg:col-span-2 xl:col-span-3">{detail}</div>
      </div>
    </>
  );
};

export default MainDetailLayout;
