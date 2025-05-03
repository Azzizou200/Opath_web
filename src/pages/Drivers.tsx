import React from "react";
import { DataTable } from "@/components/ui/data-table";
import { columnsDriverStatus, DriverStatus } from "@/components/columns";
import { useEffect, useState } from "react";
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
import Regesterform from "../components/imageinput";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
const Profile: React.FC = () => {
  const [data, setData] = useState<DriverStatus[]>([]);
  useEffect(() => {
    async function fetchData02() {
      const { data: drivers, error: driversError } = await supabase
        .from("drivers")
        .select(
          "id,full_name,status,phone,bus_id,total_hours,email,total_trips,days_missed"
        );

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

      const driverStatus: DriverStatus[] = drivers.map((driver) => {
        const bus = buses.find((bus) => driver.id === bus.driver_id);
        return {
          id: driver.id,
          name: driver.full_name,
          status: driver.status,
          phoneNumber: driver.phone,
          currentBus: bus?.id || null,
          hours: driver.total_hours,
          email: driver.email,

          distance: driver.total_trips,
          absence: driver.days_missed,
        };
      });

      setData(driverStatus);
    }

    fetchData02();
  }, []);
  return (
    <div className="p-6">
      <div className="mb-4 flex justify-between">
        <h1 className="text-2xl font-bold mb-4">Driver Status</h1>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">Open</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Add a driver to you fleet</SheetTitle>
            </SheetHeader>
            <SheetDescription></SheetDescription>
            <div className="flex justify-center w-full items-center">
              <Regesterform
                onImageSelect={(file) => {
                  console.log("Selected file:", file);
                  // maybe set to state, or upload, etc.
                }}
              />
            </div>
            <div className="grid gap-2 p-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input id="confirm-password" />
              </div>
            </div>

            <SheetFooter>
              <SheetClose asChild>
                <Button type="submit">Save changes</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
      <DataTable columns={columnsDriverStatus} data={data}></DataTable>
    </div>
  );
};

export default Profile;
