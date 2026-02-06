
import React, { useState, useEffect } from 'react';
import { X, Save, Trash2, Plus } from 'lucide-react';
import api from '../../api';

interface TeamMember {
    _id: string;
    name: string;
    email: string;
    role: string;
}

interface TeamManagerModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const TeamManagerModal: React.FC<TeamManagerModalProps> = ({ isOpen, onClose }) => {
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [newName, setNewName] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) fetchMembers();
    }, [isOpen]);

    const fetchMembers = async () => {
        try {
            const res = await api.get('/api/team');
            setMembers(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAdd = async () => {
        if (!newName || !newEmail) return;
        setLoading(true);
        try {
            await api.post('/api/team', { name: newName, email: newEmail });
            setNewName('');
            setNewEmail('');
            fetchMembers();
        } catch (err) {
            alert('Failed to add member');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Remove this team member?')) return;
        try {
            await api.delete(`/api/team/${id}`);
            fetchMembers();
        } catch (err) {
            alert('Failed to delete member');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                    <X size={20} />
                </button>

                <h2 className="text-xl font-bold mb-4">Manage Team</h2>

                <div className="mb-6">
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Add New Member</label>
                    <div className="flex gap-2 mb-2">
                        <input
                            placeholder="Name"
                            className="flex-1 border rounded px-3 py-2 text-sm"
                            value={newName}
                            onChange={e => setNewName(e.target.value)}
                        />
                        <input
                            placeholder="Email"
                            className="flex-1 border rounded px-3 py-2 text-sm"
                            value={newEmail}
                            onChange={e => setNewEmail(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={handleAdd}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                    >
                        {loading ? 'Adding...' : <><Plus size={16} /> Add Member</>}
                    </button>
                </div>

                <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Current Team</h3>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                        {members.map(m => (
                            <div key={m._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg group">
                                <div>
                                    <div className="font-medium text-sm">{m.name}</div>
                                    <div className="text-xs text-gray-500">{m.email}</div>
                                </div>
                                <button onClick={() => handleDelete(m._id)} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                        {members.length === 0 && <div className="text-center text-gray-400 text-sm py-4">No team members yet.</div>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeamManagerModal;
