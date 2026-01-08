// /lib/time.ts
export function normalizeTimeInput(value: string): string {
    if (/^\d+$/.test(value)) {
        return `${value.padStart(2, "0")}:00`;
    }
    if (/^\d+(\.\d{1,2})?$/.test(value)) {
        return convertToTimeString(parseFloat(value));
    }
    return value;
}

export function convertToTimeString(value: number): string {
    const hours = Math.floor(value);
    const minutes = Math.round((value - hours) * 60);
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}