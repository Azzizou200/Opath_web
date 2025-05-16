import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";

// Fix Leaflet icon issue
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)
  ._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

interface MapPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLocation: (location: {
    lat: number;
    lng: number;
    address: string;
  }) => void;
  defaultPosition?: [number, number]; // Optional default position
}

interface LocationMarkerProps {
  position: [number, number];
  onPositionChange: (position: [number, number]) => void;
}

const LocationMarker: React.FC<LocationMarkerProps> = ({
  position,
  onPositionChange,
}) => {
  // Use map events without storing the map reference
  useMapEvents({
    click(e) {
      onPositionChange([e.latlng.lat, e.latlng.lng]);
    },
  });

  return position ? <Marker position={position} /> : null;
};

export function MapPicker({
  isOpen,
  onClose,
  onSelectLocation,
  defaultPosition = [1, 1], // Default to Algeria if not provided
}: MapPickerProps) {
  const [position, setPosition] = useState<[number, number]>(defaultPosition);
  const [address, setAddress] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Update position if defaultPosition changes
  useEffect(() => {
    if (defaultPosition) {
      setPosition(defaultPosition);
      reverseGeocode(defaultPosition[0], defaultPosition[1]);
    }
  }, [defaultPosition]);

  // Try to get user's location on component mount
  useEffect(() => {
    if (isOpen && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setPosition([position.coords.latitude, position.coords.longitude]);
          reverseGeocode(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    }
  }, [isOpen]);

  const handlePositionChange = (newPosition: [number, number]) => {
    setPosition(newPosition);
    reverseGeocode(newPosition[0], newPosition[1]);
  };

  const reverseGeocode = async (lat: number, lon: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
      );
      const data = await response.json();
      setAddress(data.display_name);
    } catch (error) {
      console.error("Error reverse geocoding:", error);
      setAddress("Unknown location");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = () => {
    onSelectLocation({
      lat: position[0],
      lng: position[1],
      address: address,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Select Location from Map</DialogTitle>
        </DialogHeader>
        <div className="h-[400px] w-full mt-4">
          <MapContainer
            center={position}
            zoom={13}
            scrollWheelZoom={true}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker
              position={position}
              onPositionChange={handlePositionChange}
            />
          </MapContainer>
        </div>
        <div className="mt-4">
          <p className="text-sm font-medium mb-2">Selected Location:</p>
          <p className="text-sm text-gray-700 break-words">
            {isLoading
              ? "Loading address..."
              : address || "Click on the map to select a location"}
          </p>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={!address}>
            Confirm Location
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
