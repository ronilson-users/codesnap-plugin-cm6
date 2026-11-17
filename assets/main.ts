// import plugin from "../plugin.json";
// import { renderSnap } from "./snap";
// import { THEMES, getTheme } from "./themes";
// import { BACKGROUNDS, getBackground } from "./backgrounds";
// import { loadSettings, saveSettings } from "./settings";

// import { showPreview } from "./preview";

// declare const acode: any;
// declare const editorManager: any;
// declare const cordova: any;

// const CMD_CAPTURE = "codesnap.capture";
// const CMD_SETTINGS = "codesnap.settings";

// class AcodePlugin {
// 	baseUrl = "";
// 	private commands: any;

// 	async init(
// 		_page: any,
// 		_cacheFile: any,
// 		_cacheFileUrl: string,
// 		_firstInit: boolean,
// 		_ctx: any,
// 		_fileIcons: any,
// 	) {
// 		this.commands = acode.require("commands");
// 		this.commands.addCommand({
// 			name: CMD_CAPTURE,
// 			description: "CodeSnap: generate image",
// 			bindKey: { win: "Ctrl-Alt-S", mac: "Command-Alt-S" },
// 			exec: (view: any) => {
// 				this.capture(view);
// 				return true;
// 			},
// 		});
// 		this.commands.addCommand({
// 			name: CMD_SETTINGS,
// 			description: "CodeSnap: settings (theme and folder)",
// 			exec: () => {
// 				this.openSettings();
// 				return true;
// 			},
// 		});
// 	}

// 	async destroy() {
// 		this.commands?.removeCommand(CMD_CAPTURE);
// 		this.commands?.removeCommand(CMD_SETTINGS);
// 	}

// 	// ---------- Configurações ----------
// 	private async openSettings() {
// 		const select = acode.require("select");
// 		const settings = loadSettings();
// 		const dirLabel = settings.dir ?? "Pictures (default)";

// 		const action = await select("CodeSnap", [
// 			["theme", `Theme: ${getTheme(settings.theme).name}`],
// 			["background", `Background: ${getBackground(settings.background).name}`],
// 			["dir", `Folder: ${dirLabel}`],
// 			["resetDir", "Reset to default folder"],
// 		]);

// 		if (action === "theme") {
// 			const id = await select(
// 				"Image theme",
// 				THEMES.map((t) => [t.id, t.name]),
// 				{ default: settings.theme },
// 			);
// 			if (id) saveSettings({ ...settings, theme: id });
// 		} else if (action === "background") {
// 			const id = await select(
// 				"Image background",
// 				BACKGROUNDS.map((b) => [b.id, b.name]),
// 				{ default: settings.background },
// 			);
// 			if (id) saveSettings({ ...settings, background: id });
// 		} else if (action === "dir") {
// 			const fileBrowser = acode.require("fileBrowser");
// 			const picked = await fileBrowser("folder", "Choose the folder to save to");
// 			if (picked?.url) saveSettings({ ...settings, dir: picked.url });
// 		} else if (action === "resetDir") {
// 			saveSettings({ ...settings, dir: null });
// 		}
// 	}

// 	// ---------- Captura ----------
// 	private async capture(activeView?: any) {
// 		const toast = acode.require("toast");
// 		const view = activeView ?? editorManager.editor;
// 		const sel = view.state.selection.main;

// 		const code: string = sel.empty
// 			? view.state.doc.toString()
// 			: normalizeSelection(view, sel);

// 		if (!code.trim()) return toast("Nothing to capture");

// 		const fileName: string = editorManager.activeFile?.filename ?? "snippet";
// 		const language = fileName.includes(".") ? fileName.split(".").pop()! : "text";
// 		const settings = loadSettings();

// 		try {
// 			const render = (themeId: string, backgroundId: string) =>
// 				renderSnap({
// 					code,
// 					fileName,
// 					language,
// 					theme: getTheme(themeId),
// 					background: backgroundId,
// 				});

// 			const result = await showPreview({
// 				blob: await render(settings.theme, settings.background),
// 				themeId: settings.theme,
// 				backgroundId: settings.background,
// 				themes: THEMES.map((t) => ({ id: t.id, name: t.name })),
// 				backgrounds: BACKGROUNDS.map((b) => ({ id: b.id, name: b.name })),
// 				render,
// 			});
// 			if (result.action !== "save") return;

