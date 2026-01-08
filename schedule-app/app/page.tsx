"use client";

import { useState } from "react";
import Calendar from "@/components/Calendar";

export default function Page() {
    const [selected, setSelected] = useState<{
        start: string;
        end: string;
    } | null>(null);

    return (
        <div className="h-screen p-2">
            <Calendar
                onSelect={(start, end) => {
                    setSelected({ start, end });
                }}
                onEventClick={(event) => {
                    console.log("edit", event);
                }}
            />

            {selected && (
                <div className="fixed bottom-4 left-4 bg-white shadow p-4 rounded">
                    <div>開始: {selected.start}</div>
                    <div>終了: {selected.end}</div>
                </div>
            )}
        </div>
    );
}