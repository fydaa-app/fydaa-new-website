"use client";

import { useEffect, useRef } from "react";
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

interface Indicator {
  label: string;
  value: number;
  color: string;
}

interface BalanceSheetProps {
  indicators: Indicator[];
  damage: number;
  networth: string | number;
  width: number;
  height: number;
}

function degsToRadians(degs: number): number {
  return (degs / 360) * (2 * Math.PI);
}

export default function BalanceSheet({ indicators, damage, networth, width, height }: BalanceSheetProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const c = canvas.getContext('2d');
    if (!c) return;

    const center = width / 2;
    const lineWidth = 30;
    const radius = center - (lineWidth / 2) - 20;

    let startAngle = degsToRadians(-90);
    const damagedColor = '#F04438';
    const positiveColor = '#6CE9A6';

    // Draw outer ring (damage vs good)
    const sectionDamaged = damage / 100 * 360;
    const sectionGood = (100 - damage) / 100 * 360;
    const sectionDamagedEndAngle = startAngle + degsToRadians(sectionDamaged);

    c.lineWidth = 5;
    c.strokeStyle = damagedColor;
    c.beginPath();
    c.arc(center, center, radius + 20, startAngle, sectionDamagedEndAngle);
    c.stroke();
    c.closePath();

    startAngle = sectionDamagedEndAngle;
    const sectionGoodEndAngle = startAngle + degsToRadians(sectionGood);

    c.strokeStyle = positiveColor;
    c.beginPath();
    c.arc(center, center, radius + 20, startAngle, sectionGoodEndAngle);
    c.stroke();
    c.closePath();

    // Draw inner ring (indicators)
    const dataTotal = indicators.reduce((r, dataPoint) => r + dataPoint.value, 0);
    startAngle = degsToRadians(-90);

    for (const indicator of indicators) {
      const section = indicator.value / dataTotal * 360;
      const endAngle = startAngle + degsToRadians(section);
      const color = indicator.color;

      c.lineWidth = lineWidth;
      c.strokeStyle = color;
      c.beginPath();
      c.arc(center, center, radius, startAngle, endAngle);
      c.stroke();
      startAngle = endAngle;
      c.closePath();
    }

    // Draw divider lines
    startAngle = degsToRadians(-90);
    for (const indicator of indicators) {
      const section = indicator.value / dataTotal * 360;
      const endAngle = startAngle + degsToRadians(section);

      const dx = (radius + 15) * Math.cos(startAngle);
      const dy = (radius + 15) * Math.sin(startAngle);

      c.strokeStyle = '#ffffff';
      c.lineWidth = 4;
      c.beginPath();
      c.moveTo(center, center);
      c.lineTo(center + dx, center + dy);
      c.stroke();
      startAngle = endAngle;
      c.closePath();
    }

    // Draw center text
    c.textAlign = 'center';
    c.lineWidth = 0;
    c.fillStyle = '#475467';
    c.font = `bold 16px Inter, ${inter.style.fontFamily}`;
    c.beginPath();
    c.fillText(`Net Worth`, center, center - 15);
    c.closePath();

    c.fillStyle = '#101828';
    c.font = `bold 24px Inter, ${inter.style.fontFamily}`;
    c.fontKerning = "none";
    c.beginPath();
    c.fillText(`₹${networth}`, center, center + 15);
    c.closePath();
  }, [damage, indicators, networth, width, height]);

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <canvas ref={canvasRef} width={width} height={height} />
      <div className="w-full flex flex-row justify-center flex-wrap gap-2 mt-4">
        {indicators.map((indicator, index) => (
          <div
            key={`${indicator.color}-${index}`}
            className="bg-brandblack-100 pl-2 pr-2 pt-1 pb-1 flex flex-row justify-center items-center rounded-lg"
          >
            <div
              className={`h-4 w-4 rounded-sm mr-1`}
              style={{ background: indicator.color }}
            ></div>
            <div className="text-[10px] font-bold text-brandblack-700">{indicator.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

