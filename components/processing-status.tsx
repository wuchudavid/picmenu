import { CheckIcon } from "@heroicons/react/24/solid";

interface ProcessingStatusProps {
  status: "initial" | "uploading" | "parsing" | "created";
  menuItemCount?: number;
}

export function ProcessingStatus({ status, menuItemCount }: ProcessingStatusProps) {
  const steps = [
    { id: "uploading", label: "Uploading image", completed: status !== "initial" },
    { id: "parsing", label: "Parsing menu items", completed: status === "parsing" || status === "created" },
    { id: "generating", label: "Generating images", completed: status === "created" },
  ];

  return (
    <div className="mt-10 flex flex-col items-center">
      <div className="flex items-center space-x-4 mb-6">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500" />
        <p className="text-lg text-gray-600">
          {status === "uploading" && "Uploading your menu image..."}
          {status === "parsing" && "Analyzing menu items..."}
          {status === "created" && "Processing complete!"}
        </p>
      </div>

      {/* Progress Steps */}
      <div className="w-full max-w-md space-y-4 mb-8">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center space-x-3">
            <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
              step.completed 
                ? "bg-green-500 text-white" 
                : "bg-gray-200 text-gray-400"
            }`}>
              {step.completed ? (
                <CheckIcon className="w-4 h-4" />
              ) : (
                <span className="text-xs font-medium">{index + 1}</span>
              )}
            </div>
            <span className={`text-sm ${
              step.completed ? "text-gray-900" : "text-gray-500"
            }`}>
              {step.label}
            </span>
          </div>
        ))}
      </div>

      {/* Loading Animation */}
      {status === "parsing" && (
        <div className="w-full max-w-2xl space-y-4">
          <div className="h-8 bg-gray-200 rounded-lg animate-pulse" />
          <div className="grid grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-32 bg-gray-200 rounded-lg animate-pulse" />
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Success Message */}
      {status === "created" && menuItemCount && (
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckIcon className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Menu processed successfully!
          </h3>
          <p className="text-gray-600">
            Found {menuItemCount} menu items with AI-generated images
          </p>
        </div>
      )}
    </div>
  );
} 