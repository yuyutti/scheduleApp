"use client";
import { useState } from "react";
import TimeInput from "./TimeInput";

type Props = {
    open: boolean;
    onClose: () => void;
    onSave: (data: any) => void;
};

export default function EventModal({ open, onClose, onSave }: Props) {
    const [title, setTitle] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [description, setDescription] = useState("");

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-md rounded bg-white p-6">
                <h2 className="mb-4 text-lg font-bold">イベント追加</h2>

                <input
                    className="mb-3 w-full rounded border px-3 py-2"
                    placeholder="タイトル"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                />

                <TimeInput value={startTime} onChange={setStartTime} />
                <TimeInput value={endTime} onChange={setEndTime} />

                <textarea
                    className="mt-3 w-full rounded border px-3 py-2"
                    rows={3}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                />

                <div className="mt-4 flex justify-end gap-2">
                    <button className="px-4 py-2" onClick={onClose}>キャンセル</button>
                    <button
                        className="rounded bg-blue-600 px-4 py-2 text-white"
                        onClick={() => onSave({ title, startTime, endTime, description })}
                    >
                        保存
                    </button>
                </div>
            </div>
        </div>
    );
}