import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState(null);
  const [outputFormat, setOutputFormat] = useState("jpg");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please upload a file.");

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("format", outputFormat);

    const response = await fetch("/api/convert", {
      method: "POST",
      body: formData,
    });

    setLoading(false);

    if (!response.ok) {
      return alert("Error converting the image. Please try again.");
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `converted-image.${outputFormat}`;
    link.click();
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Image Converter</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>
        <div>
          <label htmlFor="format">Convert to: </label>
          <select
            id="format"
            value={outputFormat}
            onChange={(e) => setOutputFormat(e.target.value)}
          >
            <option value="jpg">JPG</option>
            <option value="png">PNG</option>
            <option value="webp">WEBP</option>
          </select>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Converting..." : "Convert"}
        </button>
      </form>
    </div>
  );
}
