import { QuickActionButtons } from "@/components/QuickActionButtons";
import { QuickActions } from "@/components/QuickActions";
import { UpcomingEvents } from "@/components/UpcomingEvents";
import { StatsCards } from "@/components/StatsCards";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* Quick Action Buttons */}
      <QuickActionButtons />

      {/* Upcoming Events - Moved to top */}
      <UpcomingEvents />

      {/* Stats Overview */}
      <StatsCards />

      {/* File Upload Actions */}
      <QuickActions />
    </div>
  );
};

export default Dashboard;