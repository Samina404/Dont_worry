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
    <div ref={wrapperRef} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search your location"
          className="w-full pl-12 pr-4 py-3 rounded-full bg-white border-none shadow-sm focus:ring-2 focus:ring-blue-100 outline-none text-gray-700 placeholder-gray-400"
        />
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-lg overflow-hidden z-[9999]">
          {results.map((location, index) => (
            <button
              key={`${location.lat}-${location.lon}-${index}`}
              onClick={() => handleSelect(location)}
              className="w-full px-4 py-3 text-left hover:bg-blue-50 flex items-center gap-3 transition-colors"
            >
              <MapPin className="w-4 h-4 text-gray-400" />
              <div>
                <p className="font-medium text-gray-700">{location.name}</p>
                <p className="text-sm text-gray-400">{location.country}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
