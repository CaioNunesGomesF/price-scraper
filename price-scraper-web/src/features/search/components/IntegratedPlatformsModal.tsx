import React from "react";
import { X, CheckCircle2 } from "lucide-react";

interface IntegratedPlatformsModalProps {
  isOpen: boolean;
  isClosing: boolean;
  onClose: () => void;
}

export const IntegratedPlatformsModal: React.FC<IntegratedPlatformsModalProps> = ({
  isOpen,
  isClosing,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div
      style={styles.modalOverlay}
      className={isClosing ? "modal-overlay-fadeout" : "modal-overlay-fade"}
      onClick={onClose}
    >
      <div
        style={styles.modalContent}
        className={isClosing ? "modal-content-popout" : "modal-content-pop"}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={styles.modalHeader}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)" }}>
              Fontes de Busca Integradas
            </h3>
          </div>
          <button style={styles.closeBtn} onClick={onClose}>
            <X size={16} color="var(--text-secondary)" />
          </button>
        </div>

        <div style={styles.modalBody}>
          <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "20px" }}>
            PriceScraper realiza consultas paralelas simultâneas e diretas nestas plataformas em tempo real:
          </p>

          <div style={styles.sourceList}>
            {/* Mercado Livre */}
            <div style={styles.sourceItem}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <img src="/platforms/mercadoLivre.png" alt="Mercado Livre" style={styles.sourceLogo} />
                <div>
                  <h4 style={styles.sourceName}>Mercado Livre</h4>
                  <a
                    href="https://www.mercadolivre.com.br"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ ...styles.sourceUrl, textDecoration: "underline" }}
                  >
                    mercadolivre.com.br
                  </a>
                </div>
              </div>
              <span style={styles.statusPill}>
                <CheckCircle2 size={11} color="var(--success)" />
                Ativo
              </span>
            </div>

            {/* OLX */}
            <div style={styles.sourceItem}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <img src="/platforms/olx.png" alt="OLX" style={styles.sourceLogo} />
                <div>
                  <h4 style={styles.sourceName}>OLX Brasil</h4>
                  <a
                    href="https://www.olx.com.br"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ ...styles.sourceUrl, textDecoration: "underline" }}
                  >
                    olx.com.br
                  </a>
                </div>
              </div>
              <span style={styles.statusPill}>
                <CheckCircle2 size={11} color="var(--success)" />
                Ativo
              </span>
            </div>

            {/* GGMax */}
            <div style={styles.sourceItem}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <img
                  src="/platforms/ggmax.png"
                  alt="GGMax"
                  style={{ ...styles.sourceLogo, padding: "2px", backgroundColor: "#0a0a10" }}
                />
                <div>
                  <h4 style={styles.sourceName}>GGMax</h4>
                  <a
                    href="https://ggmax.com.br"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ ...styles.sourceUrl, textDecoration: "underline" }}
                  >
                    ggmax.com.br
                  </a>
                </div>
              </div>
              <span style={styles.statusPill}>
                <CheckCircle2 size={11} color="var(--success)" />
                Ativo
              </span>
            </div>

            {/* Amazon */}
            <div style={styles.sourceItem}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <img src="/platforms/amazon.png" alt="Amazon" style={styles.sourceLogo} />
                <div>
                  <h4 style={styles.sourceName}>Amazon Brasil</h4>
                  <a
                    href="https://www.amazon.com.br"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ ...styles.sourceUrl, textDecoration: "underline" }}
                  >
                    amazon.com.br
                  </a>
                </div>
              </div>
              <span style={styles.statusPill}>
                <CheckCircle2 size={11} color="var(--success)" />
                Ativo
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  modalOverlay: {
    position: "fixed",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
  },
  modalContent: {
    backgroundColor: "var(--bg-secondary)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-lg)",
    width: "100%",
    maxWidth: "420px",
    padding: "20px",
    display: "flex",
    flexDirection: "column" as const,
    gap: "16px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  closeBtn: {
    background: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "4px",
    borderRadius: "50%",
    border: "1px solid transparent",
    transition: "var(--transition)",
    cursor: "pointer",
  },
  modalBody: {
    display: "flex",
    flexDirection: "column" as const,
  },
  sourceList: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "12px",
  },
  sourceItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px",
    backgroundColor: "var(--bg-card)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-md)",
  },
  sourceLogo: {
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    objectFit: "cover" as const,
  },
  sourceName: {
    fontSize: "13px",
    fontWeight: 600,
    color: "var(--text-primary)",
  },
  sourceUrl: {
    fontSize: "11px",
    color: "var(--text-secondary)",
  },
  statusPill: {
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    fontSize: "10px",
    color: "var(--success)",
    backgroundColor: "rgba(0,184,148,0.1)",
    padding: "2px 8px",
    borderRadius: "100px",
    fontWeight: 600,
  },
};
