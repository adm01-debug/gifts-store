import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Bell,
  Plus,
  Check,
  Clock,
  Phone,
  Mail,
  Users,
  FileText,
  AlertCircle,
  Calendar as CalendarIcon,
  ChevronRight,
  MoreHorizontal,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useFollowUpReminders, CreateReminderInput } from "@/hooks/useFollowUpReminders";
import { format, isToday, isTomorrow, isPast } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

const typeIcons = {
  follow_up: Bell,
  call: Phone,
  email: Mail,
  meeting: Users,
  quote: FileText,
};

const typeLabels = {
  follow_up: "Follow-up",
  call: "Ligação",
  email: "E-mail",
  meeting: "Reunião",
  quote: "Orçamento",
};

const priorityLabels = {
  low: "Baixa",
  medium: "Média",
  high: "Alta",
  urgent: "Urgente",
};

export function FollowUpRemindersPopover() {
  const {
    pendingReminders,
    upcomingReminders,
    pendingCount,
    createReminder,
    completeReminder,
    snoozeReminder,
    deleteReminder,
    isCreating,
  } = useFollowUpReminders();

  const [isOpen, setIsOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [formData, setFormData] = useState<Partial<CreateReminderInput>>({
    title: "",
    description: "",
    reminder_type: "follow_up",
    priority: "medium",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;

    await createReminder({
      title: formData.title,
      description: formData.description,
      reminder_date: selectedDate,
      reminder_type: formData.reminder_type as any,
      priority: formData.priority as any,
    });

    setIsDialogOpen(false);
    setFormData({
      title: "",
      description: "",
      reminder_type: "follow_up",
      priority: "medium",
    });
  };

  const getReminderStatusStyle = (reminderDate: string) => {
    const date = new Date(reminderDate);
    if (isPast(date) && !isToday(date)) {
      return "border-l-destructive bg-destructive/5";
    }
    if (isToday(date)) {
      return "border-l-warning bg-warning/5";
    }
    return "border-l-primary bg-primary/5";
  };

  const formatReminderDate = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isToday(date)) return "Hoje";
    if (isTomorrow(date)) return "Amanhã";
    return format(date, "dd/MM", { locale: ptBR });
  };

  const allReminders = [...pendingReminders, ...upcomingReminders].slice(0, 10);

  return (
    <>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="relative h-9 w-9"
          >
            <Bell className="h-5 w-5" />
            {pendingCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
              >
                {pendingCount > 9 ? "9+" : pendingCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="end">
          <div className="flex items-center justify-between p-4 border-b">
            <h4 className="font-semibold">Lembretes</h4>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="h-7 gap-1">
                  <Plus className="h-3.5 w-3.5" />
                  Novo
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-primary" />
                    Novo Lembrete
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label>Título</Label>
                    <Input
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      placeholder="Ex: Ligar para cliente sobre orçamento"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Descrição (opcional)</Label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      placeholder="Detalhes adicionais..."
                      rows={2}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Tipo</Label>
                      <Select
                        value={formData.reminder_type}
                        onValueChange={(v) =>
                          setFormData({ ...formData, reminder_type: v as any })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(typeLabels).map(([value, label]) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Prioridade</Label>
                      <Select
                        value={formData.priority}
                        onValueChange={(v) =>
                          setFormData({ ...formData, priority: v as any })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(priorityLabels).map(([value, label]) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Data do Lembrete</Label>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => date && setSelectedDate(date)}
                      locale={ptBR}
                      className="rounded-md border"
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isCreating}>
                    {isCreating ? "Criando..." : "Criar Lembrete"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <ScrollArea className="h-[320px]">
            {allReminders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center px-4">
                <Bell className="h-10 w-10 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  Nenhum lembrete pendente
                </p>
              </div>
            ) : (
              <div className="divide-y">
                {allReminders.map((reminder) => {
                  const TypeIcon = typeIcons[reminder.reminder_type];
                  const isOverdue =
                    isPast(new Date(reminder.reminder_date)) &&
                    !isToday(new Date(reminder.reminder_date));

                  return (
                    <div
                      key={reminder.id}
                      className={cn(
                        "p-3 border-l-4 transition-colors",
                        getReminderStatusStyle(reminder.reminder_date)
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={cn(
                            "p-1.5 rounded-md",
                            isOverdue
                              ? "bg-destructive/20 text-destructive"
                              : "bg-primary/20 text-primary"
                          )}
                        >
                          <TypeIcon className="h-4 w-4" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm line-clamp-1">
                            {reminder.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span
                              className={cn(
                                "text-xs",
                                isOverdue
                                  ? "text-destructive font-medium"
                                  : "text-muted-foreground"
                              )}
                            >
                              {isOverdue && (
                                <AlertCircle className="h-3 w-3 inline mr-1" />
                              )}
                              {formatReminderDate(reminder.reminder_date)}
                            </span>
                            {reminder.client && (
                              <span className="text-xs text-muted-foreground truncate">
                                • {reminder.client.name}
                              </span>
                            )}
                          </div>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => completeReminder(reminder.id)}
                            >
                              <Check className="h-4 w-4 mr-2" />
                              Concluir
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                snoozeReminder({ reminderId: reminder.id, days: 1 })
                              }
                            >
                              <Clock className="h-4 w-4 mr-2" />
                              Adiar 1 dia
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                snoozeReminder({ reminderId: reminder.id, days: 3 })
                              }
                            >
                              <Clock className="h-4 w-4 mr-2" />
                              Adiar 3 dias
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => deleteReminder(reminder.id)}
                              className="text-destructive"
                            >
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </PopoverContent>
      </Popover>
    </>
  );
}
