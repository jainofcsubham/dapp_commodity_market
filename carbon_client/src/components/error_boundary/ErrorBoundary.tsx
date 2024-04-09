import React, { useState, useEffect } from 'react';
import { ErrorBoundaryType } from '../../types/ErrorBoundary.type';



const ErrorBoundary: React.FC<ErrorBoundaryType> = ({ children }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const errorHandler = () => {
      setHasError(true);
    };

    window.addEventListener('error', errorHandler);

    return () => {
      window.removeEventListener('error', errorHandler);
    };
  }, []);

  if (hasError) {
    return <h1>Something went wrong.</h1>;
  }

  return <>{children}</>;
};

export default ErrorBoundary;
