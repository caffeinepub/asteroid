import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import Layout from "./components/Layout";
import AboutUsPage from "./pages/AboutUs";
import AdminSetupPage from "./pages/AdminSetup";
import ChangelogPage from "./pages/Changelog";
import ChatPage from "./pages/Chat";
import Dashboard from "./pages/Dashboard";
import EarthModePage from "./pages/EarthMode";
import FeaturesPage from "./pages/Features";
import GravityModePage from "./pages/GravityMode";
import HelpPage from "./pages/Help";
import SettingsPage from "./pages/Settings";
import TasksPage from "./pages/Tasks";

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

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard onNavigate={setCurrentPage} />;
      case "chat":
        return <ChatPage onNavigate={setCurrentPage} />;
      case "gravity":
        return <GravityModePage onNavigate={setCurrentPage} />;
      case "earth":
        return <EarthModePage onNavigate={setCurrentPage} />;
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
    <div className="min-h-screen bg-background font-body">
      <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
        {renderPage()}
      </Layout>
      <Toaster />
    </div>
  );
}
