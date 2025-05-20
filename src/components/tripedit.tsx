import React, { useState } from "react";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "./ui/dialog";
import {
  DialogClose,
  DialogDescription,
  DialogTitle,
} from "@radix-ui/react-dialog";
import { toast } from "sonner";

interface TripEditProps {
  id: string;
}

function TripEdit({ id }: TripEditProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteTrip = async (id: string) => {
    setIsDeleting(true);
    try {
      const { error } = await supabase.from("trips").delete().eq("id", id);
      
      if (error) {
        throw error;
      }
      
      toast.success("Trip deleted successfully");
      setIsOpen(false);
      // Refresh the trips list after deletion
      window.location.reload();
    } catch (error) {
      console.error("Error deleting trip:", error);
      toast.error("Failed to delete trip. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-row justify-end">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant="destructive"
            size="sm"
            className="flex items-center gap-2 hover:bg-red-600 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Delete Trip
            </DialogTitle>
            <DialogDescription className="text-gray-500 mt-2">
              Are you sure you want to delete this trip? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6 gap-2">
            <DialogClose asChild>
              <Button variant="outline" disabled={isDeleting}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              variant="destructive"
              className="flex items-center gap-2"
              onClick={() => deleteTrip(id)}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  Delete Trip
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default TripEdit;
