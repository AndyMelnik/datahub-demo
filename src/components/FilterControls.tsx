import React from 'react';

interface FilterControlsProps {
  groups: string[];
  departments: string[];
  selectedGroup: string;
  selectedDepartment: string;
  onGroupChange: (group: string) => void;
  onDepartmentChange: (department: string) => void;
  onResetFilters: () => void;
}

export const FilterControls: React.FC<FilterControlsProps> = ({
  groups,
  departments,
  selectedGroup,
  selectedDepartment,
  onGroupChange,
  onDepartmentChange,
  onResetFilters,
}) => {
  const hasActiveFilters = selectedGroup !== 'all' || selectedDepartment !== 'all';

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 
          className="text-base font-semibold"
          style={{ color: 'var(--text-primary)' }}
        >
          Filters
        </h3>
        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="text-sm font-medium flex items-center transition-colors"
            style={{ color: 'var(--primary)' }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary-hover)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--primary)'}
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Reset Filters
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Group Filter */}
        <div>
          <label htmlFor="group-filter" className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Group
          </label>
          <select
            id="group-filter"
            value={selectedGroup}
            onChange={(e) => onGroupChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
          >
            <option value="all">All Groups</option>
            {groups.map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>
        </div>

        {/* Department Filter */}
        <div>
          <label htmlFor="department-filter" className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Department
          </label>
          <select
            id="department-filter"
            value={selectedDepartment}
            onChange={(e) => onDepartmentChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
          >
            <option value="all">All Departments</option>
            {departments.map((department) => (
              <option key={department} value={department}>
                {department}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="text-sm text-gray-600">Active filters:</span>
          {selectedGroup !== 'all' && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
              Group: {selectedGroup}
              <button
                onClick={() => onGroupChange('all')}
                className="ml-2 text-indigo-600 hover:text-indigo-800"
              >
                ×
              </button>
            </span>
          )}
          {selectedDepartment !== 'all' && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
              Department: {selectedDepartment}
              <button
                onClick={() => onDepartmentChange('all')}
                className="ml-2 text-purple-600 hover:text-purple-800"
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

