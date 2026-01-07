import { useState } from "react";
import { useQuoteApproval } from "@/hooks/useQuoteApproval";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Link,
  Copy,
  CheckCircle2,
  Clock,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface QuoteApprovalLinkProps {
  quoteId: string;
  userId: string;
}

export function QuoteApprovalLink({ quoteId, userId }: QuoteApprovalLinkProps) {
  const { tokens, activeToken, isLoading, generateToken } = useQuoteApproval(quoteId);
  const [copied, setCopied] = useState(false);

  const approvalUrl = activeToken
    ? `${window.location.origin}/quote/approve/${activeToken.token}`
    : null;

  const handleCopy = async () => {
    if (approvalUrl) {
      await navigator.clipboard.writeText(approvalUrl);
      setCopied(true);
      toast.success("Link copiado para a área de transferência!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleGenerate = () => {
    generateToken.mutate({ quoteId, userId });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link className="h-5 w-5" />
          Link de Aprovação
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activeToken ? (
          <>
            <div className="flex gap-2">
              <Input
                value={approvalUrl || ""}
                readOnly
                className="font-mono text-sm"
              />
              <Button variant="outline" size="icon" onClick={handleCopy}>
                {copied ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
              <Button variant="outline" size="icon" asChild>
                <a href={approvalUrl || "#"} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>
                  Expira{" "}
                  {formatDistanceToNow(new Date(activeToken.expires_at), {
                    addSuffix: true,
                    locale: ptBR,
                  })}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleGenerate}
                disabled={generateToken.isPending}
              >
                <RefreshCw className={`h-4 w-4 mr-1 ${generateToken.isPending ? "animate-spin" : ""}`} />
                Gerar novo
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-4">
            <p className="text-muted-foreground mb-4">
              Nenhum link de aprovação ativo
            </p>
            <Button onClick={handleGenerate} disabled={generateToken.isPending}>
              {generateToken.isPending ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Link className="h-4 w-4 mr-2" />
              )}
              Gerar Link de Aprovação
            </Button>
          </div>
        )}

        {tokens.length > 1 && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm font-medium mb-2">Histórico de links</p>
            <div className="space-y-2">
              {tokens.slice(1, 5).map((token) => (
                <div
                  key={token.id}
                  className="flex items-center justify-between text-sm text-muted-foreground"
                >
                  <span className="font-mono truncate max-w-[200px]">
                    ...{token.token.slice(-8)}
                  </span>
                  <Badge variant={token.used_at ? "default" : "secondary"}>
                    {token.used_at ? "Usado" : "Expirado"}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
