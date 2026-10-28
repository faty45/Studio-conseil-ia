import type { Metadata, Viewport } from 'next';
import '@fontsource-variable/inter';
import '@fontsource-variable/fraunces';
import './globals.css';
import { DepotProvider } from '../components/DepotContext';
import { AppShell } from '../components/AppShell';

export const metadata: Metadata = {
  title: 'Studio Conseil IA — Cockpit de mission',
  description: 'Environnement de conseil en transformation : préparer, animer, analyser, décider, restituer, suivre.',
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#14203a' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <a className="skip" href="#contenu">
          Aller au contenu
        </a>
        <DepotProvider>
          <AppShell>{children}</AppShell>
        </DepotProvider>
      </body>
    </html>
  );
}
