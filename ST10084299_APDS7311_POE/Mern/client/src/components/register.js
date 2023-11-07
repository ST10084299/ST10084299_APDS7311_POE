import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import DOMPurify from 'dompurify';
import { useNavigate } from 'react-router-dom';

const SignupForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertVariant, setAlertVariant] = useState('success');
  const [alertMessage, setAlertMessage] = useState('');

  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      const MIN_PASSWORD_LENGTH = 6;
      const Max_PASSWORD_LENGTH = 10;

      const sanitizedUsername = DOMPurify.sanitize(username.trim());
      const sanitizedPassword = DOMPurify.sanitize(password.trim());

      if (!sanitizedUsername) {
        setUsernameError('Username is required.');
        return;
      }

      if (!sanitizedPassword) {
        setPasswordError('Password is required.');
        return;
      }

      if (!/(?=.*[a-z])(?=.*[A-Z])/.test(sanitizedPassword)) {
        setPasswordError('Password must contain both uppercase and lowercase characters.');
        return;
      }
// mininim password lenght check
      if (sanitizedPassword.length < MIN_PASSWORD_LENGTH) {
        setPasswordError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`);
        return;
      }

      setPasswordError('');
      setUsernameError('');

      const response = await fetch('http://localhost:5050/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: sanitizedUsername, password: sanitizedPassword }),
      });

      if (response.status === 204) {
        setAlertVariant('success');
        setAlertMessage('Signup successful!');
        setShowAlert(true);

        // Navigate to the login page
        navigate('/login');
      } else if (response.status === 400) {
        const data = await response.json();
        setAlertVariant('danger');
        setAlertMessage(data.error);
        setShowAlert(true);
      } else {
        setAlertVariant('danger');
        setAlertMessage('Signup failed.');
        setShowAlert(true);
      }
    } catch (error) {
      console.error('Error during signup:', error);
      setAlertVariant('danger');
      setAlertMessage('An error occurred during signup.');
      setShowAlert(true);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col md={6}>
          <h2 className="mb-4">Sign Up</h2>
          {showAlert && <Alert variant={alertVariant} onClose={() => setShowAlert(false)} dismissible>{alertMessage}</Alert>}
          <Form>
            <Form.Group controlId="formUsername">
              <Form.Label>Username:</Form.Label>
              <Form.Control
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              {usernameError && <p style={{ color: 'red' }}>{usernameError}</p>}
            </Form.Group>
            <Form.Group controlId="formPassword">
              <Form.Label>Password:</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {passwordError && <p style={{ color: 'red' }}>{passwordError}</p>}
            </Form.Group>
            <Button variant="primary" onClick={handleSignup}>
              Sign Up
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default SignupForm;
