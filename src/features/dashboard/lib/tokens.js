// ─── Fydaa Design Tokens ───
// Source of truth for all colors, radii, and shadows.
// Tailwind classes map directly; these are for JS usage (charts, SVGs, dynamic styles).

export const colors = {
  ink:       "#0A0A0A",
  dark:      "#262626",
  tertiary:  "#525252",
  secondary: "#737373",
  muted:     "#A3A3A3",
  borderMid: "#D4D4D4",
  border:    "#E5E5E5",
  surface:   "#F5F5F5",
  bg:        "#FAFAFA",
  white:     "#FFFFFF",
  jade:      "#0C4A3E",
  jadeHover: "#0A3D33",
  emerald:   "#047857",
  tint:      "#ECFDF5",
  emeraldLight: "#6EE7B7",
};

export const radii = {
  card: "14px",
  btn:  "10px",
};

// Hero card gradient (reused in RM card, detail panel hero)
export const jadeGradient =
  "radial-gradient(ellipse 120% 80% at 15% 110%, rgba(4,120,87,.5) 0%, transparent 55%), " +
  "radial-gradient(ellipse 80% 90% at 90% -10%, rgba(110,231,183,.12) 0%, transparent 45%), " +
  "radial-gradient(ellipse 50% 60% at 50% 50%, rgba(10,61,51,.6) 0%, transparent 70%), " +
  "#0C4A3E";
