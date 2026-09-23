import React, { useState, useEffect } from "react";
import {
  BarChart3,
  Heart,
  Store,
  Search,
  User as UserIcon,
  LogOut,
  ChevronDown,
  Menu,
  X,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Close drawer on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMobileDrawerOpen(false);
        setIsUserMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const tabs = [
    { id: "search", label: "Buscar", icon: Search, desc: "Pesquisa em tempo real" },
    { id: "sources", label: "Fontes", icon: Store, desc: "Mercado Livre, OLX, Amazon, GGMax", badge: "4 Lojas" },
    { id: "favorites", label: "Favoritos", icon: Heart, desc: "Seus produtos salvos", count: favoritesCount },
    { id: "analytics", label: "Analytics", icon: BarChart3, desc: "Gráficos de preço e volume" },
  ];

  const handleSelectTabMobile = (tabId: "search" | "analytics" | "favorites" | "sources") => {
    onTabChange(tabId);
    setIsMobileDrawerOpen(false);
  };

  return (
    <>
      <header style={styles.topbar} className="topbar-glow">
        <div style={styles.topbarInner}>
          {/* Left: Brand Logo + Desktop Nav Grouped Together */}
          <div style={styles.leftSection}>
            <div style={styles.brand} onClick={onNewSearch} title="Voltar para a tela inicial">
              <div style={styles.brandIconBox}>
                <Search size={16} color="#ffffff" strokeWidth={2.5} />
              </div>
              <div style={styles.brandTextGroup}>
                <span style={styles.brandTitle}>Price<span style={{ color: "var(--accent)" }}>Scraper</span></span>
              </div>
            </div>

            <div style={styles.navDivider} className="hide-on-mobile" />

            {/* Desktop Navigation Tabs (Linear / Vercel style with animated sliding pill) */}
            <nav className="hide-on-mobile" style={styles.desktopNavContainer}>
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                const Icon = tab.icon;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => onTabChange(tab.id as any)}
                    style={styles.navTabBtn}
                    className="header-desktop-tab"
                    title={tab.desc}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="active-nav-pill"
                        style={styles.activePillBackground}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span style={{ position: "relative", zIndex: 2, display: "inline-flex", alignItems: "center", gap: "6px" }}>
                      <Icon
                        size={15}
                        color={isActive ? "var(--accent)" : "var(--text-secondary)"}
                        strokeWidth={isActive ? 2.2 : 1.8}
                        fill={tab.id === "favorites" && isActive ? "rgba(108, 92, 231, 0.2)" : "none"}
                      />
                      <span
                        style={{
                          fontSize: "13.5px",
                          fontWeight: isActive ? 700 : 500,
                          color: isActive ? "var(--accent)" : "var(--text-secondary)",
                          transition: "color 0.15s ease",
                        }}
                      >
                        {tab.label}
                      </span>
                      {tab.count !== undefined && tab.count > 0 && (
                        <span style={styles.countBadge}>{tab.count}</span>
                      )}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right Actions: User Profile + Hamburger Toggle on Mobile */}
          <div style={styles.rightSection}>
            {/* User Account Button (Desktop & Mobile) */}
            {user ? (
              <div style={{ position: "relative" }}>
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
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
                  <span style={styles.userName} className="hide-on-xs">{user.name.split(" ")[0]}</span>
                  <ChevronDown size={12} color="var(--text-secondary)" />
                </button>

                {/* Desktop User Dropdown Menu */}
                {isUserMenuOpen && (
                  <div style={styles.dropdownMenu} className="modal-content-pop">
                    <div style={styles.userMenuHeader}>
                      <strong style={{ fontSize: "12px", color: "var(--text-primary)" }}>{user.name}</strong>
                      <span style={{ fontSize: "11px", color: "var(--text-secondary)" }}>{user.email}</span>
                    </div>
                    <div style={styles.menuDivider} />
                    <button
                      type="button"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onTabChange("favorites");
                      }}
                      style={styles.menuItem}
                    >
                      <Heart size={13} color="#e74c3c" />
                      <span>Meus Favoritos ({favoritesCount})</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onTabChange("sources");
                      }}
                      style={styles.menuItem}
                    >
                      <Store size={13} color="var(--accent)" />
                      <span>Fontes Indexadas</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsUserMenuOpen(false);
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
                type="button"
                onClick={onOpenAuth}
                style={styles.loginBtn}
                className="hide-on-xs"
                title="Entrar ou criar conta"
              >
                <UserIcon size={14} />
                <span>Entrar</span>
              </button>
            )}

            {/* Mobile Hamburger Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setIsMobileDrawerOpen(true)}
              style={styles.mobileMenuToggleBtn}
              className="show-on-mobile-flex"
              aria-label="Abrir Menu de Navegação"
              title="Menu"
            >
              <Menu size={18} color="var(--text-primary)" />
              {favoritesCount > 0 && <span style={styles.mobileDotBadge} />}
            </button>
          </div>
        </div>
      </header>

      {/* Modern Mobile Navigation Drawer (Slide-Over) */}
      <AnimatePresence>
        {isMobileDrawerOpen && (
          <>
            {/* Backdrop Blur Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              style={styles.drawerBackdrop}
              onClick={() => setIsMobileDrawerOpen(false)}
            />

            {/* Sliding Drawer Sheet */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 32 }}
              style={styles.drawerSheet}
            >
              {/* Drawer Header */}
              <div style={styles.drawerHeader}>
                <div style={styles.drawerBrand}>
                  <div style={styles.drawerIconBox}>
                    <Search size={16} color="var(--accent)" />
                  </div>
                  <div>
                    <h3 style={styles.drawerTitle}>PriceScraper</h3>
                    <span style={styles.drawerSubtitle}>Navegação & Painel</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsMobileDrawerOpen(false)}
                  style={styles.drawerCloseBtn}
                  aria-label="Fechar Menu"
                >
                  <X size={18} color="var(--text-secondary)" />
                </button>
              </div>

              {/* User Card in Drawer */}
              <div style={styles.drawerUserSection}>
                {user ? (
                  <div style={styles.drawerUserCard}>
                    {user.avatarUrl ? (
                      <img src={user.avatarUrl} alt={user.name} style={styles.drawerAvatar} />
                    ) : (
                      <div style={styles.drawerAvatarFallback}>
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <span style={styles.drawerUserName}>{user.name}</span>
                      <span style={styles.drawerUserEmail}>{user.email}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        onLogout();
                        setIsMobileDrawerOpen(false);
                      }}
                      style={styles.drawerLogoutBtn}
                      title="Sair"
                    >
                      <LogOut size={15} color="#e74c3c" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileDrawerOpen(false);
                      onOpenAuth();
                    }}
                    style={styles.drawerLoginBtn}
                  >
                    <UserIcon size={16} />
                    <span>Entrar ou Criar Conta</span>
                  </button>
                )}
              </div>

              {/* Navigation Items List */}
              <div style={styles.drawerNavList}>
                <span style={styles.drawerNavHeader}>Menu Principal</span>

                {tabs.map((tab) => {
                  const isActive = activeTab === tab.id;
                  const Icon = tab.icon;

                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => handleSelectTabMobile(tab.id as any)}
                      style={{
                        ...styles.drawerNavItem,
                        backgroundColor: isActive ? "rgba(108, 92, 231, 0.1)" : "transparent",
                        borderColor: isActive ? "rgba(108, 92, 231, 0.25)" : "transparent",
                      }}
                    >
                      <div
                        style={{
                          ...styles.drawerNavIconBox,
                          backgroundColor: isActive ? "var(--accent)" : "rgba(0, 0, 0, 0.04)",
                          color: isActive ? "#ffffff" : "var(--text-secondary)",
                        }}
                      >
                        <Icon
                          size={17}
                          color={isActive ? "#ffffff" : (tab.id === "favorites" ? "#e74c3c" : "var(--text-secondary)")}
                          fill={tab.id === "favorites" && isActive ? "#ffffff" : "none"}
                        />
                      </div>

                      <div style={styles.drawerNavContent}>
                        <div style={styles.drawerNavTitleRow}>
                          <span
                            style={{
                              ...styles.drawerNavTitle,
                              color: isActive ? "var(--accent)" : "var(--text-primary)",
                              fontWeight: isActive ? 700 : 600,
                            }}
                          >
                            {tab.label}
                          </span>
                          {tab.badge && <span style={styles.drawerTag}>{tab.badge}</span>}
                          {tab.count !== undefined && tab.count > 0 && (
                            <span style={styles.drawerCountBadge}>{tab.count}</span>
                          )}
                        </div>
                        <span style={styles.drawerNavDesc}>{tab.desc}</span>
                      </div>

                      <ChevronRight
                        size={16}
                        color={isActive ? "var(--accent)" : "var(--text-muted)"}
                      />
                    </button>
                  );
                })}
              </div>

              {/* Drawer Footer info */}
              <div style={styles.drawerFooter}>
                <div style={styles.drawerFooterBadge}>
                  <ShieldCheck size={14} color="var(--accent)" />
                  <span>4 Marketplaces Conectados</span>
                </div>
                <span style={styles.drawerFooterText}>
                  Mercado Livre • OLX • Amazon • GGMax
                </span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

