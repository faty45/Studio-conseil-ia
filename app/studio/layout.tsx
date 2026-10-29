import type { Metadata } from 'next';
import './studio.css';
import { StudioProvider } from '../../components/studio/StudioContext';

export const metadata: Metadata = {
  title: 'Studio — prototype hybride',
  description: 'Prototype interactif de la direction hybride (cockpit relationnel, atelier sur canvas, analyse croisée), sur données fictives.',
};

export default function LayoutStudio({ children }: { children: React.ReactNode }) {
  return (
    <div className="hx">
      <StudioProvider>{children}</StudioProvider>
    </div>
  );
}
