import { useState } from "react";
import SectionContainer from "../components/sectionContainer";

export default function Auth() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      return setError("Por favor, completa todos los campos.");
    }
    setError("");

    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
      credentials: "include",
    });
    if (!response.ok) {
      return setError("Error al iniciar sesión. Verifica tus credenciales.");
    }
    window.location.href = "/dashboard";
  };

  return (
    <main>
      <SectionContainer className="flex flex-col items-center justify-center h-svh">
        <div className="w-full max-w-sm">
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-semibold text-yellow-300 mb-2">
              Iniciar sesión
            </h1>
            <p className="text-sm text-yellow-400">
              Ingresa tus credenciales para continuar
            </p>
          </div>
          <form className="space-y-4" action="">
            <div className="space-y-1.5">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-zinc-400"
              >
                Usuario
              </label>
              <input
                id="username"
                type="text"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ingresa tu usuario"
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-gray-300 rounded-lg 
                         placeholder:text-gray-400 text-gray-900
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         transition-all duration-200"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-zinc-400"
              >
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña"
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-gray-300 rounded-lg 
                         placeholder:text-gray-400 text-gray-900
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         transition-all duration-200"
              />
            </div>

            {error && (
              <label className="block text-center text-sm text-red-500 font-semibold">
                {error}
              </label>
            )}

            <button
              type="submit"
              onClick={handleSubmit}
              className="w-full px-4 py-2.5 text-sm font-semibold text-white bg-slate-800 rounded-lg hover:bg-slate-800/80 cursor-pointer transition"
            >
              Continuar
            </button>
          </form>
        </div>
      </SectionContainer>
    </main>
  );
}
