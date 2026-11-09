import React, { useState, useMemo } from 'react';
import { store } from '../../services/store';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Building, 
  UserCheck, 
  Search, 
  Navigation,
  ExternalLink,
  Compass,
  Crosshair,
  CheckCircle2,
  Building2,
  Sparkles
} from 'lucide-react';
import { Branch } from '../../types/insurance';

// Helper: Haversine distance in kilometers
function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export const BranchesPage: React.FC = () => {
  const branches = store.getBranches();
  const [search, setSearch] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedBranch, setSelectedBranch] = useState<Branch>(branches[0] || {} as Branch);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locatingUser, setLocatingUser] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Derive unique cities
  const cities = useMemo(() => {
    const set = new Set<string>();
    branches.forEach((b) => set.add(b.city));
    return ['all', ...Array.from(set)];
  }, [branches]);

  // Handle Find Nearest Office
  const handleFindNearest = () => {
    setLocatingUser(true);
    setLocationError(null);
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      setLocatingUser(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const uLat = pos.coords.latitude;
        const uLng = pos.coords.longitude;
        setUserLocation({ lat: uLat, lng: uLng });
        setLocatingUser(false);

        // Find closest branch
        let closest = branches[0];
        let minDist = Infinity;
        branches.forEach((b) => {
          if (b.coordinates) {
            const dist = calculateDistanceKm(uLat, uLng, b.coordinates.lat, b.coordinates.lng);
            if (dist < minDist) {
              minDist = dist;
              closest = b;
            }
          }
        });
        setSelectedBranch(closest);
      },
      (err) => {
        // Fallback to central Addis Ababa
        setUserLocation({ lat: 9.0018, lng: 38.7845 });
        setLocatingUser(false);
        setLocationError('Location permission denied; default to Addis Ababa Head Office.');
      },
      { timeout: 8000 }
    );
  };

  // Filter and sort branches
  const filteredAndSorted = useMemo(() => {
    let list = branches.filter((b) => {
      const matchCity = selectedCity === 'all' || b.city === selectedCity;
      const matchQuery =
        b.name.toLowerCase().includes(search.toLowerCase()) ||
        b.city.toLowerCase().includes(search.toLowerCase()) ||
        b.address.toLowerCase().includes(search.toLowerCase());
      return matchCity && matchQuery;
    });

    if (userLocation) {
      list = [...list].sort((a, b) => {
        const distA = a.coordinates
          ? calculateDistanceKm(userLocation.lat, userLocation.lng, a.coordinates.lat, a.coordinates.lng)
          : 9999;
        const distB = b.coordinates
          ? calculateDistanceKm(userLocation.lat, userLocation.lng, b.coordinates.lat, b.coordinates.lng)
          : 9999;
        return distA - distB;
      });
    }

    return list;
  }, [branches, search, selectedCity, userLocation]);

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-slate-200">
          <div className="space-y-3 max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#12366e] uppercase tracking-wider">
              <span>National Footprint</span>
              <span aria-hidden="true">·</span>
              <span>17 Verified Branches Across Ethiopia</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold text-[#12366e] tracking-tight leading-tight">
              AIC Nationwide Branch Directory
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              Locate authorized Africa Insurance Company branch offices in Addis Ababa, Oromia, Amhara, Sidama, Tigray, Somali, and Southern regional hubs for in-person advisory, underwriting intake, and claims notification.
            </p>
          </div>

          {/* Action: Find Nearest Branch */}
          <div className="shrink-0 space-y-1">
            <button
              onClick={handleFindNearest}
              disabled={locatingUser}
              className="bg-[#12366e] hover:bg-[#184486] active:scale-95 text-white px-5 py-3 rounded-xl text-xs font-semibold flex items-center gap-2.5 shadow-md transition-all cursor-pointer whitespace-nowrap"
            >
              <Crosshair className={`w-4 h-4 text-[#f0cb5a] ${locatingUser ? 'animate-spin' : ''}`} />
              <span>{locatingUser ? 'Locating Your Position...' : 'Find Nearest Office to Me'}</span>
            </button>
            {locationError && (
              <p className="text-[11px] text-amber-700">{locationError}</p>
            )}
          </div>
        </div>

        {/* Visual Map Dashboard & City Filter Header */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search by city, branch name, or street..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white border border-slate-200 text-xs pl-9 pr-3 py-2.5 rounded-xl focus:outline-none focus:border-[#12366e] shadow-sm"
              />
            </div>

            {/* Total Results Count */}
            <div className="text-xs font-mono text-slate-500">
              Showing <strong className="text-slate-900">{filteredAndSorted.length}</strong> of {branches.length} authorized locations
            </div>
          </div>

          {/* City Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
            {cities.map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  selectedCity === city
                    ? 'bg-[#12366e] text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {city === 'all' ? `All Cities (${branches.length})` : city}
              </button>
            ))}
          </div>
        </div>

        {/* Main 2-Column Responsive Layout: Branch Cards List + Interactive Google Map Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Branch Cards List (5 Cols) */}
          <div className="lg:col-span-5 space-y-4 max-h-[820px] overflow-y-auto pr-1">
            {filteredAndSorted.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
                <Building className="w-8 h-8 text-slate-400 mx-auto" />
                <h4 className="text-sm font-bold text-slate-900">No branches match your query</h4>
                <p className="text-xs text-slate-500">Try clearing the search or choosing "All Cities".</p>
                <button
                  onClick={() => { setSearch(''); setSelectedCity('all'); }}
                  className="mt-2 text-xs font-semibold text-[#12366e] underline"
                >
                  Reset filters
                </button>
              </div>
            ) : (
              filteredAndSorted.map((branch) => {
                const isSelected = selectedBranch.branchId === branch.branchId;
                const distanceKm = userLocation && branch.coordinates
                  ? calculateDistanceKm(userLocation.lat, userLocation.lng, branch.coordinates.lat, branch.coordinates.lng)
                  : null;

                return (
                  <div
                    key={branch.branchId}
                    onClick={() => setSelectedBranch(branch)}
                    className={`bg-white border rounded-2xl p-5 cursor-pointer transition-all space-y-3 ${
                      isSelected
                        ? 'border-[#12366e] ring-2 ring-[#12366e]/15 shadow-md bg-slate-50/50'
                        : 'border-slate-200 hover:border-slate-300 shadow-sm hover:shadow'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm sm:text-base font-bold text-slate-900">
                            {branch.name}
                          </h3>
                        </div>
                        <span className="text-[11px] font-semibold text-[#12366e] uppercase tracking-wider block mt-0.5">
                          {branch.city}, Ethiopia
                        </span>
                      </div>

                      <div className="flex flex-col items-end gap-1 shrink-0">
                        {branch.isHeadquarters && (
                          <span className="text-[10px] font-bold bg-[#f0cb5a]/20 text-[#8c6d17] border border-[#f0cb5a]/40 px-2 py-0.5 rounded-full uppercase">
                            Head Office
                          </span>
                        )}
                        {distanceKm !== null && (
                          <span className="text-[11px] font-mono font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                            {distanceKm < 1 ? `${Math.round(distanceKm * 1000)} m away` : `${distanceKm.toFixed(1)} km away`}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start gap-2 text-xs text-slate-600">
                      <MapPin className="w-3.5 h-3.5 text-[#12366e] shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{branch.address}</span>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-1.5 text-slate-600 font-mono">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{branch.phone}</span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {branch.openingHours}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Right Column: Visual Google Map Interface & Live Route Details (7 Cols) */}
          <div className="lg:col-span-7 space-y-6 lg:sticky lg:top-24">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 space-y-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#12366e] uppercase tracking-wider">
                    <MapPin className="w-4 h-4 text-[#c59b27]" />
                    <span>Selected Office Coordinates</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                    {selectedBranch.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">{selectedBranch.address}, {selectedBranch.city}</p>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      selectedBranch.name + ' ' + selectedBranch.address + ' ' + selectedBranch.city + ' Ethiopia'
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-[#12366e] hover:bg-[#184486] text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm transition-all whitespace-nowrap cursor-pointer"
                  >
                    <span>Get Directions</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#f0cb5a]" />
                  </a>
                </div>
              </div>

              {/* Large Visual Map Display */}
              <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-inner h-[420px] sm:h-[480px] relative bg-slate-100">
                <iframe
                  title={`${selectedBranch.name} Google Map`}
                  src={`https://maps.google.com/maps?q=${selectedBranch.coordinates?.lat || 9.0018},${selectedBranch.coordinates?.lng || 38.7845}&hl=en&z=15&output=embed`}
                  className="w-full h-full border-0"
                  loading="lazy"
                  allowFullScreen
                />
              </div>

              {/* Branch Specifications Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-slate-500 text-[11px] block">Branch Manager</span>
                  <strong className="text-slate-900 font-semibold">{selectedBranch.managerName}</strong>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-slate-500 text-[11px] block">Telephone Line</span>
                  <a href={`tel:${selectedBranch.phone}`} className="font-mono font-bold text-[#12366e] hover:underline">
                    {selectedBranch.phone}
                  </a>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-slate-500 text-[11px] block">Official Email</span>
                  <a href={`mailto:${selectedBranch.email}`} className="font-mono text-slate-800 hover:underline truncate block">
                    {selectedBranch.email}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
