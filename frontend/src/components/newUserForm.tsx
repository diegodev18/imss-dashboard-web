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
      <label className="block text-xs font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        className="w-full bg-white border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 px-3 py-1.5 rounded-md focus:outline-0 transition text-gray-900 text-sm placeholder-gray-400"
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
      <label className="block text-xs font-medium text-gray-700 mb-1">
        Estatus
      </label>
      <select
        className="w-full bg-white border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 px-3 py-1.5 rounded-md focus:outline-0 cursor-pointer text-gray-900 text-sm transition"
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
    } catch {
      setError("Error de conexión. Por favor, intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-5 rounded-lg shadow-md border border-gray-100">
      <h2 className="text-lg font-bold text-gray-900 mb-1">
        Agregar Nuevo Empleado
      </h2>
      <p className="text-xs text-gray-600 mb-4">
        Completa todos los campos para registrar un empleado
      </p>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
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
          className="w-full mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors duration-200 shadow-sm"
        >
          {isSubmitting ? "Agregando..." : "Agregar Empleado"}
        </button>
      </form>

      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">
            <strong>Error:</strong> {error}
          </p>
        </div>
      )}

      {success && (
        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm text-green-600">
            <strong>¡Éxito!</strong> El empleado ha sido agregado correctamente
          </p>
        </div>
      )}
    </div>
  );
}
