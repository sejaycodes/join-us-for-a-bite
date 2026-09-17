
import {
    FaceLandmarker,
    FilesetResolver,
    DrawingUtils
} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14";

const video = document.getElementById('webcam');
const canvas = document.getElementById('overlay');
const ctx = canvas.getContext('2d');

let faceLandmarker;

async function createFaceLandmarker() {
  const filesetResolver = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm"
  );

  faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
    baseOptions: {
      modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
      delegate: "GPU"
    },
    outputFaceBlendshapes: false,
    runningMode: "VIDEO",
    numFaces: 1
  });
}


async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { width: 640, height: 480 },
      audio: false
    });
    video.srcObject = stream;

    // Wait until the video's metadata is loaded so we know its real dimensions
    video.addEventListener('loadeddata', () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      predictLoop();
    });
  } catch (err) {
    console.error('Camera access failed:', err);
    alert('Could not access camera. Check permissions and try again.');
  }
}

// Runs on every animation frame: detect landmarks, draw them
function predictLoop() {
  const nowInMs = performance.now();
  const result = faceLandmarker.detectForVideo(video, nowInMs);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (result.faceLandmarks) {
    const drawingUtils = new DrawingUtils(ctx);
    for (const landmarks of result.faceLandmarks) {
      drawingUtils.drawConnectors(
        landmarks,
        FaceLandmarker.FACE_LANDMARKS_TESSELATION,
        { color: "#00FF0033", lineWidth: 1 }
      );
    }
  }

  requestAnimationFrame(predictLoop);
}

// Boot sequence: load model, then start camera
async function init() {
  await createFaceLandmarker();
  await startCamera();
}

init();