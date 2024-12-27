import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { AccessLevel } from "@prisma/client";
import { Button } from "./ui/button";
import { Download } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  accessLevel: AccessLevel;
  lastSessionAt: string;
  courseCompletions?: {
    completedAt: string;
    moduleId: number;
    courseId: number;
  }[];
}

export function AdminModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [accessLevelFilter, setAccessLevelFilter] = useState<
    AccessLevel | "ALL"
  >("ALL");
  const [emailFilter, setEmailFilter] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [totalCompletions, setTotalCompletions] = useState(0);
  const [isCompletionsCalendarOpen, setIsCompletionsCalendarOpen] =
    useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  const fetchUsers = async () => {
    try {
      const [usersResponse, statsResponse] = await Promise.all([
        fetch("/api/admin/users"),
        fetch("/api/platform-stats"),
      ]);
      const usersData = await usersResponse.json();
      const statsData = await statsResponse.json();
      setUsers(usersData);
      setTotalCompletions(statsData.totalCompletions);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserAccess = async (
    userId: string,
    newAccessLevel: AccessLevel,
  ) => {
    try {
      await fetch("/api/admin/update-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, accessLevel: newAccessLevel }),
      });
      await fetchUsers(); // Recarrega a lista após atualização
    } catch (error) {
      console.error("Error updating user access:", error);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesAccessLevel =
      accessLevelFilter === "ALL" || user.accessLevel === accessLevelFilter;
    const matchesEmail = user.email
      .toLowerCase()
      .includes(emailFilter.toLowerCase());
    return matchesAccessLevel && matchesEmail;
  });

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getSessionsForDay = (date: Date) => {
    return users.filter((user) => {
      if (!user.lastSessionAt) return false;
      const sessionDate = new Date(user.lastSessionAt);
      return (
        sessionDate.getDate() === date.getDate() &&
        sessionDate.getMonth() === date.getMonth() &&
        sessionDate.getFullYear() === date.getFullYear()
      );
    }).length;
  };

  const getCompletionsForDay = (date: Date) => {
    return users.reduce((total, user) => {
      const completionsOnDay =
        user.courseCompletions?.filter((completion) => {
          if (!completion.completedAt) return false;
          const completionDate = new Date(completion.completedAt);
          return (
            completionDate.getDate() === date.getDate() &&
            completionDate.getMonth() === date.getMonth() &&
            completionDate.getFullYear() === date.getFullYear()
          );
        }).length || 0;
      return total + completionsOnDay;
    }, 0);
  };

  const getCompletionDetails = (date: Date) => {
    const details: Array<{
      userName: string;
      userEmail: string;
      accessLevel: AccessLevel;
      moduleId: number;
      courseId: number;
      completedAt: string;
    }> = [];

    users.forEach((user) => {
      user.courseCompletions?.forEach((completion) => {
        const completionDate = new Date(completion.completedAt);
        if (
          completionDate.getDate() === date.getDate() &&
          completionDate.getMonth() === date.getMonth() &&
          completionDate.getFullYear() === date.getFullYear()
        ) {
          details.push({
            userName: user.name,
            userEmail: user.email,
            accessLevel: user.accessLevel,
            moduleId: completion.moduleId,
            courseId: completion.courseId,
            completedAt: completion.completedAt,
          });
        }
      });
    });

    return details.sort(
      (a, b) =>
        new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime(),
    );
  };

  const generateCSV = () => {
    const csvContent = [
      ["Nome", "Email", "Nível de Acesso", "Última Sessão"],
      ...users.map((user) => [
        user.name,
        user.email,
        user.accessLevel,
        user.lastSessionAt
          ? new Date(user.lastSessionAt).toLocaleString("pt-BR")
          : "Nunca acessou",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `usuarios-${new Date().toISOString().split("T")[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-3xl w-full bg-gray-800 rounded-xl p-6 max-h-[90vh] flex flex-col">
          <Dialog.Title className="text-xl font-bold text-white mb-4 flex justify-between items-center">
            <span>Gerenciar Usuários</span>
            <Button
              onClick={generateCSV}
              className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
              size="sm"
            >
              <Download className="w-4 h-4" />
              Exportar CSV
            </Button>
          </Dialog.Title>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-500 rounded-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Usuários</p>
                  <p className="text-white text-2xl font-bold">
                    {users.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500 rounded-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Aulas</p>
                  <p className="text-white text-2xl font-bold">
                    {totalCompletions}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-700 rounded-lg p-6 mb-6">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setIsCalendarOpen(!isCalendarOpen)}
            >
              <h3 className="text-white font-medium">Daily Active Users</h3>
              <div className="text-gray-400 hover:text-white transition-colors">
                {isCalendarOpen ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
            </div>

            {isCalendarOpen && (
              <>
                <div className="mt-4 flex justify-between items-center mb-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent calendar from closing when clicking navigation
                      setCurrentDate(
                        new Date(
                          currentDate.setMonth(currentDate.getMonth() - 1),
                        ),
                      );
                    }}
                    className="text-gray-400 hover:text-white"
                  >
                    ←
                  </button>
                  <h3 className="text-white font-medium">
                    {currentDate.toLocaleDateString("pt-BR", {
                      month: "long",
                      year: "numeric",
                    })}
                  </h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent calendar from closing when clicking navigation
                      setCurrentDate(
                        new Date(
                          currentDate.setMonth(currentDate.getMonth() + 1),
                        ),
                      );
                    }}
                    className="text-gray-400 hover:text-white"
                  >
                    →
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-1 mb-2">
                  {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map(
                    (day) => (
                      <div
                        key={day}
                        className="text-center text-gray-400 text-sm py-2"
                      >
                        {day}
                      </div>
                    ),
                  )}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {Array.from({
                    length: getDaysInMonth(
                      currentDate.getFullYear(),
                      currentDate.getMonth(),
                    ),
                  }).map((_, index) => {
                    const date = new Date(
                      currentDate.getFullYear(),
                      currentDate.getMonth(),
                      index + 1,
                    );
                    const sessionsCount = getSessionsForDay(date);
                    const isToday =
                      new Date().toDateString() === date.toDateString();

                    if (index === 0) {
                      const startDay = date.getDay();
                      if (startDay > 0) {
                        const emptyCells = Array(startDay).fill(null);
                        return [
                          ...emptyCells.map((_, i) => (
                            <div
                              key={`empty-${i}`}
                              className="h-16 bg-gray-800/50 rounded-lg"
                            />
                          )),
                          <div
                            key={date.toISOString()}
                            className={`h-16 p-2 rounded-lg ${
                              isToday ? "bg-indigo-600" : "bg-gray-800"
                            } flex flex-col justify-between`}
                          >
                            <span className="text-gray-400 text-sm">
                              {index + 1}
                            </span>
                            {sessionsCount > 0 && (
                              <span className="text-white font-bold">
                                {sessionsCount}
                              </span>
                            )}
                          </div>,
                        ];
                      }
                    }

                    return (
                      <div
                        key={date.toISOString()}
                        className={`h-16 p-2 rounded-lg ${
                          isToday ? "bg-indigo-600" : "bg-gray-800"
                        } flex flex-col justify-between`}
                      >
                        <span className="text-gray-400 text-sm">
                          {index + 1}
                        </span>
                        {sessionsCount > 0 && (
                          <span className="text-white font-bold">
                            {sessionsCount}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          <div className="bg-gray-700 rounded-lg p-6 mb-6">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() =>
                setIsCompletionsCalendarOpen(!isCompletionsCalendarOpen)
              }
            >
              <h3 className="text-white font-medium">Conclusões de Aulas</h3>
              <div className="text-gray-400 hover:text-white transition-colors">
                {isCompletionsCalendarOpen ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
            </div>

            {isCompletionsCalendarOpen && (
              <>
                <div className="mt-4 flex justify-between items-center mb-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentDate(
                        new Date(
                          currentDate.setMonth(currentDate.getMonth() - 1),
                        ),
                      );
                    }}
                    className="text-gray-400 hover:text-white"
                  >
                    ←
                  </button>
                  <h3 className="text-white font-medium">
                    {currentDate.toLocaleDateString("pt-BR", {
                      month: "long",
                      year: "numeric",
                    })}
                  </h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentDate(
                        new Date(
                          currentDate.setMonth(currentDate.getMonth() + 1),
                        ),
                      );
                    }}
                    className="text-gray-400 hover:text-white"
                  >
                    →
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-1 mb-2">
                  {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map(
                    (day) => (
                      <div
                        key={day}
                        className="text-center text-gray-400 text-sm py-2"
                      >
                        {day}
                      </div>
                    ),
                  )}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {Array.from({
                    length: getDaysInMonth(
                      currentDate.getFullYear(),
                      currentDate.getMonth(),
                    ),
                  }).map((_, index) => {
                    const date = new Date(
                      currentDate.getFullYear(),
                      currentDate.getMonth(),
                      index + 1,
                    );
                    const completionsCount = getCompletionsForDay(date);
                    const isToday =
                      new Date().toDateString() === date.toDateString();

                    if (index === 0) {
                      const startDay = date.getDay();
                      if (startDay > 0) {
                        const emptyCells = Array(startDay).fill(null);
                        return [
                          ...emptyCells.map((_, i) => (
                            <div
                              key={`empty-${i}`}
                              className="h-16 bg-gray-800/50 rounded-lg"
                            />
                          )),
                          <div
                            key={date.toISOString()}
                            onClick={() => {
                              setSelectedDate(date);
                              setShowDetailsModal(true);
                            }}
                            className={`h-16 p-2 rounded-lg ${
                              isToday ? "bg-indigo-600" : "bg-gray-800"
                            } flex flex-col justify-between cursor-pointer hover:bg-gray-600 transition-colors`}
                          >
                            <span className="text-gray-400 text-sm">
                              {index + 1}
                            </span>
                            {completionsCount > 0 && (
                              <span className="text-white font-bold">
                                {completionsCount}
                              </span>
                            )}
                          </div>,
                        ];
                      }
                    }

                    return (
                      <div
                        key={date.toISOString()}
                        onClick={() => {
                          setSelectedDate(date);
                          setShowDetailsModal(true);
                        }}
                        className={`h-16 p-2 rounded-lg ${
                          isToday ? "bg-indigo-600" : "bg-gray-800"
                        } flex flex-col justify-between cursor-pointer hover:bg-gray-600 transition-colors`}
                      >
                        <span className="text-gray-400 text-sm">
                          {index + 1}
                        </span>
                        {completionsCount > 0 && (
                          <span className="text-white font-bold">
                            {completionsCount}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Filtrar por nível de acesso
                </label>
                <select
                  value={accessLevelFilter}
                  onChange={(e) =>
                    setAccessLevelFilter(e.target.value as AccessLevel | "ALL")
                  }
                  className="w-full bg-gray-700 text-white rounded-md px-3 py-2 border border-gray-600"
                >
                  <option value="ALL">Todos</option>
                  {Object.values(AccessLevel).map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Buscar por e-mail
                </label>
                <input
                  type="text"
                  value={emailFilter}
                  onChange={(e) => setEmailFilter(e.target.value)}
                  placeholder="Digite o e-mail..."
                  className="w-full bg-gray-700 text-white rounded-md px-3 py-2 border border-gray-600 placeholder-gray-500"
                />
              </div>
            </div>
          </div>

          {loading ? (
            <p className="text-gray-300">Carregando...</p>
          ) : (
            <div className="space-y-4 overflow-y-auto">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between bg-gray-700 p-4 rounded-lg"
                >
                  <div>
                    <p className="text-white font-medium">{user.name}</p>
                    <p className="text-gray-400 text-sm">{user.email}</p>
                  </div>

                  <select
                    value={user.accessLevel}
                    onChange={(e) =>
                      updateUserAccess(user.id, e.target.value as AccessLevel)
                    }
                    className="bg-gray-600 text-white rounded-md px-3 py-1 border border-gray-500"
                  >
                    {Object.values(AccessLevel).map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <Button
              onClick={onClose}
              className="bg-gray-600 hover:bg-gray-700 text-white"
            >
              Fechar
            </Button>
          </div>
        </Dialog.Panel>
      </div>

      {showDetailsModal && selectedDate && (
        <Dialog
          open={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          className="relative z-50"
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="mx-auto max-w-2xl w-full bg-gray-800 rounded-xl p-6">
              <Dialog.Title className="text-xl font-bold text-white mb-4">
                Conclusões em{" "}
                {selectedDate.toLocaleDateString("pt-BR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </Dialog.Title>

              <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                {getCompletionDetails(selectedDate).map((detail, index) => (
                  <div
                    key={index}
                    className="bg-gray-700 p-4 rounded-lg space-y-2"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-white font-medium">
                          {detail.userName}
                        </p>
                        <p className="text-gray-400 text-sm">
                          {detail.userEmail}
                        </p>
                      </div>
                      <span
                        className={`
                        px-2 py-1 rounded text-xs font-medium
                        ${
                          detail.accessLevel === "ADMIN"
                            ? "bg-red-500/20 text-red-400"
                            : detail.accessLevel === "LEAD_PLUS"
                              ? "bg-yellow-500/20 text-yellow-400"
                              : detail.accessLevel === "LEAD"
                                ? "bg-green-500/20 text-green-400"
                                : detail.accessLevel === "STUDENT"
                                  ? "bg-blue-500/20 text-blue-400"
                                  : "bg-blue-500/20 text-blue-400"
                        }
                      `}
                      >
                        {detail.accessLevel}
                      </span>
                    </div>
                    <p className="text-gray-300">
                      Módulo {detail.moduleId + 1}, Aula {detail.courseId + 1}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {new Date(detail.completedAt).toLocaleTimeString("pt-BR")}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-end">
                <Button
                  onClick={() => setShowDetailsModal(false)}
                  className="bg-gray-700 hover:bg-gray-600"
                >
                  Fechar
                </Button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      )}
    </Dialog>
  );
}
