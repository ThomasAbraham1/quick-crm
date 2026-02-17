import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Upload, Trash2, Copy, Filter, Calendar, Edit, Users, User, Search, Info, UserPlus, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import ContactEditModal from '../components/Contacts/ContactEditModal';
import TeamManagerModal from '../components/Team/TeamManagerModal';
import { parseContactData } from '../utils/dataParser';
import { useContacts, useImportContacts, useDeleteContact, type Contact } from '../hooks';
import api from '../api';
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    flexRender,
    SortingState,
    RowSelectionState,
    getPaginationRowModel,
} from '@tanstack/react-table';
import { createContactColumns } from '../components/Contacts/ContactTableColumns';

interface TeamMember {
    _id: string;
    name: string;
}

const ContactsPage = () => {
    // URL Search Params for shareable pagination
    const [searchParams, setSearchParams] = useSearchParams();
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    // Use TanStack Query hooks with pagination
    const { data, isLoading, isFetching, error, refetch } = useContacts(page, limit);
    const contacts = data?.data || [];
    const pagination = data?.pagination;

    const importContacts = useImportContacts();
    const deleteContact = useDeleteContact();

    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

    // Modals
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingContact, setEditingContact] = useState<Contact | null>(null);
    const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);

    // Import
    const [jsonInput, setJsonInput] = useState('');
    const [isImporting, setIsImporting] = useState(false);
    const [isParsing, setIsParsing] = useState(false);

    // Filters
    const [filterDate, setFilterDate] = useState('');
    const [filterAssignee, setFilterAssignee] = useState('');
    const [filterCallback, setFilterCallback] = useState(''); // 'today', 'overdue', 'future'
    const [searchQuery, setSearchQuery] = useState('');

    // Keep selectedIds for bulk operations compatibility
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    // TanStack Table State
    const [sorting, setSorting] = useState<SortingState>([]);
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

    // Fetch team on mount (can be migrated to a hook later if needed)
    React.useEffect(() => {
        fetchTeam();
    }, []);

    // Scroll to top when page changes (prevents scroll jumping during pagination)
    React.useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [page]);

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
            result = result.filter((c: Contact) =>
                c.name?.toLowerCase().includes(lower) ||
                c.email?.toLowerCase().includes(lower)
            );
        }

        // Date Added
        if (filterDate) {
            const filterTime = new Date(filterDate).getTime();
            result = result.filter((c: Contact) => {
                if (!c.dateAdded) return false;
                return new Date(c.dateAdded).getTime() >= filterTime;
            });
        }

        // Assignee
        if (filterAssignee) {
            if (filterAssignee === 'unassigned') {
                result = result.filter((c: Contact) => !c.assignee);
            } else {
                result = result.filter((c: Contact) => c.assignee === filterAssignee);
            }
        }

        // Callback Status
        if (filterCallback) {
            const todayStr = new Date().toISOString().split('T')[0];
            result = result.filter((c: Contact) => {
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
            setSelectedIds(new Set(filteredContacts.map((c: Contact) => c._id)));
        }
    };

    const toggleSelect = (id: string) => {
        const newSet = new Set(selectedIds);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setSelectedIds(newSet);
    };

    const handleImport = async () => {
        setIsParsing(true);

        try {
            // Small delay to ensure spinner is visible
            await new Promise(resolve => setTimeout(resolve, 300));

            // Parse the input (auto-detects CSV or JSON)
            const parsedContacts = parseContactData(jsonInput);

            if (parsedContacts.length === 0) {
                setIsParsing(false);
                alert('❌ No valid contacts found!\\n\\nAll businesses have websites or no valid data was found.');
                return;
            }

            // Validate that we have at least names
            const missingNameIndexes: number[] = [];
            parsedContacts.forEach((contact, index) => {
                if (!contact.name || contact.name.trim() === '') {
                    missingNameIndexes.push(index);
                }
            });

            if (missingNameIndexes.length > 0) {
                const positions = missingNameIndexes.map(i => `#${i + 1}`).join(', ');
                setIsParsing(false);
                alert(`❌ Import Failed!\\n\\nThe following contact(s) are missing the required \"name\" field:\\nPositions: ${positions}\\n\\nPlease add a name field to all contacts before importing.`);
                return;
            }

            setIsParsing(false);

            // Import the contacts using TanStack Query mutation
            await importContacts.mutateAsync({ contacts: parsedContacts });
            setIsImporting(false);
            setJsonInput('');
            alert(`✅ Successfully imported ${parsedContacts.length} contact(s)!\\n\\n${parsedContacts.filter(c => !c.email).length > 0 ? `Note: ${parsedContacts.filter(c => !c.email).length} contact(s) don't have email addresses.` : ''}`);
        } catch (e: any) {
            setIsParsing(false);
            alert('❌ Parse Error: ' + e.message);
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure?')) return;
        await deleteContact.mutateAsync(id);
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
        try {
            for (const id of selectedIds) {
                await deleteContact.mutateAsync(id);
            }
            setSelectedIds(new Set());
            setRowSelection({}); // Clear table selection
            toast.success(`Deleted ${selectedIds.size} contacts`);
        } catch (e: any) {
            toast.error('Failed to delete contacts');
        }
    }

    const handleBulkAssign = async (assignee: string) => {
        if (!assignee) return;
        try {
            await api.put('contacts/bulk-assign', {
                contactIds: Array.from(selectedIds),
                assignee
            });
            setSelectedIds(new Set());
            setRowSelection({}); // Clear table selection
            refetch();
            toast.success('Contacts assigned successfully');
        } catch (e) {
            console.error('Bulk assign failed:', e);
            toast.error('Failed to assign contacts');
        }
    }

    const handleCopyFilteredDocs = () => {
        const selectedRows = table.getSelectedRowModel().rows;

        if (selectedRows.length === 0) {
            toast.error('No contacts selected');
            return;
        }

        const exportData = selectedRows.map(row => {
            const c = row.original;
            return {
                name: c.name,
                email: c.email,
                phone: c.phone || '',
                website: c.website || '',
                address: c.address || ''
            };
        });

        const jsonString = JSON.stringify(exportData, null, 2);

        navigator.clipboard.writeText(jsonString).then(() => {
            toast.success(`Copied ${exportData.length} contacts to JSON!`);
        }).catch(err => {
            console.error('Failed to copy: ', err);
            toast.error('Failed to copy to clipboard');
        });
    }

    const getAssigneeName = (id?: string) => {
        if (!id) return undefined;
        const member = teamMembers.find(m => m._id === id);
        return member ? member.name : 'Unknown';
    };

    // Create TanStack Table columns with callbacks
    const columns = useMemo(
        () => createContactColumns({
            handleEdit,
            handleDelete,
            getAssigneeName,
        }),
        [teamMembers] // Recreate when team members change
    );

    // Initialize TanStack Table
    const table = useReactTable({
        data: filteredContacts,
        columns,
        state: {
            sorting,
            rowSelection,
        },
        manualPagination: true,
        onSortingChange: setSorting,
        onRowSelectionChange: setRowSelection,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        enableRowSelection: true,
        getRowId: (row) => row._id, // Use _id as row ID
    });

    // Sync TanStack row selection with selectedIds for bulk operations
    React.useEffect(() => {
        const selectedRows = table.getSelectedRowModel().rows;
        setSelectedIds(new Set(selectedRows.map(r => r.original._id)));
    }, [rowSelection, table]);

    // DON'T return early for loading - show skeleton in table instead to prevent page flash

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
                    <h3 className="font-semibold text-blue-900 mb-2">Paste CSV or JSON Data</h3>
                    <p className="text-xs text-blue-700 mb-3">
                        <strong>Supports:</strong> CSV or JSON format • <strong>Auto-filters:</strong> Businesses with websites
                        <br />
                        <strong>CSV Example:</strong> <code>name,email,phone,website,address</code>
                        <br />
                        <strong>JSON Example:</strong> <code>[{`{\"name\": \"...\", \"email\": \"...\", \"phone\": \"...\", \"website\": \"\"}`}]</code>
                    </p>
                    <textarea
                        className="w-full p-3 rounded-lg border border-blue-200 mb-3 h-32 font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                        value={jsonInput}
                        onChange={(e) => setJsonInput(e.target.value)}
                        placeholder='Paste CSV or JSON here...'
                        disabled={isParsing}
                    />
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleImport}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            disabled={isParsing || !jsonInput.trim()}
                        >
                            {isParsing ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    Parsing...
                                </>
                            ) : (
                                <>
                                    <Upload size={16} />
                                    Run Import
                                </>
                            )}
                        </button>
                        <button
                            onClick={() => {
                                setIsImporting(false);
                                setJsonInput('');
                                setIsParsing(false);
                            }}
                            className="text-gray-600 text-sm hover:underline"
                            disabled={isParsing}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Main Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Loading banner for initial load */}
                {isLoading && (
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 px-6 py-3">
                        <div className="flex items-center gap-3">
                            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-sm font-medium text-blue-900">
                                Loading your contacts...
                            </span>
                        </div>
                    </div>
                )}

                <div className="overflow-x-auto overflow-y-auto flex-1" style={{ maxHeight: 'calc(100vh - 320px)' }}>
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100 sticky top-0 z-10">
                            {table.getHeaderGroups().map(headerGroup => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map(header => (
                                        <th
                                            key={header.id}
                                            className={`px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${header.column.getCanSort() ? 'cursor-pointer select-none' : ''
                                                } ${(header.column.columnDef.meta as any)?.className || ''}`}
                                            onClick={header.column.getToggleSortingHandler()}
                                        >
                                            <div className="flex items-center gap-2">
                                                {flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                                {/* Sort indicator */}
                                                {header.column.getCanSort() && (
                                                    <span className="text-gray-400 text-xs">
                                                        {{
                                                            asc: '↑',
                                                            desc: '↓',
                                                        }[header.column.getIsSorted() as string] ?? '↕'}
                                                    </span>
                                                )}
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {/* Loading state - show skeleton */}
                            {isLoading && (
                                <>
                                    {[...Array(5)].map((_, i) => (
                                        <tr key={`skeleton-${i}`} className="animate-pulse">
                                            {[...Array(columns.length)].map((_, j) => (
                                                <td key={j} className="px-3 sm:px-6 py-3 sm:py-4">
                                                    <div className="h-4 bg-gray-200 rounded"></div>
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </>
                            )}

                            {/* Error state */}
                            {error && !isLoading && (
                                <tr>
                                    <td colSpan={columns.length} className="px-6 py-12 text-center text-red-500">
                                        <div className="flex flex-col items-center gap-2">
                                            <p className="text-sm">Error loading contacts. Please try again.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}

                            {/* Data rows - with loading overlay indicator */}
                            {!isLoading && !error && table.getRowModel().rows.map(row => (
                                <tr
                                    key={row.id}
                                    className={`hover:bg-gray-50/50 transition ${row.getIsSelected() ? 'bg-blue-50/30' : ''
                                        } ${isFetching ? 'opacity-50' : ''}`}
                                >
                                    {row.getVisibleCells().map(cell => (
                                        <td
                                            key={cell.id}
                                            className={`px-3 sm:px-6 py-3 sm:py-4 ${(cell.column.columnDef.meta as any)?.className || ''
                                                }`}
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}

                            {/* Empty state */}
                            {!isLoading && !error && table.getRowModel().rows.length === 0 && (
                                <tr>
                                    <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-400">
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

                {/* Pagination Controls */}
                {pagination && pagination.totalPages > 1 && (
                    <div className="px-3 sm:px-6 py-3 sm:py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                        {/* Results count - compact on mobile */}
                        <div className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
                            <span className="hidden sm:inline">Showing </span>
                            <span className="font-medium">{((pagination.page - 1) * pagination.limit) + 1}</span>-
                            <span className="font-medium">{Math.min(pagination.page * pagination.limit, pagination.total)}</span>
                            <span className="hidden sm:inline"> of </span>
                            <span className="sm:hidden mx-1">/</span>
                            <span className="font-medium">{pagination.total}</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => {
                                    setSearchParams({ page: String(page - 1), limit: String(limit) });
                                }}
                                disabled={page <= 1}
                                className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                            >
                                Previous
                            </button>

                            <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                <span>Page</span>
                                <input
                                    type="number"
                                    min={1}
                                    max={pagination.totalPages}
                                    value={page}
                                    onChange={(e) => {
                                        const newPage = parseInt(e.target.value, 10);
                                        // Only update if it's a valid number
                                        if (!isNaN(newPage) && newPage >= 1 && newPage <= pagination.totalPages) {
                                            setSearchParams({ page: String(newPage), limit: String(limit) });
                                        }
                                    }}
                                    onBlur={(e) => {
                                        // On blur, clamp to valid range if user typed invalid number
                                        const newPage = parseInt(e.target.value, 10);
                                        if (isNaN(newPage) || newPage < 1) {
                                            setSearchParams({ page: '1', limit: String(limit) });
                                        } else if (newPage > pagination.totalPages) {
                                            setSearchParams({ page: String(pagination.totalPages), limit: String(limit) });
                                        }
                                    }}
                                    className="w-16 px-2 py-1 text-center border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <span>of <span className="font-medium">{pagination.totalPages}</span></span>
                            </div>

                            <button
                                onClick={() => {
                                    setSearchParams({ page: String(page + 1), limit: String(limit) });
                                }}
                                disabled={page >= pagination.totalPages}
                                className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <ContactEditModal
                isOpen={isEditModalOpen}
                onClose={handleCloseEdit}
                contact={editingContact}
                onSave={refetch}
            />

            <TeamManagerModal
                isOpen={isTeamModalOpen}
                onClose={() => setIsTeamModalOpen(false)}
            />
        </div>
    );
};

export default ContactsPage;
