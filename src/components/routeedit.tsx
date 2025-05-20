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

interface RouteeditProps {
  id: string;
}

function Routeedit({ id }: RouteeditProps) {
  const [hasTrips, setTrips] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const checkTrips = async (id: string) => {
    setIsChecking(true);
    try {
      const { data: trips, error } = await supabase
        .from("trips")
        .select("*")
        .eq("route_id", id);

      if (error) {
        throw error;
      }

      return (trips?.length || 0) > 0;
    } catch (error) {
      console.error("Error checking trips:", error);
      toast.error("Error checking for trips. Please try again.");
      return false;
    } finally {
      setIsChecking(false);
    }
  };

  const deleteRoute = async (id: string) => {
    setIsDeleting(true);
    try {
      const { error } = await supabase.from("routes").delete().eq("id", id);
      if (error) {
        throw error;
      }
      toast.success("Route deleted successfully");
      setIsOpen(false);
      window.location.reload();
    } catch (error) {
      console.error("Error deleting route:", error);
      toast.error("Failed to delete route. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteClick = async () => {
    const hasActiveTrips = await checkTrips(id);
    setTrips(hasActiveTrips);
    setIsOpen(true);
  };

  return (
    <div className="flex flex-row justify-end">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant="destructive"
            size="sm"
            className="flex items-center gap-2 hover:bg-red-600 transition-colors"
            onClick={handleDeleteClick}
            disabled={isChecking}
          >
            {isChecking ? (
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          {hasTrips ? (
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">
                Delete Route
              </DialogTitle>
              <DialogDescription className="text-gray-500 mt-2">
                This route has trips, please delete the trips first
              </DialogDescription>
              <DialogClose
                asChild
                className="flex justify-end w-fit self-end mt-4"
              >
                <Button variant="outline" disabled={isDeleting}>
                  Cancel
                </Button>
              </DialogClose>
            </DialogHeader>
          ) : (
            <div>
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold">
                  Delete Route
                </DialogTitle>
                <DialogDescription className="text-gray-500 mt-2">
                  Are you sure you want to delete this route? This action cannot
                  be undone.
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
                  onClick={() => deleteRoute(id)}
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
                      Delete Route
                    </>
                  )}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Routeedit;
