import NewUserForm from "../components/newUserForm";
import { useState, useEffect } from "react";
import type { User } from "../types/users";

export default function Dashboard() {
  const [searchValue, setSearchValue] = useState("");
  const [users, setUsers] = useState<Array<User>>([]);

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
      if (!response.ok) {
        window.location.href = "/auth";
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/employees/get`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        if (!response.ok) return;

        const data = await response.json();
        setUsers(data.data);
        console.log(data.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    })();
  }, []);

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
        <ul className="gap-y-2 mt-2">
          {users
            .filter((user) =>
              user.full_name.toLowerCase().includes(searchValue.toLowerCase())
            )
            .map((user) => (
              <li
                key={user.id}
                className="flex gap-x-4 flex-wrap py-2 px-4 border-b border-neutral-700"
              >
                {Object.entries(user).map(([key, value]) => {
                  if (
                    key === "id" ||
                    key === "created_at" ||
                    key === "created_by"
                  )
                    return null;

                  if (key === "status") {
                    return (
                      <span className="flex flex-nowrap gap-x-1" key={key}>
                        <strong>{key}:</strong>{" "}
                        <select
                          style={{
                            color: value === "active" ? `#7bf1a8` : `#d1d5db  `,
                          }}
                          className="cursor-pointer focus:outline-0"
                        >
                          <option value="active" selected={value === "active"}>
                            Active
                          </option>
                          <option
                            value="inactive"
                            selected={value === "inactive"}
                          >
                            Inactive
                          </option>
                        </select>
                      </span>
                    );
                  }

                  return (
                    <span className="flex flex-nowrap gap-x-1" key={key}>
                      <strong>
                        {key === "full_name"
                          ? "Nombre"
                          : key === "curp"
                          ? "CURP"
                          : key === "rfc"
                          ? "RFC"
                          : key === "position"
                          ? "Puesto"
                          : key === "salary"
                          ? "Salario"
                          : key === "status"
                          ? "Estatus"
                          : key}
                        :
                      </strong>
                      <span className="text-nowrap">{value.toString()}</span>
                    </span>
                  );
                })}
              </li>
            ))}
        </ul>
        <NewUserForm users={users} setUsers={setUsers} />
      </main>
    </>
  );
}
