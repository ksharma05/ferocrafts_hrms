import { useState, useRef, useEffect } from 'react';

/**
 * Camera Capture Component
 * Captures selfie from user's camera for attendance check-in
 */

function CameraCapture({ onCapture, onCancel }) {
  const [stream, setStream] = useState(null);
  const [error, setError] = useState('');
  const [captured, setCaptured] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 640, height: 480 },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('Camera access error:', err);
      setError('Unable to access camera. Please ensure camera permissions are granted.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert canvas to blob
    canvas.toBlob(
      (blob) => {
        if (blob) {
          setCaptured(true);
          stopCamera();
          onCapture(blob);
        }
      },
      'image/jpeg',
      0.85
    );
  };

  const retake = () => {
    setCaptured(false);
    startCamera();
  };

  const handleCancel = () => {
    stopCamera();
    onCancel();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
        <h3 className="text-xl font-semibold mb-4">Take Selfie for Check-in</h3>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="relative bg-gray-900 rounded-lg overflow-hidden mb-4">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className={`w-full ${captured ? 'hidden' : 'block'}`}
            style={{ maxHeight: '400px' }}
          />
          <canvas
            ref={canvasRef}
            className={`w-full ${captured ? 'block' : 'hidden'}`}
            style={{ maxHeight: '400px' }}
          />
        </div>

        <div className="flex gap-3 justify-end">
          {!captured ? (
            <>
              <button
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={capturePhoto}
                disabled={!stream}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400"
              >
                Capture Photo
              </button>
            </>
          ) : (
            <>
              <button
                onClick={retake}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Retake
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Use Photo
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default CameraCapture;

