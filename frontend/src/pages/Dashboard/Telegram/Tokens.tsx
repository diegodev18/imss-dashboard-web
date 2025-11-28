import { useState, useEffect } from "react";

interface Session {
  id: number;
  authToken: string;
  chatId: string | null;
  chatMetadata: Record<string, unknown> | null;
  createdAt: string;
  used: boolean;
}

export default function TelegramTokensDashboard() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [newToken, setNewToken] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [tokenToDelete, setTokenToDelete] = useState<string | null>(null);
  const [visibleTokens, setVisibleTokens] = useState<Set<number>>(new Set());

  const fetchSessions = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/bot/session/get`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Error al obtener las sesiones");
      }

      const data = await response.json();
      setSessions(data.sessions);
    } catch {
      setError("Error al cargar las sesiones");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();

    const interval = setInterval(() => {
      fetchSessions();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (sessions.length > 0 && sessions.every((session) => session.used)) {
      setIsLoading(false);
    }
  }, [sessions]);

  const createToken = async () => {
    setIsCreating(true);
    setError(null);
    setSuccess(null);
    setNewToken(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/bot/session/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Error al crear el token");
      }

      const data = await response.json();
      setNewToken(data.authToken);
      setSuccess("Token creado exitosamente");
      await fetchSessions();

      setTimeout(() => {
        setSuccess(null);
      }, 5000);
    } catch {
      setError("Error al crear el token");
    } finally {
      setIsCreating(false);
    }
  };

  const openDeleteDialog = (authToken: string) => {
    setTokenToDelete(authToken);
    setShowDeleteDialog(true);
  };

  const closeDeleteDialog = () => {
    setShowDeleteDialog(false);
    setTokenToDelete(null);
  };

  const confirmDeleteToken = async () => {
    if (!tokenToDelete) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/bot/session/delete/${tokenToDelete}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Error al eliminar el token");
      }

      setSuccess("Token eliminado exitosamente");
      await fetchSessions();
      closeDeleteDialog();

      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch {
      setError("Error al eliminar el token");
      closeDeleteDialog();
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setSuccess("Token copiado al portapapeles");
    setTimeout(() => {
      setSuccess(null);
    }, 2000);
  };

  const toggleTokenVisibility = (sessionId: number) => {
    setVisibleTokens((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(sessionId)) {
        newSet.delete(sessionId);
      } else {
        newSet.add(sessionId);
      }
      return newSet;
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="fixed left-0 top-0 w-full py-3.5 bg-white/65 backdrop-blur-xs shadow-sm border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-base">T</span>
              </div>
              <div>
                <span className="text-base font-semibold text-gray-800">
                  Tokens de Telegram
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <a
                href="/dashboard/employees"
                className="bg-white hover:bg-gray-50 text-blue-600 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 shadow-sm border border-blue-600"
              >
                Empleados
              </a>
              <a
                href="/dashboard"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 shadow-sm"
              >
                Dashboard Principal
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8">
        {/* Messages */}
        {error && (
          <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">
              <strong>Error:</strong> {error}
            </p>
          </div>
        )}

        {success && (
          <div className="mb-5 p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-sm text-green-600">
              <strong>¡Éxito!</strong> {success}
            </p>
          </div>
        )}

        {/* New Token Display */}
        {newToken && (
          <div className="mb-5 bg-blue-50 p-5 rounded-lg shadow-md border border-blue-200">
            <h3 className="text-sm font-bold text-gray-900 mb-2">
              Nuevo Token Creado
            </h3>
            <p className="text-xs text-gray-600 mb-3">
              Guarda este token de forma segura. No podrás verlo nuevamente.
            </p>
            <div className="flex gap-2 items-center">
              <code className="flex-1 bg-white px-3 py-2 rounded-md text-sm text-gray-900 border border-blue-300 font-mono break-all">
                {newToken}
              </code>
              <button
                onClick={() => copyToClipboard(newToken)}
                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors shrink-0"
              >
                Copiar
              </button>
            </div>
          </div>
        )}

        {/* Create Token Button */}
        <div className="mb-5">
          <button
            onClick={createToken}
            disabled={isCreating}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 shadow-sm"
          >
            {isCreating ? "Creando..." : "Crear Nuevo Token"}
          </button>
        </div>

        {/* Tokens List */}
        <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">
              Tokens Activos ({sessions.length})
            </h2>
            <p className="text-xs text-gray-600 mt-1">
              Administra los tokens de autenticación para el bot de Telegram
            </p>
          </div>

          {sessions.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-sm text-gray-500">
                No hay tokens creados. Crea uno para comenzar.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                      Token
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                      Estado
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                      Chat ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                      Fecha de Creación
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {sessions.map((session) => (
                    <tr
                      key={session.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center gap-2">
                          <code
                            className={`bg-gray-100 px-2 py-1 rounded text-xs font-mono ${
                              visibleTokens.has(session.id)
                                ? "text-gray-900"
                                : "text-transparent select-none"
                            }`}
                            style={
                              !visibleTokens.has(session.id)
                                ? { textShadow: "0 0 8px rgba(0,0,0,0.5)" }
                                : {}
                            }
                          >
                            {visibleTokens.has(session.id)
                              ? session.authToken
                              : "••••••••••••••••••••"}
                          </code>
                          <button
                            onClick={() => toggleTokenVisibility(session.id)}
                            className="text-gray-600 hover:text-gray-800 text-xs"
                            title={
                              visibleTokens.has(session.id)
                                ? "Ocultar"
                                : "Mostrar"
                            }
                          >
                            {visibleTokens.has(session.id) ? (
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
                                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                                />
                              </svg>
                            ) : (
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
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                              </svg>
                            )}
                          </button>
                          <button
                            onClick={() => copyToClipboard(session.authToken)}
                            className="text-blue-600 hover:text-blue-700 text-xs"
                          >
                            Copiar
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            session.used
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {session.used ? "Usado" : "Pendiente"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {session.chatId || "—"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {new Date(session.createdAt).toLocaleString("es-MX", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <button
                          onClick={() => openDeleteDialog(session.authToken)}
                          className="text-red-600 hover:text-red-700 text-xs font-medium"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="mt-5 bg-blue-50 p-5 rounded-lg border border-blue-200">
          <h3 className="text-sm font-bold text-gray-900 mb-2">
            ¿Cómo usar los tokens?
          </h3>
          <ol className="text-xs text-gray-600 space-y-2 list-decimal list-inside mb-3">
            <li>Crea un token y cópialo</li>
            <li>Abre el bot de Telegram de tu empresa</li>
            <li>
              Envía el comando{" "}
              <code className="bg-white px-1.5 py-0.5 rounded text-gray-900 font-mono">
                /auth
              </code>{" "}
              seguido del token
            </li>
            <li>El bot se vinculará automáticamente con tu cuenta</li>
          </ol>
          <div className="bg-white p-3 rounded-lg border border-blue-300">
            <p className="text-xs font-semibold text-gray-700 mb-2">Ejemplo:</p>
            <div className="bg-gray-100 p-2.5 rounded border-l-4 border-blue-500">
              <code className="text-xs font-mono text-gray-900">
                /auth mhX9QHqsyjvY
              </code>
            </div>
          </div>
        </div>
      </main>

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Confirmar eliminación
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              ¿Estás seguro de que deseas eliminar este token? Esta acción no se
              puede deshacer.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={closeDeleteDialog}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg text-sm font-medium transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDeleteToken}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
