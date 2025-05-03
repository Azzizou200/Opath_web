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
import { supabase } from "@/lib/supabase";

const Trips: React.FC = () => {
  const [routes, setRouteData] = useState<route[]>([]);

  const [trips, setTripData] = useState<Trip[]>([]);
  useEffect(() => {
    async function fetchData() {
      const { data: routes, error: routesError } = await supabase
        .from("routes")
        .select("id,route_name,start_location,destination");

      if (routesError || !routes) {
        console.error("Error fetching routes:", routesError);
        return null;
      }
      const { data: trips, error: tripsError } = await supabase
        .from("trips")
        .select("id,route_id");
      if (tripsError || !trips) {
        console.error("Error fetching trips:", tripsError);
        return null;
      }

      const routeInfo: route[] = routes.map((route) => {
        const trip = trips
          .map((trip) => {
            return trip.route_id === route.id ? trip : null;
          })
          .filter(Boolean); // Filter out null values

        return {
          id: route.route_name,
          from: route.start_location,
          to: route.destination,
          numberofbuses: trip ? trip.length : 0, // Placeholder for number of buses
        };
      });

      setRouteData(routeInfo);
    }
    async function fetchData02() {
      const { data: trips, error: tripsError } = await supabase
        .from("trips")
        .select("*");
      if (tripsError || !trips) {
        console.error("Error fetching trips:", tripsError);
        return null;
      }
      const { data: routes, error: routesError } = await supabase
        .from("routes")
        .select("*");
      if (routesError || !routes) {
        console.error("Error fetching routes:", routesError);
        return null;
      }
      const { data: drivers, error: driversError } = await supabase
        .from("drivers")
        .select("id,full_name");
      if (driversError || !drivers) {
        console.error("Error fetching drivers:", driversError);
        return null;
      }
      const { data: buses, error: busesError } = await supabase
        .from("buses")
        .select("id,status,capacity,driver_id");
      if (busesError || !buses) {
        console.error("Error fetching buses:", busesError);
        return null;
      }
      const tripsData: Trip[] = trips.map((trip) => {
        const route = routes.find((route) => route.id === trip.route_id);
        const driver = drivers.find((driver) => driver.id === trip.driver_id);
        const bus = buses.find((bus) => bus.id === trip.bus_id);
        return {
          id: trip.id,
          route: route.route_name,
          bus: bus?.id,
          driver: driver?.full_name,
          departure: trip.start_time,
          arrival: trip.end_time,
        };
      });
      console.log(tripsData);
      setTripData(tripsData);
    }
    fetchData();
    fetchData02();
  }, []);
  return (
    <div className="p-6 flex flex-col justify-center items-center gap-4 w-full overflow-hidden">
      <div className="mb-4 flex flex-row items-center gap-4 w-full">
        <div className="flex flex-col gap-2 w-full justify-between">
          <div className="flex flex-row gap-2 w-full justify-between">
            <h1 className="text-2xl font-bold mb-4">Routes</h1>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline">Add Route</Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>{"Add Route"}</SheetTitle>
                </SheetHeader>
                <SheetDescription>
                  {"Add a new route to your list."}
                </SheetDescription>
                <div className="grid gap-2 p-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="from">From</Label>
                    <Input id="from" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="to">To</Label>
                    <Input id="to" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="numberofbuses">Number of Buses</Label>
                    <Input id="numberofbuses" type="number" />
                  </div>
                </div>
                <SheetFooter>
                  <SheetClose asChild>
                    <Button type="submit">{"Add Trip"}</Button>
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
          <div className="w-full ">
            <DataTable columns={columnsRoute} data={routes} />
          </div>
        </div>
      </div>
      <div className="mb-4 flex flex-col gap-2 w-full">
        <div className="flex flex-row gap-2 w-full justify-between">
          <h1 className="text-2xl font-bold mb-4">Trips</h1>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">Add Trip</Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>{"Add Trip"}</SheetTitle>
              </SheetHeader>
              <SheetDescription>
                {"Add a new trip to your list."}
              </SheetDescription>
              <div className="grid gap-2 p-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="from">From</Label>
                  <Input id="from" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="to">To</Label>
                  <Input id="to" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="numberofbuses">Number of Buses</Label>
                  <Input id="numberofbuses" type="number" />
                </div>
              </div>
              <SheetFooter>
                <SheetClose asChild>
                  <Button type="submit">{"Add Trip"}</Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
        <DataTable columns={columnsTrip} data={trips} />
      </div>
    </div>
  );
};

export default Trips;
