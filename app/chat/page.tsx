import { ChatInterface } from "@/components/chat/chat-interface";

export default function ChatPage() {
  return (
    <div className="container mx-auto px-4 py-8 h-full">
      <h1 className="text-3xl font-bold mb-6">Chat</h1>
      <div className="h-[calc(100vh-12rem)]">
        <ChatInterface mode="client" />
      </div>
    </div>
  );
}

