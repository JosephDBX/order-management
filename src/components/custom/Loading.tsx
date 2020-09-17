import React, { useEffect } from "react";
import ModalLayout from "../../layouts/ModalLayout";

interface ILoadingProps {
  isLoading: boolean;
}

const Loading: React.FunctionComponent<ILoadingProps> = ({ isLoading }) => {
  const onClose = () => {};
  useEffect(() => {}, [isLoading]);
  return (
    <ModalLayout
      open={isLoading}
      component={<div className="lds-dual-ring"></div>}
      onClose={onClose}
      type={2}
    />
  );
};

export default Loading;
