import React from "react";
import Breadcrumbs from "../../components/custom/Breadcrumbs";

const Error404Page: React.FunctionComponent = () => {
  return (
    <>
      <Breadcrumbs
        navigations={[{ uri: "/home", text: "Home" }]}
        last="Error 404"
      />
      <h4 className="p-2 text-2xl">¡Archivo no encontrado!</h4>
    </>
  );
};

export default Error404Page;
