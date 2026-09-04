import Script from "next/script";
import "./globals.css";

export const metadata = {
  metadataBase: new URL("https://anikportfolio.vercel.app"),
  title: "ANIK.",
  description:
    "Anik | Professional Full Stack Developer specializing in high-performance NeoBrutalist web experiences. Let's build the future with raw aesthetics.",
  keywords: [
    "Arham",
    "Full Stack Developer",
    "NeoBrutalist",
    "Portfolio",
    "Web Development",
    "UI/UX",
    "Javascript",
    "React",
  ],
  authors: [{ name: "Anik" }],
  alternates: {
    canonical: "https://anikportfolio.vercel.app/",
  },
  openGraph: {
    type: "website",
    url: "https://anikportfolio.vercel.app/",
    title: "Anik.",
    description:
      "Professional Full Stack Developer specializing in high-performance NeoBrutalist web experiences.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Anik.",
    description:
      "Professional Full Stack Developer specializing in high-performance NeoBrutalist web experiences.",
  },
  icons: {
    icon: "/Assets/images/favicon.ico",
  },
};

export const viewport = {
  themeColor: "#121212",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Anik",
  url: "https://anikportfolio.vercel.app/",
  jobTitle: "Full Stack Developer",
  image: "https://anikportfolio.vercel.app/",
  knowsAbout: ["React", "Python", "Java", "Node.js", "Django"],
  sameAs: [
    "https://github.com/anikchand461",
    "https://leetcode.com/u/anikchand461/",
  ],
  description:
    "Professional Full Stack Developer specializing in high-performance NeoBrutalist web experiences.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link
          href="https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css"
          rel="stylesheet"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700;800&family=Space+Grotesk:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="text-neo-black font-display antialiased selection:bg-neo-black selection:text-neo-yellow">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-TLNG322R"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>

        {children}

        <Script id="gtm-script" strategy="afterInteractive">
          {`
            (function (w, d, s, l, i) {
              w[l] = w[l] || [];
              w[l].push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
              var f = d.getElementsByTagName(s)[0],
                j = d.createElement(s),
                dl = l != "dataLayer" ? "&l=" + l : "";
              j.async = true;
              j.src = "https://www.googletagmanager.com/gtm.js?id=" + i + dl;
              f.parentNode.insertBefore(j, f);
            })(window, document, "script", "dataLayer", "GTM-TLNG322R");
          `}
        </Script>
      </body>
    </html>
  );
}
