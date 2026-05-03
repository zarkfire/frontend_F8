import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const register = async () => {
    await fetch("http://localhost:8080/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, email, password, role: "USER" })
    });

    alert("User created !");
    navigate("/login");
  };

  return (
    <div className="flex flex-col items-center mt-20">
      <h1 className="text-2xl mb-4">Register</h1>

      <input className="border p-2 mb-2" placeholder="Name"
        onChange={(e) => setName(e.target.value)} />

      <input className="border p-2 mb-2" placeholder="Email"
        onChange={(e) => setEmail(e.target.value)} />

      <input className="border p-2 mb-2" type="password" placeholder="Password"
        onChange={(e) => setPassword(e.target.value)} />

      <button className="bg-green-500 text-white px-4 py-2"
        onClick={register}>
        Register
      </button>
      <button
        className="mt-4 text-blue-600 underline"
        onClick={() => navigate("/login")}
      >
        Already have an account? Login
      </button>
    </div>
  );
}

export default Register;