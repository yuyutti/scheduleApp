"use client";

import { useEffect, useRef, useState } from "react";
import { normalizeTimeInput } from "@/lib/time";

type Props = {
    value: string;
    onChange: (v: string) => void;
};

export default function TimeInput({ value, onChange }: Props) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const times = Array.from({ length: 96 }, (_, i) => {
        const h = Math.floor(i / 4);
        const m = (i % 4) * 15;
        return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    });

    useEffect(() => {
        const close = (e: MouseEvent) => {
            if (!ref.current?.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("click", close);
        return () => document.removeEventListener("click", close);
    }, []);

    return (
        <div className="relative" ref={ref}>
            <input
                className="w-full rounded border px-3 py-2"
                value={value}
                onFocus={() => setOpen(true)}
                onChange={(e) => onChange(e.target.value)}
                onBlur={() => onChange(normalizeTimeInput(value))}
                placeholder="HH:mm"
            />

            {open && (
                <div className="absolute z-50 mt-1 max-h-48 w-full overflow-y-auto rounded border bg-white shadow">
                    {times.map(t => (
                        <div
                            key={t}
                            className="cursor-pointer px-3 py-2 hover:bg-blue-500 hover:text-white"
                            onClick={() => {
                                onChange(t);
                                setOpen(false);
                            }}
                        >
                            {t}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}