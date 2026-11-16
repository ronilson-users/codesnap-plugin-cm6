import type { SnapTheme } from "./themes";

export interface SnapBackground {
	id: string;
	name: string;
	css: string | null; // null = definido por regra especial (theme / none)
}

export const BACKGROUNDS: SnapBackground[] = [
	{ id: "theme", name: "Gradiente do tema", css: null },
	{ id: "violet", name: "Gradiente violeta", css: "linear-gradient(135deg,#667eea,#764ba2)" },
	{ id: "sunset", name: "Gradiente pôr do sol", css: "linear-gradient(135deg,#f6d365,#fda085)" },
	{ id: "ocean", name: "Gradiente oceano", css: "linear-gradient(135deg,#43cea2,#185a9d)" },
	{ id: "night", name: "Gradiente noite", css: "linear-gradient(135deg,#232526,#414345)" },
	{ id: "black", name: "Sólido preto", css: "#000000" },
	{ id: "gray", name: "Sólido cinza", css: "#2b2b2b" },
	{ id: "white", name: "Sólido branco", css: "#ffffff" },
	{ id: "none", name: "Transparente", css: null },
];

export const getBackground = (id: string) =>
	BACKGROUNDS.find((b) => b.id === id) ?? BACKGROUNDS[0];

export function backgroundCss(id: string, theme: SnapTheme): string {
	if (id === "none") return "transparent";
	if (id === "theme") return theme.gradient;
	return getBackground(id).css ?? theme.gradient;
}
