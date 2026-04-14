import { createBrowserRouter } from "react-router";
import { Root } from "./components/Root";
import { Home } from "./pages/Home";
import { Auth } from "./pages/Auth";
import { ResetPassword } from "./pages/ResetPassword";
import { Menu } from "./pages/Menu";
import { Favorites } from "./pages/Favorites";
import { PrivacyPolicy } from "./pages/PrivacyPolicy";
import { TermsOfUse } from "./pages/TermsOfUse";
import { SecurePayment } from "./pages/SecurePayment";
import { AdminDashboard } from "./pages/AdminDashboard";
import { MinhasCompras } from "./pages/MinhasCompras";
import { About } from "./pages/About";
import { Contact } from "./pages/Contact";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "auth", Component: Auth },
      { path: "reset-password", Component: ResetPassword },
      { path: "cardapio", Component: Menu },
      { path: "favorites", Component: Favorites },
      { path: "privacidade", Component: PrivacyPolicy },
      { path: "termos-de-uso", Component: TermsOfUse },
      { path: "sobre", Component: About },
      { path: "contato", Component: Contact },
      { path: "secure-payment", Component: SecurePayment },
      { path: "minhas-compras", Component: MinhasCompras },
      { path: "admin", Component: AdminDashboard }, 
    ],
  },
]);
