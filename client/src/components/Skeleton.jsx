/**
 * Skeleton Loading Components
 * Provides better UX during data loading
 */

export function TableSkeleton({ rows = 5, columns = 5 }) {
  return (
    <div className="animate-pulse">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {Array.from({ length: columns }).map((_, idx) => (
                <th key={idx} className="px-6 py-3">
                  <div className="h-4 bg-gray-300 rounded"></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Array.from({ length: rows }).map((_, rowIdx) => (
              <tr key={rowIdx}>
                {Array.from({ length: columns }).map((_, colIdx) => (
                  <td key={colIdx} className="px-6 py-4">
                    <div className="h-4 bg-gray-200 rounded"></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow p-6 animate-pulse">
      <div className="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
      </div>
    </div>
  );
}

export function ListSkeleton({ items = 5 }) {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: items }).map((_, idx) => (
        <div key={idx} className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-300 rounded w-1/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function FormSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow p-6 animate-pulse">
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx}>
            <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        ))}
        <div className="h-10 bg-gray-300 rounded w-1/3"></div>
      </div>
    </div>
  );
}

export default {
  TableSkeleton,
  CardSkeleton,
  ListSkeleton,
  FormSkeleton,
};

