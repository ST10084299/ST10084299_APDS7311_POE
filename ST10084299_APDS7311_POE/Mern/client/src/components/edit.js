import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import DOMPurify from "dompurify";

export default function Edit() {
  const token = localStorage.getItem("token");
  console.log("The token is", token);

  const { id } = useParams();
  const navigate = useNavigate();

  const [record, setRecord] = useState({
    username: "",
    caption: "",
    hashtag: "",
    image: null,
  });

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const response = await fetch(`http://localhost:5050/record/${id}`, {
          method: "GET",
          headers: {
            Authorization: token,
          },
        });
        const postData = await response.json();
        setRecord({
          username: postData.username,
          caption: postData.caption,
          hashtag: postData.hashtag,
          image: null,
        });
      } catch (error) {
        console.error("Error fetching post data:", error);
      }
    };

    fetchPostData();
  }, [id, token]);

  // Function to sanitize input using DOMPurify
  const sanitizeInput = (input) => {
    return DOMPurify.sanitize(input);
  };

  function updateRecord(value) {
    setRecord((prev) => {
      return { ...prev, ...value };
    });
  }

  async function onSubmit(e) {
    e.preventDefault();

    // Sanitize input before submission
    const sanitizedUsername = sanitizeInput(record.username);
    const sanitizedCaption = sanitizeInput(record.caption);
    const sanitizedHashtag = sanitizeInput(record.hashtag);

    const formData = new FormData();
    formData.append("username", sanitizedUsername);
    formData.append("caption", sanitizedCaption);
    formData.append("hashtag", sanitizedHashtag);

    if (!token) {
      window.alert("User needs to log in. Please log in.");
      console.error("Authentication token missing");
      return;
    }

    if (record.image) {
      formData.append("image", record.image);
    }

    try {
      const response = await fetch(`http://localhost:5050/record/update/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: token,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();

      console.log("Post updated successfully:", result);
      window.alert("Post updated successfully!");

      navigate("/recordList");
    } catch (error) {
      console.error("Error updating post:", error);
      window.alert("Error updating post. Please try again.");
    }
  }

  return (
    <div>
      <h3>Edit Post</h3>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            className="form-control"
            id="username"
            value={record.username}
            onChange={(e) => updateRecord({ username: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label htmlFor="caption">Caption</label>
          <input
            type="text"
            className="form-control"
            id="caption"
            value={record.caption}
            onChange={(e) => updateRecord({ caption: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label htmlFor="hashtag">Todays Hash Tag</label>
          <input
            type="text"
            className="form-control"
            id="hashtag"
            value={record.hashtag}
            onChange={(e) => updateRecord({ hashtag: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label htmlFor="image">Image</label>
          <input
            type="file"
            className="form-control-file"
            id="image"
            accept="image/*"
            onChange={(e) => updateRecord({ image: e.target.files[0] })}
          />
        </div>
        <div className="form-group">
          <input type="submit" value="Update Post" className="btn btn-primary" />
        </div>
      </form>
    </div>
  );
}