// 			if (result.themeId !== settings.theme || result.backgroundId !== settings.background) {
// 				saveSettings({
// 					...settings,
// 					theme: result.themeId,
// 					background: result.backgroundId,
// 				});
// 			}
// 			const where = await this.save(result.blob, `codesnap-${Date.now()}.png`, settings.dir);
// 			toast(`Saved to ${where}`);
// 		} catch (e: any) {
// 			console.error("[CodeSnap]", e);
// 			toast("Error: " + (e?.message ?? e));
// 		}
// 	}

// 	private async save(blob: Blob, name: string, dirUrl: string | null): Promise<string> {
// 		const fs = acode.require("fsOperation");
// 		let target = dirUrl;

// 		if (!target) {
// 			const root: string = cordova.file.externalRootDirectory;
// 			target = root + "Pictures";
// 			const d = await fs(target);
// 			if (!(await d.exists())) await (await fs(root)).createDirectory("Pictures");
// 		}

// 		const dir = await fs(target);
// 		await dir.createFile(name, await blob.arrayBuffer());
// 		return decodeURIComponent(target).split("/").slice(-2).join("/") + "/" + name;
// 	}
// }

// function normalizeSelection(view: any, sel: any): string {
// 	const line = view.state.doc.lineAt(sel.from);
// 	const prefix: string = view.state.sliceDoc(line.from, sel.from);
// 	const text: string = prefix.match(/^\s*/)![0] + view.state.sliceDoc(sel.from, sel.to);
// 	const lines: string[] = text.split("\n");
// 	const indents = lines.filter((l: string) => l.trim()).map((l: string) => l.match(/^[\t ]*/)![0].length);
// 	const min = indents.length ? Math.min(...indents) : 0;
// 	return lines.map((l: string) => l.slice(min)).join("\n");
// }

// if ((window as any).acode) {
// 	const acodePlugin = new AcodePlugin();

// 	acode.setPluginInit(
// 		plugin.id,
// 		async (
// 			baseUrl: string,
// 			$page: any,
// 			{ cacheFileUrl, cacheFile, firstInit, ctx, fileIcons }: any,
// 		) => {
// 			acodePlugin.baseUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
// 			await acodePlugin.init($page, cacheFile, cacheFileUrl, firstInit, ctx, fileIcons);
// 		},
// 	);

// 	acode.setPluginUnmount(plugin.id, () => {
// 		acodePlugin.destroy();
// 	});
// }



import plugin from "../plugin.json";
import { renderSnap } from "./snap";
import { THEMES, getTheme } from "./themes";
import { BACKGROUNDS, getBackground } from "./backgrounds";
import { loadSettings, saveSettings } from "./settings";

import { showPreview } from "./preview";

declare const acode: any;
declare const editorManager: any;
declare const cordova: any;

const CMD_CAPTURE = "codesnap.capture";
const CMD_SETTINGS = "codesnap.settings";

class AcodePlugin {
	baseUrl = "";
	private commands: any;

	async init(
		_page: any,
		_cacheFile: any,
		_cacheFileUrl: string,
		_firstInit: boolean,
		_ctx: any,
		_fileIcons: any,
	) {
		this.commands = acode.require("commands");
		this.commands.addCommand({
			name: CMD_CAPTURE,
			description: "CodeSnap: generate image",
			bindKey: { win: "Ctrl-Alt-S", mac: "Command-Alt-S" },
			exec: (view: any) => {
				this.capture(view).catch((e: any) => {
					console.error("[CodeSnap]", e);
					acode.require("toast")("CodeSnap: " + (e?.message ?? e));
				});
				return true;
			},
		});
		this.commands.addCommand({
			name: CMD_SETTINGS,
			description: "CodeSnap: settings (theme and folder)",
			exec: () => {
				this.openSettings().catch((e: any) => {
					console.error("[CodeSnap]", e);
					acode.require("toast")("CodeSnap: " + (e?.message ?? e));
				});
				return true;
			},
		});
	}

	async destroy() {
		try {
			this.commands?.removeCommand?.(CMD_CAPTURE);
			this.commands?.removeCommand?.(CMD_SETTINGS);
		} catch (e) {
			console.error("[CodeSnap] destroy", e);
		}
	}

	// ---------- Configurações ----------
	private async openSettings() {
		const select = acode.require("select");
		const settings = loadSettings();
		const dirLabel = settings.dir ?? "Pictures (default)";

		const action = await select("CodeSnap", [
			["theme", `Theme: ${getTheme(settings.theme).name}`],
			["background", `Background: ${getBackground(settings.background).name}`],
			["dir", `Folder: ${dirLabel}`],
			["resetDir", "Reset to default folder"],
		]);

		if (action === "theme") {
			const id = await select(
				"Image theme",
				THEMES.map((t) => [t.id, t.name]),
			);
			if (id) saveSettings({ ...settings, theme: id });
		} else if (action === "background") {
			const id = await select(
				"Image background",
				BACKGROUNDS.map((b) => [b.id, b.name]),
			);
			if (id) saveSettings({ ...settings, background: id });
		} else if (action === "dir") {
			const fileBrowser = acode.require("fileBrowser");
			const picked = await fileBrowser("folder", "Choose the folder to save to");
			const url = typeof picked === "string" ? picked : picked?.url;
			if (url) saveSettings({ ...settings, dir: url });
		} else if (action === "resetDir") {
			saveSettings({ ...settings, dir: null });
		}
	}

