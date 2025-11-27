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
        if (!response.ok) return;
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
    <div className="min-h-screen bg-linear-to-br from-neutral-900 to-neutral-800">
      {/* Header */}
      <header className="bg-neutral-900/50 backdrop-blur-sm border-b border-neutral-700/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Dashboard IMSS</h1>
              {company && (
                <p className="text-sm text-neutral-400 mt-1">
                  {company.name || "Empresa"}
                </p>
              )}
            </div>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-neutral-800/50 backdrop-blur-sm rounded-xl border border-neutral-700/50 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Buscar empleado
              </label>
              <input
                className="w-full bg-neutral-900/50 border border-neutral-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 px-4 py-2.5 rounded-lg focus:outline-0 transition text-white placeholder-neutral-500"
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Buscar por nombre..."
              />
            </div>
            <div className="relative sm:w-48">
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Filtrar por estatus
              </label>
              <button
                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                className="w-full bg-neutral-900/50 border border-neutral-600 hover:border-neutral-500 px-4 py-2.5 rounded-lg cursor-pointer transition text-white text-left flex items-center justify-between"
              >
                <span className="capitalize">
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
                className={`absolute w-full flex flex-col z-50 bg-neutral-800 border border-neutral-600 rounded-lg overflow-hidden mt-1 shadow-xl ${
                  showStatusDropdown ? "block" : "hidden"
                }`}
              >
                {statuses.map((status) => (
                  <button
                    key={status}
                    className="px-4 py-2.5 text-left hover:bg-neutral-700 cursor-pointer transition text-white capitalize"
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
          <div className="mt-4 flex items-center gap-2 text-sm text-neutral-400">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>
              {filteredUsers.length} empleado
              {filteredUsers.length !== 1 ? "s" : ""} encontrado
              {filteredUsers.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
        {/* Users List */}
        {filteredUsers.length === 0 ? (
          <div className="bg-neutral-800/50 backdrop-blur-sm rounded-xl border border-neutral-700/50 p-12 text-center">
            <svg
              className="w-16 h-16 text-neutral-600 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <h3 className="text-xl font-semibold text-neutral-300 mb-2">
              No se encontraron empleados
            </h3>
            <p className="text-neutral-500">
              Intenta ajustar los filtros de búsqueda
            </p>
          </div>
        ) : (
          <div className="bg-neutral-800/50 backdrop-blur-sm rounded-xl border border-neutral-700/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-900/50 border-b border-neutral-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                      Nombre
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                      CURP
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                      RFC
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                      NSS
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                      Puesto
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                      Salario
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                      Estatus
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-700/50">
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-neutral-700/30 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                        {user.full_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-300">
                        {user.curp}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-300">
                        {user.rfc}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-300">
                        {user.social_security_number}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-300">
                        {user.position}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-300">
                        ${Number(user.salary).toLocaleString("es-MX")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <select
                          value={user.status}
                          onChange={(e) =>
                            changeUserData(user.id, {
                              status: e.target.value as "active" | "inactive",
                            })
                          }
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-800 transition ${
                            user.status === "active"
                              ? "bg-green-500/20 text-green-400 border border-green-500/30 focus:ring-green-500"
                              : "bg-gray-500/20 text-gray-400 border border-gray-500/30 focus:ring-gray-500"
                          }`}
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
        <div className="mt-6">
          <NewUserForm users={users} setUsers={setUsers} />
        </div>
      </main>
    </div>
  );
}
