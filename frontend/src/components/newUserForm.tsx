import { useState } from "react";
import type { User } from "../types/users";

function NewUserInput({
  newUserProperty,
  newUser,
  setNewUser,
  placeholder,
}: {
  newUserProperty: keyof User;
  newUser: User;
  setNewUser: React.Dispatch<React.SetStateAction<User>>;
  placeholder: string;
}) {
  return (
    <input
      className="block bg-neutral-800 ring-1 ring-neutral-700 max-w-[300px] w-full px-2.5 py-1 rounded-md focus:outline-0"
      type="text"
      value={newUser[newUserProperty] || ""}
      onChange={(e) =>
        setNewUser({ ...newUser, [newUserProperty]: e.target.value })
      }
      placeholder={placeholder}
    />
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
    <select
      className="block bg-neutral-800 ring-1 ring-neutral-700 max-w-[300px] w-full px-2.5 py-1 rounded-md focus:outline-0 cursor-pointer *:[option]:bg-neutral-800 *:[option]:text-white"
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
  const [newUser, setNewUser] = useState<User>({
    id: Date.now(),
    full_name: "",
    curp: "",
    rfc: "",
    position: "",
    salary: 0,
    status: "active",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!Object.values(newUser).every((value) => value !== "")) {
      setError("Por favor, completa todos los campos.");
      return;
    }
    if (isNaN(Number(newUser.salary))) {
      setError("El salario debe ser un número válido.");
      return;
    }
    newUser.salary = Number(newUser.salary);

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/employees/add`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      }
    );
    if (!response.ok) {
      const data = await response.json();
      setError(data.message || "Error al agregar el usuario.");
      return;
    }

    setError(null);
    setUsers([...users, { ...newUser }]);
    setNewUser({
      id: Date.now(),
      full_name: "",
      curp: "",
      rfc: "",
      position: "",
      salary: 0,
      status: "active",
    });
  };

  return (
    <>
      <form className="mt-5" onSubmit={handleSubmit}>
        <div className="grid grid-cols-3 gap-4">
          <NewUserInput
            newUserProperty="full_name"
            newUser={newUser}
            setNewUser={setNewUser}
            placeholder="Nombre del usuario..."
          />
          <NewUserInput
            newUserProperty="curp"
            newUser={newUser}
            setNewUser={setNewUser}
            placeholder="CURP del usuario..."
          />
          <NewUserInput
            newUserProperty="rfc"
            newUser={newUser}
            setNewUser={setNewUser}
            placeholder="RFC del usuario..."
          />
          <NewUserInput
            newUserProperty="salary"
            newUser={newUser}
            setNewUser={setNewUser}
            placeholder="Salario del usuario..."
          />
          <NewUserInput
            newUserProperty="position"
            newUser={newUser}
            setNewUser={setNewUser}
            placeholder="Puesto del usuario..."
          />
          <NewUserSelect newUser={newUser} setNewUser={setNewUser} />
        </div>
        <button className="group px-2.5 py-1 w-full mt-4 bg-neutral-800 rounded-md ring-1 ring-neutral-700 cursor-pointer overflow-hidden">
          <span className="group-hover:translate-x-1 transition-transform inline-block font-semibold">
            Agregar Usuario
          </span>
        </button>
      </form>
      {error && (
        <p className="text-red-500 mt-2 text-center">
          <strong>Error:</strong> {error}
        </p>
      )}
    </>
  );
}
