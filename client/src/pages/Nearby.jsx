import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, AlertTriangle, Compass, Building } from 'lucide-react';
import { tbiService } from '../services/tbiService';
import { TbiGrid } from '../components/TbiGrid';

export const Nearby = () => {
  const [tbis, setTbis] = useState([]);
  const [loading, setLoading] = useState(false);
  const [geoState, setGeoState] = useState('prompt'); // 'prompt' | 'granted' | 'denied'
  const [selectedCity, setSelectedCity] = useState('');
  const [availableCities, setAvailableCities] = useState([]);
  const [infoMessage, setInfoMessage] = useState('');

  // Fetch top cities for manual selection
  useEffect(() => {
    tbiService
      .getCategories()
      .then((res) => {
        if (res.success && res.data?.cities) {
          setAvailableCities(res.data.cities);
        }
      })
      .catch(() => {});
  }, []);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setGeoState('denied');
      setInfoMessage('Geolocation is not supported by your browser. Please select a city.');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        setGeoState('granted');
        try {
          const res = await tbiService.getNearbyTbis({
            lat: pos.coords.latitude,
            lon: pos.coords.longitude
          });
          if (res.success) {
            setTbis(res.data || []);
            setInfoMessage(
              res.mode === 'coordinates'
                ? `Showing incubators sorted by distance from your current location.`
                : `Coordinates lookup fallback: Incubators discovered by proximity.`
            );
          }
        } catch (err) {
          setInfoMessage('Unable to resolve nearest TBIs. Please select a city manually.');
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setGeoState('denied');
        setLoading(false);
        setInfoMessage('Location permission denied. You can select your city manually below.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleCitySelect = async (city) => {
    setSelectedCity(city);
    setLoading(true);
    try {
      const res = await tbiService.getNearbyTbis({ city });
      if (res.success) {
        setTbis(res.data || []);
        setInfoMessage(`Showing incubators located in and around ${city}.`);
      }
    } catch (err) {
      setInfoMessage('Error retrieving TBIs for selected city.');
    } finally {
      setLoading(false);
    }
  };

  // Auto request location on mount or prompt
  useEffect(() => {
    requestLocation();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#5E0B15] flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#D9CAB3] flex items-center justify-center shrink-0 shadow-xs transition-transform duration-200 hover:scale-105">
            <MapPin className="w-5 h-5 text-[#BC8034]" />
          </div>
          <span>Nearby TBIs</span>
        </h1>
        <p className="text-sm text-slate-muted mt-1">
          Discover Technology Business Incubators close to your institutional or geographic location.
        </p>
      </div>

      {/* Location Status Banner */}
      <div className="bg-surface p-5 rounded-2xl border border-slate-border shadow-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#D9CAB3] text-[#5E0B15] flex items-center justify-center shrink-0 border border-[#8C7A6B]">
              <Navigation className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate">
                {geoState === 'granted'
                  ? 'Location Access Enabled'
                  : geoState === 'denied'
                  ? 'Location Access Unavailable'
                  : 'Detecting Location...'}
              </h3>
              <p className="text-xs text-slate-muted mt-0.5">
                {infoMessage || 'We never store or share your exact coordinates.'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={requestLocation}
              disabled={loading}
              className="px-4 py-2 bg-[#5E0B15] text-[#D9CAB3] text-xs font-semibold rounded-lg hover:bg-[#90323D] disabled:opacity-50 transition-colors shadow-sm border border-[#5E0B15]"
            >
              {loading ? 'Detecting...' : 'Detect My Location'}
            </button>
          </div>
        </div>

        {/* Manual City Selector Fallback (Section 39) */}
        <div className="pt-4 border-t border-slate-100">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-muted mb-2">
            Or select your city manually
          </label>
          <div className="flex flex-wrap gap-2">
            {availableCities.slice(0, 10).map((c) => (
              <button
                key={c.name}
                onClick={() => handleCitySelect(c.name)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                  selectedCity === c.name
                    ? 'bg-[#5E0B15] text-[#D9CAB3] border-[#5E0B15] shadow-sm'
                    : 'bg-surface text-slate border-slate-border hover:bg-[#D9CAB3]/40'
                }`}
              >
                {c.name} ({c.count})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <TbiGrid
        tbis={tbis}
        loading={loading}
        emptyTitle="No nearby TBIs detected"
        emptyMessage="Try selecting a major city above to view available incubation centres."
      />
    </div>
  );
};
