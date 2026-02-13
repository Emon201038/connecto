import React from "react";

const layout = ({
  children,
  stats,
  userDemographics,
  userGrowth,
  weeklyAngagement,
}: {
  children: React.ReactNode;
  stats: React.ReactNode;
  userDemographics: React.ReactNode;
  userGrowth: React.ReactNode;
  weeklyAngagement: React.ReactNode;
}) => {
  return (
    <div className="min-h-screen bg-background">
      <div className="w-full p-6 space-y-8">
        {stats}
        <div className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {userGrowth}
            {userDemographics}
          </div>
          {weeklyAngagement}
          {/* {children} */}
        </div>
      </div>
    </div>
  );
};

export default layout;
