import { AppLayout } from "@/components/AppLayout";
import { ChatAssistant } from "@/components/assistant/ChatAssistant";

export default function AssistantPage() {
  return (
    <AppLayout>
      <div className="flex-1 h-[calc(100vh-theme(spacing.14))] md:h-screen flex flex-col">
        <div className="flex items-center justify-between space-y-2 p-4 md:p-8 pt-6 border-b">
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            AI Medication Assistant
          </h1>
        </div>
        <ChatAssistant />
      </div>
    </AppLayout>
  );
}
