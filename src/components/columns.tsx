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

import DriverProfileSheet from "./DriverProfileSheet";

import { DriverEditForm } from "./DriverEditForm";

// Define table options meta type
declare module "@tanstack/react-table" {
  interface TableMeta {
    busActions?: {
      onDeleteBus?: (busId: string) => void;
      onAddDriver?: (busId: string) => void;
      onReplaceDriver?: (busId: string) => void;
      onRemoveDriver?: (busId: string) => void;
    };
    onRefresh?: () => void;
  }
}

export type Trip = {
  id: number;
  route: string;
  bus: string;
  driver: string;
  departure: string;
  arrival: string;
};
export const columnsTrip: ColumnDef<Trip>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Trip ID" />
    ),
    cell: ({ row }) => (
      <div className="text-sm font-medium">{row.getValue("id")}</div>
    ),
  },
  {
    accessorKey: "route",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Route" />
    ),
    cell: ({ row }) => (
      <div className="text-sm font-medium">{row.getValue("route")}</div>
    ),
  },
  {
    accessorKey: "bus",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Bus" />
    ),
    cell: ({ row }) => (
      <div className="text-sm font-medium">{row.getValue("bus")}</div>
    ),
  },
  {
    accessorKey: "driver",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Driver" />
    ),
    cell: ({ row }) => (
      <div className="text-sm font-medium">{row.getValue("driver")}</div>
    ),
  },
  {
    accessorKey: "departure",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Departure" />
    ),
    cell: ({ row }) => (
      <div className="text-sm font-medium">{row.getValue("departure")}</div>
    ),
  },
  {
    accessorKey: "arrival",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Arrival" />
    ),
    cell: ({ row }) => (
      <div className="text-sm font-medium">{row.getValue("arrival")}</div>
    ),
  },
];
export type route = {
  id: number;
  from: string;
  to: string;
  numberofbuses: number;
  route_name: string;
};
export const columnsRoute: ColumnDef<route>[] = [
  {
    accessorKey: "id",
    header: () => <></>,
    cell: () => <></>,
  },
  {
    accessorKey: "route_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Route Name" />
    ),
    cell: ({ row }) => (
      <div className="text-sm font-medium">{row.getValue("route_name")}</div>
    ),
  },
  {
    accessorKey: "from",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="From" />
    ),
    cell: ({ row }) => (
      <div className="text-sm font-medium">{row.getValue("from")}</div>
    ),
  },
  {
    accessorKey: "to",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="To" />
    ),
    cell: ({ row }) => (
      <div className="text-sm font-medium">{row.getValue("to")}</div>
    ),
  },
  {
    accessorKey: "numberofbuses",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Number of Trips" />
    ),
    cell: ({ row }) => (
      <div className="text-sm font-medium">{row.getValue("numberofbuses")}</div>
    ),
  },
  {
    id: "actions",
    cell: () => (
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
            <DropdownMenuItem className="text-blue-600">Edit</DropdownMenuItem>
            <DropdownMenuItem className="text-red-500">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
];
export type DriverStatus = {
  id: string;
  name: string;
  status: "maintenance" | "working" | "available";
  phoneNumber: string | null;
  currentBus: string | null;
  hours: number;
  distance: number;
  salary: number;
  email: string;
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
    cell: ({ row }) => <DriverProfileSheet id={row.getValue("id") as string} />,
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
          available: "bg-blue-100 text-blue-800",
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
      const phone: string = row.getValue("phoneNumber") || "N/A";
      return <div className="text-sm text-gray-700">{phone}</div>;
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
    accessorKey: "salary",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Salary" />
    ),
    cell: ({ row }) => {
      const salary: string = row.getValue("salary") || "N/A";
      return <div className="text-sm font-medium">{salary}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const driver = row.original;
      const onRefresh = table?.options?.meta?.onRefresh;
      return (
        <div className="flex items-center gap-2">
          <DriverEditForm driver={driver} onUpdate={onRefresh} />
        </div>
      );
    },
  },
];

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type BusStatus = {
  id: string;
  status: "maintenance" | "available" | "stopped";
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

          available: "bg-green-100 text-green-800",
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
      <DataTableColumnHeader column={column} title="Driver" />
    ),
    cell: ({ row }) => {
      const driverName = row.getValue("driverName") as string | number | null;
      return (
        <div className="text-sm text-gray-700">
          {driverName ? (
            <div className="text-sm font-medium">{String(driverName)}</div>
          ) : (
            <div className="text-sm text-gray-400">Unassigned</div>
          )}
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
    cell: ({ row, table }) => {
      const bus = row.original;
      const busActions = table?.options?.meta?.busActions;

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
              {bus.driverName ? (
                <>
                  <DropdownMenuItem
                    className="text-blue-600"
                    onClick={() => busActions?.onReplaceDriver?.(bus.id)}
                  >
                    Replace Driver
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-500"
                    onClick={() => busActions?.onRemoveDriver?.(bus.id)}
                  >
                    Remove Driver
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem
                  className="text-blue-600"
                  onClick={() => busActions?.onAddDriver?.(bus.id)}
                >
                  Add Driver
                </DropdownMenuItem>
              )}

              <DropdownMenuItem
                className="text-red-500"
                onClick={() => busActions?.onDeleteBus?.(bus.id)}
              >
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
  id?: string;
  status?: string;
  capacity?: number;
  driverName: string | null;
  phoneNumber: string | null;
  busId: string;
  currentRoute?: string | null; // "A", "B", "C", etc.
  totalTrips?: number;
  totalHours?: number;
  totalMileage?: number;
  fuelEfficiency?: number;
  layoutType?: string;
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
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const statusColor =
        {
          maintenance: "bg-yellow-100 text-yellow-800",
          available: "bg-green-100 text-green-800",
          stopped: "bg-red-100 text-red-800",
        }[status] || "bg-gray-100 text-gray-800";

      return (
        <span
          className={`px-2 py-1 rounded text-xs font-semibold ${statusColor}`}
        >
          {status ? status.charAt(0).toUpperCase() + status.slice(1) : "—"}
        </span>
      );
    },
  },
  {
    accessorKey: "capacity",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Capacity" />
    ),
    cell: ({ row }) => {
      const capacity = row.getValue("capacity") as number;
      return <div className="text-sm font-medium">{capacity ?? "—"}</div>;
    },
  },
  {
    accessorKey: "totalTrips",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total Trips" />
    ),
    cell: ({ row }) => {
      const trips = row.getValue("totalTrips") as number;
      return <div className="text-sm font-semibold">{trips ?? "—"}</div>;
    },
  },
  {
    accessorKey: "totalHours",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total Hours" />
    ),
    cell: ({ row }) => {
      const hours = row.getValue("totalHours") as number;
      return <div className="text-sm">{hours ? `${hours} hrs` : "—"}</div>;
    },
  },
  {
    accessorKey: "totalMileage",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total Mileage" />
    ),
    cell: ({ row }) => {
      const mileage = row.getValue("totalMileage") as number;
      return <div className="text-sm font-medium">{mileage ?? "—"} km</div>;
    },
  },
  {
    accessorKey: "fuelEfficiency",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fuel Efficiency" />
    ),
    cell: ({ row }) => {
      const efficiency = row.getValue("fuelEfficiency") as number;
      return (
        <div className="text-sm font-medium">{efficiency ?? "—"} km/L</div>
      );
    },
  },
  {
    accessorKey: "layoutType",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Layout Type" />
    ),
    cell: ({ row }) => {
      const layout = row.getValue("layoutType") as string;
      return <div className="text-sm font-medium">{layout ?? "—"}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const bus = row.original;
      const busActions = table?.options?.meta?.busActions;

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
              {bus.driverName ? (
                <>
                  <DropdownMenuItem
                    className="text-blue-600"
                    onClick={() => busActions?.onReplaceDriver?.(bus.busId)}
                  >
                    Replace Driver
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-500"
                    onClick={() => busActions?.onRemoveDriver?.(bus.busId)}
                  >
                    Remove Driver
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem
                  className="text-blue-600"
                  onClick={() => busActions?.onAddDriver?.(bus.busId)}
                >
                  Add Driver
                </DropdownMenuItem>
              )}

              <DropdownMenuItem
                className="text-red-500"
                onClick={() => busActions?.onDeleteBus?.(bus.busId)}
              >
                Remove Bus
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
