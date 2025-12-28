import { useState } from 'react';
import { templateEngine } from './TemplateEngine';

export function TemplateEditor() {
  const [template, setTemplate] = useState('');
  const [preview, setPreview] = useState('');

  const handlePreview = (data: any) => {
    const result = templateEngine.parseTemplate(template, data);
    setPreview(result);
  };

  return (
    <div>
      <textarea value={template} onChange={(e) => setTemplate(e.target.value)} />
      <div dangerouslySetInnerHTML={{ __html: preview }} />
    </div>
  );
}
