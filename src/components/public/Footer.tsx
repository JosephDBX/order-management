import React from "react";
import { useHistory } from "react-router-dom";

const Copyright: React.FunctionComponent = () => {
  return (
    <p className="text-white p-2">
      {"Copyright © LCBM - "}
      <a
        className="underline"
        href="https://github.com/JosephDBX"
        target="_blank"
        rel="noopener noreferrer"
      >
        JosephDBX
      </a>{" "}
      {new Date().getFullYear()}
      {"."}
    </p>
  );
};

const Footer: React.FunctionComponent = () => {
  const history = useHistory();
  const navigateToAboutUs = () => {
    history.push("/about-us");
  };

  return (
    <footer className="footer rounded-t shadow-md mt-2">
      <div className="footer-about-us">
        <h3 className="text-white">
          ¿Quieres saber más sobre nuestra familia?
        </h3>
        <button
          className="btn btn-secondary mx-auto my-2"
          onClick={navigateToAboutUs}
        >
          Acerca de nosotros
        </button>
      </div>
      <div className="footer-contacts">
        <div className="footer-contacts__text">
          <h3 className="footer-contacts__text-header text-white text-lg">
            Contactos
          </h3>
          <ul className="footer-contacts__text-phones">
            <li>
              <span>Teléfonos</span>
            </li>
            <li>Convencional. 505-2222-1111</li>
            <li>Movistar. 505-8888-7777</li>
            <li>Claro. 505-6666-5555</li>
            <li>E-mail: laboratoriomoncada@gmail.com</li>
          </ul>
          <ul className="footer-contacts__text-address">
            <li>
              <span>Dirección</span>
            </li>
            <li>
              <p className="text-white">
                Rotonda Bello Horizonte 1 cuadra Abajo, 1/2 cuadras al Lago.
                Managua - Managua.
              </p>
            </li>
            <li>
              <iframe
                title="LCBM Location"
                className="w-full h-64 mt-2 rounded-sm"
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15601.982921233137!2d-86.2357698!3d12.1466161!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x44246e431566b03a!2sLaboratorio%20Cl%C3%ADnico%20Bacteriol%C3%B3gico%20Moncada!5e0!3m2!1ses!2sni!4v1588828352724!5m2!1ses!2sni"
              ></iframe>
            </li>
          </ul>
        </div>
        <div className="footer-contacts_social m-2">
          <h3 className="text-white text-lg">Redes sociales</h3>
          <ul>
            <li>
              <a
                className="btn btn-secondary my-2"
                href="https://www.facebook.com/laboratorioclinico.bacteriologicomoncada"
                target="_blank"
                rel="noopener noreferrer"
              >
                Facebook
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-copyright">
        <Copyright />
      </div>
    </footer>
  );
};

export default Footer;
