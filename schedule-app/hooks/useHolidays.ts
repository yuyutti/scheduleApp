import { useEffect, useState } from "react";

export function useHolidays() {
    const [holidays, setHolidays] = useState<Record<string, string>>({});

    useEffect(() => {
        fetch("https://holidays-jp.github.io/api/v1/date.json")
            .then(res => res.json())
            .then(setHolidays);
    }, []);

    return holidays;
}