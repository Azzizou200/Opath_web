import { useEffect, useState } from "react";
import CustomColor from "../constant/color";
import {
  PieChart,
  Pie,
  BarChart,
  LineChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  Calendar,
  CreditCard,
  Globe,
  TrendingUp,
  Square,
  ArrowBigDown,
  ArrowBigUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import { supabase, auth } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

const COLORS = [CustomColor.success, CustomColor.fail, CustomColor.warning];

// Sample data for charts
const bookingData = [
  { month: "Jan", bookings: 65, revenue: 4000 },
  { month: "Feb", bookings: 59, revenue: 3800 },
  { month: "Mar", bookings: 80, revenue: 5200 },
  { month: "Apr", bookings: 81, revenue: 5100 },
  { month: "May", bookings: 56, revenue: 3700 },
  { month: "Jun", bookings: 55, revenue: 3500 },
  { month: "Jul", bookings: 72, revenue: 4800 },
];

export const Persentage = ({ value }: { value: number }) => {
  return value < 0 ? (
    <div className="flex items-center ">
      <ArrowBigDown size={18} fill="red" color="red" />
      <p>{value.toString() + "%"}</p>
    </div>
  ) : (
    <div className="flex items-center">
      <ArrowBigUp size={18} fill="green" color="green" />
      <p>{value.toString() + "%"}</p>
    </div>
  );
};
interface routetype {
  route_name: string;
  number_of_trips: number;
}
interface doughnuttype {
  name: string;
  value: number;
}
const Dashboard: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any[]>([]);
  const [total_earnings, setData03] = useState<number>();
  const [total_routes, setData04] = useState<number>();
  const [routeData, setRouteData] = useState<routetype[]>([]);
  const [doughnutData, setDoughnutData] = useState<doughnuttype[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [total_bookings, setData07] = useState<number>();
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

    async function getData() {
      if (!currentUser) return null;
      const agentId = currentUser.id;

      const { data: drivers, error } = await supabase
        .from("drivers")
        .select("*")
        .eq("agent_id", agentId);

      if (error) {
        console.error("Error fetching drivers:", error);
        return null;
      } else {
        setData(drivers);
      }
    }

    async function getData03() {
      if (!currentUser) return null;
      const agentId = currentUser.id;

      const { data: earnings, error } = await supabase
        .from("trips")
        .select("total_earnings")
        .eq("agent_id", agentId);

      if (error) {
        console.error("Error fetching earnings:", error);
        return null;
      } else {
        let total_earnings = 0;
        earnings.map((earning) => {
          total_earnings += earning.total_earnings;
        });
        setData03(total_earnings);
      }
    }

    async function getData04() {
      if (!currentUser) return null;
      const agentId = currentUser.id;

      const { data: routes, error } = await supabase
        .from("routes")
        .select("*")
        .eq("agent_id", agentId);

      if (error) {
        console.error("Error fetching routes:", error);
        return null;
      } else {
        setData04(routes.length);
      }
    }

    async function getData05() {
      if (!currentUser) return null;
      const agentId = currentUser.id;

      const { data, error } = await supabase
        .from("routes")
        .select(`route_name, trips(id)`)
        .eq("agent_id", agentId); // Filter routes by agent_id

      if (error) {
        console.error("Error fetching data:", error);
        return;
      }

      if (!data || data.length === 0) {
        console.warn("No data returned.");
        return;
      }

      const topRoutes = data
        .map((route) => ({
          route_name: route.route_name,
          number_of_trips: route.trips?.length || 0,
        }))
        .filter((route) => route.number_of_trips > 0) // Only keep routes with trips
        .sort((a, b) => b.number_of_trips - a.number_of_trips)
        .slice(0, 5);

      setRouteData(topRoutes); // make sure useState is defined above

      console.log("Top Route Data:", topRoutes);
    }

    async function getData06() {
      if (!currentUser) return null;
      const agentId = currentUser.id;

      const { data: buses, error } = await supabase
        .from("buses")
        .select("*")
        .eq("agent_id", agentId);

      if (error) {
        console.error("Error fetching buses:", error);
        return null;
      }

      const available = buses.filter(
        (bus) => bus.status === "available"
      ).length;
      const stopped = buses.filter((bus) => bus.status === "stopped").length;
      const maintenance = buses.filter(
        (bus) => bus.status === "maintenance"
      ).length;
      setDoughnutData([
        { name: "Available", value: available },
        { name: "Stopped", value: stopped },
        { name: "Maintenance", value: maintenance },
      ]);
    }
    async function getData07() {
      if (!currentUser) return null;
      const agentId = currentUser.id;

      const { data: trips, error } = await supabase
        .from("trips")
        .select("id")
        .eq("agent_id", agentId);
      const { data: bookings, error: bookingerror } = await supabase
        .from("clientbookings")
        .select("seat_number")
        .in("trip_id", trips?.map((trip) => trip.id) || []);
      if (error) {
        console.error("Error fetching trips:", error);
        return null;
      }
      if (bookingerror) {
        console.error("Error fetching bookings:", bookingerror);
        return null;
      }
      const seat_numbers = bookings?.map((booking) => {
        const number = booking.seat_number.split(",").length;
        return number;
      });
      const totalBookings = seat_numbers?.reduce((acc, curr) => acc + curr, 0);
      setData07(totalBookings || 0);
    }
    getData();

    getData03();
    getData04();
    getData05();
    getData06();
    getData07();
  }, [currentUser]);

  // Stats data
  const stats = [
    {
      title: "Total Bookings",
      value: total_bookings || 0,
      change: "+12.5%",
      icon: Calendar,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Monthly Revenue",
      value: total_earnings + " DA",
      change: "+8.3%",
      icon: CreditCard,
      color: "bg-green-100 text-green-600",
    },

    {
      title: "Routes",
      value: total_routes,
      change: "+3.2%",
      icon: Globe,
      color: "bg-amber-100 text-amber-600",
    },
  ];

  // Upcoming tours

  // Recent bookings

  return (
    <div className="p-6 w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Travel Agency Dashboard</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="flex justify-between bg-white p-6 rounded-lg shadow-sm border border-gray-100"
          >
            <div className="">
              <div className={`p-3 rounded-full ${stat.color}`}>
                <stat.icon size={40} />
              </div>
            </div>
            <div className="flex flex-col justify-center items-center">
              <p className="text-gray-600 text-sm">{stat.title}</p>
              <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Booking Trend Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Booking Trends</h2>
            <div className="flex items-center text-sm text-green-600">
              <TrendingUp size={16} className="mr-1" /> 12.5% increase
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%" className="p-0">
              <LineChart
                data={bookingData}
                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis yAxisId="left" orientation="left" />
                <YAxis yAxisId="right" orientation="right" />

                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="bookings"
                  stroke="#3b82f6"
                  yAxisId="left"
                  activeDot={{ r: 8 }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10b981"
                  yAxisId="right"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Popular Destinations */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-4">Popular Routes</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                maxBarSize={60}
                data={routeData}
                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={true}
                  vertical={false}
                />
                <XAxis dataKey="route_name" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip label={"Number of Trips"} />
                <Legend />
                <Bar
                  name={"Number of Trips"}
                  dataKey="number_of_trips"
                  fill="#4ade80"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Tours */}
        <div className="flex flex-col bg-white p-6 rounded-lg shadow-sm border border-gray-100   ">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Bus overview</h2>
            <Link to="/Buses">View All</Link>
          </div>
          <div className="flex flex-col   justify-center items-center gap-4 ">
            <PieChart width={260} height={250}>
              <Pie
                data={doughnutData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                cornerRadius={10}
                fill="#82ca9d"
                label
              >
                {doughnutData.map((_entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
            <ul className="space-y-4 flex flex-row justify-center items-center gap-4  ">
              <li className="flex  items-center gap-1">
                <Square
                  color="green"
                  fill="green"
                  className="mt-0.5"
                  size={12}
                ></Square>
                <p className="text-sm">Buses Available</p>
              </li>
              <li className="flex items-center gap-1">
                <Square
                  color={COLORS[2]}
                  fill={COLORS[2]}
                  size={12}
                  className="mt-0.5"
                ></Square>
                <p className="text-sm">Buses on Maintenance</p>
              </li>
              <li className="flex items-center gap-1 mb-4 ">
                <Square
                  color={COLORS[1]}
                  fill={COLORS[1]}
                  className="mt-0.5"
                  size={12}
                ></Square>
                <p className="text-sm">Buses Stopped</p>
              </li>
            </ul>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Top proforming drivers</h2>
            <Link to="/drivers">View All</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-500 text-sm border-b">
                  <th className="pb-3 font-medium">Driver</th>
                  <th className="pb-3 font-medium">Name</th>
                  <th className="pb-3 font-medium">Time</th>
                  <th className="pb-3 font-medium">Trips</th>
                </tr>
              </thead>
              <tbody>
                {data
                  .sort((a, b) => b.total_trips - a.total_trips)
                  .slice(0, 4)
                  .map((driver) => (
                    <tr key={driver.id} className="border-b border-gray-100">
                      <td className="py-4 text-sm font-medium">
                        <img
                          src={driver.profile_picture}
                          alt="driver"
                          className="w-10 h-10 rounded-full"
                        />
                      </td>
                      <td className="py-4 text-sm">{driver.full_name}</td>
                      <td className="py-4 text-sm">{driver.total_hours}</td>
                      <td className="py-4 text-sm">{driver.total_trips}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
