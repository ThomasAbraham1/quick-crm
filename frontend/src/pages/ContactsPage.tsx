
import React, { useEffect, useState, useMemo } from 'react';
import { Upload, Trash2, Copy, Filter, Calendar, Edit, Users, User, CheckCircle, Search, Info, UserPlus } from 'lucide-react';
import api from '../api';
import ContactEditModal from '../components/Contacts/ContactEditModal';
import TeamManagerModal from '../components/Team/TeamManagerModal';

interface Contact {
    _id: string;
    email: string;
    name: string;
    phone?: string;
    dateAdded?: string;
    assignee?: string;
    callbackDate?: string;
    notes?: string;
    misc?: Record<string, any>;
}

interface TeamMember {
    _id: string;
    name: string;
}

const ContactsPage = () => {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

    // Modals
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingContact, setEditingContact] = useState<Contact | null>(null);
    const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);

    // Import
    const [jsonInput, setJsonInput] = useState('');
    const [isImporting, setIsImporting] = useState(false);

    // Filters
    const [filterDate, setFilterDate] = useState('');
    const [filterAssignee, setFilterAssignee] = useState('');
    const [filterCallback, setFilterCallback] = useState(''); // 'today', 'overdue', 'future'
    const [searchQuery, setSearchQuery] = useState('');

    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    useEffect(() => {
        fetchContacts();
        fetchTeam();
    }, []);

    const fetchContacts = async () => {
        const res = await api.get('contacts');
        setContacts(res.data);
    };

    const fetchTeam = async () => {
        try {
            const res = await api.get('team');
            setTeamMembers(res.data);
        } catch (e) { console.error(e); }
    };

    // Derived State: Filtered Contacts
    const filteredContacts = useMemo(() => {
        let result = contacts;

        // Search
        if (searchQuery) {
            const lower = searchQuery.toLowerCase();
            result = result.filter(c =>
                c.name?.toLowerCase().includes(lower) ||
                c.email.toLowerCase().includes(lower)
            );
        }

        // Date Added
        if (filterDate) {
            const filterTime = new Date(filterDate).getTime();
            result = result.filter(c => {
                if (!c.dateAdded) return false;
                return new Date(c.dateAdded).getTime() >= filterTime;
            });
        }

        // Assignee
        if (filterAssignee) {
            if (filterAssignee === 'unassigned') {
                result = result.filter(c => !c.assignee);
            } else {
                result = result.filter(c => c.assignee === filterAssignee);
            }
        }

        // Callback Status
        if (filterCallback) {
            const todayStr = new Date().toISOString().split('T')[0];
            result = result.filter(c => {
                if (!c.callbackDate) return false;
                const cDate = c.callbackDate.split('T')[0];
                if (filterCallback === 'today') return cDate === todayStr;
                if (filterCallback === 'overdue') return cDate < todayStr;
                if (filterCallback === 'future') return cDate > todayStr;
                return true;
            });
        }

        return result;
    }, [contacts, filterDate, filterAssignee, filterCallback, searchQuery]);

    // Selection Logic
    const toggleSelectAll = () => {
        if (selectedIds.size === filteredContacts.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(filteredContacts.map(c => c._id)));
        }
    };

    const toggleSelect = (id: string) => {
        const newSet = new Set(selectedIds);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setSelectedIds(newSet);
    };

    const handleImport = async () => {
        try {
            const parsed = JSON.parse(jsonInput);
            if (!Array.isArray(parsed)) throw new Error('Must be an array');
            await api.post('contacts/import', { contacts: parsed });
            setIsImporting(false);
            setJsonInput('');
            fetchContacts();
        } catch (e: any) {
            alert('Invalid JSON format: ' + e.message);
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure?')) return;
        await api.delete(`contacts/${id}`);
        fetchContacts();
    }

    const handleEdit = (contact: Contact) => {
        setEditingContact(contact);
        setIsEditModalOpen(true);
    };

    const handleCloseEdit = () => {
        setIsEditModalOpen(false);
        setEditingContact(null);
        fetchTeam(); // Refresh team data in case assignee was changed
    };

    const handleBulkDelete = async () => {
        if (!confirm(`Delete ${selectedIds.size} contacts?`)) return;
        for (const id of selectedIds) {
            await api.delete(`contacts/${id}`);
        }
        setSelectedIds(new Set());
        fetchContacts();
    }

    const handleBulkAssign = async (assignee: string) => {
        if (!assignee) return;
        try {
            await api.put('contacts/bulk-assign', {
                contactIds: Array.from(selectedIds),
                assignee
            });
            setSelectedIds(new Set());
            fetchContacts();
        } catch (e) {
            console.error('Bulk assign failed:', e);
            alert('Failed to assign contacts');
        }
    }

    const handleCopyFilteredDocs = () => {
        const exportData = filteredContacts.map(c => ({
            name: c.name,
            email: c.email,
            phone: c.phone
        }));
        navigator.clipboard.writeText(JSON.stringify(exportData, null, 2));
        alert(`Copied ${exportData.length} contacts to clipboard!`);
    }

    const getAssigneeName = (id?: string) => {
        if (!id) return null;
        const member = teamMembers.find(m => m._id === id);
        return member ? member.name : 'Unknown';
    };

    return (
        <div>
            <div className="flex flex-col gap-4 mb-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 mb-1">Contacts</h1>
                        <p className="text-sm text-gray-500">Manage your leads and assignments</p>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                        <button
                            onClick={() => setIsTeamModalOpen(true)}
                            className="flex-1 sm:flex-none justify-center flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg hover:bg-indigo-100 transition font-medium text-sm border border-indigo-100 whitespace-nowrap"
                        >
                            <Users size={16} /> Manage Team
                        </button>
                        <button
                            onClick={() => setIsImporting(!isImporting)}
                            className="flex-1 sm:flex-none justify-center flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium text-sm shadow-sm whitespace-nowrap"
                        >
                            <Upload size={16} /> Import
                        </button>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm grid grid-cols-2 lg:flex gap-3 items-center">
                    {/* Search - Full width on mobile */}
                    <div className="col-span-2 lg:flex-1 lg:min-w-[200px] flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-100">
                        <Search size={16} className="text-gray-400 shrink-0" />
                        <input
                            placeholder="Search name or email..."
                            className="bg-transparent outline-none text-sm w-full"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="h-8 w-px bg-gray-200 mx-1 hidden lg:block"></div>

                    {/* Filters - Grid on mobile */}
                    <div className="col-span-1 flex items-center gap-2 text-sm text-gray-600 bg-gray-50 lg:bg-transparent px-2 lg:px-0 py-2 lg:py-0 rounded-lg lg:rounded-none border border-gray-100 lg:border-none">
                        <User size={16} className="text-gray-400 shrink-0" />
                        <select
                            className="bg-transparent outline-none font-medium hover:bg-gray-50 rounded px-1 w-full lg:w-auto"
                            value={filterAssignee}
                            onChange={e => setFilterAssignee(e.target.value)}
                        >
                            <option value="">All Assignees</option>
                            <option value="unassigned">Unassigned</option>
                            {teamMembers.map(m => (
                                <option key={m._id} value={m._id}>{m.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="col-span-1 flex items-center gap-2 text-sm text-gray-600 bg-gray-50 lg:bg-transparent px-2 lg:px-0 py-2 lg:py-0 rounded-lg lg:rounded-none border border-gray-100 lg:border-none">
                        <Calendar size={16} className="text-gray-400 shrink-0" />
                        <select
                            className="bg-transparent outline-none font-medium hover:bg-gray-50 rounded px-1 w-full lg:w-auto"
                            value={filterCallback}
                            onChange={e => setFilterCallback(e.target.value)}
                        >
                            <option value="">Any Time</option>
                            <option value="today">Call Today</option>
                            <option value="overdue">Overdue</option>
                            <option value="future">Scheduled Future</option>
                        </select>
                    </div>

                    {/* Date Filter - Full width on small mobile, half on sm */}
                    <div className="col-span-2 sm:col-span-1 lg:w-auto flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-2 py-2 lg:py-1">
                        <span className="text-xs text-gray-400 whitespace-nowrap">Added After:</span>
                        <input
                            type="date"
                            className="bg-transparent text-sm outline-none w-full"
                            value={filterDate}
                            onChange={(e) => setFilterDate(e.target.value)}
                        />
                    </div>

                    {/* Actions - Aligned right on desktop */}
                    <div className="col-span-2 sm:col-span-1 lg:flex-1 flex justify-end">
                        {selectedIds.size > 0 && (
                            <div className="flex gap-3 justify-end w-full lg:w-auto items-center">
                                <div className="flex items-center gap-2">
                                    <UserPlus size={14} className="text-blue-600" />
                                    <select
                                        className="text-sm text-blue-600 bg-transparent border border-blue-200 rounded px-2 py-1 hover:bg-blue-50 outline-none"
                                        onChange={(e) => {
                                            if (e.target.value) {
                                                handleBulkAssign(e.target.value);
                                                e.target.value = ''; // Reset
                                            }
                                        }}
                                    >
                                        <option value="">Assign ({selectedIds.size})</option>
                                        {teamMembers.map(m => (
                                            <option key={m._id} value={m._id}>{m.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <button onClick={handleBulkDelete} className="text-red-600 text-sm hover:underline flex items-center gap-1">
                                    <Trash2 size={14} /> Delete ({selectedIds.size})
                                </button>
                                <button onClick={handleCopyFilteredDocs} className="text-green-600 text-sm hover:underline flex items-center gap-1">
                                    <Copy size={14} /> Copy JSON
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {isImporting && (
                <div className="mb-8 bg-blue-50 p-6 rounded-xl border border-blue-100 animate-in fade-in slide-in-from-top-4">
                    <h3 className="font-semibold text-blue-900 mb-2">Paste JSON Data</h3>
                    <p className="text-xs text-blue-700 mb-2">Format: <code>[{`{"email": "...", "name": "...", "phone": "..."}`}]</code></p>
                    <textarea
                        className="w-full p-3 rounded-lg border border-blue-200 mb-3 h-32 font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        value={jsonInput}
                        onChange={(e) => setJsonInput(e.target.value)}
                        placeholder='[{"email":"alex@example.com", "name": "Alex", "phone": "555-0199"}]'
                    />
                    <button onClick={handleImport} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
                        Run Import
                    </button>
                </div>
            )}

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-3 sm:px-6 py-3 sm:py-4 w-10">
                                    <input
                                        type="checkbox"
                                        checked={filteredContacts.length > 0 && selectedIds.size === filteredContacts.length}
                                        onChange={toggleSelectAll}
                                    />
                                </th>
                                <th className="px-3 sm:px-6 py-3 sm:py-4 text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">Contact</th>
                                <th className="px-3 sm:px-6 py-3 sm:py-4 text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">Phone</th>
                                <th className="px-3 sm:px-6 py-3 sm:py-4 text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">Notes</th>
                                <th className="px-3 sm:px-6 py-3 sm:py-4 text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">Assignee</th>
                                <th className="px-3 sm:px-6 py-3 sm:py-4 text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">Callback</th>
                                <th className="px-3 sm:px-6 py-3 sm:py-4 text-xs font-semibold text-gray-500 uppercase text-right whitespace-nowrap">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredContacts.map(c => (
                                <tr key={c._id} className={`hover:bg-gray-50/50 transition ${selectedIds.has(c._id) ? 'bg-blue-50/30' : ''}`}>
                                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.has(c._id)}
                                            onChange={() => toggleSelect(c._id)}
                                        />
                                    </td>
                                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                                        <div className="font-medium text-sm text-gray-900 whitespace-nowrap">{c.name || 'Unknown'}</div>
                                        <div className="text-xs text-gray-500 truncate max-w-[200px]">{c.email}</div>
                                    </td>
                                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                                        {c.phone ? (
                                            <span className="text-sm text-gray-700 whitespace-nowrap">{c.phone}</span>
                                        ) : <span className="text-gray-400 text-xs">-</span>}
                                    </td>
                                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                                        {c.notes ? (
                                            <div className="group relative inline-block">
                                                <span className="text-xs text-gray-700 cursor-help">
                                                    {c.notes.length > 40 ? c.notes.substring(0, 40) + '...' : c.notes}
                                                </span>
                                                {c.notes.length > 40 && (
                                                    <div className="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute z-50 left-0 top-full mt-2 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-xl w-64 pointer-events-none whitespace-normal">
                                                        {c.notes}
                                                        <div className="absolute -top-1 left-4 w-2 h-2 bg-gray-900 transform rotate-45"></div>
                                                    </div>
                                                )}
                                            </div>
                                        ) : <span className="text-gray-400 text-xs">-</span>}
                                    </td>
                                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                                        {c.assignee ? (
                                            <div className="flex items-center gap-1.5">
                                                <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] font-bold">
                                                    {getAssigneeName(c.assignee)?.charAt(0)}
                                                </div>
                                                <span className="text-sm text-gray-700 whitespace-nowrap">{getAssigneeName(c.assignee)}</span>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-gray-400 italic">Unassigned</span>
                                        )}
                                    </td>
                                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                                        {c.callbackDate ? (
                                            <span className={`text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ${new Date(c.callbackDate) < new Date() ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                                                }`}>
                                                {new Date(c.callbackDate).toLocaleDateString()}
                                            </span>
                                        ) : '-'}
                                    </td>
                                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-right">
                                        <div className="flex justify-end gap-2 text-gray-400">
                                            {c.misc && Object.keys(c.misc).length > 0 && (
                                                <div className="group relative inline-block">
                                                    <button className="hover:text-indigo-600 transition">
                                                        <Info size={16} />
                                                    </button>
                                                    <div className="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute z-50 right-0 top-full mt-2 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-xl w-56 pointer-events-none">
                                                        <div className="font-semibold mb-2 text-indigo-300">Additional Info</div>
                                                        <div className="space-y-1">
                                                            {Object.entries(c.misc).map(([key, value]) => (
                                                                <div key={key} className="flex justify-between gap-2">
                                                                    <span className="text-gray-400 capitalize">{key}:</span>
                                                                    <span className="text-white font-medium">{String(value)}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <div className="absolute -top-1 right-4 w-2 h-2 bg-gray-900 transform rotate-45"></div>
                                                    </div>
                                                </div>
                                            )}
                                            <button onClick={() => handleEdit(c)} className="hover:text-blue-600 transition">
                                                <Edit size={16} />
                                            </button>
                                            <button onClick={() => handleDelete(c._id)} className="hover:text-red-500 transition">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredContacts.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                                        <div className="flex flex-col items-center gap-2">
                                            <Filter size={24} className="opacity-20" />
                                            <p className="text-sm">No contacts found matching your filters.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <ContactEditModal
                isOpen={isEditModalOpen}
                onClose={handleCloseEdit}
                contact={editingContact}
                onSave={fetchContacts}
            />

            <TeamManagerModal
                isOpen={isTeamModalOpen}
                onClose={() => setIsTeamModalOpen(false)}
            />
        </div>
    );
};

export default ContactsPage;
