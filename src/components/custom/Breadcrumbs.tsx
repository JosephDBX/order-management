import React from "react";
import { Link } from "react-router-dom";

interface IBreadcrumbsProps {
  navigations?: {
    uri: string;
    text: string;
  }[];
  last: string;
}

const Breadcrumbs: React.FunctionComponent<IBreadcrumbsProps> = ({
  navigations,
  last,
}) => {
  return (
    <nav className="bg-gray-200 p-2 rounded font-code m-2 mb-4">
      <ol className="list-reset flex flex-wrap text-gray-600 justify-center md:justify-start">
        {navigations && navigations.length > 0
          ? navigations.map((n) => {
              return (
                <React.Fragment key={n.text}>
                  <li>
                    <Link
                      to={n.uri}
                      className="text-blue-600 font-bold underline"
                    >
                      {n.text}
                    </Link>
                  </li>
                  <li>
                    <span className="mx-2">/</span>
                  </li>
                </React.Fragment>
              );
            })
          : null}
        <li>{last}</li>
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
