import { createColumnHelper, ColumnDef } from '@tanstack/react-table';
import { Info, Edit, Trash2 } from 'lucide-react';
import type { Contact } from '../../hooks';

interface ContactColumnsOptions {
    handleEdit: (contact: Contact) => void;
    handleDelete: (id: string) => void;
    getAssigneeName: (id?: string) => string | undefined;
}

// Function to create columns with callbacks
export const createContactColumns = (options: ContactColumnsOptions): ColumnDef<Contact, any>[] => {
    const { handleEdit, handleDelete, getAssigneeName } = options;
    const columnHelper = createColumnHelper<Contact>();
    return [
        // Checkbox column for selection
        columnHelper.display({
            id: 'select',
            header: ({ table }) => (
                <input
                    type="checkbox"
                    checked={table.getIsAllRowsSelected()}
                    onChange={table.getToggleAllRowsSelectedHandler()}
                />
            ),
            cell: ({ row }) => (
                <input
                    type="checkbox"
                    checked={row.getIsSelected()}
                    onChange={row.getToggleSelectedHandler()}
                />
            ),
            size: 50,
        }),

        // Contact column (name + email)
        columnHelper.accessor('name', {
            id: 'contact',
            header: 'Contact',
            cell: (info) => (
                <div>
                    <div className="font-medium text-sm text-gray-900 whitespace-nowrap">
                        {info.getValue() || 'Unknown'}
                    </div>
                    <div className="text-xs text-gray-500 truncate max-w-[200px]">
                        {info.row.original.email}
                    </div>
                </div>
            ),
            size: 250,
            enableSorting: true,
        }),

        // Phone column (hidden on mobile)
        columnHelper.accessor('phone', {
            header: 'Phone',
            cell: (info) => {
                const phone = info.getValue();
                return phone ? (
                    <span className="text-sm text-gray-700 whitespace-nowrap">{phone}</span>
                ) : (
                    <span className="text-gray-400 text-xs">-</span>
                );
            },
            size: 150,
            enableSorting: true,
            meta: {
                className: 'hidden md:table-cell', // Hide on mobile
            },
        }),

        // Notes column (with responsive truncation for mobile)
        columnHelper.accessor('notes', {
            header: 'Notes',
            cell: (info) => {
                const notes = info.getValue();
                if (!notes) return <span className="text-gray-400 text-xs">-</span>;

                // More aggressive truncation on mobile (15 chars) vs desktop (40 chars)
                const isMobile = window.innerWidth < 768;
                const maxLength = isMobile ? 15 : 40;
                const truncated = notes.length > maxLength ? notes.substring(0, maxLength) + '...' : notes;

                return (
                    <div className="group relative inline-block">
                        <span className="text-xs text-gray-700 cursor-help block max-w-[80px] sm:max-w-none truncate sm:whitespace-normal">
                            {truncated}
                        </span>
                        {notes.length > maxLength && (
                            <div className="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute z-50 left-0 top-full mt-2 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-xl w-64 pointer-events-none whitespace-normal">
                                {notes}
                                <div className="absolute -top-1 left-4 w-2 h-2 bg-gray-900 transform rotate-45"></div>
                            </div>
                        )}
                    </div>
                );
            },
            size: 200,
            enableSorting: false,
        }),

        // Assignee column
        columnHelper.accessor('assignee', {
            header: 'Assignee',
            cell: (info) => {
                const assigneeId = info.getValue();

                if (!assigneeId) {
                    return <span className="text-xs text-gray-400 italic">Unassigned</span>;
                }

                const assigneeName = getAssigneeName(assigneeId);

                return (
                    <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] font-bold">
                            {assigneeName?.charAt(0) || 'A'}
                        </div>
                        <span className="text-sm text-gray-700 whitespace-nowrap">
                            {assigneeName || 'Unknown'}
                        </span>
                    </div>
                );
            },
            size: 150,
            enableSorting: true,
        }),

        // Callback Date column
        columnHelper.accessor('callbackDate', {
            header: 'Callback',
            cell: (info) => {
                const callbackDate = info.getValue();
                if (!callbackDate) return '-';

                const isPast = new Date(callbackDate) < new Date();
                return (
                    <span className={`text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ${isPast ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                        }`}>
                        {new Date(callbackDate).toLocaleDateString()}
                    </span>
                );
            },
            size: 130,
            enableSorting: true,
            sortingFn: (rowA, rowB, columnId) => {
                const a = rowA.getValue(columnId) as string | undefined;
                const b = rowB.getValue(columnId) as string | undefined;
                if (!a) return 1;
                if (!b) return -1;
                return new Date(a).getTime() - new Date(b).getTime();
            },
        }),

        // Actions column
        columnHelper.display({
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => (
                <div className="flex justify-end gap-2 text-gray-400">
                    {/* Info button for misc data */}
                    {row.original.misc && Object.keys(row.original.misc).length > 0 && (
                        <div className="group relative inline-block">
                            <button className="hover:text-indigo-600 transition">
                                <Info size={16} />
                            </button>
                            <div className="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute z-50 right-0 top-full mt-2 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-xl w-56 pointer-events-none">
                                <div className="font-semibold mb-2 text-indigo-300">Additional Info</div>
                                <div className="space-y-1">
                                    {Object.entries(row.original.misc).map(([key, value]) => (
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

                    {/* Edit button */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(row.original);
                        }}
                        className="hover:text-blue-600 transition"
                    >
                        <Edit size={16} />
                    </button>

                    {/* Delete button */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(row.original._id);
                        }}
                        className="hover:text-red-500 transition"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            ),
            size: 120,
        }),
    ];
};
