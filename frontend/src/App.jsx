import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Landing   from "./pages/Landing";
import Onboard   from "./pages/Onboard";
import Login     from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Triggers  from "./pages/Triggers";
import Claims    from "./pages/Claims";
import Admin     from "./pages/Admin";
import Chat      from "./pages/Chat";
import Navbar    from "./components/Navbar";

function Protected({ children }) {
  const id = localStorage.getItem("workerId");
  return id ? children : <Navigate to="/login" />;
}

const NO_NAVBAR = ["/", "/login", "/onboard"];

function AppShell() {
  const location = useLocation();
  const showNav = !NO_NAVBAR.includes(location.pathname);

  return (
    <div style={{ minHeight: "100vh", background: "#F0F4FF" }}>
      {showNav && <Navbar />}
      <Routes>
        <Route path="/"          element={<Landing />} />
        <Route path="/login"     element={<Login />} />
        <Route path="/onboard"   element={<Onboard />} />
        <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
        <Route path="/triggers"  element={<Protected><Triggers /></Protected>} />
        <Route path="/claims"    element={<Protected><Claims /></Protected>} />
        <Route path="/chat"      element={<Protected><Chat /></Protected>} />
        <Route path="/admin"     element={<Admin />} />
        <Route path="*"          element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}