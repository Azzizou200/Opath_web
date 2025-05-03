import { useEffect, useState } from "react";
import Login from "./Login";
import type { User } from "@supabase/supabase-js";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/appsidebar";
import { auth } from "@/lib/supabase";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";
// Import page components
import Buses from "./pages/Buses";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";
import Drivers from "./pages/Drivers";
import Trips from "./pages/Trips";
import Revenue from "./pages/Revenue";
export default function Layout() {
  const [user, setUser] = useState<User | null>(null);

  const [loading, setLoading] = useState(true);

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
        <SidebarProvider open={true}>
          <AppSidebar />
          <SidebarTrigger className="hidden" />
          <Toaster />
          <Routes>
            <Route path="/buses" element={<Buses />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/drivers" element={<Drivers />} />
            <Route path="/trips" element={<Trips />} />
            <Route path="/revenue" element={<Revenue />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </SidebarProvider>
      )}
    </Router>
  );
}
