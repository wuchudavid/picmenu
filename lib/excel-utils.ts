import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { MenuItem } from '@/app/page';

export function exportMenuToExcel(menuItems: MenuItem[], filename: string = 'menu-export.xlsx') {
  // Prepare data for Excel
  const excelData = menuItems.map((item, index) => ({
    'Item #': index + 1,
    'Name': item.name,
    'Price': item.price,
    'Description': item.description,
  }));

  // Create workbook and worksheet
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(excelData);

  // Set column widths
  const columnWidths = [
    { wch: 8 },  // Item #
    { wch: 30 }, // Name
    { wch: 15 }, // Price
    { wch: 50 }, // Description
  ];
  worksheet['!cols'] = columnWidths;

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Menu Items');

  // Generate Excel file
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  
  // Download the file
  saveAs(data, filename);
}

export function generateMenuReport(menuItems: MenuItem[], originalImageUrl?: string) {
  // Create a more detailed report with multiple sheets
  const workbook = XLSX.utils.book_new();
  
  // Main menu items sheet
  const menuData = menuItems.map((item, index) => ({
    'Item #': index + 1,
    'Name': item.name,
    'Price': item.price,
    'Description': item.description,
  }));
  
  const menuWorksheet = XLSX.utils.json_to_sheet(menuData);
  menuWorksheet['!cols'] = [
    { wch: 8 },  // Item #
    { wch: 30 }, // Name
    { wch: 15 }, // Price
    { wch: 50 }, // Description
  ];
  XLSX.utils.book_append_sheet(workbook, menuWorksheet, 'Menu Items');

  // Summary sheet
  const totalItems = menuItems.length;
  const priceRange = menuItems
    .map(item => parseFloat(item.price.replace(/[^0-9.]/g, '')))
    .filter(price => !isNaN(price));
  
  const minPrice = priceRange.length > 0 ? Math.min(...priceRange) : 0;
  const maxPrice = priceRange.length > 0 ? Math.max(...priceRange) : 0;
  const avgPrice = priceRange.length > 0 ? (priceRange.reduce((a, b) => a + b, 0) / priceRange.length).toFixed(2) : 0;

  const summaryData = [
    { 'Metric': 'Total Items', 'Value': totalItems },
    { 'Metric': 'Lowest Price', 'Value': `$${minPrice}` },
    { 'Metric': 'Highest Price', 'Value': `$${maxPrice}` },
    { 'Metric': 'Average Price', 'Value': `$${avgPrice}` },
    { 'Metric': 'Original Image URL', 'Value': originalImageUrl || 'N/A' },
    { 'Metric': 'Generated Date', 'Value': new Date().toLocaleString() },
  ];

  const summaryWorksheet = XLSX.utils.json_to_sheet(summaryData);
  summaryWorksheet['!cols'] = [
    { wch: 20 }, // Metric
    { wch: 30 }, // Value
  ];
  XLSX.utils.book_append_sheet(workbook, summaryWorksheet, 'Summary');

  // Generate and download the file
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  
  const filename = `menu-report-${new Date().toISOString().split('T')[0]}.xlsx`;
  saveAs(data, filename);
} 