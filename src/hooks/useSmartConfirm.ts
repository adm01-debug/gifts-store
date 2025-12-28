import { useState } from 'react';
export function useSmartConfirm() {
  const [show, setShow] = useState(false);
  const confirm = (msg: string) => window.confirm(msg);
  return { confirm, show, setShow };
}
