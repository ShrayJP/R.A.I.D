import React, { useState, useEffect } from "react";
import { Upload, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DisasterIdentifier = () => {
  const [tweets, setTweets] = useState(["", "", "", "", ""]);
  const [tweetResults, setTweetResults] = useState<("true" | "false" | null)[]>([null, null, null, null, null]);
  const [tweetResult, setTweetResult] = useState<"true" | "false" | null>(null);
  const [imageFiles, setImageFiles] = useState<{ path: string; url: string }[]>([]);
  const [imageResults, setImageResults] = useState<
    { severity: "Little to None" | "Mild" | "Severe"; type: string; image: string }[]
  >([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (tweetResult === "true") fetchImages();
  }, [tweetResult]);

  const fetchImages = async (city = null) => {
    try {
      const response = await fetch("http://127.0.0.1:5000/get-images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city }),
      });

      const data = await response.json();
      if (response.ok) {
        setImageFiles(data.images);
      } else {
        alert("Error: " + (data.error || "Could not fetch images"));
      }
    } catch {
      alert("Failed to connect to server. Is Flask running?");
    }
  };

  useEffect(() => {
    if (imageFiles.length > 0) analyzeImages();
  }, [imageFiles]);

  const analyzeImages = async () => {
    setLoading(true);
    const results = [];

    for (const image of imageFiles) {
      try {
        const response = await fetch("http://127.0.0.1:5000/analyze-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image_path: image.path }),
        });

        const data = await response.json();
        if (response.ok) {
          results.push({ ...data, image: `http://127.0.0.1:5000${image.url}` });
        } else {
          console.error("Error analyzing image:", data.error);
        }
      } catch (error) {
        console.error("Failed to analyze image:", error);
      }
    }

    setImageResults(results);
    setLoading(false);
    localStorage.setItem("imageResults", JSON.stringify(results));
    
    // ✅ Show popup
    toast.info("Redirecting to Resource Allocator...", {
      position: "bottom-right",
      autoClose: 3000,
      theme: "dark",
    });

    // Redirect after toast
    setTimeout(() => {
      window.location.href = "/resource";
    }, 3500);
  };

  const analyzeTweets = async () => {
    let results = [...tweetResults];
    let detectedCity = null;

    for (let i = 0; i < tweets.length; i++) {
      const tweetText = tweets[i].trim();
      if (!tweetText) continue;

      try {
        const response = await fetch("http://127.0.0.1:5000/analyze-tweet", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tweet: tweetText }),
        });

        const data = await response.json();
        if (response.ok) {
          results[i] = data.result;
          if (data.result === "true") {
            setTweetResult("true");
            if (data.location) detectedCity = data.location;
          }
        } else {
          alert(`Error analyzing tweet ${i + 1}: ${data.error || "Unknown error"}`);
        }
      } catch {
        alert(`Failed to analyze tweet ${i + 1}. Is Flask running?`);
      }
    }

    setTweetResults(results);
    if (!results.includes("true")) {
      setTweetResult("false");
    } else {
      fetchImages(detectedCity);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-6">
      <ToastContainer position="bottom-right" autoClose={2500} />
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500 mb-4">
            Disaster Identifier
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Advanced AI-powered disaster detection and classification system
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Tweet Analysis Section */}
          <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700">
            <div className="flex items-center mb-4">
              <AlertTriangle className="h-6 w-6 text-orange-500 mr-2" />
              <h2 className="text-xl font-semibold">Tweet Analysis</h2>
            </div>
            <div className="space-y-4">
              {tweets.map((tweet, index) => (
                <textarea
                  key={index}
                  className="w-full h-20 p-4 rounded-lg bg-gray-700/50 border border-gray-600 focus:outline-none focus:border-orange-500 text-gray-200 placeholder-gray-400"
                  placeholder={`Enter tweet ${index + 1}...`}
                  value={tweet}
                  onChange={(e) => {
                    const updatedTweets = [...tweets];
                    updatedTweets[index] = e.target.value;
                    setTweets(updatedTweets);
                    setTweetResult(null);
                  }}
                />
              ))}
              <Button
                onClick={analyzeTweets}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
              >
                Analyze Tweets
              </Button>
              {tweetResults.some((result) => result !== null) && (
                <div
                  className={`flex items-center p-4 rounded-lg ${
                    tweetResult === "true" ? "bg-green-500/20" : "bg-red-500/20"
                  }`}
                >
                  {tweetResult === "true" ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500 mr-2" />
                  )}
                  <span>
                    {tweetResult === "true"
                      ? "Disaster Detected."
                      : "No valid disaster detected."}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Image Analysis Section */}
          <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700">
            <div className="flex items-center mb-4">
              <Upload className="h-6 w-6 text-blue-500 mr-2" />
              <h2 className="text-xl font-semibold">CCTV Image Analysis</h2>
            </div>

            {tweetResult === "true" ? (
              loading ? (
                <p className="text-gray-400">Analyzing images...</p>
              ) : (
                <div className="space-y-4">
                  {imageResults.length > 0 ? (
                    imageResults.map((result, index) => (
                      <div key={index} className="p-4 rounded-lg bg-blue-500/20">
                        <p className="font-semibold">{result.image.split("/").pop()}</p>
                        <div className="flex items-center">
                          <span className="font-semibold mr-2">Severity:</span>
                          <span
                            className={`px-2 py-1 rounded ${
                              result.severity === "Severe"
                                ? "bg-red-500/50"
                                : result.severity === "Mild"
                                ? "bg-orange-500/50"
                                : "bg-green-500/50"
                            }`}
                          >
                            {result.severity}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-semibold mr-2">Type:</span>
                          <span>{result.type}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400">No images available for analysis.</p>
                  )}
                </div>
              )
            ) : (
              <p className="text-gray-400">
                Analyze tweets first and confirm disaster validity.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisasterIdentifier;
