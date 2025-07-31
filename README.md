# PicMenu - AI-Powered Menu Visualizer

A modern web application that transforms menu images into interactive visual experiences with AI-generated images and Excel export capabilities.

## Features

### 🖼️ **Menu Image Processing**
- Upload menu images via drag & drop
- **NEW**: Take pictures directly with your device camera
- AI-powered menu item extraction using Together AI
- Automatic parsing of menu items, prices, and descriptions

### 🎨 **AI-Generated Visuals**
- Generate realistic food images for each menu item
- High-quality, detailed food photography
- Powered by FLUX.1-schnell AI model

### 📊 **Excel Export Functionality**
- **NEW**: Export individual menu items to Excel
- **NEW**: Generate comprehensive menu reports with multiple sheets
- **NEW**: Download full reports with summary statistics
- Automatic price analysis and statistics

### 🔍 **Interactive Features**
- Search and filter menu items
- Responsive grid layout
- Hover effects with individual item export
- Real-time processing status updates

## Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **AI Services**: Together AI (Llama-3.2-90B-Vision, FLUX.1-schnell)
- **File Processing**: XLSX, FileSaver.js
- **Image Upload**: Next-S3-Upload
- **Camera Access**: Web MediaDevices API

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Together AI API key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd picmenu
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .example.env .env.local
```

Add your Together AI API key to `.env.local`:
```
TOGETHER_API_KEY=your_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Taking Menu Pictures
1. Click "Take Picture" to access your device camera
2. Position your camera over the menu
3. Click "Capture" to take the photo
4. The image will be automatically processed

### Uploading Menu Images
1. Drag and drop a menu image onto the upload area
2. Or click to browse and select an image file
3. Supported formats: JPG, JPEG, PNG

### Exporting to Excel
- **Individual Items**: Hover over any menu item and click "Export"
- **Full Menu**: Click "Export to Excel" for a simple export
- **Detailed Report**: Click "Download Full Report" for comprehensive analysis

### Excel Report Features
- **Menu Items Sheet**: Complete list with item numbers, names, prices, descriptions
- **Summary Sheet**: Statistics including total items, price range, average price
- **Metadata**: Original image URL and generation timestamp

## API Endpoints

### `/api/parseMenu`
- **Method**: POST
- **Body**: `{ menuUrl: string }`
- **Response**: `{ menu: MenuItem[] }`

### `/api/s3-upload`
- Handles image upload to S3 storage
- Returns public URL for processing

## Environment Variables

```env
TOGETHER_API_KEY=your_together_ai_api_key
HELICONE_API_KEY=your_helicone_key (optional)
NEXT_PUBLIC_S3_UPLOAD_KEY=your_s3_access_key
NEXT_PUBLIC_S3_UPLOAD_SECRET=your_s3_secret_key
NEXT_PUBLIC_S3_UPLOAD_BUCKET=your_s3_bucket_name
NEXT_PUBLIC_S3_UPLOAD_REGION=your_s3_region
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Acknowledgments

- Powered by [Together AI](https://togetherai.link/)
- Built with Next.js and React
- Styled with Tailwind CSS
