import {
  Inbox,
  User,
  CircleDollarSign,
  BusFront,
  Link2,
  InfoIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import { auth } from "@/lib/supabase";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { NavUser } from "./nav-user";
import logo from "@/assets/inverseLogo.svg";

let data = {
  name: "John Doe",
  email: "TtC3l@example.com",
  avatar: "https://via.placeholder.com/150",
};
try {
  const res = await auth.getUser();

  data = res.data.user
    ? {
        name: res.data.user.user_metadata?.full_name || "Unknown",
        email: res.data.user.email || "",
        avatar:
          res.data.user.user_metadata?.avatar_url ||
          "https://via.placeholder.com/150",
      }
    : {
        name: "John Doe",
        email: "TtC3l@example.com",
        avatar: "https://via.placeholder.com/150",
      };
} catch {
  data = {
    name: "John Doe",
    email: "TtC3l@example.com",
    avatar: "https://via.placeholder.com/150",
  };
}
// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/",
    icon: Inbox,
  },
  {
    title: "Buses",
    url: "/buses",
    icon: BusFront,
  },
  {
    title: "Drivers",
    url: "/drivers",
    icon: User,
  },
  {
    title: "Trips",
    url: "/trips",
    icon: Link2,
  },
  {
    title: "Revenue",
    url: "/revenue",
    icon: CircleDollarSign,
  },
  {
    title: "About",
    url: "/about",
    icon: InfoIcon,
  },
];

export function AppSidebar() {
  return (
    <Sidebar variant="sidebar" collapsible="offcanvas" className="w-60 ">
      <SidebarContent>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <div className="flex flex-col items-center gap-2 p-2">
                <Link className="flex items-center gap-2 mr-10" to="/">
                  <img
                    src={logo}
                    alt="logo"
                    className="w-10 h-10 select-none"
                  />
                  <h1 className="text-4xl font-bold select-none">Opath</h1>
                </Link>
              </div>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data} />
      </SidebarFooter>
    </Sidebar>
  );
}
