"use client";
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
import RegisterForm from "./imageinput";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { DataTableColumnHeader } from "./columnheader";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import HeatMap from "@uiw/react-heat-map";

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

export type DriverStatus = {
  id: string;
  name: string;
  status: "maintenance" | "working" | "stopped";
  phoneNumber: string | null;
  currentBus: string | null;
  hours: number;
  distance: number;
  email: string;
  route: string | null;
  absence: number;
};
export const columnsDriverStatus: ColumnDef<DriverStatus>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Driver ID" />
    ),
    cell: ({ row }) => (
      <div className="text-sm font-medium">{row.getValue("id")}</div>
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost">{row.getValue("name")}</Button>
        </SheetTrigger>
        <SheetContent
          side="bottom"
          className=" py-5 pl-24 pr-10 border-4 h-full"
        >
          <SheetHeader className="p-0"></SheetHeader>
          <SheetDescription></SheetDescription>
          <div className="flex flex-row justify-between h-full">
            <div className="flex flex-col gap-4 justify-center items-center">
              <Avatar className="w-60 h-60 ">
                <AvatarImage src="src\assets\OIP-2453187945.jpg" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold">{row.getValue("name")}</h1>
                <div className="flex flex-row gap-2">
                  <h2 className="text-lg font-semibold text-zinc-500">
                    Email:
                  </h2>
                  <h2 className="text-lg font-semibold ">
                    {row.getValue("email") ?? "—"}
                  </h2>
                </div>
                <div className="flex flex-row gap-2">
                  <h2 className="text-lg font-semibold text-zinc-500">
                    Phone:
                  </h2>
                  <h2 className="text-lg font-semibold ">
                    {row.getValue("phoneNumber") ?? "—"}
                  </h2>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4  w-2/3">
              <div className=" bg-neutral-100 flex flex-row gap-8 items-center rounded-lg border-0 p-4">
                <h1 className="text-2xl font-bold text-zinc-700">
                  Bus Assigned:
                </h1>
                <h1 className="text-2xl font-bold">
                  {row.getValue("currentBus") ?? "—"}
                </h1>
              </div>
              <div className=" bg-neutral-100 flex flex-row gap-8 items-center rounded-lg border-0 p-4">
                <h1 className="text-2xl font-bold text-zinc-700">
                  Current Route:
                </h1>
                <h1 className="text-2xl font-bold">
                  {row.getValue("route") ?? "—"}
                </h1>
              </div>
              <div className=" bg-neutral-100 flex flex-col  rounded-lg   p-4 mb-8">
                <div className="mb-8">
                  <h1 className="text-2xl font-bold text-zinc-700">
                    Contribution for this month
                  </h1>
                  <p className="text-sm text-zinc-500">
                    Track the drivers work for this month
                  </p>
                </div>
                <div className="flex flex-row justify-around">
                  <div className="flex flex-col items-center">
                    <h1 className="text-2xl font-bold text-zinc-700">Hours:</h1>
                    <h1 className="text-2xl font-bold">
                      {row.getValue("hours")
                        ? row.getValue("hours") + "h"
                        : "—"}
                    </h1>
                  </div>

                  <div className="flex flex-col items-center">
                    <h1 className="text-2xl font-bold text-zinc-700">
                      Distance Travelled:
                    </h1>
                    <h1 className="text-2xl font-bold">
                      {row.getValue("distance")
                        ? row.getValue("distance") + "km"
                        : "—"}
                    </h1>
                  </div>
                  <div className="flex flex-col items-center">
                    <h1 className="text-2xl font-bold text-zinc-700">
                      Absences:
                    </h1>
                    <h1 className="text-2xl font-bold text-red-600">
                      {row.getValue("absence") ?? "none"}
                    </h1>
                  </div>
                </div>
              </div>
              <HeatMap
                value={value}
                width={600}
                className="w-full h-full bg-zinc-50 rounded-lg"
                startDate={new Date("2016/01/01")}
              />
            </div>
          </div>
          <SheetFooter>
            <SheetClose asChild></SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as DriverStatus["status"];
      const colorClass =
        {
          maintenance: "bg-yellow-100 text-yellow-800",
          working: "bg-green-100 text-green-800",
          stopped: "bg-red-100 text-red-800",
        }[status] || "bg-gray-100 text-gray-800";

      return (
        <span
          className={`px-2 py-1 rounded text-xs font-semibold ${colorClass}`}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      );
    },
  },
  {
    accessorKey: "phoneNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone Number" />
    ),
    cell: ({ row }) => {
      const phone: number = row.getValue("phoneNumber");
      return <div className="text-sm text-gray-700">{phone ?? "—"}</div>;
    },
  },
  {
    accessorKey: "currentBus",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Current Bus" />
    ),
    cell: ({ row }) => {
      const bus: string = row.getValue("currentBus");
      return (
        <div className="text-sm">
          {bus ?? <span className="text-gray-400">Unassigned</span>}
        </div>
      );
    },
  },
  {
    accessorKey: "hours",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Hours Worked" />
    ),
    cell: ({ row }) => (
      <div className="text-sm font-medium">{row.getValue("hours")} hrs</div>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => {
      const email: string = row.getValue("email");
      return (
        <div className="text-sm">
          {email ?? <span className="text-gray-400">Unassigned</span>}
        </div>
      );
    },
  },
  {
    accessorKey: "route",
    header: () => <></>,
    cell: () => {
      <></>;
    },
  },
  {
    accessorKey: "distance",
    header: () => <></>,
    cell: () => {
      <></>;
    },
  },
  {
    accessorKey: "absence",
    header: () => <></>,
    cell: () => {
      <></>;
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const driver = row.original;

      return (
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" onClick={() => console.log(driver)}>
              Open
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Add a driver to you fleet</SheetTitle>
            </SheetHeader>
            <SheetDescription></SheetDescription>
            <div className="flex justify-center w-full items-center">
              <RegisterForm
                onImageSelect={(file) => {
                  console.log("Selected file:", file);
                  // maybe set to state, or upload, etc.
                }}
              />
            </div>
            <div className="grid gap-2 p-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={driver.name} />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="email">email</Label>
                <Input id="email" value={driver.email} />
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
      );
    },
  },
];

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type BusStatus = {
  id: string;
  status: "maintenance" | "working" | "stopped";
  driverName: number | null;
  capacity: number;
};

