import React from "react";

interface ISummaryLayoutProps {
  title: string;
  styleTitle?: string;
  component: any;
  code?: string;
  controls?: any;
  bg?: string;
}

const SummaryLayout: React.FunctionComponent<ISummaryLayoutProps> = ({
  title,
  styleTitle,
  component,
  code,
  controls,
  bg,
}) => {
  return (
    <div className={`rounded-sm shadow flex flex-col ${bg}`}>
      <h3 className={`text-center rounded-sm p-2 text-lg ${styleTitle}`}>
        {title}
      </h3>
      <hr className="mx-2" />
      <div className="p-2 flex-grow">{component}</div>
      {!!code && (
        <>
          <hr className="m-2" />
          <p className="text-center font-code font-semibold p-2">
            Código:{code}
          </p>
        </>
      )}
      {!!controls && (
        <>
          <hr className="mx-2" />
          <div className="flex p-2 justify-evenly">{controls}</div>
        </>
      )}
    </div>
  );
};

export default SummaryLayout;
