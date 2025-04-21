import { useState } from "react";
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
  Users,
  CreditCard,
  Globe,
  TrendingUp,
  ArrowUpRight,
  Square,
  ArrowBigDown,
  ArrowBigUp,
} from "lucide-react";

const COLORS = [CustomColor.success, CustomColor.fail, CustomColor.warning];
const data02 = [
  {
    name: "Group A",
    value: 2400,
  },
  {
    name: "Group B",
    value: 4567,
  },
  {
    name: "Group C",
    value: 1398,
  },
];

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

const destinationData = [
  { name: "Paris", bookings: 240 },
  { name: "Bali", bookings: 195 },
  { name: "Tokyo", bookings: 150 },
  { name: "New York", bookings: 120 },
  { name: "Rome", bookings: 90 },
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
const Dashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState("month");

  // Stats data
  const stats = [
    {
      title: "Total Bookings",
      value: "1,285",
      change: "+12.5%",
      icon: Calendar,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Monthly Revenue",
      value: "$48,290",
      change: "+8.3%",
      icon: CreditCard,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Active Customers",
      value: "892",
      change: "+5.7%",
      icon: Users,
      color: "bg-purple-100 text-purple-600",
    },
    {
      title: "Destinations",
      value: "78",
      change: "+3.2%",
      icon: Globe,
      color: "bg-amber-100 text-amber-600",
    },
  ];

  // Upcoming tours
  interface bookings {
    id: string;
    customer: string;
    duration: string;
    distance: string;
    change: number;
  }
  // Recent bookings
  const recentBookings: bookings[] = [
    {
      id: "BK-1893",
      customer: "Emma Wilson",
      duration: "70h",
      distance: "800km",
      change: 10,
    },
    {
      id: "BK-1892",
      customer: "Michael Chen",
      duration: "70h",
      distance: "800km",
      change: 10,
    },
    {
      id: "BK-1891",
      customer: "Sophie Martin",
      duration: "70h",
      distance: "800km",
      change: 10,
    },
    {
      id: "BK-1890",
      customer: "James Miller",
      duration: "70h",
      distance: "800km",
      change: 10,
    },
  ];

  return (
    <div className="p-6 w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Travel Agency Dashboard</h1>
        <div className="flex space-x-2">
          <button
            className={`px-3 py-1 text-sm rounded-md ${
              timeRange === "week" ? "bg-blue-600 text-white" : "bg-gray-100"
            }`}
            onClick={() => setTimeRange("week")}
          >
            Weekly
          </button>
          <button
            className={`px-3 py-1 text-sm rounded-md ${
              timeRange === "month" ? "bg-blue-600 text-white" : "bg-gray-100"
            }`}
            onClick={() => setTimeRange("month")}
          >
            Monthly
          </button>
          <button
            className={`px-3 py-1 text-sm rounded-md ${
              timeRange === "year" ? "bg-blue-600 text-white" : "bg-gray-100"
            }`}
            onClick={() => setTimeRange("year")}
          >
            Yearly
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
          >
            <div className="flex justify-between">
              <div className={`p-3 rounded-full ${stat.color}`}>
                <stat.icon size={20} />
              </div>
              <span className="flex items-center text-sm text-green-600">
                {stat.change} <ArrowUpRight size={14} />
              </span>
            </div>
            <p className="text-gray-600 mt-4 text-sm">{stat.title}</p>
            <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
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
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={bookingData}
                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="bookings"
                  stroke="#3b82f6"
                  activeDot={{ r: 8 }}
                />
                <Line type="monotone" dataKey="revenue" stroke="#10b981" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Popular Destinations */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-4">Popular Destinations</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={destinationData}
                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={true}
                  vertical={false}
                />
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="bookings" fill="#8884d8" radius={[4, 4, 0, 0]} />
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
            <button className="text-blue-600 text-sm font-medium">
              View All
            </button>
          </div>
          <div className="flex   justify-center items-center gap-4 ">
            <PieChart width={260} height={250}>
              <Pie
                data={data02}
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
                {data02.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
            <ul className="space-y-4">
              <li className="flex items-center gap-1">
                <Square
                  color="green"
                  fill="green"
                  className="mt-0.5"
                  size={12}
                ></Square>
                <p>Buses Available</p>
              </li>
              <li className="flex items-center gap-1">
                <Square
                  color="green"
                  fill="green"
                  size={12}
                  className="mt-0.5"
                ></Square>
                <p>Buses Available</p>
              </li>
              <li className="flex items-center gap-1">
                <Square
                  color="green"
                  className="mt-0.5"
                  fill="green"
                  size={12}
                ></Square>
                <p>Buses Available</p>
              </li>
            </ul>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Top proforming drivers</h2>
            <button className="text-blue-600 text-sm font-medium">
              View All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-500 text-sm border-b">
                  <th className="pb-3 font-medium">ID</th>
                  <th className="pb-3 font-medium">Driver</th>
                  <th className="pb-3 font-medium">Time</th>
                  <th className="pb-3 font-medium">Distance</th>
                  <th className="pb-3 font-medium">Change</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((booking) => (
                  <tr key={booking.id} className="border-b border-gray-100">
                    <td className="py-4 text-sm font-medium">{booking.id}</td>
                    <td className="py-4 text-sm">{booking.customer}</td>
                    <td className="py-4 text-sm">{booking.duration}</td>
                    <td className="py-4 text-sm">{booking.distance}</td>
                    <td className="py-4 text-sm">
                      <Persentage value={booking.change} />
                    </td>
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
