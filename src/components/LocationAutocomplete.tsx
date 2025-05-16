import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { MapPicker } from "./MapPicker";

interface LocationAutocompleteProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  defaultMapPosition?: [number, number]; // Optional default map position
}

interface LocationSuggestion {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

export function LocationAutocomplete({
  id,
  label,
  value,
  onChange,
  defaultMapPosition,
}: LocationAutocompleteProps) {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const suggestionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Extract display text from value if it contains coordinates
    if (value && value.includes("|")) {
      setQuery(value.split("|")[1]);
    } else {
      setQuery(value);
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionRef.current &&
        !suggestionRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const searchLocation = async (searchQuery: string) => {
    if (!searchQuery || searchQuery.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}&limit=5`
      );
      const data = await response.json();
      setSuggestions(data);
      setShowSuggestions(true);
    } catch (error) {
      console.error("Error fetching location suggestions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    // Debounce search to avoid too many API calls
    const timeoutId = setTimeout(() => {
      searchLocation(value);
    }, 500);

    return () => clearTimeout(timeoutId);
  };

  const handleSelectSuggestion = (suggestion: LocationSuggestion) => {
    setQuery(suggestion.display_name);
    onChange(`${suggestion.lat},${suggestion.lon}|${suggestion.display_name}`);
    setShowSuggestions(false);
  };

  const handleMapSelection = (location: {
    lat: number;
    lng: number;
    address: string;
  }) => {
    setQuery(location.address);
    onChange(`${location.lat},${location.lng}|${location.address}`);
  };

  return (
    <div className="flex flex-col gap-2 relative">
      <Label htmlFor={id}>{label}</Label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            id={id}
            value={query}
            onChange={handleInputChange}
            onFocus={() => query.length >= 3 && setShowSuggestions(true)}
            placeholder={`Enter ${label.toLowerCase()} location`}
          />
          {isLoading && (
            <div className="text-sm text-gray-500 absolute mt-1">
              Loading suggestions...
            </div>
          )}
          {showSuggestions && suggestions.length > 0 && (
            <div
              ref={suggestionRef}
              className="absolute top-full left-0 right-0 z-10 bg-white border rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto"
            >
              {suggestions.map((suggestion) => (
                <div
                  key={suggestion.place_id}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                  onClick={() => handleSelectSuggestion(suggestion)}
                >
                  {suggestion.display_name}
                </div>
              ))}
            </div>
          )}
        </div>
        <Button
          type="button"
          size="icon"
          variant="outline"
          onClick={() => setIsMapOpen(true)}
          title="Select location from map"
        >
          <MapPin className="h-4 w-4" />
        </Button>
      </div>

      <MapPicker
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        onSelectLocation={handleMapSelection}
        defaultPosition={defaultMapPosition}
      />
    </div>
  );
}
