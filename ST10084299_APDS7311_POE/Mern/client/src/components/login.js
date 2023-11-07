import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import DOMPurify from 'dompurify';

const Signin = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertVariant, setAlertVariant] = useState('success');
  const [alertMessage, setAlertMessage] = useState('');

  const handleSignin = async () => {
    try {
      // Validate required fields
      if (!username.trim() || !password.trim()) {
        setAlertVariant('danger');
        setAlertMessage('Username and password are required.');
        setShowAlert(true);
        return;
      }

      // Sanitize input values
      const sanitizedUsername = DOMPurify.sanitize(username.trim());
      const sanitizedPassword = DOMPurify.sanitize(password.trim());

      const response = await fetch('http://localhost:5050/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: sanitizedUsername, password: sanitizedPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        const token = data.token; // Assuming your token is in the response
        localStorage.setItem('token', JSON.stringify(token));

        // Show success alert
        setAlertVariant('success');
        setAlertMessage('Authentication successful.');
        console.log("Login in Successful");
        setShowAlert(true);

        // Navigate to the desired page after a successful sign-in
        navigate('/recordlist');
      } else {
        // Show failure alert
        setAlertVariant('danger');
        setAlertMessage(`Authentication failed: ${data.message}`);
        setShowAlert(true);
      }
    } catch (error) {
      console.error('Signin error:', error);

      // Show error alert
      setAlertVariant('danger');
      setAlertMessage('An error occurred during sign-in.');
      setShowAlert(true);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col md={6}>
          <h2 className="mb-4">Sign In</h2>
          {showAlert && <Alert variant={alertVariant} onClose={() => setShowAlert(false)} dismissible>{alertMessage}</Alert>}
          <Form>
            <Form.Group controlId="formUsername">
              <Form.Label>Username:</Form.Label>
              <Form.Control
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formPassword">
              <Form.Label>Password:</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" onClick={handleSignin}>
              Sign In
            </Button>
          </Form>
          <p className="mt-3">
            Don't have an account? <Link to="/register">Click here to register.</Link>
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default Signin;
