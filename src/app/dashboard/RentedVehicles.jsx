import React from "react";

const RentedVehicles = ({ rentedVehicles }) => {
  return (
    <div className="recent-order">
      <h2>My Recent Order</h2>
      <div className="table-container">
        <table className="order-table">
          <thead>
            <tr>
              <th>Booking No</th>
              <th>Vehicle</th>
              <th>Pick Up Location</th>
              <th>Date</th>
              <th>Return Date</th>
              <th>Payment</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rentedVehicles.map((order) => (
              <tr key={order.id}>
                <td>#{order.bookingNumber}</td>
                <td>{`${order.make} ${order.model}`}</td>
                <td>{order.pickUpLocation || "Location N/A"}</td>
                <td>{new Date(order.rentalStartDate).toLocaleDateString()}</td>
                <td>{new Date(order.rentalEndDate).toLocaleDateString()}</td>
                <td>${order.price}</td>
                <td>
                  <span
                    className={`status ${order.paymentStatus.toLowerCase()}`}
                  >
                    {order.paymentStatus.charAt(0).toUpperCase() +
                      order.paymentStatus.slice(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        .recent-order {
          padding: 20px;
          background-color: white;
          border-radius: 8px;
          box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
        }

        h2 {
          margin-bottom: 20px;
        }

        .table-container {
          max-width: 80vw;
          overflow-x: auto; /* This makes the table horizontally scrollable */
        }

        /* Custom Scrollbar Styles */
        .table-container::-webkit-scrollbar {
          height: 8px; /* Height of the horizontal scrollbar */
        }

        .table-container::-webkit-scrollbar-track {
          background: #f1f1f1; /* Background of the scrollbar track */
        }

        .table-container::-webkit-scrollbar-thumb {
          background-color: #888; /* Scrollbar color */
          border-radius: 10px; /* Rounded corners for scrollbar */
        }

        .table-container::-webkit-scrollbar-thumb:hover {
          background-color: #555; /* Darker color when hovered */
        }

        .order-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 410px; /* Ensure the table has a minimum width */
        }

        .order-table th,
        .order-table td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #eaeaea;
          white-space: nowrap; /* Prevent text from wrapping */
        }

        .order-table th {
          background-color: #f9f9f9;
        }

        .order-table tr:last-child td {
          border-bottom: none;
        }

        .status {
          padding: 5px 10px;
          border-radius: 5px;
          font-weight: bold;
          display: inline-block;
        }

        .status.completed {
          background-color: #d4edda;
          color: #155724;
        }

        .status.cancelled {
          background-color: #f8d7da;
          color: #721c24;
        }

        .status.booking {
          background-color: #fff3cd;
          color: #856404;
        }
      `}</style>
    </div>
  );
};

export default RentedVehicles;
