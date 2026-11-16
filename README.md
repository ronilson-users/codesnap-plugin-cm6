# CodeSnap Acode

Take stunning screenshots of your code in Acode

Turn your code into a clean, shareable PNG image, right from the Acode editor.

CodeSnap renders the selected code (or the whole file) inside a window-style card with the file name, using the same syntax highlighting as your editor or one of the built-in themes.

## Features

- Capture the current selection or the entire file
- Native Acode syntax highlighting (follows your editor theme)
- Built-in color themes: Dracula, Monokai, GitHub Dark, One Dark, GitHub Light, Solarized Light
- Background options: theme gradient, violet / sunset / ocean / night gradients, solid black / gray / white, or transparent
- Live preview: change the theme and background before saving
- High-resolution output (2x scale)
- Choose where images are saved (defaults to the `Pictures` folder)
- Remembers your last theme, background and folder

## Usage

1. Open a file in Acode.
2. (Optional) Select the code you want to capture. With no selection, the whole file is used. Indentation of a selection is normalized automatically.
3. Run **CodeSnap: generate image** from the command palette, or press `Ctrl-Alt-S` with a hardware keyboard (`Command-Alt-S` on macOS).
4. In the preview, pick a theme and a background if you want to change them.
5. Tap **Save**. The image is saved as `codesnap-<timestamp>.png` and a message shows where it went. Tap **Cancel** to discard it.

## Settings

Run **CodeSnap: settings (theme and folder)** from the command palette to set:

| Option | Description |
| --- | --- |
| Theme | Default theme used for new captures |
| Background | Default background used for new captures |
| Folder | Folder where images are saved |
| Reset to default folder | Go back to `Pictures` |

Changes made in the preview are also saved as your new defaults.

## Installation

In Acode, go to **Plugins** and search for **CodeSnap**, or install from a local build (see below).



## Notes

- Very long lines are clipped (the image is capped at 2400 px wide).
- Saving to the default folder requires storage access on your device.
