import React from "react";

const ProfileInfo = ({ profile }) => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Profile Information
      </h2>
      <div className="space-y-4">
        <div className="flex justify-between items-center border-b pb-3">
          <span className="text-gray-600 font-medium">Name:</span>
          <span className="text-gray-900">{profile.name}</span>
        </div>
        <div className="flex justify-between items-center border-b pb-3">
          <span className="text-gray-600 font-medium">Email:</span>
          <span className="text-gray-900">{profile.email}</span>
        </div>
        <div className="flex justify-between items-center border-b pb-3">
          <span className="text-gray-600 font-medium">Phone Number:</span>
          <span className="text-gray-900">{profile.phoneNumber}</span>
        </div>
        <div className="flex justify-between items-center border-b pb-3">
          <span className="text-gray-600 font-medium">Address:</span>
          <span className="text-gray-900">{profile.address}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600 font-medium">Joined On:</span>
          <span className="text-gray-900">
            {new Date(profile.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
