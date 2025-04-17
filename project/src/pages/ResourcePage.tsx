import React, { useEffect, useState } from "react";
import axios from "axios";

interface Resource {
  type: string;
  quantity: number | string;
}

interface ImageResult {
  severity: "Little to None" | "Mild" | "Severe";
  type: string;
  image: string;
  resources: {
    [key: string]: number;
  };
  resources_arrived?: boolean;
}

const ResourcePage = () => {
  const [resourcesData, setResourcesData] = useState<
    {
      name: string;
      image: string;
      severity: string;
      resources: Resource[];
      resources_arrived?: boolean;
    }[]
  >([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [resourceArrivalStatus, setResourceArrivalStatus] = useState<null | boolean>(null);
  const [showArrivalPopup, setShowArrivalPopup] = useState(false);

  useEffect(() => {
    const storedResults = localStorage.getItem("imageResults");
    if (storedResults) {
      const imageResults: ImageResult[] = JSON.parse(storedResults);

      const formattedResults = imageResults.map((result) => {
        const formattedResources: Resource[] = Object.entries(result.resources).map(
          ([type, quantity]) => ({ type, quantity })
        );

        return {
          name: `${result.type} Response`,
          image: result.image,
          severity: result.severity,
          resources: formattedResources,
          resources_arrived: result.resources_arrived,
        };
      });

      setResourcesData(formattedResults);

      // Save deployed resource totals to localStorage
      const cumulativeResourceUsage: { [key: string]: number } = {};
      imageResults.forEach((result) => {
        Object.entries(result.resources).forEach(([type, qty]) => {
          cumulativeResourceUsage[type] = (cumulativeResourceUsage[type] || 0) + qty;
        });
      });
      localStorage.setItem("updatedResourceStatus", JSON.stringify(cumulativeResourceUsage));

      // Handle popup for latest result
      const latest = imageResults[imageResults.length - 1];
      if (typeof latest?.resources_arrived === "boolean") {
        setResourceArrivalStatus(latest.resources_arrived);
        setShowArrivalPopup(true);
      }

      localStorage.removeItem("imageResults");
    }
  }, []);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsModalOpen(false);
        setShowArrivalPopup(false);
      }
    };
    if (isModalOpen || showArrivalPopup) {
      window.addEventListener("keydown", handleEscape);
    }
    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isModalOpen, showArrivalPopup]);

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-9">Allocation of Resources</h1>

        {resourcesData.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {resourcesData.map((disaster, index) => (
              <div
                key={index}
                className="bg-gray-800 rounded-lg shadow-lg overflow-hidden relative"
              >
                {/* Tags */}
                <div className="absolute top-2 left-2 flex flex-col gap-2">
                  <span
                    className={`px-3 py-1 text-sm font-semibold text-white rounded-lg ${
                      disaster.resources_arrived === true
                        ? "bg-green-600"
                        : disaster.resources_arrived === false
                        ? "bg-red-600"
                        : "bg-gray-500"
                    }`}
                  >
                    {disaster.resources_arrived === true
                      ? "✅ Arrived"
                      : disaster.resources_arrived === false
                      ? "❌ Failed"
                      : "⏳ Pending"}
                  </span>
                </div>

                <span
                  className={`absolute top-2 right-2 px-3 py-1 text-sm font-semibold text-white rounded-lg ${
                    disaster.severity === "Severe"
                      ? "bg-red-600"
                      : disaster.severity === "Mild"
                      ? "bg-yellow-500"
                      : "bg-green-600"
                  }`}
                >
                  {disaster.severity}
                </span>

                <img
                  src={disaster.image}
                  alt={disaster.name}
                  className="w-full h-48 object-cover cursor-pointer"
                  onClick={() => {
                    setSelectedImage(disaster.image);
                    setIsModalOpen(true);
                  }}
                />
                <div className="p-6">
                  <h2 className="text-2xl font-semibold mb-4">
                    {disaster.name}
                  </h2>
                  <table className="w-full text-left border-collapse mt-2">
                    <thead>
                      <tr className="text-white-300">
                        <th className="border-b border-white-600 pb-1 pr-4 border-r border-white-700">
                          Resource
                        </th>
                        <th className="border-b border-white-600 pb-1 pl-4">
                          Quantity
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {disaster.resources.map((resource, idx) => (
                        <tr key={idx} className="border-b border-white-700">
                          <td className="py-2 pr-4 border-r border-white-700">
                            {resource.type}
                          </td>
                          <td className="py-2 pl-4">{resource.quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">
            No resources available. Please analyze a disaster first.
          </p>
        )}

        {/* Image Modal */}
        {isModalOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setIsModalOpen(false)}
          >
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <div className="w-[800px] h-[600px] bg-gray-800 rounded-lg overflow-hidden">
                <img
                  src={selectedImage!}
                  alt="Full size"
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                className="absolute top-2 right-2 text-white bg-gray-800 rounded-full p-2"
                onClick={() => setIsModalOpen(false)}
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourcePage;
