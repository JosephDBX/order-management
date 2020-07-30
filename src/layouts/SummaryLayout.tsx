import React from "react";

interface ISummaryLayoutProps {
  title: string;
  styleTitle?: string;
  component: any;
  controls?: any;
  bg?: string;
}

const SummaryLayout: React.FunctionComponent<ISummaryLayoutProps> = ({
  title,
  styleTitle,
  component,
  controls,
  bg,
}) => {
  return (
    <div className={`rounded-sm shadow flex flex-col ${bg}`}>
      <h3 className={`text-center rounded-sm p-2 ${styleTitle}`}>{title}</h3>
      <hr className="mx-2" />
      <div className="p-2 flex-grow">{component}</div>
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
