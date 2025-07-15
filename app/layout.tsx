// app/layout.tsx
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

import { LoadingProvider } from "./context/LoadingContext";
import GlobalLoadingIndicator from "./components/GlobalLoadingIndicator";
import { AppProvider } from "./context/AppContext"; 

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Ayud Craft",
  description: "Decision Support System for Ayud Craft",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <LoadingProvider>
          <AppProvider> {/* Ganti menjadi AppProvider */}
            <GlobalLoadingIndicator />
            {children}
          </AppProvider>
        </LoadingProvider>
      </body>
    </html>
  );
}