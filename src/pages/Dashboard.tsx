import { useState } from "react";
import {
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
} from "recharts";
import {
  Calendar,
  Users,
  CreditCard,
  Globe,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";

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
  const upcomingTours = [
    {
      id: 1,
      name: "European Summer Adventure",
      departureDate: "2023-07-15",
      spots: 4,
      price: "$2,499",
    },
    {
      id: 2,
      name: "Tropical Bali Retreat",
      departureDate: "2023-07-22",
      spots: 2,
      price: "$1,899",
    },
    {
      id: 3,
      name: "Japanese Culture Tour",
      departureDate: "2023-08-05",
      spots: 8,
      price: "$3,299",
    },
  ];

  // Recent bookings
  const recentBookings = [
    {
      id: "BK-1893",
      customer: "Emma Wilson",
      destination: "Paris",
      date: "2023-06-28",
      amount: "$1,350",
    },
    {
      id: "BK-1892",
      customer: "Michael Chen",
      destination: "Bali",
      date: "2023-06-27",
      amount: "$2,180",
    },
    {
      id: "BK-1891",
      customer: "Sophie Martin",
      destination: "Tokyo",
      date: "2023-06-27",
      amount: "$2,950",
    },
    {
      id: "BK-1890",
      customer: "James Miller",
      destination: "Rome",
      date: "2023-06-26",
      amount: "$1,650",
    },
  ];

  return (
    <div className="p-6">
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
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Upcoming Tours</h2>
            <button className="text-blue-600 text-sm font-medium">
              View All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-500 text-sm border-b">
                  <th className="pb-3 font-medium">Tour</th>
                  <th className="pb-3 font-medium">Departure</th>
                  <th className="pb-3 font-medium">Available Spots</th>
                  <th className="pb-3 font-medium">Price</th>
                </tr>
              </thead>
              <tbody>
                {upcomingTours.map((tour) => (
                  <tr key={tour.id} className="border-b border-gray-100">
                    <td className="py-4 text-sm font-medium">{tour.name}</td>
                    <td className="py-4 text-sm">{tour.departureDate}</td>
                    <td className="py-4 text-sm">{tour.spots}</td>
                    <td className="py-4 text-sm">{tour.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Recent Bookings</h2>
            <button className="text-blue-600 text-sm font-medium">
              View All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-500 text-sm border-b">
                  <th className="pb-3 font-medium">ID</th>
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Destination</th>
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Amount</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((booking) => (
                  <tr key={booking.id} className="border-b border-gray-100">
                    <td className="py-4 text-sm font-medium">{booking.id}</td>
                    <td className="py-4 text-sm">{booking.customer}</td>
                    <td className="py-4 text-sm">{booking.destination}</td>
                    <td className="py-4 text-sm">{booking.date}</td>
                    <td className="py-4 text-sm">{booking.amount}</td>
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
