"use client";

import { useState } from "react";
import { MapPin, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useGeocodeSearch } from "@/hooks/use-geocode-search";
import type { GeocodeResult } from "@/lib/geocode";
import { cn } from "@/lib/utils";

interface TopBarProps {
  onSelectLocation: (result: GeocodeResult) => void;
}

export function TopBar({ onSelectLocation }: TopBarProps) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const { data: results, isFetching } = useGeocodeSearch(query);

  const showResults = isFocused && query.trim().length >= 2;

  return (
    <div className="relative">
      <div className="glass-panel flex items-center gap-2 rounded-xl px-3 py-2.5">
        <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 150)}
          placeholder="Type to search..."
          className="h-auto border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
        />
      </div>

      {showResults && (
        <div className="glass-panel-strong absolute inset-x-0 top-[calc(100%+6px)] z-30 max-h-72 overflow-y-auto rounded-xl p-1.5">
          {isFetching && (
            <p className="px-3 py-2 text-sm text-muted-foreground">Searching...</p>
          )}
          {!isFetching && results?.length === 0 && (
            <p className="px-3 py-2 text-sm text-muted-foreground">No locations found.</p>
          )}
          {results?.map((result) => (
            <button
              key={result.id}
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => {
                onSelectLocation(result);
                setQuery(`${result.name}, ${result.country}`);
                setIsFocused(false);
              }}
              className={cn(
                "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm hover:bg-accent"
              )}
            >
              <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" />
              <span className="truncate">
                {result.name}
                <span className="text-muted-foreground">
                  {result.admin1 ? `, ${result.admin1}` : ""}, {result.country}
                </span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
