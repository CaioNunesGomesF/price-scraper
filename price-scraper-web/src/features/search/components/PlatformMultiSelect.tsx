import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, Store } from "lucide-react";
import type { Platform } from "../../../services/searchApi";

export interface PlatformOption {
  id: "MERCADO_LIVRE" | "OLX" | "AMAZON" | "GGMAX";
  label: string;
  logo: string;
  brandColor: string;
}

export const ALL_PLATFORM_IDS: Array<"MERCADO_LIVRE" | "OLX" | "AMAZON" | "GGMAX"> = [
  "MERCADO_LIVRE",
  "OLX",
  "AMAZON",
  "GGMAX",
];

export const PLATFORM_OPTIONS: PlatformOption[] = [
  { id: "MERCADO_LIVRE", label: "Mercado Livre", logo: "/platforms/mercadoLivre.png", brandColor: "#ffd800" },
  { id: "OLX", label: "OLX Brasil", logo: "/platforms/olx.png", brandColor: "#8c52ff" },
  { id: "AMAZON", label: "Amazon Brasil", logo: "/platforms/amazon.png", brandColor: "#ff9900" },
  { id: "GGMAX", label: "GGMax", logo: "/platforms/ggmax.png", brandColor: "#00cec9" },
];

interface PlatformMultiSelectProps {
  platform: Platform;
  setPlatform: (p: Platform) => void;
  width?: string;
}

