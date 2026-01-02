import { jsPDF } from 'jspdf';

export const generatePDFReport = (title: string, data: any[]) => {
  const doc = new jsPDF();
  doc.text(title, 10, 10);
  
  let y = 20;
  data.forEach(item => {
    doc.text(JSON.stringify(item), 10, y);
    y += 10;
  });
  
  doc.save(`${title}.pdf`);
};
