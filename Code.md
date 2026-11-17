<div align="center">

  <div align="centee">
    <img src="https://img.shields.io/badge/Acode-Plugin-fdf067?style=for-the-badge" alt="Acode Plugin">

  </div>

<h1>📸 CodeSnap for Acode</h1>

<p style="color:#9a9aa5">Turn your code into a clean, shareable PNG image, right from the Acode editor.</p>

<img src="https://img.shields.io/badge/Acode-Plugin-fdf067?style=for-the-badge" alt="Acode Plugin">
<img src="https://img.shields.io/badge/TypeScript-3178c6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
<img src="https://img.shields.io/badge/esbuild-ffcf00?style=for-the-badge&logo=esbuild&logoColor=black" alt="esbuild">
<img src="https://img.shields.io/badge/license-MIT-2ecc71?style=for-the-badge" alt="MIT">

</div>



<div style="background:#1e1e24;border:1px solid #333;border-radius:5px ;padding:16px;margin:12px 0">
  <h2>
    <span style="background:#fdf067;color:#000;border-radius:4px;padding:2px 8px;margin-right:8px">1</span>
    What is it
  </h2>
  <p style="color:#9a9aa5">
    CodeSnap renders the selected code (or the whole file) inside a window-style card with the file name,
    using the same syntax highlighting as your editor or one of the built-in themes.
    Perfect for sharing clean, professional code screenshots.
  </p>
</div>


<div style="background:#1e1e24;border:1px solid #333;border-radius:5px ;padding:16px;margin:12px 0">
  
<h2>
    <span style="background:#fdf067;color:#000;border-radius:4px;padding:2px 8px;margin-right:8px">2</span>
    Screenshots
  </h2>

<p align="center" ><sub>← Swipe sideways to see all screenshots →</sub></p>

<div style="display:flex; overflow-x:auto; scroll-snap-type:x mandatory; gap:12px; border:1px solid #ccc; border-radius:12px; padding:8px;">

   <figure style="flex:0 0 100%; scroll-snap-align:center; margin:0; text-align:center;">
<img src="https://github.com/ronilson-users/screenshots-acode-public/assets/snap.png" alt="snapcode screenshot" height="350" width="420" style="margin:4px; border-radius:2px;" />
    <figcaption>1/4 · Live model list</figcaption>
  </figure>

  <figure style="flex:0 0 100%; scroll-snap-align:center; margin:0; text-align:center;">
<img src="https://github.com/ronilson-users/screenshots-acode-public/assets/snap.png" alt="snapcode screenshot" height="350" width="420" style="margin:4px; border-radius:2px;" />
    <figcaption>2/4 · Live model list</figcaption>
  </figure>
  
  <figure style="flex:0 0 100%; scroll-snap-align:center; margin:0; text-align:center;">
<img src="https://github.com/ronilson-users/screenshots-acode-public/assets/snap.png" alt="snapcode screenshot" height="350" width="420" style="margin:4px; border-radius:2px;" />
    <figcaption>3/4 · Live model list</figcaption>
  </figure>
  
  <figure style="flex:0 0 100%; scroll-snap-align:center; margin:0; text-align:center;">
<img src="https://github.com/ronilson-users/screenshots-acode-public/assets/snap.png" alt="snapcode screenshot" height="350" width="420" style="margin:4px; border-radius:2px;" />
    <figcaption>4/4 · Live model list</figcaption>
  </figure>

</div>
</div>


<div style="background:#1e1e24;font-size: 9px border:1px solid #333;border-radius:5px ;padding:16px;margin:12px 0">
  <h2>
    <span style="background:#fdf067;color:#000;border-radius:5px ;padding:2px 10px;margin-right:8px">3</span>
    Features
  </h2>
  <table style="width:100%;border-collapse:collapse">
    <tr>
      <th style="color:#fdf067;text-align:left">Feature</th>
      <th style="color:#2ecc71">Status</th>
    </tr>
    <tr>
      <td>Capture selection or entire file</td>
      <td style="color:#2ecc71">✔ Available</td>
    </tr>
    <tr>
      <td>Native Acode syntax highlighting</td>
      <td style="color:#2ecc71">✔ Available</td>
    </tr>
    <tr>
      <td>Built-in themes (Dracula, Monokai, GitHub Dark…)</td>
      <td style="color:#2ecc71">✔ Available</td>
    </tr>
    <tr>
      <td>Backgrounds: gradient, solid or transparent</td>
      <td style="color:#2ecc71">✔ Available</td>
    </tr>
    <tr>
      <td>Live preview before saving</td>
      <td style="color:#2ecc71">✔ Available</td>
    </tr>
    <tr>
      <td>Window with the 3 traffic-light dots</td>
      <td style="color:#2ecc71">✔ Available</td>
    </tr>
    <tr>
      <td>High-resolution output (2× scale)</td>
      <td style="color:#2ecc71">✔ Available</td>
    </tr>
    <tr>
      <td>Custom save folder + remembers last settings</td>
      <td style="color:#2ecc71">✔ Available</td>
    </tr>
  </table>
