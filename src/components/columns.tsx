"use client";

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
      const driver = row.getValue("driverName");
      return <div className="text-sm">{driver ?? "—"}</div>;
    },
  },
  {
    accessorKey: "phoneNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone Number" />
    ),
    cell: ({ row }) => {
      const phone = row.getValue("phoneNumber");
      return <div className="text-sm text-gray-700">{phone ?? "—"}</div>;
    },
  },
  {
    accessorKey: "currentRoute",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Current Route" />
    ),
    cell: ({ row }) => {
      const route = row.getValue("currentRoute");
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
