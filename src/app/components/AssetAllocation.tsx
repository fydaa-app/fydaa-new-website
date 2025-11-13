"use client";

import { useEffect, useRef } from "react";
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

interface AssetAllocationItem {
  name: string;
  pr: number;
}

interface AssetAllocationProps {
  assetAllocation: AssetAllocationItem[];
  width: number;
  height: number;
}

function degsToRadians(degs: number): number {
  return (degs / 360) * (2 * Math.PI);
}

const colors = ['#007DFB', '#EC5B7A', '#EE7A3F', '#344054', '#FBC70A'];

export default function AssetAllocation({ assetAllocation, width, height }: AssetAllocationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const c = canvas.getContext('2d');
    if (!c) return;

    const center = width / 2;
    const lineWidth = 40;
    const radius = center - (lineWidth / 2);
    const dataTotal = assetAllocation.reduce((r, dataPoint) => r + dataPoint.pr, 0);

    let startAngle = degsToRadians(-90);
    let counter = 0;

    // Draw the donut chart segments
    for (const indicator of assetAllocation) {
      const section = indicator.pr / dataTotal * 360;
      const endAngle = startAngle + degsToRadians(section);

      c.lineWidth = lineWidth;
      c.strokeStyle = colors[counter++ % colors.length];
      c.beginPath();
      c.arc(center, center, radius, startAngle, endAngle);
      c.stroke();
      startAngle = endAngle;
      c.closePath();
    }

    // Draw the divider lines
    startAngle = degsToRadians(-90);
    for (const indicator of assetAllocation) {
      const section = indicator.pr / dataTotal * 360;
      const endAngle = startAngle + degsToRadians(section);

      const dx = (width / 2) * Math.cos(startAngle);
      const dy = (width / 2) * Math.sin(startAngle);

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
    c.fillStyle = '#101828';
    c.font = `bold 18px Inter, ${inter.style.fontFamily}`;
    c.fontKerning = "none";
    c.beginPath();
    c.fillText(`Asset`, center, center - 10);
    c.fillText('Allocation', center, center + 15);
    c.closePath();
  }, [assetAllocation, width, height]);

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <canvas ref={canvasRef} width={width} height={height} />
      <div className="w-full flex flex-row justify-center flex-wrap gap-2 mt-4">
        {assetAllocation.map((indicator, i) => (
          <div
            key={indicator.name}
            className="bg-brandblack-100 pl-2 pr-2 pt-1 pb-1 flex flex-row justify-center items-center rounded-lg"
          >
            <div
              className={`h-4 w-4 rounded-sm mr-1`}
              style={{ background: colors[i % colors.length] }}
            ></div>
            <div className="text-[10px] font-bold text-brandblack-700">{indicator.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

