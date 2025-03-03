"use client"; // Marks this as a client component that runs in the browser

import qs from "query-string"; // Library for parsing and stringifying URL query parameters
import { ChangeEventHandler, useEffect, useState } from "react"; // React hooks for state management and side effects
import { Search } from "lucide-react"; // Search icon from Lucide icon library
import { useRouter, useSearchParams } from "next/navigation"; // Next.js hooks for routing and accessing URL parameters

import { Input } from "@/components/ui/input"; // UI component for text input
import { useDebounce } from "@/hooks/use-debounce"; // Custom hook to delay execution (prevents excessive API calls)

export const SearchInput = () => {
  // Get router instance for programmatic navigation
  const router = useRouter();
  // Access current URL search parameters
  const searchParams = useSearchParams();

  // Extract specific query parameters from the URL
  const categoryId = searchParams.get("categoryId"); // Get category filter if present
  const name = searchParams.get("name"); // Get current search term if present

  // Local state to track input value, initialized with URL search term or empty string
  const [value, setValue] = useState(name ?? "");
  // Apply debounce to prevent search on every keystroke (waits 500ms after typing stops)
  const debouncedValue = useDebounce<string>(value, 500);

  // Handler for input changes
  const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setValue(e.target.value); // Update local state with input value
  };

  // Effect that runs when debounced value changes
  useEffect(() => {
    // Construct query object with current search parameters
    const query = {
      name: debouncedValue, // The search term (debounced)
      categoryId: categoryId, // Preserve category filter if present
    };

    // Create a new URL with updated query parameters
    const url = qs.stringifyUrl(
      {
        url: window.location.href, // Base URL (current page)
        query, // Query parameters to add
      },
      { 
        skipEmptyString: true, // Don't include empty strings in URL
        skipNull: true // Don't include null values in URL
      }
    );
    
    // Navigate to the new URL, updating the search results
    router.push(url);
  }, [debouncedValue, router, categoryId]); // Re-run when these dependencies change

  return (
    <div className="relative"> {/* Container with relative positioning for the icon */}
      {/* Search icon positioned absolutely within the input */}
      <Search className="absolute h-4 w-4 top-3 left-4 text-muted-foreground" />
      <Input
        onChange={onChange} // Handle input changes
        value={value} // Controlled input value
        placeholder="Search..." // Placeholder text
        className="pl-10 bg-primary/10" // Left padding to make room for the icon, slight background color
      />
    </div>
  );
};