import { useState } from "react";
import { useFollowUpReminders, FollowUpReminder } from "@/hooks/useFollowUpReminders";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Bell,
  Calendar,
  CheckCircle2,
  Clock,
  Plus,
  Trash2,
  User,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

const PRIORITY_COLORS = {
  high: "bg-red-500",
  medium: "bg-yellow-500",
  low: "bg-green-500",
};

const PRIORITY_LABELS = {
  high: "Alta",
  medium: "Média",
  low: "Baixa",
};

interface FollowUpListProps {
  userId?: string;
  clientId?: string;
  showCreateButton?: boolean;
}

export function FollowUpList({ userId, clientId, showCreateButton = true }: FollowUpListProps) {
  const { reminders, isLoading, completeReminder, deleteReminder } = useFollowUpReminders(userId, clientId);
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("pending");

  const filteredReminders = reminders.filter((r) => {
    if (filter === "pending") return !r.is_completed;
    if (filter === "completed") return r.is_completed;
    return true;
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Lembretes de Follow-up
        </CardTitle>
        <div className="flex gap-2">
          <Button
            variant={filter === "pending" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("pending")}
          >
            Pendentes
          </Button>
          <Button
            variant={filter === "completed" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("completed")}
          >
            Concluídos
          </Button>
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
          >
            Todos
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {filteredReminders.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Bell className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Nenhum lembrete {filter === "pending" ? "pendente" : filter === "completed" ? "concluído" : ""}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredReminders.map((reminder) => (
              <ReminderItem
                key={reminder.id}
                reminder={reminder}
                onComplete={() => completeReminder.mutate(reminder.id)}
                onDelete={() => deleteReminder.mutate(reminder.id)}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ReminderItem({
  reminder,
  onComplete,
  onDelete,
}: {
  reminder: FollowUpReminder;
  onComplete: () => void;
  onDelete: () => void;
}) {
  const isOverdue = !reminder.is_completed && new Date(reminder.reminder_date) < new Date();

  return (
    <div
      className={`flex items-start gap-3 p-3 rounded-lg border ${
        reminder.is_completed
          ? "bg-muted/50 opacity-60"
          : isOverdue
          ? "bg-red-50 border-red-200"
          : "bg-card"
      }`}
    >
      <Checkbox
        checked={reminder.is_completed}
        onCheckedChange={onComplete}
        disabled={reminder.is_completed}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={`font-medium ${reminder.is_completed ? "line-through" : ""}`}>
            {reminder.title}
          </span>
          <Badge
            variant="secondary"
            className={`${PRIORITY_COLORS[reminder.priority as keyof typeof PRIORITY_COLORS]} text-white text-xs`}
          >
            {PRIORITY_LABELS[reminder.priority as keyof typeof PRIORITY_LABELS]}
          </Badge>
        </div>
        {reminder.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-1">
            {reminder.description}
          </p>
        )}
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formatDistanceToNow(new Date(reminder.reminder_date), {
              addSuffix: true,
              locale: ptBR,
            })}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {reminder.reminder_type}
          </span>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="text-destructive hover:text-destructive"
        onClick={onDelete}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
