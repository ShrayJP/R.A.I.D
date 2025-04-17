from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import joblib
import nltk
import traceback
from disaster import load_model, predict_image, class_labels, severity_labels
from resource import allocate_resources, resources
import torch
import os
from geotext import GeoText

# 🔹 Preprocessing for Tweet Classification
nltk.download("punkt")
nltk.download("wordnet")
nltk.download("stopwords")

# 🔹 Initialize Flask App
app = Flask(__name__)
CORS(app)

# 🔹 Load Tweet Classification Model & Vectorizer
model_filename = r"F:\VishnuSemi2\DisasterPro\project\models\tweet_classyfying_pa_bigram_model_2.pkl"
vectorizer_filename = r"F:\VishnuSemi2\DisasterPro\project\models\tfidf_vectorizer_bigram_2.pkl"

try:
    tweet_model = joblib.load(model_filename)
    tfidf_vectorizer = joblib.load(vectorizer_filename)
    print("✅ Tweet Classification Model & Vectorizer Loaded")
except Exception as e:
    print(f"❌ Error loading tweet model/vectorizer: {e}\n{traceback.format_exc()}")

# 🔹 Load Image Classification Model
image_model_path = r"F:\VishnuSemi2\DisasterPro\project\models\usemodel.pth"
image_model, device = load_model(image_model_path)
print("✅ Image Classification Model Loaded")

lemma = nltk.WordNetLemmatizer()
stop = set(nltk.corpus.stopwords.words("english"))

# Base directory for disaster images
BASE_IMAGE_DIR = r"F:\VishnuSemi2\DisasterPro\project\Disaster_images"

def cleanTweet(txt):
    txt = txt.lower()
    words = nltk.word_tokenize(txt)
    words = [lemma.lemmatize(word) for word in words if word not in stop]
    return " ".join(words)

def extract_location(tweet):
    places = GeoText(tweet)
    cities = places.cities
    return cities[0] if cities else None

# 🟢 Tweet Classification Route
@app.route("/analyze-tweet", methods=["POST"])
def analyze_tweet():
    try:
        data = request.get_json()
        tweet = data.get("tweet", "")
        if not tweet:
            return jsonify({"error": "No tweet text provided"}), 400

        cleaned_tweet = cleanTweet(tweet)
        tfidf_tweet = tfidf_vectorizer.transform([cleaned_tweet])
        prediction = tweet_model.predict(tfidf_tweet)[0]

        detected_city = extract_location(tweet)
        return jsonify({
            "result": "true" if prediction == 1 else "false",
            "location": detected_city if prediction == 1 else None
        })
    except Exception as e:
        print(f"❌ Error in analyze_tweet: {traceback.format_exc()}")
        return jsonify({"error": str(e)}), 500

# 🟢 Image Serving Route
@app.route('/images/<path:filename>')
def serve_image(filename):
    return send_from_directory(BASE_IMAGE_DIR, filename)

# 🟢 Image Listing Route
@app.route("/get-images", methods=["POST"])
def get_images():
    try:
        data = request.get_json()
        city_name = data.get("city")
        image_dir = os.path.join(BASE_IMAGE_DIR, city_name) if city_name else BASE_IMAGE_DIR

        if not os.path.exists(image_dir):
            return jsonify({"error": f"Image directory '{city_name}' not found"}), 404

        image_files = [f for f in os.listdir(image_dir) if f.lower().endswith((".png", ".jpg", ".jpeg"))]
        images = []

        for img in image_files:
            full_path = os.path.join(image_dir, img)
            rel_path = os.path.relpath(full_path, BASE_IMAGE_DIR).replace("\\", "/")
            images.append({
                "path": full_path,
                "url": f"/images/{rel_path}"
            })

        return jsonify({"images": images})
    except Exception as e:
        print(f"❌ Error in get_images: {traceback.format_exc()}")
        return jsonify({"error": str(e)}), 500

# 🗂️ Global dictionary to track resource allocations
image_results = {}

# 🟢 Image Analysis and Resource Allocation
@app.route("/analyze-image", methods=["POST"])
def analyze_image():
    try:
        if request.is_json:
            data = request.get_json()
            print(f"Received JSON data: {data}")

            image_data = data.get("image_path")
            image_path = image_data.get("path") if isinstance(image_data, dict) else image_data

            if not isinstance(image_path, str) or not os.path.exists(image_path):
                return jsonify({"error": "Invalid or missing image path."}), 400

            prediction = predict_image(image_model, image_path, device, class_labels, severity_labels)
            print(f"Prediction for {image_path}: {prediction}")

            disaster_type = prediction.get("type")
            severity_level = prediction.get("severity")

            allocated = None
            resources_arrived = None

            if disaster_type and severity_level:
                before_allocation = resources.copy()
                allocated = allocate_resources(disaster_type, severity_level)
                after_allocation = resources.copy()

                resources_arrived = any(after_allocation[res] < before_allocation[res] for res in resources)
                print("🚨 Resources have arrived!" if resources_arrived else "❗ Resources failed to arrive")
                image_results[image_path] = allocated

            return jsonify({
                **prediction,
                "resources": allocated,
                "resources_arrived": resources_arrived
            })

        return jsonify({"error": "No JSON data received."}), 400

    except Exception as e:
        print(f"❌ Error in analyze_image: {traceback.format_exc()}")
        return jsonify({"error": str(e)}), 500

# 🟢 Manual Allocation Route
@app.route('/allocate', methods=['POST'])
def allocate():
    data = request.json
    disaster_type = data.get("type")
    severity_level = data.get("severity")

    allocation = allocate_resources(disaster_type, severity_level, return_only=True)
    print(allocation)

    if allocation:
        return jsonify({"success": True, "resources": allocation})
    else:
        return jsonify({"success": False, "message": "Allocation failed."}), 400

# 🟢 Global Resource Status Route (for frontend sync)
@app.route('/get-global-resources', methods=['GET'])
def get_global_resources():
    return jsonify(resources)

if __name__ == "__main__":
    app.run(debug=True)
