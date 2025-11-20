import React from 'react';
import GridLayout, { Layout, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import '../styles/grid-layout.css';

const ResponsiveGridLayout = WidthProvider(GridLayout);

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
    <ResponsiveGridLayout
      className="layout"
      layout={layout}
      cols={12}
      rowHeight={80}
      isDraggable={isEditMode}
      isResizable={isEditMode}
      onLayoutChange={onLayoutChange}
      draggableHandle=".drag-handle"
      resizeHandles={['se', 'sw', 'ne', 'nw']}
      compactType="vertical"
      preventCollision={false}
      margin={[16, 16]}
      containerPadding={[0, 0]}
    >
      {children}
    </ResponsiveGridLayout>
  );
};

