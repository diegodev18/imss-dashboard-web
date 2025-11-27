import { useState } from "react";
import type { User } from "../types/users";

function NewUserInput({
  newUserProperty,
  newUser,
  setNewUser,
  placeholder,
  label,
  type = "text",
}: {
  newUserProperty: keyof User;
  newUser: User;
  setNewUser: React.Dispatch<React.SetStateAction<User>>;
  placeholder: string;
  label: string;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-neutral-300 mb-2">
        {label}
      </label>
      <input
        className="w-full bg-neutral-900/50 border border-neutral-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 px-4 py-2.5 rounded-lg focus:outline-0 transition text-white placeholder-neutral-500"
        type={type}
        value={newUser[newUserProperty] || ""}
        onChange={(e) =>
          setNewUser({ ...newUser, [newUserProperty]: e.target.value })
        }
        placeholder={placeholder}
      />
    </div>
  );
}

function NewUserSelect({
  newUser,
  setNewUser,
}: {
  newUser: User;
  setNewUser: React.Dispatch<React.SetStateAction<User>>;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-neutral-300 mb-2">
        Estatus
      </label>
      <select
        className="w-full bg-neutral-900/50 border border-neutral-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 px-4 py-2.5 rounded-lg focus:outline-0 cursor-pointer text-white transition"
        value={newUser.status}
        onChange={(e) =>
          setNewUser({
            ...newUser,
            status: e.target.value as "active" | "inactive",
          })
        }
      >
        <option value="active">Activo</option>
        <option value="inactive">Inactivo</option>
      </select>
    </div>
  );
}

export default function NewUserForm({
  users,
  setUsers,
}: {
  users: Array<User>;
  setUsers: React.Dispatch<React.SetStateAction<Array<User>>>;
}) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newUser, setNewUser] = useState<User>({
    id: Date.now(),
    full_name: "",
    curp: "",
    rfc: "",
    position: "",
    salary: 0,
    status: "active",
    social_security_number: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!Object.values(newUser).every((value) => value !== "")) {
      setError("Por favor, completa todos los campos.");
      return;
    }
    if (isNaN(Number(newUser.salary))) {
      setError("El salario debe ser un número válido.");
      return;
    }

    setIsSubmitting(true);
    newUser.salary = Number(newUser.salary);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/employees/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...newUser,
            fullName: newUser.full_name,
          }),
          credentials: "include",
        }
      );
      if (!response.ok) {
        const data = await response.json();
        setError(data.message || "Error al agregar el usuario.");
        return;
      }

      setSuccess(true);
      setUsers([...users, { ...newUser }]);
      setNewUser({
        id: Date.now(),
        full_name: "",
        curp: "",
        rfc: "",
        position: "",
        salary: 0,
        status: "active",
        social_security_number: "",
      });

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError("Error de conexión. Por favor, intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-neutral-800/50 backdrop-blur-sm rounded-xl border border-neutral-700/50 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-500/10 rounded-lg">
          <svg
            className="w-6 h-6 text-blue-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
            />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">
            Agregar Nuevo Empleado
          </h2>
          <p className="text-sm text-neutral-400">
            Completa todos los campos para registrar un empleado
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <NewUserInput
            newUserProperty="full_name"
            newUser={newUser}
            setNewUser={setNewUser}
            placeholder="Ej: Juan Pérez García"
            label="Nombre completo"
          />
          <NewUserInput
            newUserProperty="curp"
            newUser={newUser}
            setNewUser={setNewUser}
            placeholder="Ej: PEGA850101HDFRRL01"
            label="CURP"
          />
          <NewUserInput
            newUserProperty="rfc"
            newUser={newUser}
            setNewUser={setNewUser}
            placeholder="Ej: PEGA850101ABC"
            label="RFC"
          />
          <NewUserInput
            newUserProperty="social_security_number"
            newUser={newUser}
            setNewUser={setNewUser}
            placeholder="Ej: 12345678901"
            label="Número de Seguridad Social"
          />
          <NewUserInput
            newUserProperty="position"
            newUser={newUser}
            setNewUser={setNewUser}
            placeholder="Ej: Gerente de Ventas"
            label="Puesto"
          />
          <NewUserInput
            newUserProperty="salary"
            newUser={newUser}
            setNewUser={setNewUser}
            placeholder="Ej: 15000"
            label="Salario mensual"
            type="number"
          />
          <NewUserSelect newUser={newUser} setNewUser={setNewUser} />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-neutral-600 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2 group"
        >
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Agregando...
            </>
          ) : (
            <>
              <svg
                className="w-5 h-5 group-hover:scale-110 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Agregar Empleado
            </>
          )}
        </button>
      </form>

      {/* Messages */}
      {error && (
        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
          <svg
            className="w-5 h-5 text-red-400 shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <p className="font-semibold text-red-400">Error</p>
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-start gap-3">
          <svg
            className="w-5 h-5 text-green-400 shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <p className="font-semibold text-green-400">¡Éxito!</p>
            <p className="text-green-300 text-sm">
              El empleado ha sido agregado correctamente
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
