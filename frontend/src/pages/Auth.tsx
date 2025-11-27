import { useState, useEffect } from "react";

export default function Auth() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/session`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      if (!response.ok) return;
      window.location.href = "/dashboard";
    })();
  }, []);

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
    <main className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mb-4">
            <div className="inline-flex items-center justify-center w-10 h-10 mb-3 bg-linear-to-br from-blue-500 to-purple-600 rounded-lg">
              <span className="text-lg font-bold text-white">IM</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Iniciar sesión
          </h1>
          <p className="text-sm text-gray-500">Ingresa a tu cuenta</p>
        </div>

        <form className="space-y-3" onSubmit={handleSubmit}>
          <div className="space-y-1.5">
            <label
              htmlFor="username"
              className="block text-xs font-medium text-gray-700"
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
              className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md 
                       placeholder:text-gray-400 text-gray-900
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                       transition-all duration-200
                       hover:border-gray-400"
              autoComplete="username"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="block text-xs font-medium text-gray-700"
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
              className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md 
                       placeholder:text-gray-400 text-gray-900
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                       transition-all duration-200
                       hover:border-gray-400"
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="p-2.5 bg-red-50 border border-red-200 rounded-md">
              <p className="text-xs text-red-600 text-center">{error}</p>
            </div>
          )}

          <button
            type="submit"
            className="w-full px-4 py-2 text-sm font-medium text-white 
                     bg-blue-600 rounded-md 
                     hover:bg-blue-700 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                     transition-all duration-200
                     active:scale-[0.98]"
          >
            Continuar
          </button>
        </form>

        <div className="mt-5 text-center">
          <p className="text-sm text-gray-500">
            ¿Aun no tienes cuenta?{" "}
            <a href="#register-form" className="hover:underline">
              Registrate aquí
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
