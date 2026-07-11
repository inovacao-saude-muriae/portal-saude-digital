import "@/app/globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
    title: "Portal Saúde Digital Muriaé",
    description: "Portal Saúde Digital Muriaé",
};

export default function RootLayout({ children }) {
    return (
        <html lang="pt-BR">
            <body>
                <Header />
                <main style={{ minHeight: 'calc(100vh - 400px)' }}>{children}</main>            
                <Footer /> 
            </body>
        </html>
    );
}