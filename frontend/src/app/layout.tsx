import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";

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
    <html lang="es">
      {/* SOLUCIÓN:
        - min-h-screen: Asegura que el body ocupe al menos toda la altura de la pantalla.
        - flex flex-col: Convierte el body en un contenedor flexbox vertical.
        - bg-crucianelli-light: Mantiene nuestro color de fondo.
      */}
      <body className={`min-h-screen flex flex-col bg-crucianelli-light ${inter.className}`}>
        <AuthProvider>
          <Navbar /> 
          {/* SOLUCIÓN:
            - flex-grow: Hace que el <main> se estire para ocupar todo el espacio vertical sobrante.
          */}
          <main className="flex-grow">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
