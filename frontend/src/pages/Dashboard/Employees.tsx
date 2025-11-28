import NewUserForm from "../../components/newUserForm";
import { useState, useEffect } from "react";
import type { Company } from "../../types";
import type { User } from "../../types/users";

export default function EmployeesDashboard() {
  const [searchValue, setSearchValue] = useState("");
  const [users, setUsers] = useState<Array<User>>([]);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [company, setCompany] = useState<null | Company>(null);
  const [isLoading, setIsLoading] = useState(true);

  const statuses = ["all", "active", "inactive"];

  useEffect(() => {
    (async () => {
      try {
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
        if (response.status === 404) {
          window.location.href = "/auth";
          return;
        }
        const data = (await response.json()) as { user: Company };
        setCompany(data.user);
      } finally {
        setIsLoading(false);
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
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    })();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-neutral-400">Cargando...</p>
        </div>
      </div>
    );
  }

  if (company && company.status !== "active") {
    window.location.href = "/auth";
    return null;
  }

  if (!company) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-neutral-400">Cargando...</p>
        </div>
      </div>
    );
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

  const filteredUsers = users.filter(
    (user) =>
      user.full_name.toLowerCase().includes(searchValue.toLowerCase()) &&
      (statusFilter === "all" ? true : user.status === statusFilter)
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed left-0 top-0 w-full py-3.5 bg-white/65 backdrop-blur-xs shadow-sm border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-base">I</span>
              </div>
              <div>
                <span className="text-base font-semibold text-gray-800">
                  Dashboard IMSS
                </span>
                {company && (
                  <span className="text-xs text-gray-500 ml-2">
                    {company.name || "Empresa"}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <a
                href="/dashboard/telegram/tokens"
                className="bg-white hover:bg-gray-50 text-blue-600 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 shadow-sm border border-blue-600"
              >
                Tokens Telegram
              </a>
              <button
                onClick={logout}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 shadow-sm"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8">
        {/* Search and Filters */}
        <div className="bg-white p-5 rounded-lg shadow-md border border-gray-100 mb-5">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <input
                className="w-full bg-white border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 px-3 py-2 rounded-md focus:outline-0 transition text-gray-900 text-sm placeholder-gray-400"
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Buscar empleado por nombre..."
              />
            </div>
            <div className="relative sm:w-40">
              <button
                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                className="w-full bg-white border border-gray-300 hover:border-gray-400 px-3 py-2 rounded-md cursor-pointer transition text-gray-900 text-sm text-left flex items-center justify-between"
              >
                <span className="capitalize text-sm">
                  {statusFilter === "all"
                    ? "Todos"
                    : statusFilter === "active"
                    ? "Activos"
                    : "Inactivos"}
                </span>
                <svg
                  className={`w-4 h-4 transition-transform ${
                    showStatusDropdown ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <div
                className={`absolute w-full flex flex-col z-50 bg-white border border-gray-300 rounded-md overflow-hidden mt-1 shadow-lg ${
                  showStatusDropdown ? "block" : "hidden"
                }`}
              >
                {statuses.map((status) => (
                  <button
                    key={status}
                    className="px-3 py-2 text-left hover:bg-gray-100 cursor-pointer transition text-gray-900 text-sm capitalize"
                    onClick={() => {
                      setStatusFilter(status as "all" | "active" | "inactive");
                      setShowStatusDropdown(false);
                    }}
                  >
                    {status === "all"
                      ? "Todos"
                      : status === "active"
                      ? "Activos"
                      : "Inactivos"}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-3 text-xs text-gray-500">
            {filteredUsers.length} empleado
            {filteredUsers.length !== 1 ? "s" : ""} encontrado
            {filteredUsers.length !== 1 ? "s" : ""}
          </div>
        </div>
        {/* Users List */}
        {filteredUsers.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-md border border-gray-100 text-center">
            <p className="text-sm text-gray-500">
              No se encontraron empleados. Intenta ajustar los filtros de
              búsqueda.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                      Nombre
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                      CURP
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                      RFC
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                      NSS
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                      Puesto
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                      Salario
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                      Estatus
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        {user.full_name}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                        {user.curp}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                        {user.rfc}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                        {user.social_security_number}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                        {user.position}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                        ${Number(user.salary).toLocaleString("es-MX")}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        <select
                          value={user.status}
                          onChange={(e) =>
                            changeUserData(user.id, {
                              status: e.target.value as "active" | "inactive",
                            })
                          }
                          className="px-2 py-1 rounded text-xs font-medium cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500 border transition bg-white text-gray-900"
                        >
                          <option value="active">Activo</option>
                          <option value="inactive">Inactivo</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {/* Add New User Section */}
        <div className="mt-5">
          <NewUserForm users={users} setUsers={setUsers} />
        </div>
      </main>
    </div>
  );
}
