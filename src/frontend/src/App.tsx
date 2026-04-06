import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import Layout from "./components/Layout";
import PermissionsGate from "./components/PermissionsGate";
import { ThemeProvider } from "./contexts/ThemeContext";
import AboutUsPage from "./pages/AboutUs";
import AdminSetupPage from "./pages/AdminSetup";
import ChangelogPage from "./pages/Changelog";
import ChatPage from "./pages/Chat";
import Dashboard from "./pages/Dashboard";
import FeaturesPage from "./pages/Features";
import GluonModePage from "./pages/GluonMode";
import HelpPage from "./pages/Help";
import NucleusModePage from "./pages/NucleusMode";
import SettingsPage from "./pages/Settings";
import TasksPage from "./pages/Tasks";
import WelcomeSplash from "./pages/WelcomeSplash";

export type AppPage =
  | "dashboard"
  | "chat"
  | "gravity"
  | "earth"
  | "tasks"
  | "about"
  | "settings"
  | "admin"
  | "features"
  | "help"
  | "changelog";

export default function App() {
  const [currentPage, setCurrentPage] = useState<AppPage>("dashboard");
  const [showSplash, setShowSplash] = useState(
    () => !localStorage.getItem("quarq_splash_shown"),
  );
  const [permissionsGranted, setPermissionsGranted] = useState(
    () => !!localStorage.getItem("asteroid_permissions_requested"),
  );

  const handleSplashComplete = () => {
    localStorage.setItem("quarq_splash_shown", "1");
    setShowSplash(false);
  };

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard onNavigate={setCurrentPage} />;
      case "chat":
        return <ChatPage onNavigate={setCurrentPage} />;
      case "gravity":
        return <GluonModePage onNavigate={setCurrentPage} />;
      case "earth":
        return <NucleusModePage onNavigate={setCurrentPage} />;
      case "tasks":
        return <TasksPage onNavigate={setCurrentPage} />;
      case "about":
        return <AboutUsPage onNavigate={setCurrentPage} />;
      case "settings":
        return <SettingsPage onNavigate={setCurrentPage} />;
      case "admin":
        return <AdminSetupPage onNavigate={setCurrentPage} />;
      case "features":
        return <FeaturesPage onNavigate={setCurrentPage} />;
      case "help":
        return <HelpPage onNavigate={setCurrentPage} />;
      case "changelog":
        return <ChangelogPage onNavigate={setCurrentPage} />;
      default:
        return <Dashboard onNavigate={setCurrentPage} />;
    }
  };

  return (
    <ThemeProvider>
      {showSplash ? (
        <WelcomeSplash onComplete={handleSplashComplete} />
      ) : !permissionsGranted ? (
        <PermissionsGate onComplete={() => setPermissionsGranted(true)} />
      ) : (
        <div className="min-h-screen bg-background font-body">
          <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
            {renderPage()}
          </Layout>
          <Toaster />
        </div>
      )}
    </ThemeProvider>
  );
}
