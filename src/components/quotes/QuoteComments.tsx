import { useState } from 'react';
import { useQuoteComments } from '@/hooks/useQuoteComments';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDateTime } from '@/lib/date-utils';
import { MessageSquare, Send } from 'lucide-react';

interface QuoteCommentsProps {
  quoteId: string;
}

export function QuoteComments({ quoteId }: QuoteCommentsProps) {
  const { comments, isLoading, addComment, isAddingComment } = useQuoteComments(quoteId);
  const [newComment, setNewComment] = useState('');

  const handleSubmit = () => {
    if (!newComment.trim()) return;
    
    addComment(newComment);
    setNewComment('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Comentários
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ScrollArea className="h-96">
          {isLoading ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Carregando comentários...
            </p>
          ) : comments && comments.length > 0 ? (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex items-start gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback>
                      {comment.user?.email?.[0]?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {comment.user?.email || 'Usuário'}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDateTime(new Date(comment.created_at))}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {comment.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">
              Nenhum comentário ainda. Seja o primeiro a comentar!
            </p>
          )}
        </ScrollArea>

        <div className="space-y-2">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Adicionar comentário..."
            rows={3}
            disabled={isAddingComment}
          />
          <div className="flex justify-end">
            <Button
              onClick={handleSubmit}
              disabled={!newComment.trim() || isAddingComment}
              size="sm"
            >
              <Send className="w-4 h-4 mr-2" />
              {isAddingComment ? 'Enviando...' : 'Enviar'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
