"use client";

import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import CarProductsClient from "../cars/Car";
import BikeProductsClient from "../bikes/Bike";
import Footer from "../_Components/Layout/Footer";
import Header from "../_Components/Layout/Header";
import DetailsModel from "./DetailsModel";
import RentedVehicles from "./RentedVehicles";
import Profile from "./Profile";

export default function Dashboard() {
  const cookies = new Cookies();
  const router = useRouter();
  const [cars, setCars] = useState([]);
  const [bikes, setBikes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("dashboard");
  const [selectedCar, setSelectedCar] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rentedVehicles, setRentedVehicles] = useState([]);
  const [profile, setProfile] = useState({});

  useEffect(() => {
    const token = cookies.get("token");
    if (!token) {
      router.push("/login");
    }
  }, []);

  const fetchCars = async () => {
    try {
      const response = await axios.get("/api/getcar", {
        headers: {
          Authorization: cookies.get("token"),
        },
      });
      console.log(response);
      setCars(response.data.carsNotOnRent);
    } catch (error) {
      console.error("Error fetching cars:");
    }
  };

  const fetchBikes = async () => {
    try {
      const response = await axios.get("/api/getbikes", {
        headers: {
          Authorization: cookies.get("token"),
        },
      });
      setBikes(response.data.bikes);
    } catch (error) {
      console.error("Error fetching bikes:", error);
    }
  };

  const fetchRentedVehicles = async () => {
    try {
      const response = await axios.get("/api/getRentedVehicles", {
        headers: {
          Authorization: cookies.get("token"),
        },
      });
      console.log("response", response.data.vehicles);
      setRentedVehicles(response.data.vehicles);
    } catch (error) {
      console.error("Error fetching rented vehicles:", error);
    }
  };

  useEffect(() => {
    fetchRentedVehicles();
  }, []);

  const getProfile = async () => {
    try {
      const response = await axios.get("/api/login", {
        headers: {
          Authorization: cookies.get("token"),
        },
      });
      console.log("response", response);
      setProfile(response.data.user);
    } catch (error) {
      console.error("Error fetching rented vehicles:", error);
    }
  };

  const handleViewDetails = (car) => {
    setSelectedCar(car);
    setIsModalOpen(true);
  };

  const handleEditCar = () => {
    // Implement the edit functionality
    console.log("Edit car:", selectedCar);
    // Close the modal after editing
    setIsModalOpen(false);
  };

  const handleDeleteCar = async () => {
    try {
      await axios.delete(`/api/deletecar/${selectedCar.id}`, {
        headers: {
          Authorization: cookies.get("token"),
        },
      });
      // Remove the car from the cars state
      setCars(cars.filter((car) => car.id !== selectedCar.id));
      // Close the modal after deleting
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error deleting car:", error);
    }
  };

  return (
    <>
      <Header />

      <div className="min-h-screen bg-gray-100">
        {/* Dashboard Header */}
        <div className="bg-gray-900 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <h2 className="text-4xl font-bold text-white">My Dashboard</h2>
            <div className="relative w-48 h-48">
              <Image
                src="/path-to-dashboard-illustration.png"
                alt="Dashboard"
                layout="fill"
                objectFit="contain"
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <aside className="bg-white p-6 shadow rounded-lg">
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-16 h-16 rounded-full overflow-hidden">
                  <Image
                    src="/path-to-user-image.jpg"
                    alt="User"
                    width={64}
                    height={64}
                    objectFit="cover"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Rovan Reels</h3>
                  <p className="text-sm text-gray-500">rovanreels@gmail.com</p>
                </div>
              </div>
              <nav className="space-y-4">
                <Link
                  href="#"
                  className={`flex items-center font-bold ${
                    selectedCategory === "dashboard"
                      ? "text-gray-900"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                  onClick={() => {
                    fetchRentedVehicles();
                    setSelectedCategory("dashboard");
                  }}
                >
                  <svg
                    className="mr-3 h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  Dashboard
                </Link>
                <Link
                  href="#"
                  className={`flex items-center ${
                    selectedCategory === "profile"
                      ? "text-gray-900 font-bold"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                  onClick={() => {
                    getProfile();
                    setSelectedCategory("profile");
                  }}
                >
                  <svg
                    className="mr-3 h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M5.121 17.804l-1.415-1.414a9 9 0 1112.728 0l-1.415 1.414a7 7 0 10-9.9 0z" />
                    <path d="M9 17a3 3 0 106 0H9z" />
                  </svg>
                  My Profile
                </Link>
                <Link
                  href="#"
                  className={`flex items-center ${
                    selectedCategory === "cars"
                      ? "text-gray-900 font-bold"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                  onClick={() => {
                    fetchCars();
                    setSelectedCategory("cars");
                  }}
                >
                  <svg
                    className="mr-3 h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M3 6h18M3 12h18M3 18h18" />
                  </svg>
                  Cars
                </Link>
                <Link
                  href="#"
                  className={`flex items-center ${
                    selectedCategory === "bikes"
                      ? "text-gray-900 font-bold"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                  onClick={() => {
                    fetchBikes();
                    setSelectedCategory("bikes");
                  }}
                >
                  <svg
                    className="mr-3 h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M3 6h18M3 12h18M3 18h18" />
                  </svg>
                  Bikes
                </Link>
              </nav>
            </aside>

            {/* Main Section */}
            <main className="lg:col-span-3">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900">
                  {selectedCategory === "cars"
                    ? "My Cars"
                    : selectedCategory === "bikes"
                    ? "My Bikes"
                    : "Dashboard"}
                </h3>
              </div>

              {/* Car or Bike List */}
              <div className="grid gap-6">
                {selectedCategory === "profile" && (
                  // <ProfileClient profile={profile} />
                  <Profile profile={profile} />
                )}

                {selectedCategory === "dashboard" && (
                  // <Dashboard /> add dashboard details component here
                  <RentedVehicles
                    rentedVehicles={rentedVehicles}
                    handleViewDetails={handleViewDetails}
                  />
                )}
                {selectedCategory === "cars" && (
                  <CarProductsClient cars={cars} />
                )}

                {selectedCategory === "bikes" && (
                  <BikeProductsClient bikes={bikes} />
                )}
              </div>
            </main>
          </div>
        </div>

        {/* Modal for Car Details */}
        {isModalOpen && selectedCar && (
          <DetailsModel
            selectedCar={selectedCar}
            closeModal={() => setIsModalOpen(false)}
          />
        )}
      </div>
      <Footer />
    </>
  );
}
