import React from "react";

const About: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">About</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Our Mission</h2>
          <p className="text-gray-700">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
            lacinia odio vitae vestibulum vestibulum. Cras porttitor metus
            justo, ut faucibus justo tempor vel. Sed ac felis id quam ornare
            placerat.
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-2"></div>
              <h3 className="font-medium">Jane Doe</h3>
              <p className="text-sm text-gray-600">CEO</p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-2"></div>
              <h3 className="font-medium">John Smith</h3>
              <p className="text-sm text-gray-600">CTO</p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-2"></div>
              <h3 className="font-medium">Emily Johnson</h3>
              <p className="text-sm text-gray-600">Lead Designer</p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Contact Us</h2>
          <p className="text-gray-700 mb-2">Email: info@example.com</p>
          <p className="text-gray-700">Phone: (123) 456-7890</p>
        </div>
      </div>
    </div>
  );
};

export default About;
