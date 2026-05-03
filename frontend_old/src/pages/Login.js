import { useState } from "react";
import { useNavigate } from "react-router-dom";


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
const [error, setError] = useState("");
const [success, setSuccess] = useState("");
  const navigate = useNavigate();

    const login = async () => {
      setError("");
      setSuccess("");

      try {
        const res = await fetch("http://localhost:8080/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ email, password })
        });

        if (!res.ok) {
          setError("❌ Email ou mot de passe incorrect");
          return;
        }

        const token = await res.text();

        if (!token) {
          setError("❌ Token invalide");
          return;
        }

        localStorage.setItem("token", token);

        setSuccess("✅ Connexion réussie !");

        setTimeout(() => {
          navigate("/home");
        }, 800);

      } catch (err) {
        setError("❌ Erreur serveur");
      }
    };


  return (
    <div className="flex flex-col items-center mt-20">
      <h1 className="text-2xl mb-4">Login</h1>

      <input className="border p-2 mb-2" placeholder="Email"
        onChange={(e) => setEmail(e.target.value)} />

      <input className="border p-2 mb-2" type="password" placeholder="Password"
        onChange={(e) => setPassword(e.target.value)} />

      <button className="bg-blue-500 text-white px-4 py-2"
        onClick={login}>
        Login
      </button>
      {error && (
        <p className="text-red-500 mt-2">{error}</p>
      )}

      {success && (
        <p className="text-green-500 mt-2">{success}</p>
      )}
      <p className="mt-4 text-sm text-gray-600">
        Don’t have an account?
      </p>

      <button
        className="text-blue-500 hover:underline"
        onClick={() => navigate("/register")}
      >
        Register here
      </button>
    </div>


  );
}

export default Login;