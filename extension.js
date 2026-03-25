const vscode = require('vscode');

let localClock;
let secondClock;
let separator;
let updateInterval;

const COMMON_TIMEZONES = [
    'UTC',
    'GMT',
    'Europe/London',
    'Europe/Paris',
    'Europe/Berlin',
    'Europe/Moscow',
    'America/New_York',
    'America/Los_Angeles',
    'Asia/Tokyo',
    'Asia/Dubai',
    'Asia/Shanghai',
    'Australia/Sydney',
    'Other (Manual entry)'
];

/**
 * @param {Date} date 
 * @param {boolean} showSeconds 
 */
function formatTime(date, showSeconds) {
    const options = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        ...(showSeconds && { second: '2-digit' })
    };
    return date.toLocaleTimeString('en-GB', options);
}

function updateClocks() {
    if (!localClock || !secondClock || !separator) return;

    const now = new Date();
    const config = vscode.workspace.getConfiguration('dualClocks');
    const showSeconds = config.get('showSeconds', false);
    const paddingSize = config.get('padding', 10);
    const padding = ' '.repeat(Math.max(0, paddingSize));
    separator.text = ` | `;

    const offsetHours = config.get('localOffsetHours', 0);
    const offsetMs = offsetHours * 3600000;
    const localDate = new Date(now.getTime() + offsetMs);

    const localTimeStr = formatTime(localDate, showSeconds);
    const offsetLabel = offsetHours !== 0 ? ` (${offsetHours >= 0 ? '+' : ''}${offsetHours}h)` : '';

    localClock.text = `$(clock) ${localTimeStr}${offsetLabel}`;
    localClock.tooltip = `Local time (Offset: ${offsetHours}h). Click to change offset.`;

    let tz = config.get('secondTimezone', 'UTC');
    let secondTimeStr;
    try {
        const tzOptions = {
            timeZone: tz,
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
            ...(showSeconds && { second: '2-digit' })
        };
        secondTimeStr = new Intl.DateTimeFormat('en-GB', tzOptions).format(now);
    } catch (e) {
        secondTimeStr = 'Error';
    }

    secondClock.text = `$(globe) ${secondTimeStr} (${tz})`;
    secondClock.tooltip = `Time in ${tz}. Click to change timezone.`;
}

function activate(context) {
    const config = vscode.workspace.getConfiguration('dualClocks');
    const paddingSize = config.get('padding', 10);
    const placement = config.get('statusBarPlacement', 'center');
    const nearEditor = placement === 'center';
    const alignment = nearEditor
        ? vscode.StatusBarAlignment.Right
        : vscode.StatusBarAlignment.Left;
    const base = 1000000 + Math.max(0, paddingSize);
    const PRIORITY = nearEditor ? base : -base;
    const padding = ' '.repeat(Math.max(0, paddingSize));

    localClock = vscode.window.createStatusBarItem(alignment, PRIORITY);
    separator = vscode.window.createStatusBarItem(alignment, PRIORITY - 1);
    secondClock = vscode.window.createStatusBarItem(alignment, PRIORITY - 2);

    localClock.command = 'dualClocks.selectLocalOffset';
    secondClock.command = 'dualClocks.selectSecondTimezone';

    separator.text = padding + ' | ' + padding;
    separator.tooltip = 'Dual Clocks Extension';

    localClock.show();
    separator.show();
    secondClock.show();

    updateClocks();
    updateInterval = setInterval(updateClocks, 1000);

    context.subscriptions.push(
        vscode.commands.registerCommand('dualClocks.selectLocalOffset', async () => {
            const config = vscode.workspace.getConfiguration('dualClocks');
            const current = config.get('localOffsetHours', 0);
            const input = await vscode.window.showInputBox({
                prompt: 'Enter local offset in hours (e.g. 3, -2.5, 0)',
                value: current.toString(),
                validateInput: text => isNaN(parseFloat(text)) ? 'Please enter a valid number' : null
            });
            if (input !== undefined) {
                const value = parseFloat(input);
                await config.update('localOffsetHours', value, vscode.ConfigurationTarget.Global);
                updateClocks();
            }
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('dualClocks.selectSecondTimezone', async () => {
            const config = vscode.workspace.getConfiguration('dualClocks');
            const current = config.get('secondTimezone', 'UTC');

            const pick = await vscode.window.showQuickPick(COMMON_TIMEZONES, {
                placeHolder: `Current timezone: ${current}`
            });

            if (!pick) return;

            if (pick === 'Other (Manual entry)') {
                const custom = await vscode.window.showInputBox({
                    prompt: 'Enter IANA Timezone name (e.g. America/New_York)',
                    value: current
                });
                if (custom) {
                    await config.update('secondTimezone', custom.trim(), vscode.ConfigurationTarget.Global);
                    updateClocks();
                }
            } else {
                await config.update('secondTimezone', pick, vscode.ConfigurationTarget.Global);
                updateClocks();
            }
        })
    );

    context.subscriptions.push(
        vscode.workspace.onDidChangeConfiguration(e => {
            if (e.affectsConfiguration('dualClocks')) updateClocks();
        })
    );

    context.subscriptions.push(localClock, separator, secondClock);
}


function deactivate() {
    if (updateInterval) clearInterval(updateInterval);
}

module.exports = { activate, deactivate };