const styles: Record<string, React.CSSProperties> = {
  topbar: {
    height: "64px",
    borderBottom: "1px solid var(--border)",
    display: "flex",
    alignItems: "center",
    padding: "0 28px",
    backgroundColor: "rgba(255, 255, 255, 0.92)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    flexShrink: 0,
    position: "relative",
    zIndex: 40,
  },
  topbarInner: {
    width: "100%",
    maxWidth: "1360px",
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: "100%",
  },
  leftSection: {
    display: "flex",
    alignItems: "center",
    gap: "24px",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    cursor: "pointer",
    userSelect: "none",
  },
  brandIconBox: {
    width: "32px",
    height: "32px",
    borderRadius: "9px",
    background: "linear-gradient(135deg, #6c5ce7 0%, #8075ea 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 2px 8px rgba(108, 92, 231, 0.35)",
  },
  brandTextGroup: {
    display: "flex",
    flexDirection: "column",
  },
  brandTitle: {
    fontSize: "17px",
    fontWeight: 800,
    letterSpacing: "-0.4px",
    color: "var(--text-primary)",
    lineHeight: 1.1,
  },
  navDivider: {
    width: "1px",
    height: "22px",
    backgroundColor: "var(--border)",
  },
  desktopNavContainer: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    position: "relative",
  },
  navTabBtn: {
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "10px",
    padding: "7px 14px",
    fontSize: "13.5px",
    border: "none",
    backgroundColor: "transparent",
    cursor: "pointer",
    transition: "color 0.15s ease",
  },
  activePillBackground: {
    position: "absolute",
    inset: 0,
    borderRadius: "10px",
    backgroundColor: "rgba(108, 92, 231, 0.09)",
    border: "1px solid rgba(108, 92, 231, 0.18)",
    zIndex: 1,
  },
  countBadge: {
    backgroundColor: "#ef4444",
    color: "#ffffff",
    fontSize: "10px",
    fontWeight: 800,
    padding: "1px 6px",
    borderRadius: "10px",
    marginLeft: "2px",
  },
  rightSection: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  loginBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: "7px",
    backgroundColor: "var(--accent)",
    color: "#ffffff",
    border: "none",
    borderRadius: "10px",
    padding: "8px 18px",
    fontSize: "13px",
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 2px 10px rgba(108, 92, 231, 0.28)",
    transition: "var(--transition)",
  },
  userPillBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    backgroundColor: "var(--bg-primary)",
    border: "1px solid var(--border)",
    borderRadius: "10px",
    padding: "5px 10px 5px 6px",
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
  mobileMenuToggleBtn: {
    display: "none",
    alignItems: "center",
    justifyContent: "center",
    width: "36px",
    height: "36px",
    borderRadius: "8px",
    border: "1px solid var(--border)",
    backgroundColor: "var(--bg-primary)",
    cursor: "pointer",
    position: "relative",
  },
  mobileDotBadge: {
    position: "absolute",
    top: "6px",
    right: "6px",
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    backgroundColor: "#e74c3c",
    border: "1.5px solid var(--bg-secondary)",
  },
  drawerBackdrop: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(15, 23, 42, 0.45)",
    backdropFilter: "blur(6px)",
    WebkitBackdropFilter: "blur(6px)",
    zIndex: 9998,
  },
  drawerSheet: {
    position: "fixed",
    top: 0,
    right: 0,
    bottom: 0,
    width: "min(320px, 85vw)",
    backgroundColor: "var(--bg-secondary)",
    boxShadow: "-8px 0 30px rgba(0, 0, 0, 0.18)",
    zIndex: 9999,
    display: "flex",
    flexDirection: "column",
    padding: "20px 18px",
    boxSizing: "border-box",
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: "16px",
    borderBottom: "1px solid var(--border)",
  },
  drawerBrand: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  drawerIconBox: {
    width: "34px",
    height: "34px",
    borderRadius: "10px",
    backgroundColor: "rgba(108, 92, 231, 0.12)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  drawerTitle: {
    fontSize: "15px",
    fontWeight: 700,
    color: "var(--text-primary)",
    margin: 0,
  },
  drawerSubtitle: {
    fontSize: "11px",
    color: "var(--text-muted)",
  },
  drawerCloseBtn: {
    width: "32px",
    height: "32px",
    borderRadius: "8px",
    border: "1px solid var(--border)",
    backgroundColor: "transparent",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  drawerUserSection: {
    padding: "14px 0",
    borderBottom: "1px solid var(--border)",
  },
  drawerUserCard: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px 12px",
    borderRadius: "12px",
    backgroundColor: "var(--bg-primary)",
    border: "1px solid var(--border)",
  },
  drawerAvatar: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    objectFit: "cover",
  },
  drawerAvatarFallback: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    backgroundColor: "var(--accent)",
    color: "#ffffff",
    fontSize: "13px",
    fontWeight: 800,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  drawerUserName: {
    display: "block",
    fontSize: "13px",
    fontWeight: 700,
    color: "var(--text-primary)",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  drawerUserEmail: {
    display: "block",
    fontSize: "11px",
    color: "var(--text-muted)",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  drawerLogoutBtn: {
    padding: "6px",
    borderRadius: "8px",
    backgroundColor: "rgba(231, 76, 60, 0.1)",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  drawerLoginBtn: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    backgroundColor: "var(--accent)",
    color: "#ffffff",
    border: "none",
    borderRadius: "10px",
    padding: "10px 16px",
    fontSize: "13px",
    fontWeight: 700,
    cursor: "pointer",
  },
  drawerNavList: {
    flex: 1,
    overflowY: "auto",
    padding: "14px 0",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  drawerNavHeader: {
    fontSize: "10px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.6px",
    color: "var(--text-muted)",
    paddingLeft: "4px",
    marginBottom: "4px",
  },
  drawerNavItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "10px 12px",
    borderRadius: "12px",
    border: "1px solid transparent",
    cursor: "pointer",
    textAlign: "left",
    transition: "background-color 0.15s, border-color 0.15s",
  },
  drawerNavIconBox: {
    width: "34px",
    height: "34px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    transition: "all 0.15s",
  },
  drawerNavContent: {
    flex: 1,
    minWidth: 0,
  },
  drawerNavTitleRow: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  drawerNavTitle: {
    fontSize: "13px",
  },
  drawerTag: {
    fontSize: "9px",
    fontWeight: 700,
    backgroundColor: "rgba(108, 92, 231, 0.12)",
    color: "var(--accent)",
    padding: "1px 5px",
    borderRadius: "6px",
  },
  drawerCountBadge: {
    fontSize: "9px",
    fontWeight: 800,
    backgroundColor: "#e74c3c",
    color: "#ffffff",
    padding: "1px 5px",
    borderRadius: "6px",
  },
  drawerNavDesc: {
    fontSize: "11px",
    color: "var(--text-muted)",
    display: "block",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  drawerFooter: {
    paddingTop: "14px",
    borderTop: "1px solid var(--border)",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  drawerFooterBadge: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "11px",
    fontWeight: 600,
    color: "var(--accent)",
  },
  drawerFooterText: {
    fontSize: "10px",
    color: "var(--text-muted)",
  },
};

export default Header;
