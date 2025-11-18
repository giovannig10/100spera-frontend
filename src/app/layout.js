import { Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-nunito",
  display: "swap",
});

export const metadata = {
  title: "100spera",
  description: "Sistema de gestão de comandas para restaurantes.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body className={nunito.variable}>
        {children}
      </body>
    </html>
  );
}
