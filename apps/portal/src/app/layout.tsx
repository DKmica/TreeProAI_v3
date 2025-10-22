import "./globals.css";

export const metadata = {
  title: "TreeProAI Portal",
  description: "Internal portal for managing TreeProAI operations.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
