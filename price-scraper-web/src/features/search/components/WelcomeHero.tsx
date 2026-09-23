import React from "react";

export const WelcomeHero: React.FC = () => {
  return (
    <div style={styles.container} className="hero-container-mobile">

      {/* Minimalist Title */}
      <h2 className="hero-title-gradient hero-title-responsive" style={styles.title}>
        PriceScraper
      </h2>
      <p style={styles.subtitle} className="hero-subtitle-responsive text-center-mobile">
        Pesquise produtos em múltiplos marketplaces de forma inteligente e simultânea.
      </p>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    gap: "16px",
    padding: "0 20px",
    isolation: "isolate",
  },
  title: {
    fontSize: "36px",
    fontWeight: 800,
    letterSpacing: "-0.5px",
    animation: "fadeInUp 0.45s ease-out",
  },
  subtitle: {
    fontSize: "14px",
    color: "var(--text-secondary)",
    maxWidth: "420px",
    lineHeight: "1.6",
    animation: "fadeInUp 0.5s ease-out",
  },
};

export default WelcomeHero;
