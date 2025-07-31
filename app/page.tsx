"use client";

import { useState } from "react";
import Dropzone from "react-dropzone";
import { PhotoIcon, MagnifyingGlassIcon, LinkIcon } from "@heroicons/react/20/solid";
import { Input } from "@/components/ui/input";
import { MenuGrid } from "@/components/menu-grid";
import { DownloadButtons } from "@/components/download-buttons";
import { CameraCapture } from "@/components/camera-capture";
import { UrlInput } from "@/components/url-input";
import { ProcessingStatus } from "@/components/processing-status";
import Image from "next/image";
import { italianMenuUrl, italianParsedMenu } from "@/lib/constants";

export interface MenuItem {
  name: string;
  price: string;
  description: string;
  menuImage: {
    b64_json: string;
  };
}

export default function Home() {
  const [menuUrl, setMenuUrl] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<
    "initial" | "uploading" | "parsing" | "created"
  >("initial");
  const [parsedMenu, setParsedMenu] = useState<MenuItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const handleFileChange = async (file: File) => {
    const objectUrl = URL.createObjectURL(file);
    setStatus("uploading");
    setMenuUrl(objectUrl);
    
    // Convert file to base64 for direct processing
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      setStatus("parsing");
      
              try {
          const res = await fetch("/api/parseMenu", {
            method: "POST",
            body: JSON.stringify({
              menuUrl: base64,
            }),
          });
          
          if (!res.ok) {
            let errorMessage = "Failed to process menu";
            try {
              const errorData = await res.json();
              errorMessage = errorData.error || errorMessage;
            } catch {
              // If we can't parse the error JSON, use the status text
              errorMessage = res.statusText || errorMessage;
            }
            throw new Error(errorMessage);
          }
          
          const json = await res.json();
          console.log({ json });

          if (!json.menu || !Array.isArray(json.menu)) {
            throw new Error("Invalid response format from server");
          }

          setStatus("created");
          setParsedMenu(json.menu);
        } catch (error: unknown) {
          console.error("Error processing menu:", error);
          setStatus("initial");
          const errorMessage = error instanceof Error ? error.message : "Failed to process menu. Please try again.";
          alert(errorMessage);
        }
    };
    reader.readAsDataURL(file);
  };

  const handleUrlSubmit = async (url: string) => {
    setStatus("parsing");
    setMenuUrl(url);
    
          try {
        const res = await fetch("/api/parseMenu", {
          method: "POST",
          body: JSON.stringify({
            menuUrl: url,
          }),
        });
        
        if (!res.ok) {
          let errorMessage = "Failed to process menu";
          try {
            const errorData = await res.json();
            errorMessage = errorData.error || errorMessage;
                      } catch {
              // If we can't parse the error JSON, use the status text
              errorMessage = res.statusText || errorMessage;
            }
          throw new Error(errorMessage);
        }
        
        const json = await res.json();
        console.log({ json });

        if (!json.menu || !Array.isArray(json.menu)) {
          throw new Error("Invalid response format from server");
        }

        setStatus("created");
        setParsedMenu(json.menu);
              } catch (error: unknown) {
          console.error("Error processing menu:", error);
          setStatus("initial");
          const errorMessage = error instanceof Error ? error.message : "Failed to process menu. Please try again.";
          alert(errorMessage);
        }
  };

  const handleSampleImage = async () => {
    setStatus("parsing");
    setMenuUrl(italianMenuUrl);
    await new Promise((resolve) => setTimeout(resolve, 3000));

    setStatus("created");
    setParsedMenu(italianParsedMenu);
  };

  const filteredMenu = parsedMenu.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container text-center px-4 py-8 bg-white max-w-5xl mx-auto">
      <div className="max-w-2xl text-center mx-auto sm:mt-20 mt-2">
        <p className="mx-auto mb-5 w-fit rounded-2xl border px-4 py-1 text-sm text-slate-500">
          100% free and powered by{" "}
          <a
            href="https://togetherai.link/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-500 transition font-bold"
          >
            Together AI
          </a>
          !
        </p>
        <h1 className="mb-6 text-balance text-6xl font-bold text-zinc-800">
          Visualize your menu with AI
        </h1>
      </div>
      <div className="max-w-3xl text-center mx-auto">
        <p className="mb-8 text-lg text-gray-500 text-balance ">
          Take a picture of your menu and get pictures of each dish so you can
          better decide what to order.
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        {status === "initial" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {/* File Upload Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <PhotoIcon className="h-5 w-5" />
                  Upload Image
                </h3>
                <Dropzone
                  accept={{
                    "image/*": [".jpg", ".jpeg", ".png"],
                  }}
                  multiple={false}
                  onDrop={(acceptedFiles) => handleFileChange(acceptedFiles[0])}
                >
                  {({ getRootProps, getInputProps, isDragAccept }) => (
                    <div
                      className={`flex aspect-video cursor-pointer items-center justify-center rounded-lg border-2 border-dashed ${
                        isDragAccept ? "border-blue-500" : "border-gray-300"
                      }`}
                      {...getRootProps()}
                    >
                      <input {...getInputProps()} />
                      <div className="text-center">
                        <PhotoIcon
                          className="mx-auto h-12 w-12 text-gray-300"
                          aria-hidden="true"
                        />
                        <div className="mt-4 flex text-sm leading-6 text-gray-600">
                          <label className="relative rounded-md bg-white font-semibold text-gray-800 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 hover:text-gray-600">
                            <p className="text-lg">Upload your menu</p>
                            <p className="mt-1 font-normal text-gray-600">
                              or drag and drop
                            </p>
                          </label>
                        </div>
                      </div>
                    </div>
                  )}
                </Dropzone>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <CameraCapture onImageCapture={handleFileChange} />
                </div>
              </div>

              {/* URL Input Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <LinkIcon className="h-5 w-5" />
                  Image URL
                </h3>
                <UrlInput onImageUrlSubmit={handleUrlSubmit} />
              </div>
            </div>
            
            <div className="mt-6 text-center">
              <button
                className="font-medium text-blue-400 text-md underline decoration-transparent hover:decoration-blue-200 decoration-2 underline-offset-4 transition hover:text-blue-500 px-4 py-2"
                onClick={handleSampleImage}
              >
                Try sample menu
              </button>
            </div>
          </>
        )}

        {menuUrl && (
          <div className="my-10 mx-auto flex  flex-col items-center">
            <Image
              width={1024}
              height={768}
              src={menuUrl}
              alt="Menu"
              className="w-40 rounded-lg shadow-md"
            />
          </div>
        )}

        {(status === "uploading" || status === "parsing") && (
          <ProcessingStatus status={status} />
        )}
      </div>
      {parsedMenu.length > 0 && (
        <div className="mt-10">
          <h2 className="text-4xl font-bold mb-5">
            Menu – {parsedMenu.length} dishes detected
          </h2>
          
          <DownloadButtons menuItems={parsedMenu} originalImageUrl={menuUrl} />
          
          <div className="relative mb-6">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search menu items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <MenuGrid items={filteredMenu} />
        </div>
      )}
    </div>
  );
}
