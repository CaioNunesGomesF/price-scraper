import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (val: any) => void;
  options: Option[];
  icon: React.ReactNode;
  width?: string;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  value,
  onChange,
  options,
  icon,
  width = "160px",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((o) => o.value === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} style={{ ...styles.selectContainer, width }}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={styles.selectButton}
        className="custom-select-premium-btn"
      >
        <span style={styles.iconWrapper}>{icon}</span>
        <span style={styles.labelWrapper}>{selectedOption?.label}</span>
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
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              style={{
                ...styles.dropdownItem,
                backgroundColor: opt.value === value ? "#e8f0eb" : "transparent",
                color: opt.value === value ? "var(--accent)" : "var(--text-primary)",
                fontWeight: opt.value === value ? 700 : 500,
              }}
              className="custom-select-item"
            >
              {opt.label}
            </button>
          ))}
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
    padding: "8px 24px 8px 30px",
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
    color: "var(--text-secondary)",
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
    width: "100%",
    backgroundColor: "#ffffff",
    border: "1px solid var(--border)",
    borderRadius: "14px",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.08)",
    padding: "6px",
    zIndex: 999,
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  dropdownItem: {
    width: "100%",
    padding: "9px 12px",
    borderRadius: "8px",
    fontSize: "13px",
    textAlign: "left",
    cursor: "pointer",
    transition: "background-color 0.15s, color 0.15s",
    border: "none",
    outline: "none",
  },
};
export default CustomSelect;
