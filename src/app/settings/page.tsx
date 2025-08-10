
import { EmergencyContacts } from "@/components/settings/EmergencyContacts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
  return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            Settings
          </h1>
          <p className="text-muted-foreground">Manage your account settings and preferences.</p>
        </div>
        <div className="grid gap-6">
          <EmergencyContacts />
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                Manage your notification preferences. (UI placeholder)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Notification settings will be available here.</p>
            </CardContent>
          </Card>
        </div>
      </div>
  );
}
