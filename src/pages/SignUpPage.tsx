import React from "react";
import UserCreate from "../components/user/UserCreate";

const SignUpPage: React.FunctionComponent = () => {
  const onCreateUser = (email: string, password: string) => {
    console.log(email, password);
  };

  return (
    <>
      <UserCreate onCreateUser={onCreateUser} />
    </>
  );
};

export default SignUpPage;