	// ---------- Captura ----------
	private async capture(activeView?: any) {
		const toast = acode.require("toast");
		const view = activeView ?? editorManager.editor;
		const sel = view.state.selection.main;

		const code: string = sel.empty
			? view.state.doc.toString()
			: normalizeSelection(view, sel);

		if (!code.trim()) {
			toast("Nothing to capture");
			return;
		}

		const fileName: string = editorManager.activeFile?.filename ?? "snippet";
		const extMatch = fileName.match(/\.([^./]+)$/);
		const language = extMatch ? extMatch[1] : "text";
		const settings = loadSettings();

		try {
			const render = (themeId: string, backgroundId: string) =>
				renderSnap({
					code,
					fileName,
					language,
					theme: getTheme(themeId),
					background: backgroundId,
				});

			const result = await showPreview({
				blob: await render(settings.theme, settings.background),
				themeId: settings.theme,
				backgroundId: settings.background,
				themes: THEMES.map((t) => ({ id: t.id, name: t.name })),
				backgrounds: BACKGROUNDS.map((b) => ({ id: b.id, name: b.name })),
				render,
			});
			if (result.action !== "save") return;

			if (
				result.themeId !== settings.theme ||
				result.backgroundId !== settings.background
			) {
				saveSettings({
					...settings,
					theme: result.themeId,
					background: result.backgroundId,
				});
			}
			const where = await this.save(
				result.blob,
				`codesnap-${Date.now()}.png`,
				settings.dir,
			);
			toast(`Saved to ${where}`);
		} catch (e: any) {
			console.error("[CodeSnap]", e);
			toast("Error: " + (e?.message ?? e));
		}
	}

	private async save(
		blob: Blob,
		name: string,
		dirUrl: string | null,
	): Promise<string> {
		const fs = acode.require("fsOperation");
		let target = dirUrl;

		if (!target) {
			const root: string | undefined = cordova?.file?.externalRootDirectory;
			if (!root) throw new Error("External storage not available");
			target = root + "Pictures";
			const d = await fs(target);
			if (!(await d.exists())) {
				await (await fs(root)).createDirectory("Pictures");
			}
		}

		const dir = await fs(target);
		const buf = await blobToArrayBuffer(blob);
		await dir.createFile(name, buf);
		return (
			decodeURIComponent(target).split("/").slice(-2).join("/") + "/" + name
		);
	}
}



async function blobToArrayBuffer(blob: Blob): Promise<ArrayBuffer> {
	if (typeof (blob as any).arrayBuffer === "function") {
		return (blob as any).arrayBuffer();
	}
	return new Promise<ArrayBuffer>((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(reader.result as ArrayBuffer);
		reader.onerror = () => reject(reader.error ?? new Error("FileReader error"));
		reader.readAsArrayBuffer(blob);
	});
}

function normalizeSelection(view: any, sel: any): string {
	const line = view.state.doc.lineAt(sel.from);
	const prefix: string = view.state.sliceDoc(line.from, sel.from);
	const text: string =
		prefix.match(/^\s*/)![0] + view.state.sliceDoc(sel.from, sel.to);
	const lines: string[] = text.split("\n");
	const indents = lines
		.filter((l: string) => l.trim())
		.map((l: string) => l.match(/^[\t ]*/)![0].length);
	const min = indents.length ? Math.min(...indents) : 0;
	return lines.map((l: string) => l.slice(min)).join("\n");
}

if ((window as any).acode) {
	const acodePlugin = new AcodePlugin();

	acode.setPluginInit(
		plugin.id,
		async (
			baseUrl: string,
			$page: any,
			{ cacheFileUrl, cacheFile, firstInit, ctx, fileIcons }: any,
		) => {
			acodePlugin.baseUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
			await acodePlugin.init(
				$page,
				cacheFile,
				cacheFileUrl,
				firstInit,
				ctx,
				fileIcons,
			);
		},
	);

	acode.setPluginUnmount(plugin.id, () => {
		acodePlugin.destroy();
	});
}
