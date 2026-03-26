import { createBrowserRouter, RouterProvider, Navigate, Outlet } from "react-router";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import MainPage from "./pages/MainPage";
import NewMessage from "./pages/NewMessage";
import UserSettings from "./pages/UserSettings";
import Events from "./pages/events";
import DisplayStudent from "./pages/DisplayStudent";
import DisplayTeacher from "./pages/DisplayTeacher";
import DisplayEntryPage from "./pages/DisplayEntryPage";


const ProtectedRoute = () => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

// Router konfiguráció
const router = createBrowserRouter([
  // --- NYILVÁNOS ÚTVONALAK ---
  {
    path: "/",
    element: <MainPage />, 
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/displaystudent",
    element: <DisplayStudent />,
  },
  {
    path: "/displayteacher",
    element: <DisplayTeacher />,
  },
  {
    path: "/displayentry",
    element: <DisplayEntryPage />,
  },

  // --- VÉDETT ÚTVONALAK ---
  {
    element: <ProtectedRoute />, 
    children: [
      {
        path: "/dashboard",
        element: <DashboardPage />,
      },
      {
        path: "/newmessage",
        element: <NewMessage />,
      },
      {
        path: "/settings",
        element: <UserSettings />,
      },
      {
        path: "/events",
        element: <Events />,
      },
    ],
  },

  // --- 404 - NEM TALÁLHATÓ ---
  {
    path: "*",
    element: (
      <div style={{ padding: "5rem", textAlign: "center", color: "white", backgroundColor: "#000", minHeight: "100vh" }}>
        <h1 style={{ fontSize: "3rem", color: "#ff6600" }}>404</h1>
        <p>Hoppá! Az oldal, amit keresel, nem létezik.</p>
        <a href="/" style={{ color: "#ff6600", textDecoration: "none", fontWeight: "bold" }}>
          Vissza a főoldalra
        </a>
      </div>
    ),
  },
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;