import { useState } from "react";
import axios from "axios";

const SUGGESTIONS = [
  "dragon breathing fire, bold high-contrast print, centered composition, transparent background",
  "retro sun over ocean, flat vector, vibrant gradient, poster-style",
  "pokemon-inspired sunrise silhouette, simplified lines, limited palette, transparent background",
  "cool breeze tree line-art, single color, stamp-style print",
  "vintage motorcycle emblem, distressed texture, circular badge",
  "celestial skull with floral ornament, high-contrast, screen print friendly",
  "geometric tiger head, halftone accents, minimal color palette",
  "surreal melting logo, bold shapes, print-friendly outlines",
  "abstract waves + sun, 2-color vector, large-scale print",
  "retro cassette + neon glow, poster print, vector-like"
];

function App() {
  const [prompt, setPrompt] = useState("");
  const [images, setImages] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const API_URL = "https://sharla-phleboid-tonita.ngrok-free.dev/generate";
  const BASE_URL = "https://sharla-phleboid-tonita.ngrok-free.dev";

  const handleGenerate = async () => {
    if (!prompt) return;

    setLoading(true);
    setImages([]);
    setProducts([]);

    try {
      const res = await axios.post(
        API_URL,
        { prompt },
        {
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        }
      );

      setImages(res.data.generated_images);
      setProducts(res.data.recommended_products);
    } catch (err) {
      console.error(err);
      alert("API error");
    }
    setLoading(false);
  };

  const copyPrompt = async () => {
    if (!prompt) return;
    await navigator.clipboard.writeText(prompt);
    alert("Prompt copied!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white">
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* HEADER */}
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-3">
          AI Fashion Design Generator
        </h1>
        <p className="text-center text-gray-400 mb-8">
          Generate premium fashion concepts using AI
        </p>

        {/* INPUT CARD */}
        <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-6 flex flex-col gap-4 shadow-xl">
          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="text"
              placeholder="e.g. black oversized streetwear hoodie"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-black/40 border border-gray-600 focus:outline-none focus:border-white"
            />

            <button
              onClick={handleGenerate}
              className="px-6 py-3 rounded-lg bg-white text-black font-semibold hover:bg-gray-200 transition active:scale-95"
            >
              Generate
            </button>

            <button
              onClick={copyPrompt}
              className="px-6 py-3 rounded-lg border border-white/30 hover:bg-white/10 transition"
            >
              Copy
            </button>
          </div>

          {/* SUGGESTIONS */}
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((s, i) => (
              <button
                key={i}
                onClick={() => setPrompt(s)}
                className="text-sm px-3 py-1 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 transition"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* LOADING SKELETON */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-12">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-64 rounded-2xl bg-white/10 animate-pulse"
              />
            ))}
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && images.length === 0 && (
          <p className="text-center text-gray-500 mt-12">
            Your generated designs will appear here ✨
          </p>
        )}

        {/* GENERATED IMAGES */}
        {images.length > 0 && (
          <>
            <h2 className="text-2xl font-semibold mt-14 mb-6 text-center">
              Generated Designs
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {images.map((img, i) => (
                <div
                  key={i}
                  className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-4 shadow-xl hover:scale-[1.03] transition cursor-pointer"
                >
                  <img
                    src={`${BASE_URL}/${img}`}
                    alt="design"
                    className="rounded-xl mb-3 w-full"
                    onClick={() =>
                      setSelectedImage(`${BASE_URL}/${img}`)
                    }
                  />

                  <a
                    href={`${BASE_URL}/${img}`}
                    download
                    className="text-sm text-blue-400 hover:underline"
                  >
                    Download
                  </a>
                </div>
              ))}
            </div>
          </>
        )}

        {/* PRODUCTS */}
        {products.length > 0 && (
          <>
            <h2 className="text-2xl font-semibold mt-16 mb-6 text-center">
              Similar Products
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 text-center shadow-xl hover:scale-[1.02] transition"
                >
                  <p className="font-bold text-lg">{p.name}</p>
                  <p className="text-gray-300 mt-2">₹ {p.price}</p>
                  <button className="mt-4 px-4 py-2 rounded-lg bg-white text-black text-sm font-semibold hover:bg-gray-200 transition">
                    View Product
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* IMAGE MODAL */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 bg-black/80 flex items-center justify-center p-6 z-50"
        >
          <img
            src={selectedImage}
            alt="preview"
            className="max-h-[90vh] rounded-xl shadow-2xl"
          />
        </div>
      )}
    </div>
  );
}

export default App;