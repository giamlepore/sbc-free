import { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { AccessLevel } from '@prisma/client';
import { Button } from './ui/button';

interface User {
  id: string;
  name: string;
  email: string;
  accessLevel: AccessLevel;
}

export function AdminModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserAccess = async (userId: string, newAccessLevel: AccessLevel) => {
    try {
      await fetch('/api/admin/update-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, accessLevel: newAccessLevel }),
      });
      await fetchUsers(); // Recarrega a lista após atualização
    } catch (error) {
      console.error('Error updating user access:', error);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-3xl w-full bg-gray-800 rounded-xl p-6 max-h-[90vh] flex flex-col">
          <Dialog.Title className="text-xl font-bold text-white mb-4">
            Gerenciar Usuários
          </Dialog.Title>

          {loading ? (
            <p className="text-gray-300">Carregando...</p>
          ) : (
            <div className="space-y-4 overflow-y-auto">
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between bg-gray-700 p-4 rounded-lg">
                  <div>
                    <p className="text-white font-medium">{user.name}</p>
                    <p className="text-gray-400 text-sm">{user.email}</p>
                  </div>
                  
                  <select
                    value={user.accessLevel}
                    onChange={(e) => updateUserAccess(user.id, e.target.value as AccessLevel)}
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
    </Dialog>
  );
}