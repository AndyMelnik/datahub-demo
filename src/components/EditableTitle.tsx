import React, { useState, useRef, useEffect } from 'react';

interface EditableTitleProps {
  value: string;
  onChange: (value: string) => void;
  isEditing: boolean;
  className?: string;
  placeholder?: string;
}

export const EditableTitle: React.FC<EditableTitleProps> = ({
  value,
  onChange,
  isEditing,
  className = '',
  placeholder = 'Enter title...',
}) => {
  const [isEditingLocal, setIsEditingLocal] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTempValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditingLocal && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditingLocal]);

  const handleDoubleClick = () => {
    if (isEditing) {
      setIsEditingLocal(true);
    }
  };

  const handleBlur = () => {
    if (tempValue.trim()) {
      onChange(tempValue.trim());
    } else {
      setTempValue(value);
    }
    setIsEditingLocal(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBlur();
    } else if (e.key === 'Escape') {
      setTempValue(value);
      setIsEditingLocal(false);
    }
  };

  if (isEditingLocal) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={tempValue}
        onChange={(e) => setTempValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={`${className} border-2 border-indigo-400 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
        placeholder={placeholder}
        style={{ background: 'var(--surface-1)' }}
      />
    );
  }

  return (
    <div
      onDoubleClick={handleDoubleClick}
      className={`${className} ${isEditing ? 'cursor-pointer hover:bg-indigo-50 hover:border-2 hover:border-dashed hover:border-indigo-300 rounded px-2 py-1' : ''}`}
      title={isEditing ? 'Double-click to edit' : ''}
    >
      {value}
    </div>
  );
};

