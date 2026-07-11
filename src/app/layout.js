import "@/app/globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
    title: "Portal Saúde Digital Muriaé",
    description: "Portal Saúde Digital Muriaé",
};

// src/app/layout.js

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      {/* Adicione a propriedade abaixo para ignorar atributos injetados por extensões */}
      <body suppressHydrationWarning>
        <Header />
        <main style={{ minHeight: 'calc(100vh - 400px)' }}>
          {children}
        </main>
        <Footer /> 
      </body>
    </html>
  );
}