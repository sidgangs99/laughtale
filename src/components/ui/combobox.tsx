import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import * as React from "react";

interface ComboboxProps<T> {
  items: T[];
  placeholder?: string;
  renderItem: (item: T) => React.ReactNode;
  onSelect: (item: T) => void;
  className?: string;
}

export function Combobox<T>({
  items,
  placeholder = "Select an item...",
  renderItem,
  onSelect,
  className,
}: ComboboxProps<T>) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [filteredItems, setFilteredItems] = React.useState(items);

  React.useEffect(() => {
    setFilteredItems(
      items.filter((item) =>
        String(item).toLowerCase().includes(query.toLowerCase())
      )
    );
  }, [query, items]);

  const handleSelect = (item: T) => {
    onSelect(item);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500",
            className
          )}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {query || placeholder}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 bg-white dark:bg-gray-800">
        <div className="p-2">
          <input
            type="text"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-4 py-2 mb-2 text-sm text-gray-800 bg-gray-100 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <ul className="max-h-40 overflow-auto">
            {filteredItems.length > 0 ? (
              filteredItems.map((item, index) => (
                <li
                  key={index}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => handleSelect(item)}
                >
                  {renderItem(item)}
                </li>
              ))
            ) : (
              <li className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                No results found.
              </li>
            )}
          </ul>
        </div>
      </PopoverContent>
    </Popover>
  );
}
