import React from "react";

interface ISummaryLayoutProps {
  title: string;
  component: any;
  controls?: any;
  bg?: string;
}

const SummaryLayout: React.FunctionComponent<ISummaryLayoutProps> = ({
  title,
  component,
  controls,
  bg = "bg-white",
}) => {
  return (
    <div className={`rounded-sm shadow flex flex-col ${bg}`}>
      <div className="p-2 bg-teal-600">
        <h3 className="text-center text-white rounded-sm">{title}</h3>
      </div>
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
