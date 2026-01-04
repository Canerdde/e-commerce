"use client";

import { useState, useEffect } from "react";

interface PriceSliderProps {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
}

export function PriceSlider({ min, max, value, onChange }: PriceSliderProps) {
  const [localValue, setLocalValue] = useState<[number, number]>(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = Math.min(Number(e.target.value), localValue[1] - 1);
    const newValue: [number, number] = [newMin, localValue[1]];
    setLocalValue(newValue);
    onChange(newValue);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = Math.max(Number(e.target.value), localValue[0] + 1);
    const newValue: [number, number] = [localValue[0], newMax];
    setLocalValue(newValue);
    onChange(newValue);
  };

  const minPercent = ((localValue[0] - min) / (max - min)) * 100;
  const maxPercent = ((localValue[1] - min) / (max - min)) * 100;

  return (
    <div className="relative py-4">
      <div className="flex justify-between mb-4 text-xs text-foreground-muted">
        <span>${localValue[0]}</span>
        <span>${localValue[1]}</span>
      </div>
      <div className="relative h-1 bg-background-secondary">
        <div
          className="absolute h-1 bg-accent"
          style={{
            left: `${minPercent}%`,
            width: `${maxPercent - minPercent}%`,
          }}
        />
      </div>
      <div className="relative -mt-1 z-0">
        <input
          type="range"
          min={min}
          max={max}
          value={localValue[0]}
          onChange={handleMinChange}
          className="absolute w-full h-1 bg-transparent appearance-none cursor-pointer slider-thumb"
          style={{
            zIndex: localValue[0] > max - (max - min) / 2 ? 2 : 1,
          }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={localValue[1]}
          onChange={handleMaxChange}
          className="absolute w-full h-1 bg-transparent appearance-none cursor-pointer slider-thumb"
          style={{
            zIndex: localValue[1] <= max - (max - min) / 2 ? 2 : 1,
          }}
        />
      </div>
    </div>
  );
}

