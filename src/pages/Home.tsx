import React from "react";

const Home: React.FC = () => {
  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">Home Page</h1>
      <p className="mb-4">This is the home page of the application.</p>
      <div className="p-4 bg-blue-100 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Getting Started</h2>
        <p>
          Welcome to the application. Use the sidebar to navigate to different
          pages.
        </p>
      </div>
    </div>
  );
};

export default Home;
