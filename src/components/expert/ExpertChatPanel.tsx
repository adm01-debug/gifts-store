import { useState } from "react";
import { useExpertConversations, useExpertMessages } from "@/hooks/useExpertChat";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Send, Plus, Bot, User } from "lucide-react";

interface ExpertChatPanelProps { userId: string; }

export function ExpertChatPanel({ userId }: ExpertChatPanelProps) {
  const { conversations, createConversation } = useExpertConversations(userId);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { messages, sendMessage } = useExpertMessages(selectedId || undefined);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim() || !selectedId) return;
    sendMessage.mutate({ conversationId: selectedId, role: "user", content: input });
    setInput("");
  };

  const handleNew = () => {
    createConversation.mutate({ userId, expertType: "assistant", title: "Nova conversa" }, { onSuccess: (d) => setSelectedId(d.id) });
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2"><MessageSquare className="h-5 w-5" />Expert Chat</CardTitle>
        <Button size="sm" onClick={handleNew}><Plus className="h-4 w-4 mr-1" />Nova</Button>
      </CardHeader>
      <CardContent className="flex-1 flex gap-4 overflow-hidden">
        <div className="w-48 border-r pr-4">
          <ScrollArea className="h-full">
            {conversations.map((c) => (
              <div key={c.id} onClick={() => setSelectedId(c.id)} className={`p-2 rounded cursor-pointer mb-1 ${selectedId === c.id ? "bg-primary/10" : "hover:bg-muted"}`}>
                <p className="text-sm truncate">{c.title}</p>
              </div>
            ))}
          </ScrollArea>
        </div>
        <div className="flex-1 flex flex-col">
          <ScrollArea className="flex-1 pr-4">
            {messages.map((m) => (
              <div key={m.id} className={`flex gap-2 mb-3 ${m.role === "user" ? "justify-end" : ""}`}>
                {m.role !== "user" && <Bot className="h-6 w-6 text-primary" />}
                <div className={`max-w-[80%] p-3 rounded-lg ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>{m.content}</div>
                {m.role === "user" && <User className="h-6 w-6" />}
              </div>
            ))}
          </ScrollArea>
          <div className="flex gap-2 pt-4">
            <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Digite sua mensagem..." onKeyDown={(e) => e.key === "Enter" && handleSend()} />
            <Button onClick={handleSend}><Send className="h-4 w-4" /></Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
