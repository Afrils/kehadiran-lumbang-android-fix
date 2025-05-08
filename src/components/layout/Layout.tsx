
import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
  hideHeader?: boolean;
}

const Layout = ({ children, hideHeader = false }: LayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {!hideHeader && <Header />}
      <main className={`flex-grow ${!hideHeader ? 'pt-20 pb-8' : ''} px-4`}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
