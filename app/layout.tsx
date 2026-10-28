import type { Metadata, Viewport } from 'next';
import './globals.css';
import { MissionProvider } from '../components/MissionContext';

export const metadata: Metadata = {
  title: 'Studio Conseil IA — Atelier',
  description: 'Ateliers hybrides de découverte et d’amélioration des processus',
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <a className="skip" href="#contenu">
          Aller au contenu
        </a>
        <MissionProvider>{children}</MissionProvider>
      </body>
    </html>
  );
}
