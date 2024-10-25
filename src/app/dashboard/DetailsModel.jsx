import React from "react";
import { FaCalendarAlt, FaTag, FaTimesCircle } from "react-icons/fa";

const DetailsModel = ({ selectedCar, closeModal }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h4 className="text-xl font-bold">Car Details</h4>
          <button onClick={closeModal}>
            <FaTimesCircle className="text-gray-500 text-xl" />
          </button>
        </div>
        <div className="mb-4">
          <Image
            src={selectedCar.image_url}
            alt={selectedCar.name}
            width={400}
            height={300}
            objectFit="cover"
          />
        </div>
        <h5 className="text-lg font-bold mb-2">{selectedCar.name}</h5>
        <p className="text-gray-600 mb-2">
          <FaTag className="inline-block mr-2" />${selectedCar.price}
        </p>
        <p className="text-gray-600 mb-2">
          <FaCalendarAlt className="inline-block mr-2" />
          {selectedCar.year}
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={handleEditCar}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Edit
          </button>
          <button
            onClick={handleDeleteCar}
            className="bg-red-500 text-white px-4 py-2 rounded-lg"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailsModel;