export const columnsBusStatus: ColumnDef<BusStatus>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Bus ID" />
    ),
    cell: ({ row }) => (
      <div className="text-sm text-gray-800">{row.getValue("id")}</div>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as BusStatus["status"];
      const statusColor =
        {
          maintenance: "bg-yellow-100 text-yellow-800",

          working: "bg-green-100 text-green-800",
          stopped: "bg-red-100 text-red-800",
        }[status] || "bg-gray-100 text-gray-800";

      return (
        <span
          className={`px-2 py-1 rounded text-xs font-semibold ${statusColor}`}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      );
    },
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    accessorKey: "driverName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Driver ID" />
    ),
    cell: ({ row }) => {
      const driverId = row.getValue("driverName");
      return (
        <div className="text-sm text-gray-700">
          {driverId !== null ? "driverId" : "—"}
        </div>
      );
    },
  },
  {
    accessorKey: "capacity",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Capacity" />
    ),
    cell: ({ row }) => (
      <div className="text-sm font-medium">{row.getValue("capacity")}</div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <div className="flex flex-row justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="flex flex-row justify-end">
              <Button
                variant="ghost"
                className="h-8 w-8 p-0 flex flex-row justify-end"
              >
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {row.getValue("driverName") ? (
                <>
                  <DropdownMenuItem className="text-blue-600">
                    Replace Driver
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-500">
                    Remove Driver
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem className="text-blue-600">
                  Add Driver
                </DropdownMenuItem>
              )}

              <DropdownMenuItem className="text-red-500">
                Remove Bus
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
export type BusStats = {
  driverName: string | null;
  phoneNumber: string | null;
  busId: string;
  currentRoute: string | null; // "A", "B", "C", etc.
  totalTrips: number;
  totalHours: number;
};

export const columnsBusStats: ColumnDef<BusStats>[] = [
  {
    accessorKey: "busId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Bus ID" />
    ),
    cell: ({ row }) => (
      <div className="text-sm font-medium">{row.getValue("busId")}</div>
    ),
  },
  {
    accessorKey: "driverName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Driver Name" />
    ),
    cell: ({ row }) => {
      const driver: string = row.getValue("driverName");
      return <div className="text-sm">{driver ?? "—"}</div>;
    },
  },
  {
    accessorKey: "phoneNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone Number" />
    ),
    cell: ({ row }) => {
      const phone: string = row.getValue("phoneNumber");
      return <div className="text-sm text-gray-700">{phone ?? "—"}</div>;
    },
  },
  {
    accessorKey: "currentRoute",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Current Route" />
    ),
    cell: ({ row }) => {
      const route: string = row.getValue("currentRoute");
      return (
        <div className="text-sm font-medium">
          {route ? (
            <div className="text-sm font-medium">{route}</div>
          ) : (
            <div className="text-sm text-gray-400">Unassigned</div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "totalTrips",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total Trips" />
    ),
    cell: ({ row }) => (
      <div className="text-sm font-semibold">{row.getValue("totalTrips")}</div>
    ),
  },
  {
    accessorKey: "totalHours",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total Hours" />
    ),
    cell: ({ row }) => {
      const hours = row.getValue("totalHours") as number;
      return <div className="text-sm">{hours} hrs</div>;
    },
  },
];
