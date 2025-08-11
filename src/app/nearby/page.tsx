
'use client';

import 'mapbox-gl/dist/mapbox-gl.css';
import { useState, useEffect, useRef } from 'react';
import Map, { Marker, Popup } from 'react-map-gl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Hospital, MapPin, Stethoscope, Star } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// It's safe to expose this key on the client-side for Mapbox.
// Scoped public keys are the standard way to use Mapbox on the web.
const MAPBOX_TOKEN = 'pk.eyJ1IjoidGF3ZmVlcWJhaHVyMSIsImEiOiJjbWU3ZDdwY2MwM2p1MmxzYzFla2Z4c3BrIn0.gDE9nf5UHlWyWzVT9IVuXA';

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
  rating: number; // Simulated rating
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

  const mapRef = useRef<any>();
  const watchId = useRef<number | null>(null);

   useEffect(() => {
    if (!MAPBOX_TOKEN) {
      setError("Mapbox API key is not configured. The map cannot be displayed.");
      setLoading(false);
      return;
    }

    if (!navigator.geolocation) {
       setError('Geolocation is not supported by your browser.');
       setLoading(false);
       return;
    }

    // Function to handle successful location watch
    const handleSuccess = (position: GeolocationPosition) => {
      const { latitude, longitude } = position.coords;
      const newLocation = { latitude, longitude };
      
      setLocation(currentLocation => {
        // Only fetch places and update viewport on the very first location fix
        // or if the user has moved significantly.
        if (!currentLocation) {
          setViewport(v => ({ ...v, latitude, longitude, zoom: 14 }));
          fetchNearbyPlaces(longitude, latitude);
        }
        return newLocation;
      });
    };
    
    // Function to handle location error
    const handleError = (err: GeolocationPositionError) => {
      setError(`Could not get your location: ${err.message}. Please enable location services.`);
      setLoading(false);
    };

    // Start watching position
    watchId.current = navigator.geolocation.watchPosition(handleSuccess, handleError, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    });

    // Cleanup watcher on component unmount
    return () => {
      if (watchId.current !== null) {
        navigator.geolocation.clearWatch(watchId.current);
      }
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  const fetchNearbyPlaces = async (longitude: number, latitude: number) => {
    setLoading(true);
    setError(null);
    try {
      const [hospitalRes, pharmacyRes] = await Promise.all([
        fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/hospital.json?type=poi&proximity=${longitude},${latitude}&access_token=${MAPBOX_TOKEN}`),
        fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/pharmacy.json?type=poi&proximity=${longitude},${latitude}&access_token=${MAPBOX_TOKEN}`)
      ]);
      
      if (!hospitalRes.ok || !pharmacyRes.ok) {
        throw new Error('Failed to fetch nearby places from Mapbox API.');
      }
      
      const hospitalData = await hospitalRes.json();
      const pharmacyData = await pharmacyRes.json();

      const hospitals = hospitalData.features.map((f: any) => ({ ...f, type: 'hospital', rating: parseFloat((Math.random() * (5 - 3.5) + 3.5).toFixed(1)) }));
      const pharmacies = pharmacyData.features.map((f: any) => ({ ...f, type: 'pharmacy', rating: parseFloat((Math.random() * (5 - 3.5) + 3.5).toFixed(1)) }));

      setPlaces([...hospitals, ...pharmacies].sort((a,b) => b.rating - a.rating));

    } catch (err: any) {
      setError(err.message || "An error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="relative h-[calc(100vh-theme(spacing.14))] md:h-screen w-full overflow-hidden">
      <div className="absolute top-0 left-0 z-10 w-full md:w-96 h-1/3 md:h-[calc(100%-2rem)] p-4 md:m-4">
        <Card className="h-full flex flex-col bg-background/80 backdrop-blur-sm border-border/50 shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline">Nearby Services</CardTitle>
              <CardDescription>Hospitals & Pharmacies near you</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto pr-2">
              {loading && (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}
                  </div>
              )}
              {error && <Alert variant="destructive"><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}
              {!loading && !error && places.length > 0 && (
                  <div className="space-y-2">
                  {places.map((place) => (
                      <div 
                        key={place.id}
                        className="p-3 rounded-lg hover:bg-muted cursor-pointer transition-colors"
                        onClick={() => {
                            setSelectedPlace(place);
                            mapRef.current?.flyTo({ center: [place.geometry.coordinates[0], place.geometry.coordinates[1]], zoom: 15 });
                        }}
                      >
                        <div className="flex gap-4">
                            {place.type === 'hospital' ? <Hospital className="h-6 w-6 text-destructive flex-shrink-0 mt-1" /> : <Stethoscope className="h-6 w-6 text-primary flex-shrink-0 mt-1" />}
                            <div className="flex-1">
                              <h3 className="font-semibold">{place.properties.name}</h3>
                              <p className="text-sm text-muted-foreground">{place.properties.address || 'Address not available'}</p>
                              <div className="flex items-center gap-1 mt-1">
                                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-400" />
                                  <span className="text-sm font-bold">{place.rating}</span>
                              </div>
                            </div>
                        </div>
                      </div>
                  ))}
                  </div>
              )}
               {!loading && !error && places.length === 0 && (
                  <div className="text-center text-muted-foreground py-10">
                    <p>No places found nearby.</p>
                  </div>
                )}
            </CardContent>
        </Card>
      </div>


      {/* Map */}
      <div className="absolute inset-0 z-0 h-full w-full">
        {MAPBOX_TOKEN ? (
            <Map
              ref={mapRef}
              {...viewport}
              onMove={evt => setViewport(evt.viewState)}
              mapboxAccessToken={MAPBOX_TOKEN}
              mapStyle="mapbox://styles/mapbox/streets-v11"
            >
              {location && (
                <Marker longitude={location.longitude} latitude={location.latitude}>
                    <div className="w-5 h-5 bg-blue-500 rounded-full border-4 border-white shadow-md" />
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
                  <MapPin className={`h-8 w-8 drop-shadow-lg ${place.type === 'hospital' ? 'text-destructive' : 'text-primary'}`} />
                </Marker>
              ))}
              
              {selectedPlace && (
                <Popup
                  longitude={selectedPlace.geometry.coordinates[0]}
                  latitude={selectedPlace.geometry.coordinates[1]}
                  onClose={() => setSelectedPlace(null)}
                  closeOnClick={false}
                  anchor="bottom"
                  offset={40}
                >
                  <div className="max-w-xs">
                    <h3 className="font-bold text-base mb-1">{selectedPlace.properties.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedPlace.properties.address}</p>
                    <Button 
                        asChild 
                        variant="link"
                        size="sm"
                        className="p-0 mt-2"
                    >
                        <a 
                            href={`https://www.google.com/maps/dir/?api=1&destination=${selectedPlace.geometry.coordinates[1]},${selectedPlace.geometry.coordinates[0]}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Get Directions
                        </a>
                    </Button>
                  </div>
                </Popup>
              )}
            </Map>
         ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <Alert variant="destructive" className="w-auto">
              <AlertTitle>Map Error</AlertTitle>
              <AlertDescription>Mapbox API Key is missing. The map cannot be displayed.</AlertDescription>
            </Alert>
          </div>
         )}
      </div>
    </div>
  );
}
