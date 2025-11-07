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

export default function NewUserForm({
  users,
  setUsers,
}: {
  users: Array<User>;
  setUsers: React.Dispatch<React.SetStateAction<Array<User>>>;
}) {
  const [newUser, setNewUser] = useState<User>({
    id: Date.now(),
    name: "",
    curp: "",
    rfc: "",
    position: "",
    salary: 0,
    status: "active",
  });

  return (
    <form
      className="grid grid-cols-3 gap-4 mt-5"
      action=""
      onSubmit={(e) => {
        e.preventDefault();
        if (Object.values(newUser).every((value) => value !== "")) {
          setUsers([...users, { ...newUser }]);
          setNewUser({
            id: Date.now(),
            name: "",
            curp: "",
            rfc: "",
            position: "",
            salary: 0,
            status: "active",
          });
        }
      }}
    >
      <NewUserInput
        newUserProperty="name"
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
      <button className="px-2.5 py-1 bg-neutral-800 rounded-md ring-1 ring-neutral-700 cursor-pointer">
        Agregar Usuario
      </button>
    </form>
  );
}
