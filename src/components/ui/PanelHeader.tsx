import React from "react";

interface PanelHeaderProps {
  title: string;
  children?: React.ReactNode;
}

export const PanelHeader: React.FC<PanelHeaderProps> = ({
  title,
  children,
}) => {
  return (
    <div className="flex flex-col gap-2 px-4 py-3 border-b flex-shrink-0">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{title}</h2>
        </div>
        {children}
      </div>
    </div>
  );
};
