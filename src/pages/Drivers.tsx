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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import Regesterform from "../components/imageinput";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { supabase, auth } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  User as UserIcon,
  Clock,
  Calendar,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

// Helper function to convert base64 to Uint8Array

const Profile: React.FC = () => {
  const [data, setData] = useState<DriverStatus[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [salary, setSalary] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [showActivationModal, setShowActivationModal] = useState(false);
  const [activationCode, setActivationCode] = useState("");

  const generateActivationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleConfirm = async () => {
    if (!fullName || !phoneNumber) {
      toast.error("Please fill all required fields");
      return;
    }

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user) {
      toast.error("Authentication error. Please login again.");
      return;
    }

    const agentId = userData.user.id;
    let driverId = null;
    let imageUrl = null;

    try {
      // Generate activation code
      const code = generateActivationCode();
      setActivationCode(code);

      const { data: driverData, error: driverError } = await supabase
        .from("drivers")
        .insert([
          {
            full_name: fullName,
            phone: phoneNumber,
            profile_picture: null,
            agent_id: agentId,
            salary: salary,
            activation_code: code,
            is_active: false,
          },
        ])
        .select();

      if (driverError) throw driverError;

      // Get the id of the driver we just created
      driverId = driverData[0].id;

      // If there's an image, upload it to Supabase storage
      if (image) {
        const imageName = `driver_${driverId}_${Date.now()}.jpg`;

        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(imageName, image, {
            contentType: image.type,
          });

        if (uploadError) throw uploadError;

        const { data: imageData } = supabase.storage
          .from("avatars")
          .getPublicUrl(imageName);

        imageUrl = imageData.publicUrl;

        const { error: updateError } = await supabase
          .from("drivers")
          .update({ profile_picture: imageUrl })
          .eq("id", driverId);

        if (updateError) throw updateError;
      }

      // Show the activation code modal
      setShowActivationModal(true);

      // Reset form
      setFullName("");
      setPhoneNumber("");
      setSalary("");
      setImage(null);

      toast.success("Driver added successfully!");
    } catch (error) {
      console.error("Error adding driver:", error);
      toast.error("Failed to add driver. Please try again.");
    }
  };

  // Move fetchData02 outside useEffect
  const fetchData02 = async () => {
    setIsLoading(true);

    // Get drivers for the current agent
    const agentId = currentUser?.id;

    // Check if agentId exists
    if (!agentId) {
      setIsLoading(false);
      return null;
    }

    const { data: drivers, error: driversError } = await supabase
      .from("drivers")
      .select(
        "id,full_name,status,phone,salary,bus_id,total_hours,email,total_trips,days_missed"
      )
      .eq("agent_id", agentId);

    if (driversError || !drivers) {
      console.error("Error fetching drivers:", driversError);
      setIsLoading(false);
      return null;
    }

    const { data: buses, error: busesError } = await supabase
      .from("buses")
      .select("id,status,capacity,driver_id")
      .eq("agent_id", agentId);

    if (busesError || !buses) {
      console.error("Error fetching buses:", busesError);
      setIsLoading(false);
      return null;
    }

    const driverStatus: DriverStatus[] = drivers.map((driver) => {
      const bus = buses.find((bus) => driver.id === bus.driver_id);
      return {
        id: driver.id,
        name: driver.full_name,
        status: driver.status,
        phoneNumber: driver.phone,
        salary: driver.salary,
        currentBus: bus?.id || null,
        hours: driver.total_hours,
        email: driver.email,
        distance: driver.total_trips,
        absence: driver.days_missed,
      };
    });

    setData(driverStatus);
    setIsLoading(false);
  };

  useEffect(() => {
    // Get the current logged-in user
    async function getCurrentUser() {
      const { data } = await auth.getUser();
      setCurrentUser(data?.user || null);
    }

    getCurrentUser();
  }, []);

  useEffect(() => {
    // Only fetch data when we have the current user
    if (!currentUser) return;
    fetchData02();
  }, [currentUser]);

  // Calculate statistics from driver data
  const getDriverStats = () => {
    if (data.length === 0)
      return {
        totalDrivers: 0,
        availableDrivers: 0,
        workingDrivers: 0,
        maintenanceDrivers: 0,
        totalHours: 0,
        avgHours: 0,
        assignedDrivers: 0,
        unassignedDrivers: 0,
        totalAbsences: 0,
      };

    const availableDrivers = data.filter(
      (d) => d.status === "available"
    ).length;
    const workingDrivers = data.filter((d) => d.status === "working").length;
    const maintenanceDrivers = data.filter(
      (d) => d.status === "maintenance"
    ).length;
    const assignedDrivers = data.filter((d) => d.currentBus !== null).length;
    const totalHours = data.reduce((sum, d) => sum + (d.hours || 0), 0);
    const totalAbsences = data.reduce((sum, d) => sum + (d.absence || 0), 0);

    return {
      totalDrivers: data.length,
      availableDrivers,
      workingDrivers,
      maintenanceDrivers,
      totalHours,
      avgHours: data.length
        ? Math.round((totalHours / data.length) * 10) / 10
        : 0,
      assignedDrivers,
      unassignedDrivers: data.length - assignedDrivers,
      totalAbsences,
    };
  };

  const driverStats = getDriverStats();

  return (
    <div className="p-6 h-full overflow-auto">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Driver Management</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Monitor and manage your driver team and performance
          </p>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button>Add Driver</Button>
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
                  setImage(file);
                }}
              />
            </div>
            <div className="grid gap-2 p-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="salary">Salary</Label>
                <Input
                  id="salary"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  type="number"
                />
              </div>
            </div>

            <SheetFooter>
              <SheetClose asChild>
                <Button type="submit" onClick={handleConfirm}>
                  Save changes
                </Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      {/* Dashboard Statistics Section */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Drivers</CardTitle>
            <UserIcon className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{driverStats.totalDrivers}</div>
            <p className="text-xs text-gray-500 mt-1">
              {driverStats.assignedDrivers} assigned ·{" "}
              {driverStats.unassignedDrivers} unassigned
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Driver Status</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 flex-wrap">
              <Badge
                variant="outline"
                className="bg-green-100 text-green-800 hover:bg-green-100"
              >
                {driverStats.availableDrivers} Available
              </Badge>
              <Badge
                variant="outline"
                className="bg-blue-100 text-blue-800 hover:bg-blue-100"
              >
                {driverStats.workingDrivers} Working
              </Badge>
              <Badge
                variant="outline"
                className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
              >
                {driverStats.maintenanceDrivers} Maintenance
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Work Hours</CardTitle>
            <Clock className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{driverStats.totalHours}</div>
            <p className="text-xs text-gray-500 mt-1">
              {driverStats.avgHours} hours per driver on average
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Absences</CardTitle>
            <AlertCircle className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {driverStats.totalAbsences}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {driverStats.totalAbsences > 0
                ? `${(
                    driverStats.totalAbsences / driverStats.totalDrivers
                  ).toFixed(1)} absences per driver`
                : "No absences recorded"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Top drivers section */}
      {!isLoading && data.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Driver Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Top Drivers by Hours</CardTitle>
                <CardDescription>
                  Drivers with the most work hours
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[...data]
                    .sort((a, b) => (b.hours || 0) - (a.hours || 0))
                    .slice(0, 3)
                    .map((driver, index) => (
                      <div
                        key={driver.id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-500">
                            {index + 1}
                          </span>
                          <div>
                            <p className="font-medium">{driver.name}</p>
                            <p className="text-sm text-gray-500">
                              {driver.currentBus
                                ? `Assigned to ${driver.currentBus}`
                                : "Unassigned"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span className="font-semibold">
                            {driver.hours || 0} hrs
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Most Frequent Absences
                </CardTitle>
                <CardDescription>
                  Drivers with high absence rates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[...data]
                    .sort((a, b) => (b.absence || 0) - (a.absence || 0))
                    .slice(0, 3)
                    .map((driver, index) => (
                      <div
                        key={driver.id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-500">
                            {index + 1}
                          </span>
                          <div>
                            <p className="font-medium">{driver.name}</p>
                            <p className="text-sm text-gray-500">
                              {driver.currentBus
                                ? `Assigned to ${driver.currentBus}`
                                : "Unassigned"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className="font-semibold">
                            {driver.absence || 0} days
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      <h2 className="text-xl font-semibold mb-4">Driver Status</h2>
      <DataTable
        columns={columnsDriverStatus}
        data={data}
        isLoading={isLoading}
        meta={{
          onRefresh: () => {
            // Only fetch data when we have the current user
            if (!currentUser) return;
            fetchData02();
          },
        }}
      />

      {/* Activation Code Modal */}
      <Dialog open={showActivationModal} onOpenChange={setShowActivationModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Driver Added Successfully</DialogTitle>
            <DialogDescription>
              Please provide this activation code to the driver. They will need
              it to activate their account.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="text-center">
              <div className="text-4xl font-bold tracking-wider bg-gray-100 p-4 rounded-lg">
                {activationCode}
              </div>
              <p className="text-sm text-gray-500 mt-2">
                This code is required for the driver to activate their account
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowActivationModal(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;
