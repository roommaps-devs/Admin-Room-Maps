"use client";

import React from 'react';
import { ChevronDown, IndianRupee } from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as Slider from '@radix-ui/react-slider';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { setPriceRange } from '@/store/mapSlice';

const RENT_PRESETS: { label: string; range: [number, number] }[] = [
  { label: 'Any Price', range: [0, 1000000] },
  { label: 'Under ₹5,000', range: [0, 5000] },
  { label: '₹5,000 - ₹10,000', range: [5000, 10000] },
  { label: '₹10,000 - ₹20,000', range: [10000, 20000] },
  { label: '₹20,000 - ₹40,000', range: [20000, 40000] },
  { label: 'Above ₹40,000', range: [40000, 1000000] },
];

const TRAVELER_PRESETS: { label: string; range: [number, number] }[] = [
  { label: 'Any Price', range: [0, 1000000] },
  { label: 'Under ₹500', range: [0, 500] },
  { label: '₹500 - ₹1,500', range: [500, 1500] },
  { label: '₹1,500 - ₹3,000', range: [1500, 3000] },
  { label: 'Above ₹3,000', range: [3000, 1000000] },
];

interface PriceFilterProps {
  variant?: 'desktop' | 'mobile';
}

const PriceFilter: React.FC<PriceFilterProps> = ({ variant = 'desktop' }) => {
  const dispatch = useDispatch();
  const { mode } = useSelector((state: RootState) => state.ui);
  const { priceRange } = useSelector((state: RootState) => state.map);
  
  const handleSetPriceRange = (range: [number, number]) => {
    dispatch(setPriceRange(range));
  };

  const presets = mode === 'travelers' ? TRAVELER_PRESETS : RENT_PRESETS;
  
  const currentPreset = presets.find(
    p => p.range[0] === priceRange[0] && p.range[1] === priceRange[1]
  ) || presets[0];

  const isAnyPrice = priceRange[0] === 0 && priceRange[1] >= 1000000;
  const maxLimit = mode === 'travelers' ? 10000 : 100000;
  const step = mode === 'travelers' ? 100 : 500;

  const handleSliderChange = (value: number[]) => {
    const min = value[0];
    let max = value[1];
    if (max >= maxLimit) max = 1000000;
    handleSetPriceRange([min, max]);
  };

  const formatValue = (val: number) => {
    if (val >= 1000000) return 'Any';
    return `₹${val.toLocaleString('en-IN')}`;
  };

  const SliderUI = ({ compact = false }: { compact?: boolean }) => (
    <div className={`px-3 ${compact ? 'py-2' : 'py-4'}`}>
      <div className={`flex items-center justify-between ${compact ? 'mb-2' : 'mb-5'}`}>
        <div className="flex flex-col">
          {!compact && <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-primary)]/30 mb-1">Price Range</span>}
          <span className={`${compact ? 'text-[12px]' : 'text-[14px]'} font-black text-[var(--primary)]`}>
            {compact && <span className={`text-[10px] font-bold mr-2 uppercase tracking-tighter ${compact ? 'text-black/50' : 'text-[var(--text-primary)]/40'}`}>Price:</span>}
            {formatValue(priceRange[0])} — {priceRange[1] >= maxLimit ? 'No Limit' : formatValue(priceRange[1])}
          </span>
        </div>
      </div>
      <Slider.Root
        className="relative flex items-center select-none touch-none w-full h-5"
        value={[priceRange[0], Math.min(priceRange[1], maxLimit)]}
        max={maxLimit}
        step={step}
        minStepsBetweenThumbs={1}
        onValueChange={handleSliderChange}
      >
        <Slider.Track className={`relative grow rounded-full h-[4px] ${compact ? 'bg-black/[0.08]' : 'bg-[var(--glass-border)]'}`}>
          <Slider.Range className="absolute bg-[var(--primary)] rounded-full h-full transition-all duration-500 ease-out" />
        </Slider.Track>
        <Slider.Thumb
          className="block w-5 h-5 bg-white border-2 border-[var(--primary)] shadow-lg rounded-full hover:scale-110 focus:outline-none transition-all duration-500 ease-out cursor-grab active:cursor-grabbing"
          aria-label="Min price"
        />
        <Slider.Thumb
          className="block w-5 h-5 bg-white border-2 border-[var(--primary)] shadow-lg rounded-full hover:scale-110 focus:outline-none transition-all duration-500 ease-out cursor-grab active:cursor-grabbing"
          aria-label="Max price"
        />
      </Slider.Root>
      <div className="flex justify-between mt-3">
        <span className={`text-[10px] font-bold ${compact ? 'text-black/30' : 'text-[var(--text-primary)]/20'}`}>₹0</span>
        <span className={`text-[10px] font-bold ${compact ? 'text-black/30' : 'text-[var(--text-primary)]/20'}`}>{formatValue(maxLimit)}+</span>
      </div>
    </div>
  );

  if (variant === 'mobile') {
    return (
      <div className="w-full bg-black/[0.03] rounded-2xl border border-black/[0.05] animate-in fade-in slide-in-from-top-2 duration-500">
        <SliderUI compact />
      </div>
    );
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="shrink-0 h-9 flex items-center gap-2 px-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--glass-border)] text-[var(--text-primary)]/70 font-bold text-[12px] hover:bg-[var(--bg-surface-elevated)] hover:text-[var(--text-primary)] transition-all active:scale-95 group">
          <IndianRupee size={13} className={isAnyPrice ? 'text-[var(--text-primary)]/30' : 'text-[var(--primary)]'} />
          <span>{isAnyPrice ? 'Price Range' : `${formatValue(priceRange[0])} - ${priceRange[1] >= maxLimit ? '∞' : formatValue(priceRange[1])}`}</span>
          <ChevronDown size={14} className="text-[var(--text-primary)]/20 group-data-[state=open]:rotate-180 transition-transform" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="z-[2000] w-[280px] bg-[var(--bg-surface-elevated)] backdrop-blur-2xl border border-[var(--glass-border)] rounded-2xl p-1 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
          sideOffset={8}
          align="start"
        >
          <SliderUI />
          
          <div className="h-px bg-[var(--glass-border)] mx-1 mb-1" />
          
          <div className="grid grid-cols-2 gap-1 p-1">
            {presets.slice(1).map((preset) => {
              const isActive = priceRange[0] === preset.range[0] && priceRange[1] === preset.range[1];
              return (
                <button
                  key={preset.label}
                  className={`px-2 py-2 rounded-lg text-[11px] font-bold transition-colors ${
                    isActive 
                      ? 'bg-[var(--primary)] text-white' 
                      : 'text-[var(--text-primary)]/60 hover:bg-[var(--bg-surface)]'
                  }`}
                  onClick={() => handleSetPriceRange(preset.range)}
                >
                  {preset.label.replace('₹', '')}
                </button>
              );
            })}
            <button
              className="col-span-2 px-2 py-2 rounded-lg text-[11px] font-bold text-[var(--text-primary)]/40 hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)] transition-colors"
              onClick={() => handleSetPriceRange([0, 1000000])}
            >
              Reset to Any Price
            </button>
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default PriceFilter;
