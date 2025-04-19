import React from "react";

const Profile: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">User Profile</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center mb-6">
          <div className="w-16 h-16 bg-gray-300 rounded-full mr-4"></div>
          <div>
            <h2 className="text-xl font-semibold">User Name</h2>
            <p className="text-gray-600">user@example.com</p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Full Name</p>
              <p>John Doe</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Location</p>
              <p>New York, USA</p>
            </div>
          </div>
        </div>

        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default Profile;
