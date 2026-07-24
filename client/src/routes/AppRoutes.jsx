import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import AIWorkspace from "../pages/AIWorkspace";
import Library from "../pages/Library";


const AppRoutes = () => {
  return (
    <BrowserRouter>

      <Routes>

        <Route element={<MainLayout />}>

          <Route path="/" element={<Home />} />

          <Route path="/login" element={<Login />} />

          <Route path="/signup" element={<Signup />} />

          <Route path="/ai" element={<AIWorkspace />} />

          <Route path="/library" element={<Library />} />

        </Route>

      </Routes>

    </BrowserRouter>
  );
};


export default AppRoutes;