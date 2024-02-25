import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import './App.css';
import { Routes, Route } from "react-router-dom"
import Login from './pages/Login/Login';
import Signup from "./pages/Signup/Signup";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import PublicRoutes from "./routes/PublicRoutes";
import PrivateRoutes from "./routes/PrivateRoutes";
import Calendar from "./pages/Calendar/Calendar";


function App() {
  const navigate = useNavigate();

  Axios.interceptors.request.use(
    function (config) {
      const userAuthData = localStorage.getItem("authKey");
      if (userAuthData) {
        const parsedAuth = JSON.parse(userAuthData);
        config.headers.Authorization = "Bearer " + parsedAuth.token;
      }
      return config;
    },
    function (error) {
      return Promise.reject(error);
    }
  );

  Axios.interceptors.response.use(
    function (response) {
      return response;
    },
    function (error) {
      if (error.response) {
        if (error.response.status === 401) {
          navigate("/login");
          // localStorage.removeItem("auth");
          toast.error(error.response.data.message);
        }
      }
      return Promise.reject(error);
    }
  )
  return (
    <div className="App">
      <Routes>
        <Route path="/">
          <Route element={<PublicRoutes />}>
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
          </Route>
          <Route element={<PrivateRoutes />}>
            <Route index element={<Calendar />} />
          </Route>
        </Route>
      </Routes>
      <ToastContainer />
    </div>
  );
}

export default App;
