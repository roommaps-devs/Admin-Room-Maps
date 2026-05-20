// components/common/PropertyFilters.tsx

"use client"

import { useEffect, useState } from "react"
import { City, State } from "country-state-city"

import {
  BedDouble,
  IndianRupee,
  LocateFixed,
  Sparkles,
  Users,
} from "lucide-react"

interface FilterProps {
  filters: any
  setFilters: React.Dispatch<React.SetStateAction<any>>
}

const PropertyFilters = ({
  filters,
  setFilters,
}: FilterProps) => {
  const [states, setStates] = useState<any[]>([])
  const [cities, setCities] = useState<any[]>([])

  /* =========================================================
     LOCAL PRICE STATES & DEBOUNCE
  ========================================================= */

  const [localMin, setLocalMin] = useState(filters.minPrice || "")
  const [localMax, setLocalMax] = useState(filters.maxPrice || "")

  // Sync with parent filters state (e.g., when reset or updated elsewhere)
  useEffect(() => {
    setLocalMin(filters.minPrice || "")
  }, [filters.minPrice])

  useEffect(() => {
    setLocalMax(filters.maxPrice || "")
  }, [filters.maxPrice])

  // Debounce the parent setFilters call to prevent API spam while sliding
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localMin !== filters.minPrice || localMax !== filters.maxPrice) {
        setFilters((prev: any) => ({
          ...prev,
          minPrice: localMin,
          maxPrice: localMax,
        }))
      }
    }, 400)

    return () => clearTimeout(timer)
  }, [localMin, localMax, filters.minPrice, filters.maxPrice, setFilters])

  /* =========================================================
     LOAD STATES
  ========================================================= */

  useEffect(() => {
    const allStates = State.getStatesOfCountry("IN")
    setStates(allStates)
  }, [])

  /* =========================================================
     LOAD CITIES
  ========================================================= */

  useEffect(() => {
    if (filters.stateCode) {
      const allCities = City.getCitiesOfState(
        "IN",
        filters.stateCode
      )

      setCities(allCities)
    }
  }, [filters.stateCode])

  /* =========================================================
     HANDLE CHANGE
  ========================================================= */

  const handleStateChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const stateCode = e.target.value

    const selectedState = states.find(
      (item) => item.isoCode === stateCode
    )

    setFilters((prev: any) => ({
      ...prev,
      state: selectedState?.name || "",
      stateCode,
      city: "",
    }))
  }

  const handleCityChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setFilters((prev: any) => ({
      ...prev,
      city: e.target.value,
    }))
  }

  return (
    <div className="w-full bg-[#f7f7f8] rounded-[28px] p-5 sm:p-6 lg:p-7 shadow-sm border border-neutral-200">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl sm:text-3xl font-black text-[#0f172a]">
          Filters
        </h2>

        <button
          onClick={() =>
            setFilters({
              state: "",
              stateCode: "",
              city: "",
              bhk: "",
              furnished: "",
              gender: "",
              minPrice: "",
              maxPrice: "",
            })
          }
          className="text-orange-500 font-bold text-sm sm:text-base"
        >
          Reset
        </button>
      </div>

      {/* =====================================================
          LOCATION
      ===================================================== */}

      <div className="mt-8">

        <div className="flex items-center gap-2 mb-5">
          <LocateFixed className="w-5 h-5 text-orange-500" />

          <h3 className="text-sm font-black uppercase tracking-[2px] text-neutral-400">
            Location
          </h3>
        </div>

        {/* STATE */}
        <div className="mb-5">
          <p className="text-xs font-bold uppercase text-neutral-400 mb-2">
            State
          </p>

          <select
            value={filters.stateCode}
            onChange={handleStateChange}
            className="w-full bg-white border border-neutral-200 rounded-2xl px-4 py-4 text-sm sm:text-base font-medium outline-none"
          >
            <option value="">Select State</option>

            {states.map((state) => (
              <option
                key={state.isoCode}
                value={state.isoCode}
              >
                {state.name}
              </option>
            ))}
          </select>
        </div>

        {/* CITY */}
        <div>
          <p className="text-xs font-bold uppercase text-neutral-400 mb-2">
            City
          </p>

          <select
            value={filters.city}
            onChange={handleCityChange}
            className="w-full bg-white border border-neutral-200 rounded-2xl px-4 py-4 text-sm sm:text-base font-medium outline-none"
          >
            <option value="">Select City</option>

            {cities.map((city) => (
              <option
                key={city.name}
                value={city.name}
              >
                {city.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* =====================================================
          PRICE RANGE
      ===================================================== */}

      <div className="mt-8">
        <div className="flex items-center gap-2 mb-5">
          <IndianRupee className="w-5 h-5 text-orange-500" />
          <h3 className="text-sm font-black uppercase tracking-[2px] text-neutral-400">
            Price Range
          </h3>
        </div>

        {/* PRICE LABELS */}
        <div className="flex items-center justify-between mb-4">
          <div className="bg-white border border-orange-200 px-4 py-2 rounded-2xl shadow-sm">
            <p className="text-xs text-neutral-400 font-medium">Min</p>
            <h4 className="text-base sm:text-lg font-black text-orange-500">
              ₹{Number(localMin || 0).toLocaleString("en-IN")}
            </h4>
          </div>

          <div className="bg-white border border-orange-200 px-4 py-2 rounded-2xl shadow-sm">
            <p className="text-xs text-neutral-400 font-medium">Max</p>
            <h4 className="text-base sm:text-lg font-black text-orange-500">
              ₹{Number(localMax || 100000).toLocaleString("en-IN")}
            </h4>
          </div>
        </div>

        {/* RANGE SLIDER */}
        <div className="relative h-14 flex items-center">
          {/* TRACK */}
          <div className="absolute w-full h-2 bg-orange-100 rounded-full" />

          {/* ACTIVE TRACK */}
          <div
            className="absolute h-2 bg-orange-500 rounded-full"
            style={{
              left: `${(Number(localMin || 0) / 100000) * 100}%`,
              right: `${
                100 - (Number(localMax || 100000) / 100000) * 100
              }%`,
            }}
          />

          {/* MIN RANGE */}
          <input
            type="range"
            min="0"
            max="100000"
            step="1000"
            value={localMin || 0}
            onChange={(e) => {
              const value = Number(e.target.value)
              const currentMax = Number(localMax || 100000)
              if (value < currentMax) {
                setLocalMin(value.toString())
              }
            }}
            className="absolute w-full appearance-none bg-transparent pointer-events-none range-slider"
          />

          {/* MAX RANGE */}
          <input
            type="range"
            min="0"
            max="100000"
            step="1000"
            value={localMax || 100000}
            onChange={(e) => {
              const value = Number(e.target.value)
              const currentMin = Number(localMin || 0)
              if (value > currentMin) {
                setLocalMax(value.toString())
              }
            }}
            className="absolute w-full appearance-none bg-transparent pointer-events-none range-slider"
          />
        </div>

        {/* RANGE VALUES */}
        <div className="flex justify-between mt-2 text-xs text-neutral-400 font-medium">
          <span>₹0</span>
          <span>₹25K</span>
          <span>₹50K</span>
          <span>₹75K</span>
          <span>₹1L+</span>
        </div>
      </div>

      {/* =====================================================
          BHK
      ===================================================== */}

      <div className="mt-8">

        <div className="flex items-center gap-2 mb-5">
          <BedDouble className="w-5 h-5 text-orange-500" />

          <h3 className="text-sm font-black uppercase tracking-[2px] text-neutral-400">
            BHK Type
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">

          {["1 BHK", "2 BHK", "3 BHK", "4 BHK"].map(
            (item) => (
              <button
                key={item}
                onClick={() =>
                  setFilters((prev: any) => ({
                    ...prev,
                    bhk: item,
                  }))
                }
                className={`rounded-2xl py-3 text-sm font-bold transition-all border ${
                  filters.bhk === item
                    ? "bg-orange-500 text-white border-orange-500"
                    : "bg-white border-neutral-200 text-neutral-600"
                }`}
              >
                {item}
              </button>
            )
          )}
        </div>
      </div>

      {/* =====================================================
          FURNISHED
      ===================================================== */}

      <div className="mt-8">

        <div className="flex items-center gap-2 mb-5">
          <Sparkles className="w-5 h-5 text-orange-500" />

          <h3 className="text-sm font-black uppercase tracking-[2px] text-neutral-400">
            Furnishing
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-3">

          {[
            "Unfurnished",
            "Semi-Furnished",
            "Fully Furnished",
          ].map((item) => (
            <button
              key={item}
              onClick={() =>
                setFilters((prev: any) => ({
                  ...prev,
                  furnished: item,
                }))
              }
              className={`rounded-2xl py-3 px-4 text-sm font-bold transition-all border ${
                filters.furnished === item
                  ? "bg-orange-500 text-white border-orange-500"
                  : "bg-white border-neutral-200 text-neutral-600"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* =====================================================
          GENDER
      ===================================================== */}

      <div className="mt-8">

        <div className="flex items-center gap-2 mb-5">
          <Users className="w-5 h-5 text-orange-500" />

          <h3 className="text-sm font-black uppercase tracking-[2px] text-neutral-400">
            Gender
          </h3>
        </div>

        <div className="grid grid-cols-3 gap-3">

          {["Male", "Female", "Anyone"].map((item) => (
            <button
              key={item}
              onClick={() =>
                setFilters((prev: any) => ({
                  ...prev,
                  gender: item,
                }))
              }
              className={`rounded-2xl py-3 text-sm font-bold transition-all border ${
                filters.gender === item
                  ? "bg-orange-500 text-white border-orange-500"
                  : "bg-white border-neutral-200 text-neutral-600"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PropertyFilters