export const PlatformMultiSelect: React.FC<PlatformMultiSelectProps> = ({
  platform,
  setPlatform,
  width = "180px",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Parse currently active platforms into an array
  const getSelectedList = (): string[] => {
    if (!platform || platform === "ALL") {
      return ALL_PLATFORM_IDS;
    }
    return platform.split(",").map((p) => p.trim());
  };

  const selectedList = getSelectedList();
  const isAllSelected = selectedList.length === ALL_PLATFORM_IDS.length;

  const handleToggleAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isAllSelected) {
      // If all are selected, keep just the first one
      setPlatform("MERCADO_LIVRE");
    } else {
      setPlatform("ALL");
    }
  };

  const handleTogglePlatform = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    let updated: string[];

    if (selectedList.includes(id)) {
      if (selectedList.length === 1) {
        // Keep at least one selected
        return;
      }
      updated = selectedList.filter((p) => p !== id);
    } else {
      updated = [...selectedList, id];
    }

    if (updated.length === ALL_PLATFORM_IDS.length) {
      setPlatform("ALL");
    } else {
      setPlatform(updated.join(",") as Platform);
    }
  };

  // Label to show on closed select trigger button
  const renderTriggerContent = () => {
    if (isAllSelected) {
      return (
        <>
          <span style={styles.iconWrapper}>
            <Store size={14} color="var(--accent)" />
          </span>
          <span style={styles.labelWrapper}>Todas as Lojas (4)</span>
        </>
      );
    }

    if (selectedList.length === 1) {
      const single = PLATFORM_OPTIONS.find((p) => p.id === selectedList[0]);
      return (
        <>
          <span style={styles.iconWrapper}>
            {single?.logo ? (
              <img src={single.logo} alt={single.label} style={styles.buttonLogo} />
            ) : (
              <Store size={14} color="var(--accent)" />
            )}
          </span>
          <span style={styles.labelWrapper}>{single?.label || "1 Loja"}</span>
        </>
      );
    }

    // 2 or 3 platforms selected: render mini logos stack + count
    return (
      <>
        <span style={styles.iconWrapperStack}>
          {selectedList.slice(0, 3).map((id, idx) => {
            const opt = PLATFORM_OPTIONS.find((p) => p.id === id);
            return opt?.logo ? (
              <img
                key={id}
                src={opt.logo}
                alt={opt.label}
                style={{
                  ...styles.buttonLogoStack,
                  marginLeft: idx > 0 ? "-6px" : "0",
                  zIndex: 3 - idx,
                }}
              />
            ) : null;
          })}
        </span>
        <span style={{ ...styles.labelWrapper, marginLeft: "20px" }}>
          {selectedList.length} Lojas Selecionadas
        </span>
      </>
    );
  };

  return (
    <div
      ref={containerRef}
      style={{
        ...styles.selectContainer,
        width,
        zIndex: isOpen ? 1000 : 1,
      }}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={styles.selectButton}
        className="custom-select-premium-btn"
        title="Selecionar Múltiplas Lojas"
      >
        {renderTriggerContent()}

        <ChevronDown
          size={14}
          style={{
            ...styles.arrowIcon,
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </button>

      {isOpen && (
        <div style={styles.dropdownMenu} className="select-dropdown-anim">
          <div style={styles.menuHeader}>
            <span style={styles.menuHeaderTitle}>Filtrar por Marketplace</span>
          </div>

          {/* Option: Selecionar Todas */}
          <button
            type="button"
            onClick={handleToggleAll}
            style={{
              ...styles.dropdownItem,
              backgroundColor: isAllSelected ? "rgba(108, 92, 231, 0.12)" : "transparent",
            }}
          >
            <div
              style={{
                ...styles.checkboxBox,
                backgroundColor: isAllSelected ? "var(--accent)" : "transparent",
                borderColor: isAllSelected ? "var(--accent)" : "var(--border)",
              }}
            >
              {isAllSelected && <Check size={10} color="#ffffff" strokeWidth={3} />}
            </div>
            <Store size={14} color="var(--accent)" style={{ marginRight: "4px" }} />
            <span style={{ fontWeight: isAllSelected ? 700 : 500, flex: 1, fontSize: "12px" }}>
              Selecionar Todas (4)
            </span>
          </button>

          <div style={styles.divider} />

          {/* Individual Marketplace Checkboxes (Multi-select) */}
          {PLATFORM_OPTIONS.map((opt) => {
            const isChecked = selectedList.includes(opt.id);
            return (
              <button
                key={opt.id}
                type="button"
                onClick={(e) => handleTogglePlatform(opt.id, e)}
                style={{
                  ...styles.dropdownItem,
                  backgroundColor: isChecked ? "rgba(108, 92, 231, 0.08)" : "transparent",
                }}
              >
                <div
                  style={{
                    ...styles.checkboxBox,
                    backgroundColor: isChecked ? "var(--accent)" : "transparent",
                    borderColor: isChecked ? "var(--accent)" : "var(--border)",
                  }}
                >
                  {isChecked && <Check size={10} color="#ffffff" strokeWidth={3} />}
                </div>

                <img src={opt.logo} alt={opt.label} style={styles.itemLogo} />
                <span
                  style={{
                    fontWeight: isChecked ? 700 : 500,
                    color: isChecked ? "var(--text-primary)" : "var(--text-secondary)",
                    flex: 1,
                    fontSize: "12px",
                  }}
                >
                  {opt.label}
                </span>
              </button>
            );
          })}

          <div style={styles.divider} />

          {/* Footer Action to Close */}
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            style={styles.doneBtn}
          >
            Concluir
          </button>
        </div>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  selectContainer: {
    position: "relative",
    display: "inline-block",
    userSelect: "none",
  },
  selectButton: {
    width: "100%",
    backgroundColor: "#ffffff",
    border: "1px solid var(--border)",
    borderRadius: "24px",
    color: "var(--text-primary)",
    padding: "8px 24px 8px 32px",
    fontSize: "12px",
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    textAlign: "left",
    cursor: "pointer",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s, background-color 0.2s",
    position: "relative",
  },
  iconWrapper: {
    position: "absolute",
    left: "10px",
    display: "flex",
    alignItems: "center",
  },
  iconWrapperStack: {
    position: "absolute",
    left: "8px",
    display: "flex",
    alignItems: "center",
  },
  buttonLogo: {
    width: "14px",
    height: "14px",
    borderRadius: "3px",
    objectFit: "contain",
  },
  buttonLogoStack: {
    width: "14px",
    height: "14px",
    borderRadius: "50%",
    border: "1.5px solid #ffffff",
    objectFit: "cover",
    backgroundColor: "#ffffff",
  },
  labelWrapper: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    marginRight: "4px",
  },
  arrowIcon: {
    position: "absolute",
    right: "10px",
    color: "var(--text-secondary)",
    transition: "transform 0.2s ease",
  },
  dropdownMenu: {
    position: "absolute",
    top: "calc(100% + 6px)",
    left: 0,
    minWidth: "215px",
    backgroundColor: "#ffffff",
    border: "1px solid var(--border)",
    borderRadius: "14px",
    boxShadow: "0 12px 30px rgba(0, 0, 0, 0.12)",
    padding: "8px",
    zIndex: 9999,
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  menuHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "4px 8px 6px",
    fontSize: "11px",
    color: "var(--text-secondary)",
    fontWeight: 600,
  },
  menuHeaderTitle: {
    textTransform: "uppercase" as const,
    fontSize: "10px",
    letterSpacing: "0.5px",
    color: "var(--text-muted)",
  },
  menuHeaderCount: {
    backgroundColor: "rgba(108, 92, 231, 0.12)",
    color: "var(--accent)",
    padding: "1px 6px",
    borderRadius: "10px",
    fontWeight: 700,
  },
  dropdownItem: {
    width: "100%",
    padding: "8px 10px",
    borderRadius: "8px",
    fontSize: "12px",
    textAlign: "left",
    cursor: "pointer",
    transition: "background-color 0.15s, color 0.15s",
    border: "none",
    outline: "none",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  checkboxBox: {
    width: "15px",
    height: "15px",
    borderRadius: "4px",
    border: "1.5px solid var(--border)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    transition: "all 0.15s ease",
  },
  itemLogo: {
    width: "16px",
    height: "16px",
    borderRadius: "3px",
    objectFit: "contain",
  },
  divider: {
    height: "1px",
    backgroundColor: "var(--border)",
    margin: "4px 0",
  },
  doneBtn: {
    width: "100%",
    backgroundColor: "var(--accent)",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    padding: "6px 12px",
    fontSize: "11px",
    fontWeight: 700,
    cursor: "pointer",
    marginTop: "4px",
    textAlign: "center" as const,
    transition: "opacity 0.15s",
  },
};

export default PlatformMultiSelect;
