import { NextResponse } from "next/server";
import { Op } from "sequelize";
import Schedule from "@/models/Schedule";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const userID = searchParams.get("userID");
    const start = searchParams.get("start");
    const end = searchParams.get("end");

    if (!userID || !start || !end) {
        return NextResponse.json({ error: "bad request" }, { status: 400 });
    }

    const schedules = await Schedule.findAll({
        where: {
            userID,
            start: { [Op.gte]: start },
            end: { [Op.lte]: end },
        },
    });

    return NextResponse.json(schedules);
}

export async function POST(req: Request) {
    const body = await req.json();
    const schedule = await Schedule.create(body);
    return NextResponse.json(schedule);
}