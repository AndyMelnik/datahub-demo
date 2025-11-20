import React from 'react';
import GridLayout, { Layout } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import '../styles/grid-layout.css';

interface DraggableDashboardProps {
  layout: Layout[];
  onLayoutChange: (layout: Layout[]) => void;
  isEditMode: boolean;
  children: React.ReactNode;
}

export const DraggableDashboard: React.FC<DraggableDashboardProps> = ({
  layout,
  onLayoutChange,
  isEditMode,
  children,
}) => {
  return (
    <GridLayout
      className="layout"
      layout={layout}
      cols={12}
      rowHeight={80}
      width={1200}
      isDraggable={isEditMode}
      isResizable={isEditMode}
      onLayoutChange={onLayoutChange}
      draggableHandle=".drag-handle"
      resizeHandles={['se', 'sw', 'ne', 'nw']}
      compactType="vertical"
      preventCollision={false}
    >
      {children}
    </GridLayout>
  );
};

