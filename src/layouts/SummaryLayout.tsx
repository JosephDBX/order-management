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
    <div className={`rounded-sm shadow ${bg}`}>
      <div className="p-2">
        <h3 className="text-center">{title}</h3>
      </div>
      <hr className="mx-1" />
      <div className="p-2">{component}</div>
      {!!controls && (
        <>
          <hr className="mx-2" />
          <div className="">{controls}</div>
        </>
      )}
    </div>
  );
};

export default SummaryLayout;
