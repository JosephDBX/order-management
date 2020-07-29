import React from "react";

enum Type {
  GRID = 0,
  MAIN = 1,
}

interface IGridLayoutProps {
  list: any[];
  defaultText: string;
  type?: Type;
}

const GridLayout: React.FunctionComponent<IGridLayoutProps> = ({
  list,
  defaultText,
  type = Type.GRID,
}) => {
  return (
    <>
      {list && list.length > 0 ? (
        <div
          className={`grid gap-2 grid-cols-1 md:grid-cols-2 ${
            type === Type.MAIN
              ? "lg:grid-cols-2 xl:grid-cols-3"
              : "lg:grid-cols-3 xl:grid-cols-4"
          }`}
        >
          {list}
        </div>
      ) : (
        <p className="text-center my-2">{defaultText}</p>
      )}
    </>
  );
};

export default GridLayout;
