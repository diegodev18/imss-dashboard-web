import NewUserForm from "../components/newUserForm";
import { useState, useEffect } from "react";
import type { Company } from "../types";
import type { User } from "../types/users";

export default function Dashboard() {
  const [searchValue, setSearchValue] = useState("");
  const [users, setUsers] = useState<Array<User>>([]);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [company, setCompany] = useState<null | Company>(null);

  const statuses = ["all", "active", "inactive"];

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
      const data = (await response.json()) as { user: Company };
      setCompany(data.user);
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
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    })();
  }, []);

  if (company?.status !== "active") {
    window.location.href = "/auth";
    return null;
  }

  const logout = async () => {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/auth/logout`,
      {
        method: "POST",
        credentials: "include",
      }
    );
    if (!response.ok) return;

    window.location.href = "/auth";
  };

  const changeUserData = async (userId: number, payload: Partial<User>) => {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/employees/update/${userId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        credentials: "include",
      }
    );
    if (!response.ok) {
      console.error("Error updating user data");
      return;
    }

    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, ...(payload as Partial<User>) } : user
      )
    );
  };

  return (
    <>
      <main className="max-w-[800px] w-full mx-auto">
        <input
          className="block bg-neutral-800 focus:ring-1 ring-neutral-700 max-w-[400px] w-full mx-auto px-2.5 py-1.5 rounded-md focus:outline-0 mt-10 transition"
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Buscar..."
        />
        <div className="relative mt-2">
          <button
            onClick={() => setShowStatusDropdown(!showStatusDropdown)}
            className="bg-neutral-800 ring-1 ring-neutral-700 font-semibold px-1.5 rounded cursor-pointer"
          >
            Estatus ({statusFilter})
          </button>
          <div
            className={`absolute flex flex-col z-50 bg-neutral-800 rounded-lg overflow-hidden mt-0.5 ${
              showStatusDropdown ? "block" : "hidden"
            }`}
          >
            {statuses.map((status) => (
              <button
                key={status}
                className="px-2 py-1 text-left hover:bg-neutral-700 cursor-pointer"
                onClick={() => {
                  setStatusFilter(status as "all" | "active" | "inactive");
                  setShowStatusDropdown(false);
                }}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <ul className="gap-y-2 mt-2">
          {users
            .filter(
              (user) =>
                user.full_name
                  .toLowerCase()
                  .includes(searchValue.toLowerCase()) &&
                (statusFilter === "all" ? true : user.status === statusFilter)
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
                        <strong>Estatus:</strong>{" "}
                        <select
                          onChange={() =>
                            changeUserData(user.id, {
                              status:
                                value === "active" ? "inactive" : "active",
                            })
                          }
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
                          : key === "social_security_number"
                          ? "Seguro Social"
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
      <button
        onClick={logout}
        className="block mx-auto mt-3 cursor-pointer hover:underline text-neutral-300"
      >
        Cerrar sesión
      </button>
    </>
  );
}
