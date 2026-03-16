  import { createBrowserRouter, RouterProvider, Navigate } from "react-router";
  import { AuthProvider } from "./contexts/AuthContext";
  import Layout from "./components/Layout";
  import authMiddleware from "./middleware/authMiddleware";
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


  // Router konfiguráció objektum-alapú route definíciókkal
  const router = createBrowserRouter([
    // Nyilvános route-ok (Layout nélkül)
    // Az átirányítás a komponensekben van kezelve (useEffect)
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/register",
      element: <RegisterPage />,
    },
    {
      path: "/",
      element: < MainPage/>,
    },
    {path: "/displaystudent", element: <DisplayStudent />},
    {path: "/displayteacher", element: <DisplayTeacher />},
    {path: "/displayentry", element: <DisplayEntryPage />},

 
     {
      
      middleware: [authMiddleware], // MINDEN child route védett lesz!
       children: [
         {
           index: true, // Főoldal átirányítás dashboard-ra
           element: <Navigate to="/dashboard" replace />,
       },
         {
      path: "/dashboard",
      element: <DashboardPage />,
    },
    {path: "/newmessage", element: <NewMessage />},
    {path: "/settings", element: <UserSettings />},
    {path: "/events", element: <Events />},
        
        
      ],
     },

    // 404 - Not Found
    {
      path: "*",
      element: (
        <div style={{ padding: "2rem", textAlign: "center" }}>
          <h1>404 - Az oldal nem található</h1>
          <a href="/">Vissza a főoldalra</a>
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