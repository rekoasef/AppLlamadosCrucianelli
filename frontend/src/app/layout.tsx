import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import { Toaster } from "react-hot-toast"; // 1. Importar el componente Toaster

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Registro de Llamadas Crucianelli",
  description: "Sistema interno para la gestión de llamadas de soporte.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full">
      <body className={`min-h-screen flex flex-col bg-crucianelli-light ${inter.className}`}>
        <AuthProvider>
          {/* 2. Añadimos el componente Toaster aquí. Se encargará de renderizar las notificaciones. */}
          <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
          <Navbar /> 
          <main className="flex-grow">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
