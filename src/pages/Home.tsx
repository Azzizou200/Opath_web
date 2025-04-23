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
import { DiamondPlus } from "lucide-react";
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

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function DemoPage() {
  const [data, setData] = useState<BusStatus[]>([]);
  const [data02, setData02] = useState<BusStats[]>([]);

  useEffect(() => {
    async function fetchData() {
      const result: BusStatus[] = [
        {
          id: "BUS-001",
          status: "maintenance",
          driverName: 101,
          capacity: 50,
        },
        {
          id: "BUS-002",
          status: "stopped",
          driverName: 102,
          capacity: 45,
        },
        {
          id: "BUS-003",
          status: "working",
          driverName: 103,
          capacity: 60,
        },
        {
          id: "BUS-004",
          status: "stopped",
          driverName: null,
          capacity: 40,
        },
        {
          id: "BUS-005",
          status: "working",
          driverName: 104,
          capacity: 55,
        },
        // ...
      ];
      setData(result);
      const result02: BusStats[] = [
        {
          driverName: "John Doe",
          phoneNumber: "555-1234",
          busId: "BUS001",
          currentRoute: "A",
          totalTrips: 120,
          totalHours: 340,
        },
        {
          driverName: "Alice Smith",
          phoneNumber: "555-5678",
          busId: "BUS002",
          currentRoute: "B",
          totalTrips: 98,
          totalHours: 280,
        },
        {
          driverName: null,
          phoneNumber: null,
          busId: "BUS003",
          currentRoute: null,
          totalTrips: 75,
          totalHours: 190,
        },
        {
          driverName: "Michael Brown",
          phoneNumber: null,
          busId: "BUS004",
          currentRoute: "C",
          totalTrips: 134,
          totalHours: 400,
        },
        {
          driverName: "Sophie Lee",
          phoneNumber: "555-9999",
          busId: "BUS005",
          currentRoute: null,
          totalTrips: 65,
          totalHours: 150,
        },
      ];
      setData02(result02);
    }

    fetchData();
  }, []);
  const [selected, setSelected] = useState(1);

  return (
    <div className="container mx-auto py-5 px-10">
      <div className="flex flex-row justify-between mb-4 w-auto  ">
        <h1 className="text-3xl font-bold mb-5">Bus Management</h1>
        <Sheet>
          <SheetTrigger asChild>
            <Button className="">
              <p>Add Bus</p>
              <DiamondPlus />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Are you absolutely sure?</SheetTitle>
              <SheetDescription></SheetDescription>
            </SheetHeader>
            <div className="space-y-4 p-4 ">
              <div className="flex flex-row items-center gap-4 justify-between">
                <Label htmlFor="name" className="text-right font-bold ">
                  ID
                </Label>
                <Input id="busid" placeholder="placeholder" className="w-3/5" />
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
                  placeholder="Placeholder"
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
                      {Array.from({ length: 4 }).map((_, index) => (
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
                                <CardContent className="flex aspect-square items-center justify-center p-6">
                                  <span className="text-3xl font-semibold select-none">
                                    {index + 1}
                                  </span>
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
              <Button className="bg-green-500 cursor-pointer">Confirm</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      <h1 className="text-2xl font-bold mb-2">Buses Status</h1>

      <DataTable columns={columnsBusStatus} data={data} />
      <h1 className="text-2xl font-bold mb-2 mt-10">Buses Current Stats</h1>

      <DataTable columns={columnsBusStats} data={data02} />
    </div>
  );
}
