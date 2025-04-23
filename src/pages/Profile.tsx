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
const Profile: React.FC = () => {
  const [data, setData] = useState<DriverStatus[]>([]);
  useEffect(() => {
    async function fetchData() {
      const result: DriverStatus[] = [
        {
          id: "DRV001",
          name: "Liam Johnson",
          status: "working",
          phoneNumber: "555-1001",
          currentBus: "BUS001",
          hours: 120,
          email: "test",
          route: "A",
          distance: 10,
          absence: 20,
        },
        {
          id: "DRV002",
          name: "Emma Wilson",
          status: "maintenance",
          phoneNumber: "555-1002",
          currentBus: null,
          hours: 85,
          email: "test",
          route: "B",

          distance: 100,
          absence: 20,
        },
        {
          id: "DRV003",
          name: "Noah Martinez",
          status: "stopped",
          phoneNumber: null,
          currentBus: null,
          hours: 150,
          email: "test",
          route: "V",
          distance: 100,
          absence: 20,
        },
        {
          id: "DRV004",
          name: "Olivia Garcia",
          status: "working",
          phoneNumber: "555-1004",
          currentBus: "BUS005",
          hours: 200,
          email: "test",
          route: "C",
          distance: 100,
          absence: 20,
        },
        {
          id: "DRV005",
          name: "William Lee",
          status: "maintenance",
          phoneNumber: "555-1005",
          currentBus: "BUS008",
          hours: 75,
          email: "test",
          route: "A",
          distance: 100,
          absence: 20,
        },
        {
          id: "DRV006",
          name: "Sophia Davis",
          status: "stopped",
          phoneNumber: null,
          currentBus: null,
          hours: 60,
          email: "test",
          route: "B",
          distance: 100,
          absence: 20,
        },
        {
          id: "DRV007",
          name: "James Anderson",
          status: "working",
          phoneNumber: "555-1007",
          currentBus: "BUS003",
          hours: 180,
          email: "test",
          route: "V",
          distance: 100,
          absence: 20,
        },
        {
          id: "DRV008",
          name: "Isabella Thomas",
          status: "maintenance",
          phoneNumber: "555-1008",
          currentBus: null,
          hours: 90,
          email: "test",
          route: "C",
          distance: 100,
          absence: 20,
        },
        {
          id: "DRV009",
          name: "Benjamin Taylor",
          status: "working",
          phoneNumber: "555-1009",
          currentBus: "BUS002",
          hours: 110,
          email: "test",
          route: "A",
          distance: 100,
          absence: 20,
        },
        {
          id: "DRV010",
          name: "Mia Moore",
          status: "stopped",
          phoneNumber: null,
          currentBus: null,
          hours: 70,
          email: "test",
          route: "B",
          distance: 100,
          absence: 20,
        },
        {
          id: "DRV011",
          name: "Elijah Jackson",
          status: "working",
          phoneNumber: "555-1011",
          currentBus: "BUS009",
          hours: 165,
          email: "test",
          route: "V",
          distance: 100,
          absence: 20,
        },
        {
          id: "DRV012",
          name: "Ava White",
          status: "maintenance",
          phoneNumber: "555-1012",
          currentBus: "BUS007",
          hours: 95,
          email: "test",
          route: "C",
          distance: 100,
          absence: 20,
        },
        {
          id: "DRV013",
          name: "Lucas Harris",
          status: "stopped",
          phoneNumber: null,
          currentBus: null,
          hours: 45,
          email: "test",
          route: "A",
          distance: 100,
          absence: 20,
        },
        {
          id: "DRV014",
          name: "Charlotte Martin",
          status: "working",
          phoneNumber: "555-1014",
          currentBus: "BUS004",
          hours: 140,
          email: "test",
          route: "B",
          distance: 100,
          absence: 20,
        },
        {
          id: "DRV015",
          name: "Henry Thompson",
          status: "maintenance",
          phoneNumber: "555-1015",
          currentBus: "BUS006",
          hours: 60,
          email: "test",
          route: "V",
          distance: 100,
          absence: 20,
        },
        {
          id: "DRV016",
          name: "Amelia Hall",
          status: "working",
          phoneNumber: "555-1016",
          currentBus: "BUS010",
          hours: 210,
          email: "test",
          route: "C",
          distance: 100,
          absence: 20,
        },
        {
          id: "DRV017",
          name: "Alexander Allen",
          status: "stopped",
          phoneNumber: null,
          currentBus: null,
          hours: 50,
          email: "test",
          route: "A",
          distance: 100,
          absence: 20,
        },
        {
          id: "DRV018",
          name: "Harper Young",
          status: "working",
          phoneNumber: "555-1018",
          currentBus: "BUS012",
          hours: 130,
          email: "test",
          route: "B",
          distance: 100,
          absence: 20,
        },
        {
          id: "DRV019",
          name: "Daniel King",
          status: "maintenance",
          phoneNumber: "555-1019",
          currentBus: "BUS011",
          hours: 100,
          email: "test",
          route: "V",
          distance: 100,
          absence: 20,
        },
        {
          id: "DRV020",
          name: "Evelyn Scott",
          status: "working",
          phoneNumber: "555-1020",
          currentBus: "BUS013",
          hours: 155,
          email: "test",
          route: "C",
          distance: 100,
          absence: 20,
        },
      ];

      setData(result);
    }
    fetchData();
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
