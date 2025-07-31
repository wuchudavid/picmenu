import { MenuItem } from "@/app/page";
import { exportMenuToExcel, generateMenuReport } from "@/lib/excel-utils";
import { ArrowDownTrayIcon, DocumentArrowDownIcon } from "@heroicons/react/24/outline";

interface DownloadButtonsProps {
  menuItems: MenuItem[];
  originalImageUrl?: string;
}

export function DownloadButtons({ menuItems, originalImageUrl }: DownloadButtonsProps) {
  const handleSimpleExport = () => {
    exportMenuToExcel(menuItems);
  };

  const handleDetailedReport = () => {
    generateMenuReport(menuItems, originalImageUrl);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      <button
        onClick={handleSimpleExport}
        className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <ArrowDownTrayIcon className="h-5 w-5" />
        Export to Excel
      </button>
      
      <button
        onClick={handleDetailedReport}
        className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
      >
        <DocumentArrowDownIcon className="h-5 w-5" />
        Download Full Report
      </button>
    </div>
  );
} 