import React, { useState, useEffect } from 'react';
import { Layers, Building, MapPin } from 'lucide-react';
import { tbiService } from '../services/tbiService';
import { CategoryCard } from '../components/CategoryCard';

export const Categories = () => {
  const [categories, setCategories] = useState({
    incubatorTypes: [],
    universityTypes: [],
    cities: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    tbiService
      .getCategories()
      .then((res) => {
        if (res.success && res.data) {
          setCategories(res.data);
        }
      })
      .catch((err) => console.error('Categories error:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-heading text-dark flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-primary-light border border-orange-200 flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5 text-primary" />
          </div>
          <span>Incubator Categories</span>
        </h1>
        <p className="text-sm text-slate-body mt-1">
          Explore incubators categorized by accreditation model, funding program, and institution type.
        </p>
      </div>

      {loading ? (
        <div className="space-y-6">
          <div className="h-40 rounded-2xl bg-white border border-border animate-pulse" />
          <div className="h-40 rounded-2xl bg-white border border-border animate-pulse" />
        </div>
      ) : (
        <>
          {/* Incubator Types */}
          <section className="space-y-4">
            <div className="flex items-center space-x-2 border-b border-border pb-2">
              <Layers className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold font-heading text-dark">Incubator Types & Programs</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.incubatorTypes.map((cat) => (
                <CategoryCard key={cat.name} category={cat} type="incubatorType" />
              ))}
            </div>
          </section>

          {/* University Types */}
          <section className="space-y-4">
            <div className="flex items-center space-x-2 border-b border-border pb-2">
              <Building className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold font-heading text-dark">Institution Types</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.universityTypes.map((cat) => (
                <CategoryCard key={cat.name} category={cat} type="universityType" />
              ))}
            </div>
          </section>

          {/* Cities Directory */}
          <section className="space-y-4">
            <div className="flex items-center space-x-2 border-b border-border pb-2">
              <MapPin className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold font-heading text-dark">Top Cities with Active TBIs</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {categories.cities.map((cat) => (
                <CategoryCard key={cat.name} category={cat} type="city" />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
};
