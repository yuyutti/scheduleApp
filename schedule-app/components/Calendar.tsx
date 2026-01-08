"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import jaLocale from "@fullcalendar/core/locales/ja";
import { useEffect, useState } from "react";
import { fetchHolidays, isMobileDevice } from "@/lib/time";

type EventType = {
    id: string;
    title: string;
    start: string;
    end?: string;
    color?: string;
    description?: string;
};

export default function Calendar({
    onSelect,
    onEventClick,
}: {
    onSelect: (start: string, end: string) => void;
    onEventClick: (event: EventType) => void;
}) {
    const [events, setEvents] = useState<EventType[]>([]);
    const [holidays, setHolidays] = useState<Record<string, string>>({});

    useEffect(() => {
        fetchHolidays().then(setHolidays);
    }, []);

    return (
        <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            locale={jaLocale}
            timeZone="Asia/Tokyo"
            fixedWeekCount={false}
            selectable
            events={async (info, success) => {
                const res = await fetch(
                    `/api/schedules?start=${info.startStr}&end=${info.endStr}`
                );
                const data = await res.json();

                let merged = data;
                if (isMobileDevice()) {
                    merged = merged.concat(
                        Object.entries(holidays).map(([date, name]) => ({
                            title: name,
                            start: date,
                            allDay: true,
                            color: "#ff0000",
                        }))
                    );
                }

                success(merged);
            }}
            select={(info) => {
                const end = new Date(info.endStr);
                end.setDate(end.getDate() - 1);
                onSelect(info.startStr.slice(0, 10), end.toISOString().slice(0, 10));
            }}
            eventClick={(info) => {
                onEventClick({
                    id: info.event.id,
                    title: info.event.title,
                    start: info.event.start!.toISOString(),
                    end: info.event.end?.toISOString(),
                    color: info.event.backgroundColor,
                    description: info.event.extendedProps.description,
                });
            }}
        />
    );
}