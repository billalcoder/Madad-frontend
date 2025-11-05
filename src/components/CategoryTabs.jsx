import { useContext } from "react";
import { context } from "../App";

export default function CategoryTabs({ active, onSelect }) {
  const { providerData } = useContext(context);
  const uniqueCategories = [
    ...new Set((providerData || []).map((p) => p.category || "Unknown")),
  ];

  return (
    <div className="flex justify-start flex-wrap gap-3">
      {uniqueCategories.map((cat, i) => (
        <button
          key={i}
          onClick={() => onSelect(cat === active ? "" : cat)}
          className={`px-5 py-2 rounded-full font-medium text-sm shadow-sm transition-all duration-200 ${
            active === cat
              ? "bg-blue-500 text-white shadow-md scale-105"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
