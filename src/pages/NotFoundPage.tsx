import { Button } from '@/components/ui/button';
import { Home, Search, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-primary">404</h1>
          <div className="text-6xl mb-4">🎁</div>
        </div>

        <h2 className="text-3xl font-semibold mb-4">
          Página não encontrada
        </h2>
        
        <p className="text-muted-foreground mb-8 text-lg">
          Ops! Parece que este presente se perdeu no caminho.
          A página que você procura não existe ou foi movida.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            size="lg"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar
          </Button>

          <Button
            onClick={() => navigate('/')}
            size="lg"
          >
            <Home className="w-5 h-5 mr-2" />
            Ir para Home
          </Button>

          <Button
            onClick={() => navigate('/products')}
            variant="outline"
            size="lg"
          >
            <Search className="w-5 h-5 mr-2" />
            Ver Produtos
          </Button>
        </div>

        <div className="mt-12 p-6 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>Dica:</strong> Use a busca global (Ctrl+K) para encontrar
            rapidamente produtos, orçamentos ou clientes.
          </p>
        </div>
      </div>
    </div>
  );
}
