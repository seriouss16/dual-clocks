# Dual Clocks

A clean and useful extension for **Cursor** and **VS Code** that adds **two live clocks** to the bottom status bar.

- **First clock**: Shows your local system time with an adjustable offset (useful for remote teams or manual timezone correction).
- **Second clock**: Displays time in any timezone you choose (default: **UTC**).

Perfect for developers working across different time zones.

<!-- Image URLs must be absolute so Open VSX / marketplace web UI can load them. Push `screenshot/` to the repo default branch. -->
![Dual Clocks in the status bar](https://raw.githubusercontent.com/seriouss16/dual-clocks/main/screenshot/image_1.png)

## Features

- Real-time updating clocks (updates every second)
- Adjustable offset for the first clock (supports fractions like +3.5 or -2)
- Second clock supports any IANA timezone (UTC, Europe/Moscow, America/New_York, Asia/Tokyo, etc.)
- Click on clocks to quickly change settings
- Option to show/hide seconds
- Status bar placement: **left** (default) or **center** (inner edge of the right status bar, closest to the editor)
- Adjustable spacing around the separator between the two clocks
- Fully configurable via Settings
- Lightweight and performant

## More screenshots

![Dual Clocks settings](https://raw.githubusercontent.com/seriouss16/dual-clocks/main/screenshot/image_2.png)

![Dual Clocks usage](https://raw.githubusercontent.com/seriouss16/dual-clocks/main/screenshot/image_3.png)

## Installation

Build a `.vsix` locally (requires [Node.js](https://nodejs.org/)):

**Global `vsce`** (install once: `npm install -g @vscode/vsce`):

```bash
vsce package
```

**Or** use the copy pinned in this repo:

```bash
npm install
npm run package
```

**Or** a one-off without `npm install`: `npx @vscode/vsce package`

All three produce the same `dual-clocks-*.vsix` in the project root.

### For the whole team (recommended)

1. Download the latest `dual-clocks-*.vsix` file from Releases.
2. In Cursor / VS Code:  
   **Extensions** → **...** → **Install from VSIX...** → select the `.vsix` file.
3. Reload the window if the clocks do not show (Command Palette → **Developer: Reload Window**).

By default the clocks appear on the **left** side of the status bar. To place them on the inner edge of the right section (closest to the editor), set **Dual Clocks: Status Bar Placement** to `center` in Settings.

### From source (for developers)

```bash
git clone https://github.com/seriouss16/dual-clocks.git
cd dual-clocks
vsce package
# or: npm install && npm run package
```

Then install the produced file (VS Code: `code --install-extension dual-clocks-*.vsix`, Cursor: `cursor --install-extension dual-clocks-*.vsix`).

## Usage

- Click the first clock → enter offset in hours (e.g. `3`, `-5.5`, `0`)
- Click the second clock → choose from popular timezones or enter custom IANA name
- Configure via Settings (`Ctrl/Cmd + ,`) → search for **Dual Clocks**

## Settings

| Setting                          | Default   | Description |
|----------------------------------|-----------|-------------|
| `dualClocks.localOffsetHours`   | `0`       | Offset in hours for the first (local) clock |
| `dualClocks.secondTimezone`     | `"UTC"`   | IANA timezone for the second clock |
| `dualClocks.showSeconds`        | `false`   | Show seconds in both clocks |
| `dualClocks.padding`            | `10`      | Spaces around the separator between the clocks (`0`–`40`) |
| `dualClocks.statusBarPlacement` | `"left"`  | `"left"` = left status bar; `"center"` = inner edge of the right bar (reload may be required) |

## Popular Timezones

- UTC  
- Europe/Moscow  
- Europe/London  
- Europe/Paris  
- America/New_York  
- America/Los_Angeles  
- Asia/Tokyo  
- Asia/Dubai  
- Australia/Sydney  

