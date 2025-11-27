"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  MapPin,
  ArrowLeft,
  Navigation,
  Filter,
  RefreshCw,
  ExternalLink,
  Clock,
  Star,
  Search,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Place {
  id: string;
  name: string;
  vicinity: string;
  rating: number;
  userRatingsTotal: number;
  photos: any[];
  types: string[];
  geometry: {
    lat: number;
    lng: number;
  };
  openNow?: boolean;
}

const PLACE_TYPES = [
  {
    value: "tourist_attraction",
    label: "Tourist Spots",
    emoji: "🏛️",
    image: "https://images.unsplash.com/photo-1523539693385-e5e891eb4465?q=80&w=800&auto=format&fit=crop",
  },
  {
    value: "park",
    label: "Parks",
    emoji: "🌳",
    image: "https://images.unsplash.com/photo-1496347315686-5f274d046ccc?q=80&w=800&auto=format&fit=crop",
  },
  {
    value: "museum",
    label: "Museums",
    emoji: "🖼️",
    image: "https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?q=80&w=800&auto=format&fit=crop",
  },
  {
    value: "cafe",
    label: "Cafes",
    emoji: "☕",
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=800&auto=format&fit=crop",
  },
  {
    value: "restaurant",
    label: "Restaurants",
    emoji: "🍽️",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop",
  },
  {
    value: "shopping_mall",
    label: "Shopping",
    emoji: "🛍️",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800&auto=format&fit=crop",
  },
  {
    value: "art_gallery",
    label: "Art Galleries",
    emoji: "🎨",
    image: "https://images.unsplash.com/photo-1536924940846-227afb31e2a5?q=80&w=800&auto=format&fit=crop",
  },
];

const SkeletonCard = () => (
  <div className="bg-white/5 rounded-2xl overflow-hidden shadow-sm border border-white/10 h-full">
    <div className="h-48 bg-white/10 animate-pulse" />
    <div className="p-5 space-y-3">
      <div className="h-6 bg-white/10 rounded w-3/4 animate-pulse" />
      <div className="h-4 bg-white/10 rounded w-1/2 animate-pulse" />
      <div className="h-10 bg-white/10 rounded-xl w-full mt-4 animate-pulse" />
    </div>
  </div>
);

export default function ExplorePage() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [selectedType, setSelectedType] = useState("tourist_attraction");
  const [showFilters, setShowFilters] = useState(false);

  const fetchPlaces = async (lat: number, lng: number, type: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/places?lat=${lat}&lng=${lng}&type=${type}`
      );
      if (!response.ok) throw new Error("Failed to fetch places");
      const data = await response.json();

      if (data.status === "ZERO_RESULTS") {
        setPlaces([]);
        setError("No places found nearby. Try a different category!");
      } else {
        setPlaces(data.places || []);
      }
    } catch (err) {
      setError("Failed to load places. Please try again.");
      setPlaces([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });
          fetchPlaces(latitude, longitude, selectedType);
        },
        (err) => {
          setError("Please enable location access to explore nearby places.");
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
    }
  }, []);

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
    setShowFilters(false);
    if (location) {
      fetchPlaces(location.lat, location.lng, type);
    }
  };

  const handleRefresh = () => {
    if (location) {
      fetchPlaces(location.lat, location.lng, selectedType);
    }
  };

  const openInMaps = (place: Place) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${place.geometry.lat},${place.geometry.lng}&query_place_id=${place.id}`;
    window.open(url, "_blank");
  };

  const currentCategory = PLACE_TYPES.find((t) => t.value === selectedType);

  return (
    <div className="min-h-screen bg-[#0f172a] font-sans text-white">
      {/* Hero Section */}
      <div className="relative bg-[#1e293b] border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-blue-900/20 opacity-50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <Link
                href="/home"
                className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Link>
              <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                Explore Nearby
              </h1>
              <p className="mt-2 text-lg text-gray-400">
                Discover hidden gems and local favorites around you.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 border border-white/10 
                text-white hover:bg-white/20 transition shadow-sm font-medium"
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </button>
              <button
                onClick={handleRefresh}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white 
                hover:opacity-90 transition shadow-lg shadow-purple-500/20 font-medium"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* Filter Tags */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0, marginTop: 0 }}
                animate={{ height: "auto", opacity: 1, marginTop: 24 }}
                exit={{ height: 0, opacity: 0, marginTop: 0 }}
                className="overflow-hidden"
              >
                <div className="flex flex-wrap gap-2 pb-2">
                  {PLACE_TYPES.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => handleTypeChange(type.value)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        selectedType === type.value
                          ? "bg-white text-black shadow-md"
                          : "bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20"
                      }`}
                    >
                      <span className="mr-2">{type.emoji}</span>
                      {type.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-purple-500/20 text-purple-300 rounded-lg">
            <Navigation className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-semibold text-white">
            {currentCategory?.label} Near You
          </h2>
        </div>

        {error && !loading && places.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10 shadow-sm">
            <div className="w-16 h-16 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Oops! Something went wrong
            </h3>
            <p className="text-gray-400 max-w-md mx-auto">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
              : places.map((place, index) => (
                  <motion.div
                    key={place.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group bg-[#1e293b] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-purple-500/10 border border-white/5 transition-all duration-300 flex flex-col h-full"
                  >
                    {/* Card Image */}
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={currentCategory?.image}
                        alt={place.name}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] to-transparent opacity-80" />
                      
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-xl font-bold text-white leading-tight line-clamp-2 drop-shadow-md">
                          {place.name}
                        </h3>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 flex flex-col flex-grow">
                      <div className="flex items-start gap-3 mb-4">
                        <MapPin className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                        <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">
                          {place.vicinity}
                        </p>
                      </div>

                      <div className="mt-auto pt-4 border-t border-white/5">
                        <button
                          onClick={() => openInMaps(place)}
                          className="w-full py-3 px-4 bg-white/5 hover:bg-white/10 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2 group-hover:bg-purple-500 group-hover:text-white"
                        >
                          <ExternalLink className="w-4 h-4" />
                          View on Maps
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
          </div>
        )}
      </main>
    </div>
  );
}
