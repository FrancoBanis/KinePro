import { useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { ROUTES } from "./constants/config";

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  const location = useLocation();
  const hideHeader = location.pathname === ROUTES.PAGO_EXITOSO;

  return (
    <>
      {!hideHeader && <Header />}
      <main>
        {children}
      </main>
      <Footer />
    </>
  );
};

export default Layout;