const video = document.getElementById('webcam');

async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { width: 640, height: 480 },
            audio: false
        });

        video.srcObject = stream;
    } catch (err){
        console.error ('Camera access failed:', err);
        alert('Could not access camera. Check permissions and try again.');
    }
}

startCamera();