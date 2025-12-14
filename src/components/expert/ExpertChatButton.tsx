import { useState } from "react";
import { Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExpertChatDialog } from "./ExpertChatDialog";

interface ExpertChatButtonProps {
  clientId?: string;
  clientName?: string;
}

export function ExpertChatButton({ clientId, clientName }: ExpertChatButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-xl bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 z-50"
        size="icon"
      >
        <Bot className="h-6 w-6" />
      </Button>
      
      <ExpertChatDialog 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)}
        clientId={clientId}
        clientName={clientName}
      />
    </>
  );
}
