import Home from "./pages/Home";
import Board from "./modules/Board";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import BoardManager from "./modules/BoardManager";
import Login from "./pages/Login";
import {AuthProvider, RequireAuth, useIsAuthenticated} from "react-auth-kit"

function App() {

  const PrivateRoute = ({ Component }) => {
    const isAuthenticated = useIsAuthenticated();
    const auth = isAuthenticated();
    return auth ? <Component /> : <Navigate to="/" />;
  };

  return (
    <AuthProvider
      authType={"cookie"}
      authName={"_auth"}
      cookieDomain={window.location.hostname}
      cookieSecure={window.location.protocol === "https:"}
    >
      <BrowserRouter>
        <Routes>
          <Route>
            <Route index element={<Login/>}/>
            <Route path="/boards" element={<Board/>} />
            <Route path="/home" element={<PrivateRoute Component={Home}/>}/>
            <Route path="/boardmanager" element={<PrivateRoute Component={BoardManager}/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;