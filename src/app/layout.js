import "@/app/globals.css";
import Header from "@/components/Header";

export const metadata = {
    title: "Portal Saúde Digital Muriaé",
    description: "Portal Saúde Digital Muriaé",
};

export default function RootLayout({ children }) {
    return (
        <html lang="pt-BR">
        <body>
            <Header />
            <main>{children}</main>
        </body>
        </html>
    );
}