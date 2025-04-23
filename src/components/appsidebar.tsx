import { Inbox, User, CircleDollarSign, BusFront, Link2 } from "lucide-react";
import { Link } from "react-router-dom";

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
import logo from "@/assets/logo.svg";
const data = {
  name: "shadcn",
  email: "m@example.com",
  avatar: "/avatars/shadcn.jpg",
};
// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Inbox,
  },
  {
    title: "Buses",
    url: "/",
    icon: BusFront,
  },
  {
    title: "Drivers",
    url: "/profile",
    icon: User,
  },
  {
    title: "Trips",
    url: "/settings",
    icon: Link2,
  },
  {
    title: "Revenue",
    url: "/about",
    icon: CircleDollarSign,
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
            <SidebarMenu>
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
