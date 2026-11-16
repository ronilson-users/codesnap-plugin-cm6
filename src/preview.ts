export interface Option {
	id: string;
	name: string;
}

export interface PreviewOptions {
	blob: Blob;
	themeId: string;
	backgroundId: string;
	themes: Option[];
	backgrounds: Option[];
	render: (themeId: string, backgroundId: string) => Promise<Blob>;
}

export interface PreviewResult {
	action: "save" | "cancel";
	blob: Blob;
	themeId: string;
	backgroundId: string;
}

// Prévia em overlay próprio (sem depender de APIs de diálogo do Acode)
export function showPreview(opts: PreviewOptions): Promise<PreviewResult> {
	return new Promise((resolve) => {
		let blob = opts.blob;
		let themeId = opts.themeId;
		let backgroundId = opts.backgroundId;
		let url = URL.createObjectURL(blob);

		const overlay = document.createElement("div");
		overlay.style.cssText =
			"position:fixed;inset:0;z-index:99999;display:flex;flex-direction:column;gap:12px;" +
			"padding:calc(env(safe-area-inset-top,0px) + 12px) 12px calc(env(safe-area-inset-bottom,0px) + 12px);" +
			"background:rgba(0,0,0,.88);box-sizing:border-box;color:#fff;font-family:sans-serif";

		// xadrez para o PNG transparente ficar visível
		const stage = document.createElement("div");
		stage.style.cssText =
			"flex:1;min-height:0;display:flex;align-items:center;justify-content:center;overflow:auto;border-radius:8px;" +
			"background:conic-gradient(#3a3a3a 25%,#2c2c2c 0 50%,#3a3a3a 0 75%,#2c2c2c 0) 0 0/20px 20px";
		const img = document.createElement("img");
		img.src = url;
		img.style.cssText = "max-width:100%;max-height:100%;object-fit:contain";
		stage.appendChild(img);

		const makeSelect = (items: Option[], current: string) => {
			const sel = document.createElement("select");
			sel.style.cssText =
				"flex:1;min-width:0;padding:10px;border-radius:8px;border:1px solid #555;background:#222;color:#fff;font-size:15px";
			for (const t of items) {
				const o = document.createElement("option");
				o.value = t.id;
				o.textContent = t.name;
				o.selected = t.id === current;
				sel.appendChild(o);
			}
			return sel;
		};
		const themeSel = makeSelect(opts.themes, themeId);
		const bgSel = makeSelect(opts.backgrounds, backgroundId);
		const selects = document.createElement("div");
		selects.style.cssText = "display:flex;gap:10px";
		selects.append(themeSel, bgSel);

		const btn = (label: string, bg: string) => {
			const b = document.createElement("button");
			b.textContent = label;
			b.style.cssText = `flex:1;padding:12px;border:0;border-radius:8px;background:${bg};color:#fff;font-size:15px`;
			return b;
		};
		const cancel = btn("Cancel", "#444");
		const save = btn("Save", "#2e7d32");
		const row = document.createElement("div");
		row.style.cssText = "display:flex;gap:10px";
		row.append(cancel, save);

		overlay.append(stage, selects, row);
		document.body.appendChild(overlay);

		const close = (action: "save" | "cancel") => {
			URL.revokeObjectURL(url);
			overlay.remove();
			resolve({ action, blob, themeId, backgroundId });
		};

		const rerender = async () => {
			const nextTheme = themeSel.value;
			const nextBg = bgSel.value;
			themeSel.disabled = bgSel.disabled = save.disabled = true;
			img.style.opacity = "0.4";
			try {
				blob = await opts.render(nextTheme, nextBg);
				themeId = nextTheme;
				backgroundId = nextBg;
				URL.revokeObjectURL(url);
				url = URL.createObjectURL(blob);
				img.src = url;
			} catch (e) {
				console.error("[CodeSnap] preview", e);
				themeSel.value = themeId;
				bgSel.value = backgroundId;
			} finally {
				themeSel.disabled = bgSel.disabled = save.disabled = false;
				img.style.opacity = "1";
			}
		};

		themeSel.onchange = rerender;
		bgSel.onchange = rerender;
		cancel.onclick = () => close("cancel");
		save.onclick = () => close("save");
	});
}
