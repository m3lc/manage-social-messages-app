import { useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
  getFilteredRowModel,
} from '@tanstack/react-table';
import './mentions-table.css';

export function MentionsTable({ data, onRowClick, updateMention }) {
  const handleDisposition = useMemo(() => {
    return async (e, mentionId, disposition) => {
      e.stopPropagation();
      try {
        await updateMention(mentionId, { disposition });
      } catch (err) {
        console.error('Failed to update disposition:', err);
      }
    };
  }, [updateMention]);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        size: 100,
      },
      {
        accessorKey: 'content',
        header: 'Content',
        size: 300,
      },
      {
        accessorKey: 'platform',
        header: 'Platform',
        size: 120,
      },
      {
        accessorKey: 'type',
        header: 'Type',
        size: 120,
      },
      {
        accessorKey: 'disposition',
        header: 'Disposition',
        size: 120,
        cell: ({ row }) =>
          row.original.type !== 'reply' && row.original.state !== 'replied' ? (
            <span
              className={`status-badge ${row.original.disposition || 'pending'}`}
            >
              {row.original.disposition || 'pending'}
            </span>
          ) : null,
      },
      {
        accessorKey: 'mentionId',
        header: 'Reply To',
        size: 50,
      },
      {
        accessorKey: 'createdAt',
        header: 'Created At',
        size: 120,
      },
      {
        accessorKey: 'state',
        header: 'Status',
        size: 120,
        cell: ({ row }) => (
          <span className={`status-badge ${row.original.state || ''}`}>
            {row.original.state}
          </span>
        ),
      },
      {
        id: 'actions',
        header: 'Actions',
        size: 200,
        cell: ({ row }) =>
          row.original.type !== 'reply' && row.original.state !== 'replied' ? (
            <div className="action-buttons">
              <button
                className="action-btn reply-btn"
                onClick={e => handleDisposition(e, row.original.id, 'reply')}
                title="Mark as Reply"
              >
                Reply
              </button>
              <button
                className="action-btn ignore-btn"
                onClick={e => handleDisposition(e, row.original.id, 'ignore')}
                title="Mark as Ignore"
              >
                Ignore
              </button>
              <button
                className="action-btn escalate-btn"
                onClick={e => handleDisposition(e, row.original.id, 'escalate')}
                title="Mark as Escalate"
              >
                Escalate
              </button>
            </div>
          ) : null,
      },
    ],
    [handleDisposition]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="mentions-table-container">
      <table className="mentions-table">
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  style={{ width: header.getSize() }}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  {{
                    asc: ' \u25B2',
                    desc: ' \u25BC',
                  }[header.column.getIsSorted()] ?? null}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr
              key={row.id}
              onClick={() => onRowClick(row.original)}
              className="clickable-row"
            >
              {row.getVisibleCells().map(cell => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && (
        <div className="no-data">No mentions available</div>
      )}
    </div>
  );
}
