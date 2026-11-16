export interface SnapSettings {
	theme: string;       // id de THEMES
	background: string;  // id de BACKGROUNDS
	dir: string | null;  // URL da pasta de saída (null = Pictures)
}

const KEY = "codesnap:settings";
const DEFAULTS: SnapSettings = { theme: "editor", background: "theme", dir: null };

export function loadSettings(): SnapSettings {
	try {
		return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(KEY) || "{}") };
	} catch {
		return { ...DEFAULTS };
	}
}

export function saveSettings(s: SnapSettings) {
	try {
		localStorage.setItem(KEY, JSON.stringify(s));
	} catch (e) {
		console.error("[CodeSnap] não salvou config", e);
	}
}
