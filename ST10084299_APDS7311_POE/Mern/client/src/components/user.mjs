import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Record = ({ user, deleteRecord }) => (
  <tr>
    <td>{user.username}</td>
    <td>{user.password}</td>


    <td>
   
      <button
        className="btn btn-link"
        onClick={() => {
          deleteRecord(user._id);
        }}
      >
        Delete
      </button>
    </td>
  </tr>
);

export default function RecordList() {
  const [users, setRecords] = useState([]);

  useEffect(() => {
    async function getRecords() {
      try {
        const response = await fetch("http://localhost:5050/user");

        if (!response.ok) {
          throw new Error(`An error occurred: ${response.statusText}`);
        }

        const users = await response.json();
        setRecords(users);
      } catch (error) {
        console.error("Error fetching users:", error);
        window.alert("Error fetching users");
      }
    }

    getRecords();
  }, []); // Removed records.length from the dependency array

  async function deleteRecord(id) {
    try {
      await fetch(`http://localhost:5050/user/${id}`, {
        method: "DELETE",
      });

      setRecords((prevRecords) =>
        prevRecords.filter((record) => record._id !== id)
      );
    } catch (error) {
      console.error("Error deleting user:", error);
      window.alert("Error deleting user");
    }
  }

  function renderRecords() {
    return users.map((user) => (
      <Record
        key={user._id}
        user={user}
        deleteRecord={deleteRecord}
      />
    ));
  }

  return (
    <div>
      <h3>Admin User List</h3>
         <Link to="/register" className="btn btn-primary" style={{ marginBottom: 20 }}>
      Create New User
    </Link>
      <table className="table table-striped" style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th>username</th>
            <th>password</th>
         


            <th>Action</th>
          </tr>
        </thead>
        <tbody>{renderRecords()}</tbody>
      </table>
    </div>
  );
}