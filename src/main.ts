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
			description: "CodeSnap: gerar imagem",
			bindKey: { win: "Ctrl-Alt-S", mac: "Command-Alt-S" },
			exec: (view: any) => {
				this.capture(view);
				return true;
			},
		});
		this.commands.addCommand({
			name: CMD_SETTINGS,
			description: "CodeSnap: configurações (tema e pasta)",
			exec: () => {
				this.openSettings();
				return true;
			},
		});
	}

	async destroy() {
		this.commands?.removeCommand(CMD_CAPTURE);
		this.commands?.removeCommand(CMD_SETTINGS);
	}

	// ---------- Configurações ----------
	private async openSettings() {
		const select = acode.require("select");
		const settings = loadSettings();
		const dirLabel = settings.dir ?? "Pictures (padrão)";

		const action = await select("CodeSnap", [
			["theme", `Tema: ${getTheme(settings.theme).name}`],
			["background", `Fundo: ${getBackground(settings.background).name}`],
			["dir", `Pasta: ${dirLabel}`],
			["resetDir", "Voltar para a pasta padrão"],
		]);

		if (action === "theme") {
			const id = await select(
				"Tema da imagem",
				THEMES.map((t) => [t.id, t.name]),
				{ default: settings.theme },
			);
			if (id) saveSettings({ ...settings, theme: id });
		} else if (action === "background") {
			const id = await select(
				"Fundo da imagem",
				BACKGROUNDS.map((b) => [b.id, b.name]),
				{ default: settings.background },
			);
			if (id) saveSettings({ ...settings, background: id });
		} else if (action === "dir") {
			const fileBrowser = acode.require("fileBrowser");
			const picked = await fileBrowser("folder", "Escolha a pasta para salvar");
			if (picked?.url) saveSettings({ ...settings, dir: picked.url });
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

		if (!code.trim()) return toast("Nada para capturar");

		const fileName: string = editorManager.activeFile?.filename ?? "snippet";
		const language = fileName.includes(".") ? fileName.split(".").pop()! : "text";
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

			if (result.themeId !== settings.theme || result.backgroundId !== settings.background) {
				saveSettings({
					...settings,
					theme: result.themeId,
					background: result.backgroundId,
				});
			}
			const where = await this.save(result.blob, `codesnap-${Date.now()}.png`, settings.dir);
			toast(`Salvo em ${where}`);
		} catch (e: any) {
			console.error("[CodeSnap]", e);
			toast("Erro: " + (e?.message ?? e));
		}
	}

	private async save(blob: Blob, name: string, dirUrl: string | null): Promise<string> {
		const fs = acode.require("fsOperation");
		let target = dirUrl;

		if (!target) {
			const root: string = cordova.file.externalRootDirectory;
			target = root + "Pictures";
			const d = await fs(target);
			if (!(await d.exists())) await (await fs(root)).createDirectory("Pictures");
		}

		const dir = await fs(target);
		await dir.createFile(name, await blob.arrayBuffer());
		return decodeURIComponent(target).split("/").slice(-2).join("/") + "/" + name;
	}
}

function normalizeSelection(view: any, sel: any): string {
	const line = view.state.doc.lineAt(sel.from);
	const prefix = view.state.sliceDoc(line.from, sel.from);
	const text = prefix.match(/^\s*/)![0] + view.state.sliceDoc(sel.from, sel.to);
	const lines = text.split("\n");
	const indents = lines.filter((l) => l.trim()).map((l) => l.match(/^[\t ]*/)![0].length);
	const min = indents.length ? Math.min(...indents) : 0;
	return lines.map((l) => l.slice(min)).join("\n");
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
			await acodePlugin.init($page, cacheFile, cacheFileUrl, firstInit, ctx, fileIcons);
		},
	);

	acode.setPluginUnmount(plugin.id, () => {
		acodePlugin.destroy();
	});
}
