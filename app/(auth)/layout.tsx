import { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  return <div className="auth">{children}</div>;
};

export default Layout;
