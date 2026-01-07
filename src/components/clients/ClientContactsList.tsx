import { useClientContacts, ClientContact } from "@/hooks/useClientContacts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  User, Mail, Phone, Building, Star, Plus, MoreHorizontal,
  Pencil, Trash2 
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface ClientContactsListProps {
  clientId: string;
  onAddContact?: () => void;
  onEditContact?: (contact: ClientContact) => void;
  className?: string;
}

export function ClientContactsList({ 
  clientId, 
  onAddContact,
  onEditContact,
  className 
}: ClientContactsListProps) {
  const { 
    contacts, 
    primaryContact, 
    isLoading, 
    setPrimaryContact 
  } = useClientContacts(clientId);

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Contatos</CardTitle>
        {onAddContact && (
          <Button size="sm" onClick={onAddContact}>
            <Plus className="h-4 w-4 mr-1" />
            Adicionar
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {contacts.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-4">
            Nenhum contato cadastrado
          </p>
        ) : (
          <div className="space-y-3">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                className={cn(
                  "p-3 rounded-lg border",
                  contact.is_primary && "border-primary bg-primary/5"
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                      <User className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        {contact.name}
                        {contact.is_primary && (
                          <Badge variant="default" className="text-xs">
                            <Star className="h-3 w-3 mr-1" />
                            Principal
                          </Badge>
                        )}
                      </div>
                      {contact.role && (
                        <p className="text-sm text-muted-foreground">
                          {contact.role}
                          {contact.department && ` • ${contact.department}`}
                        </p>
                      )}
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {!contact.is_primary && (
                        <DropdownMenuItem onClick={() => setPrimaryContact.mutate(contact.id)}>
                          <Star className="h-4 w-4 mr-2" />
                          Definir como principal
                        </DropdownMenuItem>
                      )}
                      {onEditContact && (
                        <DropdownMenuItem onClick={() => onEditContact(contact)}>
                          <Pencil className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="mt-2 flex flex-wrap gap-3 text-sm">
                  {contact.email && (
                    <a 
                      href={`mailto:${contact.email}`}
                      className="flex items-center gap-1 text-muted-foreground hover:text-primary"
                    >
                      <Mail className="h-4 w-4" />
                      {contact.email}
                    </a>
                  )}
                  {contact.phone && (
                    <a 
                      href={`tel:${contact.phone}`}
                      className="flex items-center gap-1 text-muted-foreground hover:text-primary"
                    >
                      <Phone className="h-4 w-4" />
                      {contact.phone}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
