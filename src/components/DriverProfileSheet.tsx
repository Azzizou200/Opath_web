import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import HeatMap from "@uiw/react-heat-map";
import { Phone, Mail, Bus, Clock, RouteIcon, CalendarDays } from "lucide-react";

import { Button } from "./ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";
import { toast } from "sonner";
import { Badge } from "./ui/badge";
import { useEffect, useState } from "react";
import { supabase, auth } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text);
  toast.success("Copied to clipboard");
}

const value = [
  { date: "2016/01/11", count: 2 },
  ...[...Array(17)].map((_, idx) => ({
    date: `2016/01/${idx + 10}`,
    count: idx,
  })),
  ...[...Array(17)].map((_, idx) => ({
    date: `2016/02/${idx + 10}`,
    count: idx,
  })),
  { date: "2016/04/12", count: 2 },
  { date: "2016/05/01", count: 5 },
  { date: "2016/05/02", count: 5 },
  { date: "2016/05/03", count: 1 },
  { date: "2016/05/04", count: 11 },
  { date: "2016/05/08", count: 32 },
];

interface DriverProfileSheetProps {
  id: string;
}

interface DriverStatus {
  id: string;
  email: string | null;
  name: string;
  status: string;
  phoneNumber: string | null;
  currentBus: string | null;
  hours: number | null;
  trips: number | null;
  absences: number | null;
  image: string | null;
}

