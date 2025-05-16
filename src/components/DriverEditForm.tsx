import { useState } from "react";
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
import RegisterForm from "./imageinput";
import { supabase } from "@/lib/supabase";
import { DriverStatus } from "./columns";

interface DriverEditFormProps {
  driver: DriverStatus;
  onUpdate?: () => void;
}

export const DriverEditForm: React.FC<DriverEditFormProps> = ({
  driver,
  onUpdate,
}) => {
  const [editedDriver, setEditedDriver] = useState<DriverStatus>(driver);

  const handleUpdate = async () => {
    try {
      const { error } = await supabase
        .from("drivers")
        .update({
          full_name: editedDriver.name,
          phone: editedDriver.phoneNumber,
          salary: editedDriver.salary,
        })
        .eq("id", editedDriver.id);

      if (error) throw error;
      alert("Driver information updated successfully!");
      onUpdate?.(); // Call the onUpdate callback if provided
    } catch (error) {
      console.error("Error updating driver:", error);
      alert("Failed to update driver information. Please try again.");
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Edit</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Driver Information</SheetTitle>
        </SheetHeader>
        <SheetDescription>
          Update the driver's information below
        </SheetDescription>
        <div className="flex justify-center w-full items-center">
          <RegisterForm
            onImageSelect={(file: File) => {
              console.log("Selected file:", file);
            }}
          />
        </div>
        <div className="grid gap-2 p-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={editedDriver.name}
              onChange={(e) =>
                setEditedDriver({ ...editedDriver, name: e.target.value })
              }
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={editedDriver.phoneNumber || ""}
              onChange={(e) =>
                setEditedDriver({
                  ...editedDriver,
                  phoneNumber: e.target.value,
                })
              }
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="salary">Salary</Label>
            <Input
              id="salary"
              type="number"
              value={editedDriver.salary}
              onChange={(e) =>
                setEditedDriver({
                  ...editedDriver,
                  salary: Number(e.target.value),
                })
              }
            />
          </div>
        </div>

        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit" onClick={handleUpdate}>
              Save changes
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
