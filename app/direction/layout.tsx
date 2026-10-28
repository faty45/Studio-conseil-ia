import type { Metadata } from 'next';
import './direction.css';

export const metadata: Metadata = {
  title: 'Direction visuelle — Studio Conseil IA',
  description: 'Proposition de direction visuelle : trois écrans de référence et le système de design, sur données fictives.',
};

export default function LayoutDirection({ children }: { children: React.ReactNode }) {
  return <div className="dv">{children}</div>;
}
