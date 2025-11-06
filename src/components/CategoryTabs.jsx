import { useContext } from "react";
import { context } from "../App";
import { Wrench, Zap, Paintbrush, Hammer, HelpCircle } from "lucide-react"; // Import icons

export default function CategoryTabs({ active, onSelect }) {
  const { providerData } = useContext(context);

  const uniqueCategories = [
    ...new Set((providerData || []).map((p) => p.category || "Unknown")),
  ];

  // Define icons for categories
  const categoryIcons = {
    Plumber: <Wrench size={16} className="inline-block mr-2" />,
    Electrician: <Zap size={16} className="inline-block mr-2" />,
    Painter: <Paintbrush size={16} className="inline-block mr-2" />,
    Carpenter: <Hammer size={16} className="inline-block mr-2" />,
    unknown: <HelpCircle size={16} className="inline-block mr-2" />,
  };

  return (
    <div className="flex justify-start flex-wrap gap-3">
      {uniqueCategories.map((cat, i) => {
       
        const normalized = cat?.charAt(0).toUpperCase() + cat?.slice(1) || "unknown";
        const Icon = categoryIcons[normalized] || categoryIcons.unknown;

        return (
          <button
            key={i}
            onClick={() => onSelect(cat === active ? "" : cat)}
            className={`px-5 mx-3 py-2 rounded-full font-medium text-sm shadow-sm transition-all duration-200 flex items-center ${active === cat
              ? "bg-blue-500 text-white shadow-md scale-105"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
          >
            {Icon}
            {normalized}
          </button>
        );
      })}
    </div>
  );
}
