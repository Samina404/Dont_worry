"use client";

import { useState, useEffect, useRef } from "react";
import { Search, MapPin } from "lucide-react";
import { searchLocation, LocationData } from "../utils/weatherApi";

interface WeatherSearchProps {
  onLocationSelect: (location: LocationData) => void;
}

export default function WeatherSearch({ onLocationSelect }: WeatherSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<LocationData[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = async (value: string) => {
    setQuery(value);
    if (value.length > 2) {
      const locations = await searchLocation(value);
      setResults(locations);
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  };

  const handleSelect = (location: LocationData) => {
    onLocationSelect(location);
    setQuery(`${location.name}, ${location.country}`);
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 group-focus-within:text-pink-400 transition-colors" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search city..."
          className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 outline-none text-white placeholder-gray-500 focus:border-pink-500/50 focus:ring-4 focus:ring-pink-500/10 transition-all shadow-inner backdrop-blur-md"
        />
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-3 bg-[#2e1350]/95 border border-white/20 rounded-[2rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden z-[9999] backdrop-blur-3xl">
          {results.map((location, index) => (
            <button
              key={`${location.lat}-${location.lon}-${index}`}
              onClick={() => handleSelect(location)}
              className="w-full px-6 py-5 text-left hover:bg-white/10 flex items-center gap-4 transition-all group border-b border-white/[0.03] last:border-0"
            >
              <div className="p-2.5 bg-white/5 rounded-xl text-gray-400 group-hover:text-pink-400 group-hover:bg-pink-400/10 transition-all">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-white group-hover:text-pink-400 transition-colors truncate text-lg">{location.name}</p>
                <div className="flex items-center gap-2 mt-1">
                   <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{location.country}</p>
                   <div className="w-1 h-1 rounded-full bg-white/10" />
                   <p className="text-[10px] text-gray-600 font-medium">Geo Sanctuary</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
