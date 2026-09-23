import React, { useState } from "react";
import { Sparkles, BarChart3, Heart, Store, Search, User as UserIcon, LogOut, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { UserProfile } from "../../auth/components/AuthModal";

interface HeaderProps {
  activeTab: "search" | "analytics" | "favorites" | "sources";
  favoritesCount: number;
  user: UserProfile | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onTabChange: (tab: "search" | "analytics" | "favorites" | "sources") => void;
  onNewSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  favoritesCount,
  user,
  onOpenAuth,
  onLogout,
  onTabChange,
  onNewSearch,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const tabs = [
    { id: "search", label: "Buscar", icon: Search },
    { id: "sources", label: "Fontes", icon: Store, hasPulse: true },
    { id: "favorites", label: "Favoritos", icon: Heart, count: favoritesCount },
    { id: "analytics", label: "Analytics", icon: BarChart3, isLive: true },
  ];

  return (
    <div style={styles.topbar} className="topbar-glow">
      <div style={styles.brand} onClick={onNewSearch} title="Voltar para a tela inicial">
        <h1 style={styles.brandTitle}>
          PriceScraper
          <span style={styles.brandBadge}>
            <Sparkles size={10} style={{ marginRight: "4px" }} />
            Agregador de Ofertas
          </span>
        </h1>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {/* Segmented Navigation Control with Framer Motion Sliding Pill */}
        <div style={styles.navSegmentContainer}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                onClick={() => {
                  if (tab.id === "analytics" && activeTab === "analytics") {
                    onTabChange("search");
                  } else {
                    onTabChange(tab.id as any);
                  }
                }}
                style={{
                  ...styles.segmentedBtn,
                  color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                  fontWeight: isActive ? 700 : 600,
                }}
                title={tab.label}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabPill"
                    style={styles.slidingPillBg}
                    transition={{ type: "spring", stiffness: 450, damping: 35 }}
                  />
                )}
                <span style={{ position: "relative", zIndex: 2, display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  <Icon
                    size={13}
                    color={isActive ? (tab.id === "favorites" ? "#e74c3c" : "var(--accent)") : "var(--text-secondary)"}
                    fill={tab.id === "favorites" && isActive ? "#e74c3c" : "none"}
                  />
                  <span className="hide-on-mobile">{isActive && tab.id === "analytics" ? "Busca" : tab.label}</span>
                  {tab.hasPulse && <span style={styles.livePulseDot} title="4 marketplaces conectados" />}
                  {tab.count !== undefined && tab.count > 0 && <span style={styles.countBadge}>{tab.count}</span>}
                  {tab.isLive && <span style={styles.liveBadgeText}>LIVE</span>}
                </span>
              </button>
            );
          })}
        </div>

        {/* User Account / Login Button */}
        {user ? (
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              style={styles.userPillBtn}
              title={`Conectado como ${user.name}`}
            >
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name} style={styles.userAvatar} />
              ) : (
                <div style={styles.userAvatarFallback}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
              <span style={styles.userName}>{user.name.split(" ")[0]}</span>
              <ChevronDown size={12} color="var(--text-secondary)" />
            </button>

            {/* Dropdown Menu */}
            {isMenuOpen && (
              <div style={styles.dropdownMenu} className="modal-content-pop">
                <div style={styles.userMenuHeader}>
                  <strong style={{ fontSize: "12px", color: "var(--text-primary)" }}>{user.name}</strong>
                  <span style={{ fontSize: "11px", color: "var(--text-secondary)" }}>{user.email}</span>
                </div>
                <div style={styles.menuDivider} />
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onTabChange("favorites");
                  }}
                  style={styles.menuItem}
                >
                  <Heart size={13} color="#e74c3c" />
                  <span>Meus Favoritos ({favoritesCount})</span>
                </button>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onTabChange("sources");
                  }}
                  style={styles.menuItem}
                >
                  <Store size={13} color="var(--accent)" />
                  <span>Fontes Indexadas</span>
                </button>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onLogout();
                  }}
                  style={{ ...styles.menuItem, color: "#e74c3c" }}
                >
                  <LogOut size={13} />
                  <span>Sair da Conta</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            style={styles.loginBtn}
            className="new-search-btn-premium"
            title="Entrar ou criar conta"
          >
            <UserIcon size={13} />
            <span className="hide-on-mobile">Entrar</span>
          </button>
        )}
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  topbar: {
    height: "62px",
    borderBottom: "1px solid var(--border)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 16px", // responsive padding
    backgroundColor: "var(--bg-secondary)",
    flexShrink: 0,
    position: "relative",
    zIndex: 10,
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    cursor: "pointer",
    userSelect: "none",
  },
  brandTitle: {
    fontSize: "16px",
    fontWeight: 700,
    color: "var(--text-primary)",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  brandBadge: {
    fontSize: "10px",
    fontWeight: 600,
    backgroundColor: "rgba(90, 122, 106, 0.15)",
    color: "var(--accent)",
    padding: "2px 8px",
    borderRadius: "20px",
    display: "inline-flex",
    alignItems: "center",
  },
  navSegmentContainer: {
    display: "flex",
    alignItems: "center",
    gap: "3px",
    backgroundColor: "var(--bg-primary)",
    border: "1px solid var(--border)",
    padding: "3px",
    borderRadius: "24px",
    boxShadow: "inset 0 1px 2px rgba(0,0,0,0.03)",
  },
  segmentedBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    borderRadius: "20px",
    padding: "6px 13px",
    fontSize: "12px",
    fontWeight: 600,
    color: "var(--text-secondary)",
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    position: "relative" as const,
  },
  slidingPillBg: {
    position: "absolute" as const,
    inset: 0,
    backgroundColor: "var(--bg-secondary)",
    borderRadius: "20px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08), 0 0 0 1px var(--border-glow)",
    zIndex: 1,
  },
  livePulseDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    backgroundColor: "var(--success)",
    boxShadow: "0 0 6px var(--success)",
    display: "inline-block",
    marginLeft: "2px",
  },
  liveBadgeText: {
    fontSize: "9px",
    fontWeight: 800,
    backgroundColor: "rgba(90, 122, 106, 0.15)",
    color: "var(--accent)",
    padding: "1px 5px",
    borderRadius: "8px",
    marginLeft: "2px",
  },
  countBadge: {
    backgroundColor: "#e74c3c",
    color: "#ffffff",
    fontSize: "10px",
    fontWeight: 800,
    padding: "1px 6px",
    borderRadius: "10px",
    marginLeft: "2px",
  },
  loginBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    backgroundColor: "var(--accent)",
    color: "#ffffff",
    border: "none",
    borderRadius: "20px",
    padding: "7px 16px",
    fontSize: "12px",
    fontWeight: 700,
    cursor: "pointer",
    transition: "var(--transition)",
  },
  userPillBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    backgroundColor: "var(--bg-primary)",
    border: "1px solid var(--border)",
    borderRadius: "20px",
    padding: "4px 10px 4px 5px",
    fontSize: "12px",
    fontWeight: 700,
    color: "var(--text-primary)",
    cursor: "pointer",
  },
  userAvatar: {
    width: "24px",
    height: "24px",
    borderRadius: "50%",
    objectFit: "cover" as const,
  },
  userAvatarFallback: {
    width: "24px",
    height: "24px",
    borderRadius: "50%",
    backgroundColor: "var(--accent)",
    color: "#ffffff",
    fontSize: "11px",
    fontWeight: 800,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  userName: {
    fontSize: "12px",
  },
  dropdownMenu: {
    position: "absolute" as const,
    top: "calc(100% + 8px)",
    right: 0,
    backgroundColor: "var(--bg-secondary)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-md)",
    padding: "8px",
    minWidth: "180px",
    boxShadow: "0 10px 25px -5px rgba(0,0,0,0.15)",
    zIndex: 50,
  },
  userMenuHeader: {
    padding: "6px 10px",
    display: "flex",
    flexDirection: "column" as const,
  },
  menuDivider: {
    height: "1px",
    backgroundColor: "var(--border)",
    margin: "6px 0",
  },
  menuItem: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 10px",
    backgroundColor: "transparent",
    border: "none",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: 600,
    color: "var(--text-primary)",
    cursor: "pointer",
    textAlign: "left" as const,
  },
};
