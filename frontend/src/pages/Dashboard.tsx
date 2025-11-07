import NewUserForm from "../components/newUserForm";
import { useState } from "react";
import type { User } from "../types/users";

export default function Dashboard() {
  const [searchValue, setSearchValue] = useState("");
  const [users, setUsers] = useState<Array<User>>([]);

  return (
    <>
      <main className="max-w-[800px] w-full mx-auto">
        <input
          className="block bg-neutral-800 focus:ring-1 ring-neutral-700 max-w-[400px] w-full mx-auto px-2.5 py-1 rounded-md focus:outline-0 mt-10 transition"
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Buscar..."
        />
        <ul className="mt-4">
          {users
            .filter((user) =>
              user.name.toLowerCase().includes(searchValue.toLowerCase())
            )
            .map((user) => (
              <li
                key={user.id}
                className="py-2 px-4 border-b border-neutral-700"
              >
                {user.name}
              </li>
            ))}
        </ul>
        <NewUserForm users={users} setUsers={setUsers} />
      </main>
    </>
  );
}
