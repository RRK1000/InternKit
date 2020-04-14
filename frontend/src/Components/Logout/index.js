import React from "react";
import { Redirect } from "react-router-dom";
import { useSetStoreValue } from 'react-context-hook';

function Logout() {
  const setToken = useSetStoreValue('isLoggedIn');
  const setUsername = useSetStoreValue('username')

  const deleteToken = () => {
    localStorage.removeItem("token");
    setToken(false);
    setUsername(null);
    return <Redirect to="/" />;
  }
  return <div>{deleteToken()}</div>;
}

export default Logout;
