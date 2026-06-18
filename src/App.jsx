import React from "react";
import AppRoutes from "./routes/AppRoutes";
import MainLayout from "./layouts/MainLayout";
import ScrollToTop from "./components/ScrollToTop";

const App = () => {
  return (
    <MainLayout>
      <ScrollToTop />
      <AppRoutes />
    </MainLayout>
  );
};

export default App;
