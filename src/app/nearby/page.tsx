
'use client';

import 'mapbox-gl/dist/mapbox-gl.css';
import { useState, useEffect, useRef } from 'react';
import Map, { Marker, Popup } from 'react-map-gl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Hospital, MapPin, Stethoscope } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_API_KEY;

interface Place {
  id: string;
  geometry: {
    coordinates: [number, number];
  };
  properties: {
    name: string;
    address?: string;
  };
  type: 'hospital' | 'pharmacy';
}

export default function NearbyPage() {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [places, setPlaces] = useState<Place[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewport, setViewport] = useState({
    latitude: 37.7749,
    longitude: -122.4194,
    zoom: 12,
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
        setViewport(v => ({ ...v, latitude, longitude }));
      },
      (err) => {
        setError('Could not get your location. Please enable location services in your browser.');
        setLoading(false);
      }
    );
  }, []);

  useEffect(() => {
    if (location) {
      fetchNearbyPlaces(location.longitude, location.latitude);
    }
  }, [location]);

  const fetchNearbyPlaces = async (longitude: number, latitude: number) => {
    setLoading(true);
    try {
      const hospitalRes = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/hospital.json?type=poi&proximity=${longitude},${latitude}&access_token=${MAPBOX_TOKEN}`
      );
      const pharmacyRes = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/pharmacy.json?type=poi&proximity=${longitude},${latitude}&access_token=${MAPBOX_TOKEN}`
      );
      
      if (!hospitalRes.ok || !pharmacyRes.ok) {
        throw new Error('Failed to fetch nearby places from Mapbox API.');
      }
      
      const hospitalData = await hospitalRes.json();
      const pharmacyData = await pharmacyRes.json();

      const hospitals = hospitalData.features.map((f: any) => ({ ...f, type: 'hospital' }));
      const pharmacies = pharmacyData.features.map((f: any) => ({ ...f, type: 'pharmacy' }));

      setPlaces([...hospitals, ...pharmacies]);

    } catch (err: any) {
      setError(err.message || "An error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-theme(spacing.14))] md:h-screen">
      {/* Sidebar with list of places */}
      <div className="w-full md:w-1/3 lg:w-1/4 h-1/2 md:h-full flex flex-col">
        <Card className="flex-1 flex flex-col rounded-none md:rounded-r-none border-0 md:border-r">
            <CardHeader>
            <CardTitle className="font-headline">Nearby Services</CardTitle>
            <CardDescription>Hospitals & Pharmacies near you</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto">
            {loading && (
                <div className="space-y-4">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                </div>
            )}
            {error && <Alert variant="destructive"><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}
            {!loading && !error && (
                <div className="space-y-2">
                {places.map((place) => (
                    <div 
                    key={place.id}
                    className="p-3 rounded-lg hover:bg-muted cursor-pointer"
                    onClick={() => {
                        setSelectedPlace(place);
                        setViewport(v => ({ ...v, longitude: place.geometry.coordinates[0], latitude: place.geometry.coordinates[1], zoom: 14 }));
                    }}
                    >
                    <div className="flex items-center gap-3">
                        {place.type === 'hospital' ? <Hospital className="h-5 w-5 text-destructive" /> : <Stethoscope className="h-5 w-5 text-primary" />}
                        <div>
                        <h3 className="font-semibold">{place.properties.name}</h3>
                        <p className="text-sm text-muted-foreground">{place.properties.address || 'Address not available'}</p>
                        </div>
                    </div>
                    </div>
                ))}
                </div>
            )}
            </CardContent>
        </Card>
      </div>


      {/* Map */}
      <div className="flex-1 h-1/2 md:h-full">
         <Map
          {...viewport}
          onMove={evt => setViewport(evt.viewState)}
          mapboxAccessToken={MAPBOX_TOKEN}
          mapStyle="mapbox://styles/mapbox/streets-v11"
        >
          {location && (
            <Marker longitude={location.longitude} latitude={location.latitude}>
                <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white" />
            </Marker>
          )}
          {places.map(place => (
            <Marker
              key={place.id}
              longitude={place.geometry.coordinates[0]}
              latitude={place.geometry.coordinates[1]}
              onClick={(e) => {
                 e.originalEvent.stopPropagation();
                 setSelectedPlace(place);
              }}
            >
              <MapPin className={`h-6 w-6 ${place.type === 'hospital' ? 'text-destructive' : 'text-primary'}`} />
            </Marker>
          ))}
          
           {selectedPlace && (
            <Popup
              longitude={selectedPlace.geometry.coordinates[0]}
              latitude={selectedPlace.geometry.coordinates[1]}
              onClose={() => setSelectedPlace(null)}
              closeOnClick={false}
              anchor="top"
            >
              <div>
                <h3 className="font-bold">{selectedPlace.properties.name}</h3>
                <p>{selectedPlace.properties.address}</p>
                 <a 
                    href={`https://www.google.com/maps/dir/?api=1&destination=${selectedPlace.geometry.coordinates[1]},${selectedPlace.geometry.coordinates[0]}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                 >
                    Get Directions
                 </a>
              </div>
            </Popup>
          )}

        </Map>
      </div>
    </div>
  );
}
