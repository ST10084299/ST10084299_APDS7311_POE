import React, { useState } from "react";
import { useNavigate } from "react-router";
import DOMPurify from "dompurify";
import "../styles.css"; // Import the styles from src

export default function Create() {
  const token = localStorage.getItem("token");
  console.log("The token is", token);

  const [form, setForm] = useState({
    username: "",
    caption: "",
    hashtag: "",
    image: null,
  });

  const [errors, setErrors] = useState({
    username: "",
    caption: "",
    hashtag: "",
    image: "",
  });

  const navigate = useNavigate();

  function updateForm(value) {
    setForm((prev) => {
      return { ...prev, ...value };
    });
  }

  function validateInputs() {
    let isValid = true;
    const newErrors = { username: "", caption: "", hashtag: "", image: "" };
    
    // check if empty
    if (!form.username.trim()) {
      newErrors.username = "Username is required";
      isValid = false;
    }

    // check if empty
    if (!form.caption.trim()) {
      newErrors.caption = "Caption is required";
      isValid = false;
    }

    // check if empty
    if (!form.hashtag.trim()) {
      newErrors.hashtag = "HashTag is required";
      isValid = false;
    }

    // check if empty
    if (!form.image) {
      newErrors.image = "Image is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  }

  async function onSubmit(e) {
    e.preventDefault();

    if (!token) {
      window.alert("User needs to log in. Please log in.");
      console.error("Authentication token missing");
      return;
    }

    if (!validateInputs()) {
      return;
    }

    // Sanitize inputs
    const sanitizedUsername = DOMPurify.sanitize(form.username);
    const sanitizedCaption = DOMPurify.sanitize(form.caption);
    const sanitizedHashtag = DOMPurify.sanitize(form.hashtag);

    const formData = new FormData();
    formData.append("username", sanitizedUsername);
    formData.append("caption", sanitizedCaption);
    formData.append("hashtag", sanitizedHashtag);

    formData.append("image", form.image);

    try {
      const response = await fetch("http://localhost:5050/record/create", {
        method: "POST",
        headers: {
          Authorization: token,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to create post");
      }

      setForm({ username: "", caption: "", image: null });
      navigate("/recordList");
      // Provide feedback for successful submission
      window.alert("Post created successfully!");
    } catch (error) {
      window.alert(error.message);
    }
  }

  return (
    <div>
      <h3>Create New Post</h3>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            className="form-control"
            id="username"
            value={form.username}
            onChange={(e) => updateForm({ username: e.target.value })}
          />
          <small className="text-danger">{errors.username}</small>
        </div>
        <div className="form-group">
          <label htmlFor="caption">Caption</label>
          <input
            type="text"
            className="form-control"
            id="caption"
            value={form.caption}
            onChange={(e) => updateForm({ caption: e.target.value })}
          />
          <small className="text-danger">{errors.caption}</small>
        </div>
        <div className="form-group">
          <label htmlFor="hashtag">Hash Tag of Today</label>
          <input
            type="text"
            className="form-control"
            id="hashtag"
            value={form.hashtag}
            onChange={(e) => updateForm({ hashtag: e.target.value })}
          />
          <small className="text-danger">{errors.hashtag}</small>
        </div>
        <div className="form-group">
          <label htmlFor="image">Image</label>
          <input
            type="file"
            className="form-control-file"
            id="image"
            accept="image/*"
            onChange={(e) => updateForm({ image: e.target.files[0] })}
          />
          <small className="text-danger">{errors.image}</small>
        </div>
        <div className="form-group">
          <input
            type="submit"
            value="Create Post"
            className="btn btn-primary"
          />
        </div>
      </form>
    </div>
  );
}
