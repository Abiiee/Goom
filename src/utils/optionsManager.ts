/*
[
    {
        name: "days",
        requireValue: true,
        allowQuotes: false
    }
]
*/
const detectOptions = '--';
interface options {
    name: string,
    requireValue?: boolean | false,
    allowQuotes?: boolean | false
}
interface detectedOptions {
    name: string,
    value: string | null
}

export default function (options: Array<options>, args: Array<string>): Array<detectedOptions> {
    const detected: Array<detectedOptions> = [];
    for (const option of options) {
        const toSend: detectedOptions = { name: option.name, value: null };
        const index = args.indexOf(detectOptions + option.name);
        if (index === -1) continue;
        if (option.requireValue) {
            if (option.allowQuotes) {
                const nextStr = args[index + 1] || '';
                if (nextStr.startsWith('"')) {
                    const arrWorked = args.slice(index + 1);
                    for (const i in arrWorked) {
                        if (i == '0') {
                            const toSet = arrWorked[i].substring(1);
                            if (toSet.indexOf('"') === -1) toSend.value = toSet + ' ';
                            else {
                                toSend.value = toSet.substring(0, toSet.indexOf('"'));
                                args.splice(index, parseInt(i) + 2);
                                break;
                            }
                        } else {
                            const toFind = arrWorked[i].indexOf('"');
                            if (toFind === -1) toSend.value += arrWorked[i] + ' ';
                            else {
                                toSend.value += arrWorked[i].substring(0, toFind);
                                break;
                            }
                        }
                        if (parseInt(i) === arrWorked.length - 1) throw new Error('User forgot to close their quote!');
                    }
                } else {
                    toSend.value = nextStr;
                    args.splice(index, 2);
                }
            } else {
                toSend.value = args[index + 1];
                args.splice(index, 2);
            }
        } else args.splice(index, 1);
        detected.push(toSend);
    }
    return detected;
}