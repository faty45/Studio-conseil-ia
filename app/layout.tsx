import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {title:'Studio Conseil IA — Atelier',description:'Ateliers de transformation opérationnelle'};
export default function RootLayout({children}:{children:React.ReactNode}) {return <html lang="fr"><body>{children}</body></html>}