function DriverProfileSheet({ id }: DriverProfileSheetProps) {
  const [driverdata, setDriverData] = useState<DriverStatus>();
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    // Get the current logged-in user
    async function getCurrentUser() {
      const { data } = await auth.getUser();
      setCurrentUser(data?.user || null);
    }

    getCurrentUser();
  }, []);

  useEffect(() => {
    // Only fetch data when we have the current user
    if (!currentUser) return;

    async function fetchData() {
      if (!currentUser) return null;
      const agentId = currentUser.id;

      const { data: drivers, error } = await supabase
        .from("drivers")
        .select("*")
        .eq("id", id)
        .eq("agent_id", agentId);

      if (error || !drivers || drivers.length === 0) {
        console.error("Error fetching driver data:", error);
        return null;
      } else {
        const driverStatus: DriverStatus = {
          id: drivers[0].id,
          name: drivers[0].full_name,
          status: drivers[0].status,
          phoneNumber: drivers[0].phone,
          currentBus: drivers[0].bus_id || null,
          hours: drivers[0].total_hours,
          email: drivers[0].email,
          trips: drivers[0].total_trips,
          absences: drivers[0].days_missed,
          image: drivers[0].profile_picture,
        };
        setDriverData(driverStatus);
      }
    }

    fetchData();
  }, [id, currentUser]);

  // Helper for status badge
  const getStatusBadge = (status: string | undefined) => {
    if (!status) return null;

    const statusConfig = {
      available: { bg: "bg-green-100", text: "text-green-800" },
      working: { bg: "bg-blue-100", text: "text-blue-800" },
      maintenance: { bg: "bg-yellow-100", text: "text-yellow-800" },
    }[status.toLowerCase()] || { bg: "bg-gray-100", text: "text-gray-800" };

    return (
      <Badge
        variant="outline"
        className={`${statusConfig.bg} ${statusConfig.text} hover:${statusConfig.bg}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="link" className="px-0 font-medium h-auto">
          {driverdata?.name}
        </Button>
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="pt-6 pb-10 px-8 md:px-12 border-t-2 h-[85vh] max-h-[85vh] overflow-y-auto"
      >
        <SheetHeader className="p-0 flex items-end justify-between">
          <div className="flex gap-3 items-center">
            <SheetTitle className="text-2xl">{driverdata?.name}</SheetTitle>
            {getStatusBadge(driverdata?.status)}
          </div>
        </SheetHeader>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 h-full">
          {/* Left column - Profile & Contact */}
          <div className="flex flex-col gap-6 items-center md:items-start">
            <Avatar className="w-36 h-36 md:w-48 md:h-48 rounded-full border-2 border-gray-100 shadow-md">
              <AvatarImage
                className="rounded-full object-cover"
                src={driverdata?.image ?? "/src/assets/OIP-2453187945.jpg"}
                alt={driverdata?.name || "Driver"}
              />
              <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                {driverdata?.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("") || "DR"}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col gap-3 w-full h-full">
              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium text-gray-500">
                  Contact Information
                </p>
                <div className="flex flex-row gap-2 items-center group">
                  <Phone className="h-4 w-4 text-gray-400 group-hover:text-primary transition-colors" />
                  {driverdata?.phoneNumber ? (
                    <button
                      onClick={() =>
                        driverdata.phoneNumber &&
                        copyToClipboard(driverdata.phoneNumber)
                      }
                      className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1"
                    >
                      {driverdata.phoneNumber}
                    </button>
                  ) : (
                    <span className="text-sm text-gray-500">
                      No phone number
                    </span>
                  )}
                </div>

                <div className="flex flex-row gap-2 items-center group">
                  <Mail className="h-4 w-4 text-gray-400 group-hover:text-primary transition-colors" />
                  {driverdata?.email ? (
                    <button
                      onClick={() =>
                        driverdata.email && copyToClipboard(driverdata.email)
                      }
                      className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1"
                    >
                      {driverdata.email}
                    </button>
                  ) : (
                    <span className="text-sm text-gray-500">No email</span>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2 mt-2">
                <p className="text-sm font-medium text-gray-500">Assignment</p>
                <div className="flex flex-row gap-2 items-center">
                  <Bus className="h-4 w-4 text-gray-400" />
                  {driverdata?.currentBus ? (
                    <span className="text-sm font-medium">
                      {driverdata.currentBus}
                    </span>
                  ) : (
                    <span className="text-sm text-gray-500">
                      No bus assigned
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right columns - Metrics & Data */}
          <div className="md:col-span-2 flex flex-col gap-6 h-full">
            {/* Stats cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg border p-4 flex flex-col">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-medium text-gray-500">
                    Hours Worked
                  </p>
                  <Clock className="h-4 w-4 text-gray-400" />
                </div>
                <p className="text-2xl font-bold">
                  {driverdata?.hours ? `${driverdata.hours}h` : "0h"}
                </p>
                <p className="text-xs text-gray-500 mt-1">This month</p>
              </div>

              <div className="bg-white rounded-lg border p-4 flex flex-col">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-medium text-gray-500">Trips</p>
                  <RouteIcon className="h-4 w-4 text-gray-400" />
                </div>
                <p className="text-2xl font-bold">{driverdata?.trips || "0"}</p>
                <p className="text-xs text-gray-500 mt-1">Total trips</p>
              </div>

              <div className="bg-white rounded-lg border p-4 flex flex-col">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-medium text-gray-500">Absences</p>
                  <CalendarDays className="h-4 w-4 text-gray-400" />
                </div>
                <p
                  className={`text-2xl font-bold ${
                    driverdata?.absences ? "text-red-500" : ""
                  }`}
                >
                  {driverdata?.absences || "0"}
                </p>
                <p className="text-xs text-gray-500 mt-1">Days missed</p>
              </div>
            </div>

            {/* Activity chart */}
            <div className="bg-white rounded-lg border p-5 ">
              <div className="mb-4">
                <h3 className="text-base font-semibold">Activity Heatmap</h3>
                <p className="text-xs text-gray-500">
                  Driver's work activity over time
                </p>
              </div>
              <div className="overflow-x-auto pb-2 ">
                <HeatMap
                  value={value}
                  width={720}
                  height={165}
                  rectSize={15}
                  legendCellSize={15}
                  startDate={new Date("2016/01/01")}
                  rectProps={{
                    rx: 2,
                    strokeWidth: 0,
                  }}
                  legendRender={(props) => (
                    <rect {...props} rx={2} strokeWidth={0} />
                  )}
                  className="min-w-[500px]"
                />
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default DriverProfileSheet;
