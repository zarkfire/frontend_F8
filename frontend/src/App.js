import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import ProtectedRoute from "./ProtectedRoute";
import Restaurants from "./pages/Restaurants";
import Menus from "./pages/Menus";
import RestaurantMenus from "./pages/RestaurantMenus";
import Orders from "./pages/Orders";


function App() {
  return (
    <Routes>
      {/* redirection par défaut */}
      <Route path="/" element={<Navigate to="/login" />} />

      {/* pages publiques */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* page protégée 🔐 */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/restaurants/:id/menus"
        element={
          <ProtectedRoute>
            <RestaurantMenus />
          </ProtectedRoute>
        }
      />
      <Route path="/orders" element={<Orders />} />
      <Route
        path="/menus"
        element={
          <ProtectedRoute>
            <Menus />
          </ProtectedRoute>
        }
      />
      <Route
        path="/restaurants"
        element={
          <ProtectedRoute>
            <Restaurants />
          </ProtectedRoute>
        }
      />
    </Routes>

  );
}

export default App;