import { useEffect, useState } from "react";
import Login from "./Login";
import type { User } from "@supabase/supabase-js";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/appsidebar";
import { auth } from "@/lib/supabase";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

// Import page components
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import About from "./pages/About";

export default function Layout() {
  const [user, setUser] = useState<User | null>(null);
  const [mouseOver, setMouseOver] = useState(false);
  const [loading, setLoading] = useState(true);

  function handleMouseOver() {
    setMouseOver(true);
  }

  function handleMouseLeave() {
    setMouseOver(false);
  }

  useEffect(() => {
    // Check if user is already logged in
    auth.getUser().then(({ data }) => {
      setUser(data?.user || null);
      setLoading(false);
    });

    // Setup auth listener
    const subscription = auth.onAuthStateChange((user) => {
      setUser(user);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <Router>
      {!user ? (
        <Login onLogin={setUser} />
      ) : (
        <SidebarProvider open={mouseOver}>
          <AppSidebar />
          <SidebarTrigger className="hidden" />
          <div className="flex flex-col w-full">
            <div className="absolute top-0 h-full z-0 flex ">
              <div
                className="h-full w-8 z-10"
                onMouseEnter={() => {
                  handleMouseOver();
                }}
                style={{
                  pointerEvents: "auto",
                }}
              />
              <div
                className=" h-full w-8 z-10"
                onMouseEnter={() => {
                  handleMouseLeave();
                }}
                style={{
                  pointerEvents: "auto",
                }}
              />
            </div>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </div>
        </SidebarProvider>
      )}
    </Router>
  );
}
