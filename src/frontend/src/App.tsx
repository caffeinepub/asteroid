import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import Layout from "./components/Layout";
import AdminSetupPage from "./pages/AdminSetup";
import ChatPage from "./pages/Chat";
import Dashboard from "./pages/Dashboard";
import EarthModePage from "./pages/EarthMode";
import GravityModePage from "./pages/GravityMode";
import SettingsPage from "./pages/Settings";
import TasksPage from "./pages/Tasks";

export type AppPage =
  | "dashboard"
  | "chat"
  | "gravity"
  | "earth"
  | "tasks"
  | "settings"
  | "admin";

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
      case "settings":
        return <SettingsPage onNavigate={setCurrentPage} />;
      case "admin":
        return <AdminSetupPage onNavigate={setCurrentPage} />;
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
