import React, { useState } from "react";

enum Type {
  CENTER = 0,
  SIDE = 1,
  NONE = 2,
}

interface IModalLayoutProps {
  open: boolean;
  title?: any;
  component: any;
  type?: Type;
  onOpen?(): void;
  onClose(): void;
}

const ModalLayout: React.FunctionComponent<IModalLayoutProps> = ({
  open,
  title,
  component,
  type = Type.CENTER,
  onClose,
}) => {
  const [style, setStyle] = useState("");

  if (open) {
    setTimeout(() => {
      setStyle("modal-open");
    }, 1);
  }

  const closeModal = () => {
    setStyle("");
    onClose();
  };

  const modal = (
    <div className={`modal ${style} z-10 fixed inset-0`}>
      <div className="backdrop absolute inset-0" onClick={closeModal}></div>
      {type === Type.SIDE ? (
        <div className="view w-64 absolute inset-y-0 left-0 shadow-2xl">
          {component}
        </div>
      ) : (
        <div className="view absolute inset-0 flex justify-center items-center m-4 overflow-hidden">
          {type === Type.NONE ? (
            <>{component}</>
          ) : (
            <div className="bg-white shadow-2xl rounded-sm">
              <div className="flex justify-between items-start">
                <div className="flex-grow py-1 px-2">
                  <h2 className="text-center text-lg">{title}</h2>
                </div>
                <button
                  className="m-1 material-icons btn-icon btn-icon-danger p-0"
                  onClick={closeModal}
                >
                  cancel
                </button>
              </div>
              <hr className="mx-2" />
              <div className="p-2">{component}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  return <>{open ? modal : null}</>;
};

export default ModalLayout;
