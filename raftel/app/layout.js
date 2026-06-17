import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs'
import { Toaster } from "@/components/ui/sonner";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata = {
  title: "Raftel",
  description: "Anime social platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.className} h-screen flex flex-col antialiased`}>
        <ClerkProvider>
          {children}
          <Toaster />
        </ClerkProvider>
      </body>
    </html>
  );
}
