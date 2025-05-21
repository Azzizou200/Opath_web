import React, { useEffect, useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { columnsRoute, route, columnsTrip, Trip } from "@/components/columns";
import { supabase, auth } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MapPin, Route, Bus, Calendar, Clock, TrendingUp } from "lucide-react";
import { LocationAutocomplete } from "@/components/LocationAutocomplete";
import * as geolib from "geolib";
import { toast } from "sonner";

interface Bus {
  id: string;
  status: string;
  capacity: number;
  driver_id: string;
}

interface Driver {
  id: string;
  full_name: string;
}

const Trips: React.FC = () => {
  const [routes, setRouteData] = useState<route[]>([]);
  const [trips, setTripData] = useState<Trip[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoadingRoutes, setIsLoadingRoutes] = useState(true);
  const [isLoadingTrips, setIsLoadingTrips] = useState(true);
  const [buses, setBuses] = useState<Bus[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);

  // Form state for adding new route
  const [newRoute, setNewRoute] = useState({
    from: "",
    to: "",
    route_name: "",
    distance: 0,
    time: 0,
  });

  // Form state for adding new trip
  const [newTrip, setNewTrip] = useState({
    route_id: "",
    driver_id: "",
    bus_id: "",
    date: "",
    start_time: "",
    end_time: "",
    price: 0,
  });

  const [distance, setDistance] = useState(0);
  const [time, setTime] = useState(0);
  const SPEED_KMH = 30; // Constant speed for time calculation

  const defaultFromPosition: [number, number] = [35.6082351, -0.563609]; // Oran
  const defaultToPosition: [number, number] = [35.6082351, -0.563609]; // Oran

  // Function to calculate distance and time
  const calculateDistanceAndTime = (from: string, to: string) => {
    if (!from || !to) return;
    console.log("Raw From Input:", from);
    console.log("Raw To Input:", to);

    const parseLocationString = (input: string) => {
      // Check if input contains the separator format we're using
      if (input.includes("|")) {
        // Extract coordinates from the new format: "lat,lng|address"
        const coordPart = input.split("|")[0];
        const coords = coordPart
          .split(",")
          .map((part) => parseFloat(part.trim()));
        return coords.length === 2 ? coords : [NaN, NaN];
      } else {
        // Fallback to old format or direct coordinate input
        const parts = input.split(",").map((part) => parseFloat(part.trim()));
        return parts.length === 2 ? parts : [NaN, NaN];
      }
    };

    const fromCoords = parseLocationString(from);
    const toCoords = parseLocationString(to);

    console.log("Parsed From Coordinates:", fromCoords);
    console.log("Parsed To Coordinates:", toCoords);

    if (
      isNaN(fromCoords[0]) ||
      isNaN(fromCoords[1]) ||
      isNaN(toCoords[0]) ||
      isNaN(toCoords[1])
    )
      return; // Ensure valid coordinates

    const calculatedDistance =
      geolib.getDistance(
        { latitude: fromCoords[0], longitude: fromCoords[1] },
        { latitude: toCoords[0], longitude: toCoords[1] }
      ) / 1000; // Convert to kilometers

    console.log("Calculated Distance:", calculatedDistance);
    setDistance(calculatedDistance);
    setTime(calculatedDistance / SPEED_KMH);
  };

  useEffect(() => {
    calculateDistanceAndTime(newRoute.from, newRoute.to);
  }, [newRoute.from, newRoute.to]);

  // Function to handle adding a new route
  const handleAddRoute = async () => {
    if (!currentUser || !newRoute.from || !newRoute.to) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      // Extract addresses from the location strings
      const fromAddress = newRoute.from.includes("|")
        ? newRoute.from.split("|")[1]
        : newRoute.from;

      const toAddress = newRoute.to.includes("|")
        ? newRoute.to.split("|")[1]
        : newRoute.to;

      const fromCity = fromAddress.split(",")[1].trim();
      const toCity = toAddress.split(",")[1].trim();
      const start_street = fromAddress.split(",")[0].trim();
      const destination_street = toAddress.split(",")[0].trim();
      
      const { error } = await supabase.from("routes").insert({
        route_name: newRoute.route_name,
        start_location: fromCity,
        destination: toCity,
        start_street: start_street,
        destination_street: destination_street,
        distance: newRoute.distance,
        duration: newRoute.time,
        agent_id: currentUser.id,
      });

      if (error) throw error;

      // Show success message
      toast.success("Route added successfully!");

      // Refresh the routes data
      fetchData();

      // Reset form
      setNewRoute({
        from: "",
        to: "",
        route_name: "",
        distance: 0,
        time: 0,
      });
    } catch (error) {
      console.error("Error adding route:", error);
      toast.error("Failed to add route. Please try again.");
    }
  };

  // Calculate statistics from trip and route data
  const getTripStats = () => {
    if (trips.length === 0 || routes.length === 0) {
      return {
        totalRoutes: routes.length,
        totalTrips: trips.length,
        mostPopularRoute: null,
        mostActiveDriver: null,
        totalActiveRoutes: 0,
        avgTripsPerRoute: 0,
      };
    }

    // Count routes with active trips
    const routesWithTrips = new Set(trips.map((trip) => trip.route)).size;

    // Find most popular route
    const routeCounts = trips.reduce((acc, trip) => {
      if (!trip.route) return acc;
      acc[trip.route] = (acc[trip.route] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostPopularRoute =
      Object.entries(routeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || null;

    // Find most active driver
    const driverCounts = trips.reduce((acc, trip) => {
      if (!trip.driver) return acc;
      acc[trip.driver] = (acc[trip.driver] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostActiveDriver =
      Object.entries(driverCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || null;

    return {
      totalRoutes: routes.length,
      totalTrips: trips.length,
      mostPopularRoute,
      mostActiveDriver,
      totalActiveRoutes: routesWithTrips,
      avgTripsPerRoute: routes.length
        ? Math.round((trips.length / routes.length) * 10) / 10
        : 0,
    };
  };

  const tripStats = getTripStats();

  useEffect(() => {
    // Get the current logged-in user
    async function getCurrentUser() {
      const { data } = await auth.getUser();
      setCurrentUser(data?.user || null);
    }

    getCurrentUser();
  }, []);

  // Move fetchData outside useEffect
  const fetchData = async () => {
    if (!currentUser) return null;

    setIsLoadingRoutes(true);

    const agentId = currentUser.id;

    const { data: routes, error: routesError } = await supabase
      .from("routes")
      .select("id, route_name, start_location, destination")
      .eq("agent_id", agentId);

    if (routesError || !routes) {
      console.error("Error fetching routes");
      setIsLoadingRoutes(false);
      return null;
    }

    const { data: trips, error: tripsError } = await supabase
      .from("trips")
      .select("id, route_id, start_time, end_time, driver_id, bus_id")
      .eq("agent_id", agentId);

    if (tripsError || !trips) {
      console.error("Error fetching trips");
      setIsLoadingRoutes(false);
      return null;
    }

    const routeInfo: route[] = routes.map((route) => {
      const trip = trips
        .map((trip) => {
          return trip.route_id === route.id ? trip : null;
        })
        .filter(Boolean);

      return {
        id: route.id,
        from: route.start_location,
        to: route.destination,
        numberofbuses: trip ? trip.length : 0,
        route_name: route.route_name,
      };
    });

    setRouteData(routeInfo);
    setIsLoadingRoutes(false);
  };

  // Move fetchData02 outside useEffect
  const fetchData02 = async () => {
    if (!currentUser) return null;

    setIsLoadingTrips(true);

    const agentId = currentUser.id;

    const { data: trips, error: tripsError } = await supabase
      .from("trips")
      .select("id, route_id, start_time, end_time, driver_id, bus_id, date, price")
      .eq("agent_id", agentId);

    if (tripsError || !trips) {
      console.error("Error fetching trips");
      setIsLoadingTrips(false);
      return null;
    }

    const { data: routes, error: routesError } = await supabase
      .from("routes")
      .select("id, route_name")
      .eq("agent_id", agentId);

    if (routesError || !routes) {
      console.error("Error fetching routes");
      setIsLoadingTrips(false);
      return null;
    }

    const { data: drivers, error: driversError } = await supabase
      .from("drivers")
      .select("id, full_name")
      .eq("agent_id", agentId);

    if (driversError || !drivers) {
      console.error("Error fetching drivers");
      setIsLoadingTrips(false);
      return null;
    }

    const { data: buses, error: busesError } = await supabase
      .from("buses")
      .select("id, status, capacity, driver_id")
      .eq("agent_id", agentId);

    if (busesError || !buses) {
      console.error("Error fetching buses");
      setIsLoadingTrips(false);
      return null;
    }

    setBuses(buses);
    setDrivers(drivers);

    const tripsData: Trip[] = trips.map((trip) => {
      const route = routes.find((route) => route.id === trip.route_id);
      const driver = drivers.find((driver) => driver.id === trip.driver_id);
      const bus = buses.find((bus) => bus.id === trip.bus_id);
      return {
        price: trip.price,
        id: trip.id,
        route: route?.route_name,
        bus: bus?.id,
        driver: driver?.full_name,
        departure: trip.start_time,
        arrival: trip.end_time,
        date: trip.date,
      };
    });

    setTripData(tripsData);
    setIsLoadingTrips(false);
  };

  // Function to handle adding a new trip
  const handleAddTrip = async () => {
    // Comprehensive validation
    if (!currentUser) {
      toast.error("You must be logged in to add a trip");
      return;
    }
    
    // Ensure we have a bus_id by finding it from the driver_id if needed
    let finalBusId = newTrip.bus_id;
    let busCapacity = 0;
    
    // Find the bus either by bus_id or driver_id
    const selectedBus = finalBusId 
      ? buses.find(bus => bus.id === finalBusId)
      : newTrip.driver_id 
        ? buses.find(bus => bus.driver_id === newTrip.driver_id)
        : null;
        
    if (selectedBus) {
      finalBusId = selectedBus.id;
      busCapacity = selectedBus.capacity;
      console.log("Found bus:", selectedBus);
      console.log("Bus capacity:", busCapacity);
    } else {
      console.warn("No bus found for the selected driver or bus ID");
    }
    
    // Check all required fields
    const missingFields = [];
    if (!newTrip.route_id) missingFields.push("Route");
    if (!newTrip.driver_id) missingFields.push("Driver");
    if (!finalBusId) missingFields.push("Bus");
    if (!newTrip.date) missingFields.push("Date");
    if (!newTrip.start_time) missingFields.push("Start Time");
    if (!newTrip.end_time) missingFields.push("End Time");
    if (newTrip.price <= 0) missingFields.push("Price");
    
    if (missingFields.length > 0) {
      toast.error(`Please fill in all required fields: ${missingFields.join(", ")}`);
      return;
    }
    
    // Check if we have a valid capacity
    if (busCapacity <= 0) {
      console.error("Invalid bus capacity:", busCapacity);
      toast.error("The selected bus has an invalid capacity. Please select a different bus.");
      return;
    }

    try {
      // Create the trip data object
      const tripData = {
        bus_id: finalBusId,
        route_id: newTrip.route_id,
        driver_id: newTrip.driver_id,
        start_time: newTrip.start_time,
        end_time: newTrip.end_time,
        date: newTrip.date,
        price: newTrip.price,
        agent_id: currentUser.id,
        capacity: busCapacity, // Add the capacity from the selected bus
      };
      
      // Log the complete trip data for debugging
      console.log("Adding trip with data:", tripData);
      
      // Try inserting without the select first to simplify
      const { error } = await supabase.from("trips").insert(tripData);

      if (error) {
        console.error("Supabase error details:", error);
        throw error;
      }

      console.log("Trip added successfully!");
      // Show success message
      toast.success("Trip added successfully!");

      // Refresh the trips data
      fetchData02();

      // Reset form
      setNewTrip({
        bus_id: "",
        route_id: "",
        driver_id: "",
        date: "",
        start_time: "",
        end_time: "",
        price: 0,
      });
    } catch (error: any) {
      console.error("Error adding trip:", error);
      toast.error(`Failed to add trip: ${error?.message || "Please try again."}`); 
    }
  };

  useEffect(() => {
    // Only fetch data when we have the current user
    if (!currentUser) return;

    fetchData();
    fetchData02();
  }, [currentUser]);

  return (
    <div className="p-6 flex flex-col gap-4 w-full h-full overflow-auto">
      <h1 className="text-3xl font-bold">Trip Management</h1>

      {/* Dashboard Statistics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Routes</CardTitle>
            <Route className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tripStats.totalRoutes}</div>
            <p className="text-xs text-gray-500 mt-1">
              {tripStats.totalActiveRoutes} routes with active trips
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Trips</CardTitle>
            <Bus className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tripStats.totalTrips}</div>
            <p className="text-xs text-gray-500 mt-1">
              {tripStats.avgTripsPerRoute} trips per route on average
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Popular Route</CardTitle>
            <MapPin className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold truncate">
              {tripStats.mostPopularRoute || "No data"}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Most frequently traveled route
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Top Driver</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold truncate">
              {tripStats.mostActiveDriver || "No data"}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Driver with the most trips
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Routes Section */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Routes</h2>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">Add Route</Button>
            </SheetTrigger>
            <SheetContent className="p-8">
              <SheetHeader>
                <SheetTitle>Add Route</SheetTitle>
              </SheetHeader>
              <SheetDescription>Add a new route to your list.</SheetDescription>
              <div className="grid gap-4">
                <div className="flex flex-col gap-2">
                  <Label>Route Name</Label>
                  <Input
                    id="route-name"
                    value={newRoute.route_name}
                    onChange={(e) =>
                      setNewRoute({
                        ...newRoute,
                        route_name: e.target.value,
                      })
                    }
                  />
                </div>
                <LocationAutocomplete
                  id="from"
                  label="From"
                  value={newRoute.from}
                  onChange={(value) => {
                    setNewRoute({ ...newRoute, from: value });
                    calculateDistanceAndTime(value, newRoute.to);
                  }}
                  defaultMapPosition={defaultFromPosition}
                />
                <LocationAutocomplete
                  id="to"
                  label="To"
                  value={newRoute.to}
                  onChange={(value) => {
                    setNewRoute({ ...newRoute, to: value });
                    calculateDistanceAndTime(newRoute.from, value);
                  }}
                  defaultMapPosition={defaultToPosition}
                />
              </div>
              <div className="flex justify-between mt-4">
                <div>
                  <Label>Distance:</Label>
                  <p>{distance.toFixed(1)} km</p>
                </div>
                <div>
                  <Label>Hour Time:</Label>
                  <p>{time.toFixed(1)} hr</p>
                </div>
              </div>
              <SheetFooter>
                <SheetClose asChild>
                  <Button type="submit" onClick={handleAddRoute}>
                    Add Route
                  </Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
        <DataTable
          columns={columnsRoute}
          data={routes}
          isLoading={isLoadingRoutes}
        />
      </div>

      {/* Trip Details */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Trips</h2>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">Add Trip</Button>
            </SheetTrigger>
            <SheetContent className="p-8">
              <SheetHeader>
                <SheetTitle>Add Trip</SheetTitle>
              </SheetHeader>
              <SheetDescription>Add a new trip to your list.</SheetDescription>
              <div className="grid gap-4">
                <div className="flex flex-col gap-2">
                  <Label>Route</Label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={newTrip.route_id}
                    onChange={(e) =>
                      setNewTrip({ ...newTrip, route_id: e.target.value })
                    }
                  >
                    <option value="">Select a route</option>
                    {routes.map((route) => (
                      <option key={route.id} value={route.id}>
                        {route.route_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <Label>Driver with Bus</Label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={newTrip.driver_id}
                    onChange={(e) => {
                      const selectedDriverId = e.target.value;
                      
                      if (!selectedDriverId) {
                        // If no driver selected, clear both driver and bus
                        setNewTrip(prev => ({
                          ...prev,
                          driver_id: "",
                          bus_id: ""
                        }));
                        return;
                      }
                      
                      // Find the bus associated with this driver
                      const bus = buses.find(bus => bus.driver_id === selectedDriverId);
                      
                      if (bus) {
                        console.log(`Found bus ${bus.id} for driver ${selectedDriverId}`);
                        // Update both driver_id and bus_id in a single state update
                        setNewTrip(prev => ({
                          ...prev,
                          driver_id: selectedDriverId,
                          bus_id: bus.id
                        }));
                      } else {
                        console.warn(`No bus found for driver ${selectedDriverId}`);
                        // Set driver_id but clear bus_id
                        setNewTrip(prev => ({
                          ...prev,
                          driver_id: selectedDriverId,
                          bus_id: ""
                        }));
                      }
                    }}
                  >
                    <option value="">Select a driver</option>
                    {buses
                      .filter(
                        (bus) => bus.driver_id && bus.status === "available"
                      )
                      .map((bus) => {
                        const driver = drivers.find(
                          (d) => d.id === bus.driver_id
                        );
                        return (
                          <option key={bus.id} value={bus.driver_id}>
                            {driver?.full_name} - Bus {bus.id} (Capacity:{" "}
                            {bus.capacity})
                          </option>
                        );
                      })}
                  </select>
                  {newTrip.bus_id && (
                    <div className="mt-1 text-sm text-green-600">
                      Selected Bus ID: {newTrip.bus_id}
                    </div>
                  )}
                  {newTrip.driver_id && !newTrip.bus_id && (
                    <div className="mt-1 text-sm text-red-600">
                      Warning: No bus associated with this driver
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={newTrip.date}
                    onChange={(e) =>
                      setNewTrip({ ...newTrip, date: e.target.value })
                    }
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Start Time</Label>
                  <Input
                    type="time"
                    value={newTrip.start_time}
                    onChange={(e) =>
                      setNewTrip({ ...newTrip, start_time: e.target.value })
                    }
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label>End Time</Label>
                  <Input
                    type="time"
                    value={newTrip.end_time}
                    onChange={(e) =>
                      setNewTrip({ ...newTrip, end_time: e.target.value })
                    }
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Price</Label>
                  <Input
                    type="number"
                    value={newTrip.price}
                    onChange={(e) =>
                      setNewTrip({ ...newTrip, price: Number(e.target.value) })
                    }
                  />
                </div>
              </div>

              <SheetFooter>
                <SheetClose asChild>
                  <Button type="submit" onClick={handleAddTrip}>
                    Add Trip
                  </Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
        <DataTable
          columns={columnsTrip}
          data={trips}
          isLoading={isLoadingTrips}
        />
      </div>

      {/* Recent Trips */}
      {!isLoadingTrips && trips.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
          <Card>
            <CardHeader>
              <CardTitle>Latest Trips</CardTitle>
              <CardDescription>Recently scheduled trips</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trips.slice(0, 5).map((trip) => (
                  <div
                    key={trip.id}
                    className="flex items-center justify-between border-b pb-4 last:border-0"
                  >
                    <div>
                      <div className="font-medium">
                        {trip.route || "Unknown Route"}
                      </div>
                      <div className="text-sm text-gray-500">
                        Bus: {trip.bus || "Unassigned"}
                      </div>
                      <div className="text-sm text-gray-500">
                        Driver: {trip.driver || "Unassigned"}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-sm">
                        <Clock className="h-3 w-3" />
                        <span>{trip.departure || "N/A"}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Calendar className="h-3 w-3" />
                        <span>{trip.arrival || "N/A"}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Trips;
