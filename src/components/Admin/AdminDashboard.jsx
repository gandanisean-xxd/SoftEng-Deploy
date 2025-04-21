import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AdminDashboard.module.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [deleteConfirmation, setDeleteConfirmation] = useState({ show: false, userId: null });

  // Mock data - Replace with actual API calls in production
  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      setUsers([
        { id: 1, username: "user1@example.com", role: "Urban Planner", status: "Active", lastLogin: "2025-04-15", password: "$2b$10$abcdefghijklmnopqrs" },
        { id: 2, username: "user2@example.com", role: "Student", status: "Active", lastLogin: "2025-04-18", password: "$2b$10$uvwxyzabcdefghijklm" },
        { id: 3, username: "user3@example.com", role: "Farmer", status: "Inactive", lastLogin: "2025-03-30", password: "$2b$10$nopqrstuvwxyzabcde" },
        { id: 4, username: "user4@example.com", role: "Others", status: "Active", lastLogin: "2025-04-19", password: "$2b$10$fghijklmnopqrsabcd" },
        { id: 5, username: "user5@example.com", role: "Urban Planner", status: "Suspended", lastLogin: "2025-04-02", password: "$2b$10$tuvwxyzabcdefghijk" },
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleLogout = () => {
    // Implement logout logic here
    navigate("/"); // Navigate back to home page
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const changeUserStatus = (userId, newStatus) => {
    setUsers(users.map(user =>
      user.id === userId ? { ...user, status: newStatus } : user
    ));
  };

  const confirmDeleteUser = (userId) => {
    setDeleteConfirmation({ show: true, userId });
  };

  const deleteUser = (userId) => {
    setUsers(users.filter(user => user.id !== userId));
    setDeleteConfirmation({ show: false, userId: null });
    // In a real application, you would also make an API call to delete the user from the database.
  };

  const cancelDelete = () => {
    setDeleteConfirmation({ show: false, userId: null });
  };

  return (
    <div className={styles.dashboardContainer}>
      {deleteConfirmation.show && (
        <div className={styles.deleteConfirmationOverlay}>
          <div className={styles.deleteConfirmationModal}>
            <p>Are you sure you want to delete user ID: {deleteConfirmation.userId}?</p>
            <div className={styles.confirmationButtons}>
              <button className={styles.confirmDeleteBtn} onClick={() => deleteUser(deleteConfirmation.userId)}>
                Yes, Delete
              </button>
              <button className={styles.cancelDeleteBtn} onClick={cancelDelete}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={styles.sidebar}>
        <div className={styles.logo}>
          <img src="/icons/admin (2).png" alt="Admin Logo" />
          <h2>Admin Panel</h2>
        </div>
        <nav className={styles.navigation}>
          <button
            className={`${styles.navButton} ${activeTab === "users" ? styles.active : ""}`}
            onClick={() => setActiveTab("users")}
          >
            <img src="/icons/profile.png" alt="Users" />
            <span>User Management</span>
          </button>
          <button
            className={`${styles.navButton} ${activeTab === "analytics" ? styles.active : ""}`}
            onClick={() => setActiveTab("analytics")}
          >
            <img src="/icons/aianalysis.png" alt="Analytics" />
            <span>Activity Analytics</span>
          </button>
        </nav>
        <button className={styles.logoutButton} onClick={handleLogout}>
          <img src="/icons/login.png" alt="Logout" />
          <span>Logout</span>
        </button>
      </div>

      <div className={styles.mainContent}>
        <header className={styles.header}>
          <h1>
            {activeTab === "users" && "User Management"}
            {activeTab === "analytics" && "Activity Analytics"}
            {activeTab === "settings" && "System Settings"}
          </h1>
          <div className={styles.adminProfile}>
            <span>Admin</span>
            <img src="/icons/profile.png" alt="Admin Profile" />
          </div>
        </header>

        <div className={styles.content}>
          {activeTab === "users" && (
            <div className={styles.usersTab}>
              <div className={styles.controls}>
                <div className={styles.searchBar}>
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <img src="/icons/search.png" alt="Search" className={styles.searchIcon} />
                </div>
              </div>

              {isLoading ? (
                <div className={styles.loading}>Loading users...</div>
              ) : (
                <div className={styles.tableContainer}>
                  <table className={styles.usersTable}>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Last Login</th>
                        <th>Password</th> {/* Added Password Column */}
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map(user => (
                        <tr key={user.id}>
                          <td>{user.id}</td>
                          <td>{user.username}</td>
                          <td>{user.role}</td>
                          <td>
                            <span className={`${styles.statusBadge} ${styles[user.status.toLowerCase()]}`}>
                              {user.status}
                            </span>
                          </td>
                          <td>{user.lastLogin}</td>
                          <td>{user.password}</td> {/* Display Hashed Password */}
                          <td className={styles.actions}>
                            <div className={styles.actionButtons}>
                              {user.status !== "Active" && (
                                <button
                                  className={`${styles.actionBtn} ${styles.activateBtn}`}
                                  onClick={() => changeUserStatus(user.id, "Active")}
                                >
                                  Activate
                                </button>
                              )}
                              {user.status !== "Suspended" && (
                                <button
                                  className={`${styles.actionBtn} ${styles.suspendBtn}`}
                                  onClick={() => changeUserStatus(user.id, "Suspended")}
                                >
                                  Suspend
                                </button>
                              )}
                              {user.status !== "Inactive" && (
                                <button
                                  className={`${styles.actionBtn} ${styles.deactivateBtn}`}
                                  onClick={() => changeUserStatus(user.id, "Inactive")}
                                >
                                  Deactivate
                                </button>
                              )}
                              <button
                                className={`${styles.actionBtn} ${styles.deleteBtn}`}
                                onClick={() => confirmDeleteUser(user.id)}
                              >
                                <img src="/icons/close.png" alt="Delete" className={styles.deleteIcon} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === "analytics" && (
            <div className={styles.analyticsTab}>
              <h2>User Activity Overview</h2>
              <div className={styles.statsCards}>
                <div className={styles.statCard}>
                  <h3>Total Users</h3>
                  <p className={styles.statNumber}>{users.length}</p>
                </div>
                <div className={styles.statCard}>
                  <h3>Active Users</h3>
                  <p className={styles.statNumber}>
                    {users.filter(user => user.status === "Active").length}
                  </p>
                </div>
                <div className={styles.statCard}>
                  <h3>New Sign-ups (Last 7 days)</h3>
                  <p className={styles.statNumber}>12</p>
                </div>
                <div className={styles.statCard}>
                  <h3>Map Searches (Today)</h3>
                  <p className={styles.statNumber}>75</p>
                </div>
              </div>
              <div className={styles.chartPlaceholder}>
                <p>Activity chart would be displayed here</p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;