import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AppearanceSettings } from "@/components/settings/AppearanceSettings";

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <AppearanceSettings />
    </DashboardLayout>
  );
}