const canvas = document.getElementById('waveCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight * 0.8;

// Step 1: Get microphone input
navigator.mediaDevices.getUserMedia({ audio: true })
  .then(stream => {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioCtx.createMediaStreamSource(stream);
    const analyser = audioCtx.createAnalyser();
    source.connect(analyser);

    analyser.fftSize = 2048;
    const bufferLength = analyser.fftSize;
    const dataArray = new Uint8Array(bufferLength);

    function draw() {
      requestAnimationFrame(draw);

      analyser.getByteTimeDomainData(dataArray);

      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.lineWidth = 2;
      const hue = Math.floor(Math.random() * 360);
ctx.strokeStyle = `hsl(${hue}, 100%, 70%)`;

      ctx.beginPath();

      const sliceWidth = canvas.width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = v * canvas.height / 2;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
    }

    draw();
  })
  .catch(err => {
    alert('Microphone access denied: ' + err.message);
  });
