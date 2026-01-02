import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function MFA() {
  const [code, setCode] = useState('');
  
  const verify = async () => {
    // TODO: Implement TOTP verification
  };
  
  return (
    <div className="space-y-4">
      <Input 
        placeholder="000000" 
        value={code} 
        onChange={(e) => setCode(e.target.value)} 
        maxLength={6}
      />
      <Button onClick={verify}>Verify</Button>
    </div>
  );
}
