export interface SnapTheme {
	id: string;
	name: string;
	bg?: string;
	fg?: string;
	gradient: string;
	tokens?: Partial<Record<TokenKey, string>>;
}

export type TokenKey =
	| "keyword" | "string" | "comment" | "number"
	| "fn" | "type" | "prop" | "op"
	| "variable" | "constant" | "meta"
	| "tag" | "link" | "heading" | "emphasis"
	| "inserted" | "deleted" | "invalid";

export const THEMES: SnapTheme[] = [
	{ id: "editor", name: "Current editor theme", gradient: "linear-gradient(135deg,#667eea,#764ba2)" },
	{
		id: "dracula", name: "Dracula", bg: "#282a36", fg: "#f8f8f2",
		gradient: "linear-gradient(135deg,#bd93f9,#ff79c6)",
		tokens: { keyword: "#ff79c6", string: "#f1fa8c", comment: "#6272a4", number: "#bd93f9", fn: "#50fa7b", type: "#8be9fd", prop: "#50fa7b", op: "#ff79c6", variable: "#f8f8f2", constant: "#bd93f9" },
	},
	{
		id: "monokai", name: "Monokai", bg: "#272822", fg: "#f8f8f2",
		gradient: "linear-gradient(135deg,#a6e22e,#66d9ef)",
		tokens: { keyword: "#f92672", string: "#e6db74", comment: "#75715e", number: "#ae81ff", fn: "#a6e22e", type: "#66d9ef", prop: "#a6e22e", op: "#f92672", variable: "#f8f8f2", constant: "#ae81ff" },
	},
	{
		id: "github-dark", name: "GitHub Dark", bg: "#0d1117", fg: "#c9d1d9",
		gradient: "linear-gradient(135deg,#30363d,#1f6feb)",
		tokens: { keyword: "#ff7b72", string: "#a5d6ff", comment: "#8b949e", number: "#79c0ff", fn: "#d2a8ff", type: "#ffa657", prop: "#79c0ff", op: "#ff7b72", variable: "#c9d1d9", constant: "#79c0ff" },
	},
	{
		id: "one-dark", name: "One Dark", bg: "#282c34", fg: "#abb2bf",
		gradient: "linear-gradient(135deg,#61afef,#c678dd)",
		tokens: { keyword: "#c678dd", string: "#98c379", comment: "#5c6370", number: "#d19a66", fn: "#61afef", type: "#e5c07b", prop: "#e06c75", op: "#56b6c2", variable: "#e06c75", constant: "#d19a66" },
	},
	{
		id: "github-light", name: "GitHub Light", bg: "#ffffff", fg: "#24292f",
		gradient: "linear-gradient(135deg,#ffd6e0,#c7e0ff)",
		tokens: { keyword: "#cf222e", string: "#0a3069", comment: "#6e7781", number: "#0550ae", fn: "#8250df", type: "#953800", prop: "#0550ae", op: "#cf222e", variable: "#24292f", constant: "#0550ae" },
	},
	{
		id: "solarized-light", name: "Solarized Light", bg: "#fdf6e3", fg: "#657b83",
		gradient: "linear-gradient(135deg,#eee8d5,#f5e778)",
		tokens: { keyword: "#859900", string: "#2aa198", comment: "#93a1a1", number: "#d33682", fn: "#268bd2", type: "#b58900", prop: "#268bd2", op: "#859900", variable: "#657b83", constant: "#cb4b16" },
	},
];

export const getTheme = (id: string) => THEMES.find((t) => t.id === id) ?? THEMES[0];

// --------------------------------------------
// Mapeamento TokenKey -> seletores Lezer
// --------------------------------------------
const TOKEN_SELECTORS: Record<TokenKey, string[]> = {
	keyword: [
		".tok-keyword", ".tok-modifier", ".tok-operatorKeyword",
		".tok-controlKeyword", ".tok-definitionKeyword", ".tok-self",
		".tok-bool",
	],
	string: [
		".tok-string", ".tok-string2", ".tok-character",
		".tok-regexp", ".tok-escape",
	],
	comment: [
		".tok-comment", ".tok-lineComment", ".tok-blockComment",
		".tok-docComment",
	],
	number: [
		".tok-number", ".tok-integer", ".tok-float",
		".tok-atom", ".tok-null",
	],
	fn: [
		".tok-function",
		".tok-variableName.tok-definition",
		".tok-macroName",
	],
	type: [
		".tok-typeName", ".tok-className", ".tok-typeOperator",
	],
	prop: [
		".tok-propertyName", ".tok-attributeName",
		".tok-propertyName.tok-definition",
	],
	op: [
		".tok-operator", ".tok-derefOperator", ".tok-arithmeticOperator",
		".tok-logicOperator", ".tok-compareOperator", ".tok-updateOperator",
		".tok-defineOperator",
	],
	variable: [
		".tok-variableName:not(.tok-definition)",
		".tok-local",
	],
	constant: [
		".tok-constant", ".tok-standard", ".tok-builtin",
	],
	meta: [
		".tok-meta", ".tok-annotation", ".tok-processingInstruction",
	],
	tag: [
		".tok-tagName", ".tok-angleBracket", ".tok-attributeValue",
	],
	link: [
		".tok-link", ".tok-url", ".tok-URL",
	],
	heading: [
		".tok-heading", ".tok-heading1", ".tok-heading2",
		".tok-heading3", ".tok-heading4", ".tok-heading5", ".tok-heading6",
	],
	emphasis: [
		".tok-emphasis", ".tok-strong", ".tok-strikethrough",
	],
	inserted: [".tok-inserted"],
	deleted: [".tok-deleted"],
	invalid: [".tok-invalid"],
};

// ordem: genéricas antes, específicas depois (Lezer empilha classes)
const TOKEN_ORDER: TokenKey[] = [
	"comment", "meta",
	"keyword", "number", "constant",
	"string",
	"type", "fn", "prop", "variable",
	"tag", "link", "heading", "emphasis",
	"op",
	"inserted", "deleted", "invalid",
];

// CSS que recolore os tokens do Lezer (tok-*) para a paleta escolhida
export function tokenCss(t: SnapTheme): string {
	const tokens = t.tokens;
	if (!tokens) return "";

	const scope = "pre code";
	const rules: string[] = [];

	for (const key of TOKEN_ORDER) {
		const color = tokens[key];
		if (!color) continue;

		const selectors = TOKEN_SELECTORS[key]
			.map((s) => `${scope} ${s}`)
			.join(",");

		if (key === "invalid") {
			rules.push(
				`${selectors}{color:${color} !important;text-decoration:underline wavy ${color} !important}`
			);
		} else if (key === "inserted" || key === "deleted") {
			rules.push(
				`${selectors}{color:${color} !important;background-color:color-mix(in srgb,${color} 18%,transparent) !important}`
			);
		} else {
			rules.push(`${selectors}{color:${color} !important}`);
		}
	}

	// pontuação neutra (herda cor do texto); remova se quiser colorir
	rules.push(`${scope} .tok-punctuation{color:inherit !important}`);

	return rules.join("\n");
}