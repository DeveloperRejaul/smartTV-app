import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { navPath } from '../constants/navPath';
import LoadingCom from '../components/loading/loadingCom';

function Protected({ children }) {
  const { isLogin, isLoading, token } = useSelector((state) => state.auth);

  if (!token) return <Navigate to={navPath.login} replace />;
  if (isLoading) return <LoadingCom />;
  if (!isLogin) return <Navigate to={navPath.login} replace />;
  return children;
}

export default Protected;
