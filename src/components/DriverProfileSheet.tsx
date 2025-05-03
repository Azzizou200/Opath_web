import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import HeatMap from "@uiw/react-heat-map";
import { Phone, Mail } from "lucide-react";

import { Button } from "./ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "./ui/sheet";
import { toast } from "sonner";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
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
  useEffect(() => {
    async function fetchData() {
      const { data: drivers, error } = await supabase
        .from("drivers")
        .select("*")
        .eq("id", id);

      if (error) {
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
  }, [id]);
  console.log(driverdata);
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost">{driverdata?.name}</Button>
      </SheetTrigger>
      <SheetContent side="bottom" className=" pt-5 pl-24 pr-10 border-4 h-full">
        <SheetHeader className="p-0">
          <SheetTitle className="hidden">{driverdata?.name}</SheetTitle>
        </SheetHeader>
        <SheetDescription></SheetDescription>
        <div className="flex flex-row justify-between h-full">
          <div className="flex flex-col gap-4 justify-center items-center">
            <Avatar className="w-72 h-72 rounded-full">
              <AvatarImage
                className="rounded-full"
                src={driverdata?.image ?? "src/assets/OIP-2453187945.jpg"}
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold mb-4">
                {driverdata?.name ?? "—"}
              </h1>
              <div className="flex flex-row gap-2 items-center">
                <Phone color="#52525b"></Phone>
                {driverdata?.phoneNumber ? (
                  <h2
                    onClick={() =>
                      driverdata.phoneNumber &&
                      copyToClipboard(driverdata.phoneNumber)
                    }
                    className="cursor-pointer text-lg font-semibold text-zinc-500 hover:underline"
                  >
                    {driverdata.phoneNumber}
                  </h2>
                ) : (
                  "--"
                )}
              </div>
              <div className="flex flex-row gap-2 items-center">
                <Mail color="#52525b"></Mail>
                {driverdata?.email ? (
                  <h2
                    onClick={() =>
                      driverdata.email && copyToClipboard(driverdata.email)
                    }
                    className="cursor-pointer text-lg font-semibold text-zinc-500 hover:underline"
                  >
                    {driverdata.email}
                  </h2>
                ) : (
                  "--"
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4 justify-around w-2/3">
            <div className=" bg-neutral-100 flex flex-row gap-8 items-center rounded-lg border-0 p-4">
              <h1 className="text-2xl font-bold text-zinc-700">
                Bus Assigned:
              </h1>
              <h1 className="text-2xl font-bold">
                {driverdata?.currentBus ?? "—"}
              </h1>
            </div>

            <div className=" bg-neutral-100 flex flex-col  rounded-lg   p-4 ">
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
                    {driverdata?.hours ? driverdata.hours + "h" : "—"}
                  </h1>
                </div>

                <div className="flex flex-col items-center">
                  <h1 className="text-2xl font-bold text-zinc-700">
                    Distance Travelled:
                  </h1>
                  <h1 className="text-2xl font-bold">
                    {driverdata?.trips ? driverdata.trips + " trips" : "—"}
                  </h1>
                </div>
                <div className="flex flex-col items-center">
                  <h1 className="text-2xl font-bold text-zinc-700">
                    Absences:
                  </h1>
                  <h1 className="text-2xl font-bold text-red-600">
                    {driverdata?.absences ?? "none"}
                  </h1>
                </div>
              </div>
            </div>
            <div className="bg-zinc-50 rounded-lg border-0 ">
              <HeatMap
                value={value}
                width={600}
                rectSize={20}
                legendCellSize={20}
                className="w-full h-full mb-16 "
                startDate={new Date("2016/01/01")}
              />
            </div>
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild></SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export default DriverProfileSheet;
