"use client";

import { useEffect, useState } from "react";
import {
  BusStatus,
  BusStats,
  columnsBusStats,
  columnsBusStatus,
} from "../components/columns";
import { DataTable } from "../components/ui/data-table";
import { Button } from "@/components/ui/button";
import { DiamondPlus, Search } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { supabase, auth } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
const LayoutTypes = ["A", "B", "C"];
export default function DemoPage() {
  const [data, setData] = useState<BusStatus[]>([]);
  const [data02, setData02] = useState<BusStats[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [refresh, setRefresh] = useState(false);
  const [driverSelectionBusId, setDriverSelectionBusId] = useState<
    string | null
  >(null);
  const [showDriverDialog, setShowDriverDialog] = useState(false);
  const [availableDrivers, setAvailableDrivers] = useState<
    { id: string; full_name: string }[]
  >([]);
  const [currentAction, setCurrentAction] = useState<"add" | "replace">("add");
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [isProcessingDriver, setIsProcessingDriver] = useState(false);
  const [selectedDriverId, setSelectedDriverId] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");

  async function handleDeleteBus(busId: string) {
    if (confirm(`Are you sure you want to delete bus ${busId}?`)) {
      const { error } = await supabase
        .from("buses")
        .delete()
        .eq("id", busId)
        .eq("agent_id", currentUser?.id);

      if (error) {
        console.error("Error deleting bus:", error);
        alert("Failed to delete bus. Please try again.");
      } else {
        setRefresh(!refresh);
      }
    }
  }

  async function handleOpenDriverSelection(
    busId: string,
    action: "add" | "replace"
  ) {
    // Action parameter indicates whether we're adding a new driver or replacing one
    setCurrentAction(action);
    setDriverSelectionBusId(busId);
    setSelectedDriverId("");
    setIsProcessingDriver(true);

    // Fetch available drivers for this agent
    const { data, error } = await supabase
      .from("drivers")
      .select("id, full_name")
      .eq("agent_id", currentUser?.id);

    if (error) {
      console.error("Error fetching drivers:", error);
    } else {
      setAvailableDrivers(data || []);
    }

    setIsProcessingDriver(false);
    setShowDriverDialog(true);
  }

  async function handleAssignDriver() {
    if (!selectedDriverId || !driverSelectionBusId) {
      alert("Please select a driver");
      return;
    }

    setIsProcessingDriver(true);

    const { error } = await supabase
      .from("buses")
      .update({ driver_id: selectedDriverId })
      .eq("id", driverSelectionBusId)
      .eq("agent_id", currentUser?.id);

    if (error) {
      console.error("Error assigning driver:", error);
      alert("Failed to assign driver. Please try again.");
    } else {
      setShowDriverDialog(false);
      setDriverSelectionBusId(null);
      setRefresh(!refresh);
    }

    setIsProcessingDriver(false);
  }

  async function handleRemoveDriver(busId: string) {
    if (confirm("Are you sure you want to remove the driver from this bus?")) {
      setIsProcessingDriver(true);

      const { error } = await supabase
        .from("buses")
        .update({ driver_id: null })
        .eq("id", busId)
        .eq("agent_id", currentUser?.id);

      if (error) {
        console.error("Error removing driver:", error);
        alert("Failed to remove driver. Please try again.");
      } else {
        setRefresh(!refresh);
      }

      setIsProcessingDriver(false);
    }
  }

  async function handlebusinput(
    name: string,
    mileage: number,
    layout: string,
    fuelEfficiency: number
  ) {
    const { data, error } = await supabase.from("buses").insert({
      id: name,
      agent_id: currentUser?.id,

      capacity: 40,
      layout_type: layout,
      starting_mileage: mileage,
      fuel_efficiency: fuelEfficiency,
    });
    if (error) {
      console.error("Error inserting bus:", error);
    } else {
      console.log("Bus inserted successfully:", data);
    }
    setRefresh(!refresh);
  }
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
      const result02: BusStats[] = [];
      setData02(result02);
    }

    async function fetchData02() {
      // Get the user data directly using auth id
      if (!currentUser) return null;

      setIsLoadingStatus(true);

      // No need to query users table - use the auth user ID directly
      const agentId = currentUser.id;

      // Get buses for the current agent
      const { data: buses, error } = await supabase
        .from("buses")
        .select("id,status,capacity,driver_id")
        .eq("agent_id", agentId);

      if (error) {
        console.error("Error fetching buses:", error);
        setIsLoadingStatus(false);
        return null;
      } else {
        // Get drivers for the current agent
        const { data: drivers, error } = await supabase
          .from("drivers")
          .select("id,full_name")
          .eq("agent_id", agentId);

        if (error) {
          console.error("Error fetching drivers:", error);
          setIsLoadingStatus(false);
          return null;
        }

        const busStatus: BusStatus[] = buses.map((bus) => {
          const driver = drivers.find((driver) => driver.id === bus.driver_id);
          return {
            id: bus.id,
            status: bus.status,
            capacity: bus.capacity,
            driverName: driver?.full_name,
          };
        });
        setData(busStatus);
        setIsLoadingStatus(false);
      }
    }

    async function fetchData03() {
      // Get the user data directly using auth id
      if (!currentUser) return null;

      setIsLoadingStats(true);

      // No need to query users table - use the auth user ID directly
      const agentId = currentUser.id;

      // Get buses for the current agent
      const { data: buses, error } = await supabase
        .from("buses")
        .select(
          "id,status,capacity,driver_id,fuel_efficiency,total_mileage,layout_type,driver_id"
        )
        .eq("agent_id", agentId);

      if (error) {
        console.error("Error fetching buses for stats:", error);
        setIsLoadingStats(false);
        return null;
      }

      // Get drivers for the current agent
      const { data: drivers, error: drivererror } = await supabase
        .from("drivers")
        .select("id,full_name,phone")
        .eq("agent_id", agentId);

      if (drivererror) {
        console.error("Error fetching drivers for stats:", drivererror);
        setIsLoadingStats(false);
        return null;
      }

      const busStats: BusStats[] = buses.map((bus) => {
        const driver = drivers?.find((driver) => driver.id === bus.driver_id);
        return {
          id: bus.id,
          status: bus.status,
          capacity: bus.capacity,
          driverName: driver?.full_name,
          phoneNumber: driver?.phone,
          busId: bus.id,
          currentRoute: null,
          totalTrips: 0,
          totalHours: 0,
          totalMileage: bus.total_mileage,
          fuelEfficiency: bus.fuel_efficiency,
          layoutType: bus.layout_type,
        };
      });
      setData02(busStats);
      setIsLoadingStats(false);
      console.log(busStats);
    }

    fetchData02();
    fetchData03();
    fetchData();
  }, [currentUser, refresh]);

  const [selected, setSelected] = useState(0);
  const [busid, setBusid] = useState("");
  const [mileage, setMileage] = useState(0);
  const [fuelEfficiency, setFuelEfficiency] = useState(0);

  // Filter drivers based on search term
  const filteredDrivers = availableDrivers.filter((driver) =>
    driver.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6  h-full overflow-hidden">
      <div className="flex flex-row justify-between mb-4 w-auto  ">
        <div>
          <h1 className="text-3xl font-bold ">Bus Management</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 mb-4">
            Monitor and manage your fleet of buses and assignments
          </p>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button className="">
              <p>Add Bus</p>
              <DiamondPlus />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Add Bus to Fleet</SheetTitle>
              <SheetDescription>Add a new bus to your fleet</SheetDescription>
            </SheetHeader>
            <div className="space-y-4 p-4 ">
              <div className="flex flex-row items-center gap-4 justify-between">
                <Label htmlFor="name" className="text-right font-bold ">
                  Bus Number
                </Label>
                <Input
                  id="busid"
                  placeholder="bus-123"
                  onChange={(e) => setBusid(e.target.value)}
                  className="w-3/5"
                />
              </div>
              <div className="flex flex-row items-center gap-4 justify-between">
                <Label
                  htmlFor="username"
                  className="text-right font-bold whitespace-nowrap"
                >
                  Starting Mileage
                </Label>
                <Input
                  className="w-3/5"
                  id="username"
                  placeholder="0"
                  onChange={(e) => setMileage(Number(e.target.value))}
                />
              </div>
              <div className="flex flex-row items-center gap-4 justify-between">
                <Label
                  htmlFor="username"
                  className="text-right font-bold whitespace-nowrap"
                >
                  Fuel Efficiency
                </Label>
                <Input
                  className="w-3/5"
                  id="username"
                  placeholder="0"
                  onChange={(e) => setFuelEfficiency(Number(e.target.value))}
                />
              </div>
              <div className="space-y-4">
                <Label className="font-bold">Choose Layout:</Label>
                <div className="w-full flex flex-row justify-center">
                  <Carousel
                    opts={{
                      align: "start",
                    }}
                    className="w-6/9 max-w-sm"
                  >
                    <CarouselContent>
                      {LayoutTypes.map((_, index) => (
                        <CarouselItem key={index} className="">
                          <div className="flex gap-4 flex-wrap">
                            <div key={index} className="p-1 w-full h-full">
                              <Card
                                onClick={() => setSelected(index)}
                                className={`cursor-pointer transition-all w-full h-full ${
                                  selected === index
                                    ? "ring-2 ring-blue-500 shadow-lg"
                                    : "ring-1 ring-gray-200"
                                }`}
                              >
                                <CardContent className="flex flex-col aspect-square justify-center p-2">
                                  <span className="text-3xl font-semibold select-none ml-2">
                                    {LayoutTypes[index]}
                                  </span>
                                  <img
                                    src={`/src/assets/layout-${LayoutTypes[index]}.jpg`}
                                    alt={`Layout ${LayoutTypes[index]}`}
                                    className="w-full h-full object-contain"
                                  />
                                </CardContent>
                              </Card>
                            </div>
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>
                </div>
              </div>
            </div>
            <SheetFooter>
              <Button
                onClick={() =>
                  handlebusinput(
                    busid,
                    mileage,
                    LayoutTypes[selected],
                    fuelEfficiency
                  )
                }
                className="bg-green-500 cursor-pointer"
              >
                Confirm
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      {/* Driver Selection Dialog */}
      <Dialog open={showDriverDialog} onOpenChange={setShowDriverDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {currentAction === "add"
                ? "Add a driver to"
                : "Replace driver for"}{" "}
              bus {driverSelectionBusId}
            </DialogTitle>
            <DialogDescription>
              Select a driver to assign to this bus
            </DialogDescription>
          </DialogHeader>

          {isProcessingDriver ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : availableDrivers.length > 0 ? (
            <div className="py-4 space-y-4">
              {/* Search input */}
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search drivers..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {filteredDrivers.length > 0 ? (
                <Select
                  value={selectedDriverId}
                  onValueChange={setSelectedDriverId}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a driver" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Available Drivers</SelectLabel>
                      {filteredDrivers.map((driver) => (
                        <SelectItem key={driver.id} value={driver.id}>
                          {driver.full_name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-center text-sm text-muted-foreground">
                  No drivers found matching "{searchTerm}"
                </p>
              )}

              {searchTerm && filteredDrivers.length === 0 && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setSearchTerm("")}
                >
                  Clear search
                </Button>
              )}
            </div>
          ) : (
            <p className="text-center py-4 text-sm text-gray-500">
              No available drivers found.
            </p>
          )}

          <DialogFooter className="sm:justify-between">
            <Button
              variant="outline"
              onClick={() => {
                setShowDriverDialog(false);
                setSearchTerm("");
              }}
              disabled={isProcessingDriver}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAssignDriver}
              disabled={!selectedDriverId || isProcessingDriver}
            >
              Assign Driver
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex flex-col justify-between mb-4 w-auto ">
        <div>
          <h1 className="text-2xl font-bold mb-2">Buses Status</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 mb-3">
            Current operational status of all buses in your fleet
          </p>
        </div>
        <DataTable
          columns={columnsBusStatus}
          data={data}
          isLoading={isLoadingStatus}
          busActions={{
            onDeleteBus: handleDeleteBus,
            onAddDriver: (busId: string) =>
              handleOpenDriverSelection(busId, "add"),
            onReplaceDriver: (busId: string) =>
              handleOpenDriverSelection(busId, "replace"),
            onRemoveDriver: handleRemoveDriver,
          }}
        />
      </div>
      <div>
        <h1 className="text-2xl font-bold mb-2 mt-10">Buses Current Stats</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 mb-3">
          Detailed statistics and performance metrics for your bus fleet
        </p>
      </div>

      <DataTable
        columns={columnsBusStats}
        data={data02}
        isLoading={isLoadingStats}
        busActions={{
          onDeleteBus: handleDeleteBus,
          onAddDriver: (busId: string) =>
            handleOpenDriverSelection(busId, "add"),
          onReplaceDriver: (busId: string) =>
            handleOpenDriverSelection(busId, "replace"),
          onRemoveDriver: handleRemoveDriver,
        }}
      />
    </div>
  );
}
