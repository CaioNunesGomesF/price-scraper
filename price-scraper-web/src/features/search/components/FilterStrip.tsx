import React from "react";
import { Layers, Filter } from "lucide-react";
import { CustomSelect } from "./CustomSelect";
import { PlatformMultiSelect } from "./PlatformMultiSelect";
import type { Category, Platform, SortBy } from "../../../services/searchApi";

interface FilterStripProps {
  category: Category;
  setCategory: (c: Category) => void;
  platform: Platform;
  setPlatform: (p: Platform) => void;
  sortBy: SortBy;
  setSortBy: (s: SortBy) => void;
  minPrice: number | "";
  setMinPrice: (v: number | "") => void;
  maxPrice: number | "";
  setMaxPrice: (v: number | "") => void;
}

const CATEGORY_OPTIONS = [
  { value: "ELETRONICOS", label: "Eletrônicos" },
  { value: "VEICULOS", label: "Veículos" },
  { value: "IMOVEIS", label: "Imóveis" },
  { value: "JOGOS", label: "Jogos/Contas" },
  { value: "OUTROS", label: "Outros" },
];

const SORT_OPTIONS = [
  { value: "price_asc", label: "Menor Preço" },
  { value: "price_desc", label: "Maior Preço" },
  { value: "rating_desc", label: "Melhores" },
];

export const FilterStrip: React.FC<FilterStripProps> = ({
  category,
  setCategory,
  platform,
  setPlatform,
  sortBy,
  setSortBy,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
}) => {
  return (
    <div style={styles.filterStrip}>
      {/* Category Custom Select */}
      <CustomSelect
        value={category}
        onChange={(val) => setCategory(val as Category)}
        options={CATEGORY_OPTIONS}
        icon={<Layers size={13} />}
        width="135px"
      />

      {/* Platform Multi-Select Dropdown with Checkboxes and Logos */}
      <PlatformMultiSelect
        platform={platform}
        setPlatform={setPlatform}
        width="170px"
      />

      {/* Sort Custom Select */}
      <CustomSelect
        value={sortBy}
        onChange={(val) => setSortBy(val as SortBy)}
        options={SORT_OPTIONS}
        icon={<Filter size={13} />}
        width="135px"
      />

      {/* Price Inputs */}
      <div style={styles.priceInputs} className="scroll-x-mobile">
        <input
          type="number"
          placeholder="Min"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : "")}
          style={styles.priceInput}
          className="custom-select-premium-btn"
        />
        <span style={styles.priceDivider}>—</span>
        <input
          type="number"
          placeholder="Max"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : "")}
          style={styles.priceInput}
          className="custom-select-premium-btn"
        />
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  filterStrip: {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: "8px",
    alignItems: "center",
    width: "100%",
    position: "relative",
    zIndex: 60,
  },
  priceInputs: { display: "flex", alignItems: "center", gap: "6px" },
  priceInput: { width: "70px", backgroundColor: "#ffffff", border: "1px solid var(--border)", borderRadius: "24px", color: "var(--text-primary)", padding: "8px 10px", fontSize: "12px", fontWeight: 600, textAlign: "center" as const, outline: "none", transition: "var(--transition)" },
  priceDivider: { color: "var(--text-muted)", fontSize: "12px" },
};

export default FilterStrip;
