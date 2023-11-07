import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Record = ({ record, deleteRecord }) => (
  <tr>
    <td>{record.username}</td>
    <td>{record.caption}</td>
    <td>{record.hashtag}</td>

    <td>
      {record.image && <img src={record.image} alt="Record Image" style={{ maxWidth: "100px", maxHeight: "100px" }} />}
    </td>
    <td>
      <Link className="btn btn-link" to={`/edit/${record._id}`}>
        Edit
      </Link>{" "}
      |{" "}
      <button
        className="btn btn-link"
        onClick={() => {
          deleteRecord(record._id);
        }}
      >
        Delete
      </button>
    </td>
  </tr>
);

export default function RecordList() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    async function getRecords() {
      try {
        const response = await fetch("http://localhost:5050/record");

        if (!response.ok) {
          throw new Error(`An error occurred: ${response.statusText}`);
        }

        const records = await response.json();
        setRecords(records);
      } catch (error) {
        console.error("Error fetching records:", error);
        window.alert("Error fetching records");
      }
    }

    getRecords();
  }, []); // Removed records.length from the dependency array

  async function deleteRecord(id) {
    try {
      await fetch(`http://localhost:5050/record/${id}`, {
        method: "DELETE",
      });

      setRecords((prevRecords) =>
        prevRecords.filter((record) => record._id !== id)
      );
    } catch (error) {
      console.error("Error deleting record:", error);
      window.alert("Error deleting record");
    }
  }

  function renderRecords() {
    return records.map((record) => (
      <Record
        key={record._id}
        record={record}
        deleteRecord={deleteRecord}
      />
    ));
  }

  return (
    <div>
      <h3>Post List</h3>
         <Link to="/create" className="btn btn-primary" style={{ marginBottom: 20 }}>
      Create New Post
    </Link>
    
    <Link to="/user" className="btn btn-primary" style={{ marginBottom: 20 }}>
Admin Page  
</Link>
      <table className="table table-striped" style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th>username</th>
            <th>caption</th>
            <th>Hash Tag</th>

            <th>Image</th> 

            <th>Action</th>
          </tr>
        </thead>
        <tbody>{renderRecords()}</tbody>
      </table>
    </div>
  );
}
