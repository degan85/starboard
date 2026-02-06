import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "starboard - Collect & Display Customer Testimonials",
  description:
    "Easily collect testimonials from your customers and showcase them beautifully on your website. Setup in 3 minutes, embed with one line of code.",
  keywords: ["testimonial", "review", "widget", "social proof", "customer feedback"],
  authors: [{ name: "starboard" }],
  openGraph: {
    title: "starboard - Collect & Display Customer Testimonials",
    description: "The easiest way to collect and showcase customer love",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
