"use client";

import { useState, useEffect } from "react";
import {
  MapPin,
  Navigation,
  Filter,
  RefreshCw,
  ExternalLink,
  Search,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import BackButton from "@/components/BackButton";

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
    label: "Landmarks",
    emoji: "🏛️",
    image: "https://images.unsplash.com/photo-1523539693385-e5e891eb4465?q=80&w=800&auto=format&fit=crop",
  },
  {
    value: "park",
    label: "Nature",
    emoji: "🌳",
    image: "https://images.unsplash.com/photo-1496347315686-5f274d046ccc?q=80&w=800&auto=format&fit=crop",
  },
  {
    value: "museum",
    label: "Culture",
    emoji: "🖼️",
    image: "https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?q=80&w=800&auto=format&fit=crop",
  },
  {
    value: "cafe",
    label: "Coffee",
    emoji: "☕",
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=800&auto=format&fit=crop",
  },
  {
    value: "restaurant",
    label: "Dining",
    emoji: "🍽️",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop",
  },
  {
    value: "shopping_mall",
    label: "Style",
    emoji: "🛍️",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800&auto=format&fit=crop",
  },
];

const SkeletonCard = () => (
  <div className="bg-white/5 rounded-3xl overflow-hidden border border-white/10 h-[400px]">
    <div className="h-48 bg-white/5 animate-pulse" />
    <div className="p-6 space-y-4">
      <div className="h-8 bg-white/5 rounded-xl w-3/4 animate-pulse" />
      <div className="h-4 bg-white/5 rounded-lg w-1/2 animate-pulse" />
      <div className="h-12 bg-white/5 rounded-2xl w-full mt-6 animate-pulse" />
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
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name + " " + place.vicinity)}`;
    window.open(url, "_blank");
  };

  const currentCategory = PLACE_TYPES.find((t) => t.value === selectedType);
  const neonText = "text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-yellow-400";
  const glassCard = "bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0f1f] via-[#2e1350] to-[#12081a] text-white font-sans">
      
      {/* Background Lighting */}
       <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-pink-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-500/10 rounded-full blur-[120px]"></div>
      </div>

      <header className="sticky top-0 z-50 bg-[#1a0f1f]/60 backdrop-blur-2xl border-b border-white/5 py-6 px-6 sm:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex-1">
            <h1 className={`text-3xl md:text-5xl font-black uppercase tracking-tighter ${neonText}`}>
              Explore Nearby
            </h1>
            <p className="mt-2 text-gray-400 max-w-lg font-medium">
              Find local sanctuaries, parks, and hidden gems to enrich your mindfulness journey.
            </p>
          </div>
          <div className="flex items-center gap-4">
             <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRefresh}
                className="p-4 rounded-2xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all shadow-lg backdrop-blur-md"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
              </motion.button>
              <BackButton variant="themed" href="/more" />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 sm:px-12 py-12 relative z-10">
        
        {/* Categories / Filters */}
        <div className="flex flex-wrap gap-3 mb-12">
          {PLACE_TYPES.map((type) => (
            <motion.button
              key={type.value}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleTypeChange(type.value)}
              className={`px-6 py-3 rounded-2xl text-sm font-black uppercase tracking-widest transition-all ${
                selectedType === type.value
                  ? "bg-gradient-to-r from-pink-500 to-yellow-500 text-black shadow-[0_0_20px_rgba(236,72,153,0.3)]"
                  : "bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white backdrop-blur-md"
              }`}
            >
              <span className="mr-3">{type.emoji}</span>
              {type.label}
            </motion.button>
          ))}
        </div>

        {/* Section Title */}
        <div className="flex items-center gap-4 mb-10">
           <Navigation className="w-6 h-6 text-pink-500" />
           <h2 className="text-xl font-black uppercase tracking-tighter text-gray-300">
             Discovering {currentCategory?.label}
           </h2>
           <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent" />
        </div>

        {error && !loading && places.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`${glassCard} rounded-[3rem] py-20 text-center max-w-2xl mx-auto`}
          >
            <div className="w-20 h-20 bg-pink-500/10 text-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-pink-500/20">
              <MapPin className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter">
              Energy Blocked
            </h3>
            <p className="text-gray-400 font-medium px-8">{error}</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
              : places.map((place, index) => (
                  <motion.div
                    key={place.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`${glassCard} rounded-[2.5rem] group hover:bg-white/[0.08] transition-all duration-500 flex flex-col h-full overflow-hidden`}
                  >
                    {/* Card Image Area */}
                    <div className="relative h-60 overflow-hidden">
                      <img
                        src={currentCategory?.image}
                        alt={place.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1a0f1f] via-transparent to-transparent opacity-90" />
                      
                      {/* Rating Overlay */}
                      <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-2">
                        <span className="text-yellow-400 text-sm font-black">★ {place.rating || "N/A"}</span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-8 flex flex-col flex-grow">
                      <h3 className="text-2xl font-black text-white leading-tight mb-3 line-clamp-1 group-hover:text-pink-400 transition-colors">
                        {place.name}
                      </h3>
                      
                      <div className="flex items-start gap-4 mb-8">
                        <div className="p-2 bg-white/5 rounded-lg text-gray-500 mt-1">
                           <MapPin className="w-4 h-4" />
                        </div>
                        <p className="text-gray-400 font-medium leading-relaxed line-clamp-2">
                          {place.vicinity}
                        </p>
                      </div>

                      <div className="mt-auto">
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => openInMaps(place)}
                          className="w-full py-4 px-6 bg-white/5 hover:bg-gradient-to-r hover:from-pink-500 hover:to-yellow-500 hover:text-black text-white font-black uppercase tracking-widest text-xs rounded-2xl border border-white/10 hover:border-transparent transition-all flex items-center justify-center gap-3 shadow-lg"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Navigate Sanctum
                        </motion.button>
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