</div>

<div style="background:#1e1e24;border:1px solid #333;border-radius:5px ;padding:16px;margin:12px 0">
  <h2>
    <span style="background:#fdf067;color:#000;border-radius:5px ;padding:2px 10px;margin-right:8px">4</span>
    How to use
  </h2>
  <p style="color:#9a9aa5">
    1. Open a file in Acode.<br>
    2. (Optional) Select the code you want to capture. With no selection, the whole file is used.<br>
    3. Run <b>CodeSnap: generate image</b> from the command palette, or press <kbd style="border:1px solid #555;border-radius:4px;padding:2px 6px">Ctrl-Alt-S</kbd> (<kbd style="border:1px solid #555;border-radius:4px;padding:2px 6px">⌘-Alt-S</kbd> on macOS).<br>
    4. In the preview, pick a theme and background if you want.<br>
    5. Tap <b>Save</b>. The image is saved as <code style="color:#888">codesnap-&lt;timestamp&gt;.png</code>.
  </p>

  <div style="background:#0d0d14;border-radius:12px;border:1px solid #333;margin-top:12px">
    <div style="padding:10px 14px;border-bottom:1px solid #333">
      <span style="display:inline-block;width:12px;height:12px;border-radius:5px ;background:#ff5f56"></span>
      <span style="display:inline-block;width:12px;height:12px;border-radius:5px ;background:#ffbd2e"></span>
      <span style="display:inline-block;width:12px;height:12px;border-radius:5px ;background:#27c93f"></span>
      <span style="color:#888;margin-left:12px">example.js</span>
    </div>
    <pre style="padding:12px;margin:0;color:#3db8ff">const hello = () => console.log("CodeSnap!");</pre>
  </div>
</div>

<div style="background:#1e1e24;border:1px solid #333;border-radius:5px ;padding:16px;margin:12px 0">
  <h2>
    <span style="background:#fdf067;color:#000;border-radius:5px ;padding:2px 10px;margin-right:8px">5</span>
    Settings
  </h2>
  <p style="color:#9a9aa5">
    Run <b>CodeSnap: settings (theme and folder)</b> from the command palette to configure:
  </p>
  <table style="width:100%;border-collapse:collapse;margin-top:8px">
    <tr>
      <th style="color:#fdf067;text-align:left">Option</th>
      <th style="color:#9a9aa5;text-align:left">Description</th>
    </tr>
    <tr>
      <td>Theme</td>
      <td style="color:#9a9aa5">Default theme for new captures</td>
    </tr>
    <tr>
      <td>Background</td>
      <td style="color:#9a9aa5">Default background for new captures</td>
    </tr>
    <tr>
      <td>Folder</td>
      <td style="color:#9a9aa5">Where images are saved</td>
    </tr>
    <tr>
      <td>Reset to default folder</td>
      <td style="color:#9a9aa5">Go back to <code style="color:#888">Pictures</code></td>
    </tr>
  </table>
  <p style="color:#9a9aa5;margin-top:10px">
    Changes made in the preview are also saved as your new defaults.
  </p>
</div>

<div style="background:#1e1e24;border:1px solid #333;border-radius:5px ;padding:16px;margin:12px 0">
  <h2>
    <span style="background:#fdf067;color:#000;border-radius:5px ;padding:2px 10px;margin-right:8px">6</span>
    Installation
  </h2>
  <p style="color:#9a9aa5">
    In Acode, go to <b>Plugins</b> and search for <b>CodeSnap</b>, or install from a local build.
  </p>
</div>

<div style="background:#1e1e24;border:1px solid #333;border-radius:5px ;padding:16px;margin:12px 0">
  <h2>
    <span style="background:#fdf067;color:#000;border-radius:5px ;padding:2px 10px;margin-right:8px">7</span>
    Notes
  </h2>
  <p style="color:#9a9aa5">
    • Very long lines are clipped (the image is capped at 2400 px wide).<br>
    • Saving to the default folder requires storage access on your device.
  </p>
</div>

<hr>

<div align="center">
  <sub>Made with ☕ for Acode</sub>
</div>
