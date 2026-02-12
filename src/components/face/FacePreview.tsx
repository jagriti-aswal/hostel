import { useRef, useState } from "react";

export default function FacePreview() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // Start camera
  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;
  };

  // Capture image
  const captureImage = async () => {
    setLoading(true);
    const canvas = canvasRef.current;
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    const imageBase64 = canvas.toDataURL("image/jpeg");

    // Send to backend
    const res = await fetch("http://localhost:5000/api/face/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: "testuser",
        image: imageBase64,
      }),
    });

    const data = await res.json();
    setResult(data);
    setLoading(false);
  };

  return (
    <div>
      <video ref={videoRef} autoPlay playsInline width="300" />
      <canvas ref={canvasRef} style={{ display: "none" }} />

      <div>
        <button onClick={startCamera}>Start Camera</button>
        <button onClick={captureImage} disabled={loading}>
          {loading ? "Verifying..." : "Capture & Verify"}
        </button>
      </div>

      {result && (
        <div>
          {result.success ? "✅ Face Verified" : "❌ Face Not Matched"}
        </div>
      )}
    </div>
  );
}
