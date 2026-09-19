import "@/app/globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import VLibras from "@/components/VLibras";
import LeitorTela from "@/components/LeitorTela";
import { UIFeedbackProvider } from "@/components/UIFeedback";

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
        <UIFeedbackProvider>
          <ScrollToTop />
          <Header />
          <main style={{ minHeight: 'calc(100vh - 400px)' }}>
            {children}
          </main>
          <Footer /> 
          <VLibras />
          <LeitorTela />
        </UIFeedbackProvider>
      </body>
    </html>
  );
}