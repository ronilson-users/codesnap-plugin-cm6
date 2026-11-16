import { SnapTheme, tokenCss } from "./themes";
import { backgroundCss } from "./backgrounds";

declare const acode: any;
declare const editorManager: any;

export interface SnapOptions {
	code: string;
	fileName: string;
	language: string;
	theme: SnapTheme;
	background?: string;
	scale?: number;
	padding?: number;
}

const esc = (s: string) =>
	s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export async function renderSnap(o: SnapOptions): Promise<Blob> {
	const { code: rawCode, fileName, language, theme, background = "theme", scale = 2, padding = 40 } = o;
	const code = rawCode.replace(/^\n+/, "").replace(/\s+$/, "");

	// largura medindo a fonte real (14px monospace), em vez de estimar
	const mctx = document.createElement("canvas").getContext("2d")!;
	mctx.font = "14px monospace";
	const textW = Math.max(
		...code.split("\n").map((l) => mctx.measureText(l.replace(/\t/g, "  ")).width),
	);
	const width = Math.min(2400, Math.max(560, Math.ceil(textW + 36 + padding * 2 + 16)));
	const bgCss = backgroundCss(background, theme);

	// 1) Realce nativo do Acode (CodeMirror/Lezer), segue o tema do editor
	const hl = acode.require("codeHighlight");
	const html: string = await hl.highlightCodeBlock(code, language);
	const css: string = hl.getStyles();

	// Cores de fundo/texto do tema atual
	const cmEl = editorManager.container.querySelector(".cm-editor") ?? editorManager.container;
	const cs = getComputedStyle(cmEl);
	const bg = theme.bg ?? (cs.backgroundColor || "#1e1e1e");
	const fg = theme.fg ?? (cs.color || "#ddd");

	const lines = code.split("\n").length;
	const lineH = 21;
	const barH = 42;
	const height = Math.round(padding * 2 + barH + lines * lineH + 28);

	// 2) Card em HTML dentro de SVG (foreignObject), sem dependências
	const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
<foreignObject width="100%" height="100%">
<div xmlns="http://www.w3.org/1999/xhtml" style="box-sizing:border-box;width:${width}px;height:${height}px;padding:${padding}px;background:${bgCss};font-family:monospace">
<style><![CDATA[${css}
${tokenCss(theme)}
.win{border-radius:12px;overflow:hidden;box-shadow:0 20px 50px rgba(0,0,0,.45);background:${bg}}
.bar{display:flex;gap:8px;align-items:center;height:${barH}px;padding:0 14px;background:rgba(0,0,0,.25);color:${fg};font-size:13px;box-sizing:border-box}
.dot{width:12px;height:12px;border-radius:50%;display:inline-block}
pre{margin:0;padding:14px 18px;font-size:14px;line-height:${lineH}px;color:${fg};white-space:pre;overflow:hidden;tab-size:2;-moz-tab-size:2}
pre code,pre code *{background:transparent !important}
]]></style>
<div class="win">
<div class="bar"><span class="dot" style="background:#ff5f56"></span><span class="dot" style="background:#ffbd2e"></span><span class="dot" style="background:#27c93f"></span><span style="margin-left:8px">${esc(fileName)}</span></div>
<pre><code class="${hl.HIGHLIGHT_CLASS}">${html}</code></pre>
</div>
</div>
</foreignObject>
</svg>`;

	// 3) SVG → canvas → PNG
	const img = new Image();
	await new Promise<void>((res, rej) => {
		img.onload = () => res();
		img.onerror = () => rej(new Error("Falha ao renderizar o SVG"));
		img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
	});

	const canvas = document.createElement("canvas");
	canvas.width = width * scale;
	canvas.height = height * scale;
	const ctx = canvas.getContext("2d")!;
	ctx.scale(scale, scale);
	ctx.drawImage(img, 0, 0);

	return new Promise((res, rej) =>
		canvas.toBlob((b) => (b ? res(b) : rej(new Error("toBlob falhou"))), "image/png"),
	);
}
