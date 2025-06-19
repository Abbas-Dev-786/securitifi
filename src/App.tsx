import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { AppKitProvider } from "./contexts/Web3Context";
import { ThemeProvider } from "./contexts/ThemeContext";
import Navbar from "./components/layout/Navbar";
import Sidebar from "./components/layout/Sidebar";
import Dashboard from "./pages/Dashboard";
import Properties from "./pages/Properties";
import Lending from "./pages/Lending";
import RentDistribution from "./pages/RentDistribution";
import Bridge from "./pages/Bridge";
import ProofOfReserves from "./pages/ProofOfReserves";
import Portfolio from "./pages/Portfolio";
import Settings from "./pages/Settings";
import Landing from "./pages/Landing";
import "react-toastify/dist/ReactToastify.css";
import { useAppKitAccount } from "@reown/appkit/react";

const AppContent: React.FC = () => {
  const { isConnected } = useAppKitAccount();

  if (!isConnected) {
    return <Landing />;
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-6 py-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/properties" element={<Properties />} />
              <Route path="/lending" element={<Lending />} />
              <Route path="/rent-distribution" element={<RentDistribution />} />
              <Route path="/bridge" element={<Bridge />} />
              <Route path="/proof-of-reserves" element={<ProofOfReserves />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AppKitProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <AppContent />
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
              className="z-50"
            />
          </div>
        </Router>
      </AppKitProvider>
    </ThemeProvider>
  );
}

export default App;
