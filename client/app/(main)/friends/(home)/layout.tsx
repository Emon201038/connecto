import React from "react";

const layout = ({
  children,
  requests,
  suggestions,
}: {
  children: React.ReactNode;
  requests: React.ReactNode;
  suggestions: React.ReactNode;
}) => {
  return (
    <div className="flex-1 md:mx-0 p-6 bg-shade">
      {requests}
      {children}
      {suggestions}
    </div>
  );
};

export default layout;
