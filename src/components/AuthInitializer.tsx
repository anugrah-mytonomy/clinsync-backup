import type { ReactNode } from 'react';

/** App shell wrapper. Session restore via refresh cookie is not used before login. */
const AuthInitializer = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};

export default AuthInitializer;
