import { Quicksand, Roboto } from "next/font/google";
import "../globals.css";

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

export const metadata = {
  title: 'Administration - Nicolas Vivaudou',
  description: 'Panel d\'administration',
};

export default function AdminRootLayout({ children }) {
  return (
    <html lang="fr">
      <body className={`${quicksand.variable} ${roboto.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}