import React, { useState, useContext } from 'react';
import { UserContext } from './context';
import Card from './context';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function CreateAccount() {
  const [show, setShow] = useState(true);
  const [status, setStatus] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const userContext = useContext(UserContext);
  const nav = useNavigate();

  function validate(field, label) {
    if (!field) {
      setStatus("Error: " + label);
      setTimeout(() => setStatus(""), 3000);
      return false;
    }
    return true;
  }

  function validateLength(field, label) {
    if (field.length < 8) {
      setStatus('Error: ' + label + ' is not 8 characters');
      setTimeout(() => setStatus(""), 3000);
      return false;
    }
    return true;
  }

  async function handleCreate() {
    if (!validate(name, "name")) return;

    if (!validate(email, "email")) return;

    if (!validate(password, "password")) return;

    if (!validateLength(password, 'password')) return;

    try {
      const request = await axios.post('https://radiant-everglades-55627-9f01a972e6c9.herokuapp.com/api/auth/local/register', {
        username: name,
        email: email,
        password: password,
        balance: 500,
      });

      const userToLogin = request.data;

      userContext.loggedInUser = userToLogin;

      setShow(false);

      nav('/');
    } catch (e) {
      setStatus(e.message);
      setTimeout(() => setStatus(''), 3000);
    }
  }

  function clearForm() {
    setName("");
    setEmail("");
    setPassword("");
    setShow(true);
  }

  function isDisabled() {
    if (!name && !email && !password) return true;
    return false;
  }

  return (
    <Card
      bgcolor="primary"
      header="Create Account"
      status={status}
      body={
        show ? (
          <>
            Name
            <br />
            <input
              type="input"
              className="form-control"
              id="name"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.currentTarget.value)}
            />
            <br />
            Email address
            <br />
            <input
              type="input"
              className="form-control"
              id="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
            />
            <br />
            Password
            <br />
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
            />
            <br />
            <button
              type="submit"
              className="btn btn-light"
              onClick={handleCreate}
              disabled={isDisabled()}
            >
              Create Account
            </button>
          </>
        ) : (
          <>
            <h5>Success</h5>
            <button type="submit" className="btn btn-light" onClick={clearForm}>
              Add another account
            </button>
          </>
        )
      }
    />
  );
}

export default CreateAccount;
