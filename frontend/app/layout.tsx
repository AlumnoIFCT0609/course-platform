// ============================================
// ARCHIVO 4: frontend/app/layout.tsx
// ============================================

import { ReactNode } from 'react';
import './globals.css';

export const metadata = {
  title: 'Course Platform',
  description: 'Plataforma de gestión de cursos online',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-gray-50">
        {children}
      </body>
    </html>
  );
}