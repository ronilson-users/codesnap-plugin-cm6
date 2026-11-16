import type { SnapTheme } from "./themes";

export interface SnapBackground {
	id: string;
	name: string;
	css: string | null; // null = definido por regra especial (theme / none)
}

export const BACKGROUNDS: SnapBackground[] = [
	{ id: "theme", name: "Theme gradient", css: null },
	{ id: "violet", name: "Violet gradient", css: "linear-gradient(135deg,#667eea,#764ba2)" },
	{ id: "sunset", name: "Sunset gradient", css: "linear-gradient(135deg,#f6d365,#fda085)" },
	{ id: "ocean", name: "Ocean gradient", css: "linear-gradient(135deg,#43cea2,#185a9d)" },
	{ id: "night", name: "Night gradient", css: "linear-gradient(135deg,#232526,#414345)" },
	{ id: "black", name: "Solid black", css: "#000000" },
	{ id: "gray", name: "Solid gray", css: "#2b2b2b" },
	{ id: "white", name: "Solid white", css: "#ffffff" },
	{ id: "none", name: "Transparent", css: null },
];

export const getBackground = (id: string) =>
	BACKGROUNDS.find((b) => b.id === id) ?? BACKGROUNDS[0];

export function backgroundCss(id: string, theme: SnapTheme): string {
	if (id === "none") return "transparent";
	if (id === "theme") return theme.gradient;
	return getBackground(id).css ?? theme.gradient;
}
