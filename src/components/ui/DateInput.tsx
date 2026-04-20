import { Calendar } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "./button";

interface Props {
  value: string; // format: YYYY-MM-DD
  onChange: (val: string) => void;
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function DateInput({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [setShowMonthYearPicker] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const parsed = value ? new Date(value) : null;
  const [viewYear, setViewYear] = useState(
    parsed?.getFullYear() ?? new Date().getFullYear(),
  );
  const [viewMonth, setViewMonth] = useState(
    parsed?.getMonth() ?? new Date().getMonth(),
  );

  const handleBlur = (e: React.FocusEvent) => {
    if (!ref.current?.contains(e.relatedTarget as Node)) {
      setOpen(false);
    }
  };

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();

  const selectDay = (day: number) => {
    const mm = String(viewMonth + 1).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    onChange(`${viewYear}-${mm}-${dd}`);
    setOpen(false);
  };

  const displayValue = parsed
    ? parsed.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      })
    : "";

  const selectedDay = parsed?.getDate();
  const selectedMonth = parsed?.getMonth();
  const selectedYear = parsed?.getFullYear();

  return (
    <div ref={ref} className="relative" onBlur={handleBlur}>
      {/* Trigger */}
      <Button
        type="button"
        variant="outline"
        onClick={() => setOpen((p) => !p)}
        className="w-full h-12 border border-gray-200 rounded-xl px-4 text-sm text-left bg-white flex items-center justify-between hover:border-gray-300 transition-colors"
      >
        <span className={displayValue ? "text-gray-700" : "text-gray-400"}>
          {displayValue || "Select date"}
        </span>
        <Calendar size={15} className="text-gray-400 shrink-0" />
      </Button>

      {open && (
        <div className="absolute bottom-full left-0 mb-1.5 bg-white border border-gray-200 rounded-2xl shadow-lg z-50 p-4 w-72">
          <div className="flex items-center justify-between mb-3 gap-2">
            {/* Prev */}
            <button
              type="button"
              onClick={() => {
                if (viewMonth === 0) {
                  setViewMonth(11);
                  setViewYear((y) => y - 1);
                } else setViewMonth((m) => m - 1);
              }}
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 transition text-gray-500"
            >
              ‹
            </button>

            {/* Month dropdown */}
            <select
              value={viewMonth}
              onChange={(e) => setViewMonth(Number(e.target.value))}
              className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white"
            >
              {MONTHS.map((m, i) => (
                <option key={m} value={i}>
                  {m}
                </option>
              ))}
            </select>

            {/* Year dropdown */}
            <select
              value={viewYear}
              onChange={(e) => setViewYear(Number(e.target.value))}
              className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white"
            >
              {Array.from({ length: 120 }).map((_, i) => {
                const year = new Date().getFullYear() - i;
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                );
              })}
            </select>

            {/* Next */}
            <button
              type="button"
              onClick={() => {
                if (viewMonth === 11) {
                  setViewMonth(0);
                  setViewYear((y) => y + 1);
                } else setViewMonth((m) => m + 1);
              }}
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 transition text-gray-500"
            >
              ›
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 mb-1">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
              <div
                key={d}
                className="text-center text-[10px] text-gray-400 font-medium py-1"
              >
                {d}
              </div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-y-1">
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}

            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const isSelected =
                day === selectedDay &&
                viewMonth === selectedMonth &&
                viewYear === selectedYear;

              return (
                <Button
                  key={day}
                  type="button"
                  variant="outline"
                  onClick={() => selectDay(day)}
                  className={`w-8 h-8 mx-auto flex items-center justify-center text-xs rounded-lg transition-colors
                    ${
                      isSelected
                        ? "bg-gray-900 text-white font-semibold"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                >
                  {day}
                </Button>
              );
            })}
          </div>

          {/* Clear Button */}
          {value && (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onChange("");
                setOpen(false);
                setShowMonthYearPicker(false);
              }}
              className="w-full mt-3 text-xs text-gray-400 hover:text-gray-600 hover:bg-gray-50 py-1.5 rounded-lg transition"
            >
              Clear date
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
