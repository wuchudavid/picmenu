import { MenuItem } from "@/app/page";
import { exportMenuToExcel } from "@/lib/excel-utils";
import Image from "next/image";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";

interface MenuGridProps {
  items: MenuItem[];
}

export function MenuGrid({ items }: MenuGridProps) {
  const handleItemExport = (item: MenuItem) => {
    exportMenuToExcel([item], `${item.name.replace(/[^a-zA-Z0-9]/g, '-')}.xlsx`);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {items.map((item) => (
        <div
          key={item.name}
          className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 group"
        >
          <div className="relative h-48">
            <Image
              src={`data:image/png;base64,${item.menuImage.b64_json}`}
              alt={item.name}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
              <button
                onClick={() => handleItemExport(item)}
                className="opacity-0 group-hover:opacity-100 bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 px-3 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 transform scale-90 group-hover:scale-100"
              >
                <ArrowDownTrayIcon className="h-4 w-4" />
                Export
              </button>
            </div>
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-1">{item.name}</h3>
            <p className="text-gray-600 mb-2 font-medium">{item.price}</p>
            <p className="text-sm text-gray-500 line-clamp-2">
              {item.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
