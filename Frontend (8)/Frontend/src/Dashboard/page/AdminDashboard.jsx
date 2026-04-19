import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import Style from "../Style/AdminDashboard.module.scss";

const baseURL = import.meta.env.VITE_API_BASE_URL;

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        const { data } = await axios.get(`${baseURL}/api/enquiry/get`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setEnquiries(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching enquiries:", error);
        setEnquiries([]);
      }
    };

    const fetchUsers = async () => {
      try {
        const { data } = await axios.get(`${baseURL}/api/users/get/users`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUsers(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching users:", error);
        setUsers([]);
      }
    };

    fetchEnquiries();
    fetchUsers();
  }, []);

  const todayEnquiries = enquiries.filter((enq) => {
    const date = new Date(enq.created_at);
    const now = new Date();
    return (
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  });

  const todayUsers = users.filter((user) => {
    const date = new Date(user.created_at);
    const now = new Date();
    return (
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  });

  const dailyCounts = enquiries.reduce((acc, enq) => {
    const date = new Date(enq.created_at);
    const key = `${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()}`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const sortedDates = Object.keys(dailyCounts).sort(
    (a, b) => new Date(a) - new Date(b)
  );

  const lineChartData = {
    labels: sortedDates,
    datasets: [
      {
        label: "Daily Enquiries",
        data: sortedDates.map((date) => dailyCounts[date]),
        fill: true,
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        tension: 0.4,
        pointBackgroundColor: "rgba(54, 162, 235, 1)",
      },
    ],
  };

  const doughnutData = {
    labels: ["Today's Enquiries", "Other Enquiries"],
    datasets: [
      {
        data: [todayEnquiries.length, enquiries.length - todayEnquiries.length],
        backgroundColor: ["rgba(75, 192, 192, 0.6)", "rgba(255, 99, 132, 0.6)"],
        borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)"],
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className={Style.UserDashboard}>
      <h2>Welcome Admin</h2>

      <div className={Style.TopCards}>
        <div className={`${Style.Card} ${Style.BlueCard}`}>
          <h3>Total Enquiries</h3>
          <p>{enquiries.length}</p>
        </div>
        <div className={`${Style.Card} ${Style.GreenCard}`}>
          <h3>Today's Enquiries</h3>
          <p>{todayEnquiries.length}</p>
        </div>
        <div className={`${Style.Card} ${Style.PurpleCard}`}>
          <h3>Total Users</h3>
          <p>{users.length}</p>
        </div>
        <div className={`${Style.Card} ${Style.OrangeCard}`}>
          <h3>Today's Users</h3>
          <p>{todayUsers.length}</p>
        </div>
      </div>

      <div className={Style.ChartsRow}>
        <div className={Style.ChartWrapper}>
          <h3>Daily Enquiry Trend</h3>
          <Line data={lineChartData} options={{ responsive: true }} />
        </div>
        <div className={Style.ChartWrapper}>
          <h3>Today's vs Other Enquiries</h3>
          <Doughnut data={doughnutData} options={{ responsive: true }} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
