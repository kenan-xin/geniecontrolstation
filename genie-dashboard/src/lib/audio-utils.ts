import lamejs from "lamejs";

const API_BASE_URL = "https://dev-genie.001.gs/smart-api";

// Convert AudioBuffer to MP3 Blob using lamejs
export function audioBufferToMp3Blob(audioBuffer: AudioBuffer): Blob {
  const numChannels = audioBuffer.numberOfChannels;
  const sampleRate = audioBuffer.sampleRate;
  const kbps = 128;

  const mp3encoder = new lamejs.Mp3Encoder(numChannels, sampleRate, kbps);
  const mp3Data: Int8Array[] = [];

  const blockSize = 1152;
  const leftChannel = audioBuffer.getChannelData(0);
  const rightChannel = numChannels > 1 ? audioBuffer.getChannelData(1) : leftChannel;

  // Convert Float32 to Int16
  const leftInt16 = new Int16Array(leftChannel.length);
  const rightInt16 = new Int16Array(rightChannel.length);

  for (let i = 0; i < leftChannel.length; i++) {
    leftInt16[i] = Math.max(-32768, Math.min(32767, Math.floor(leftChannel[i] * 32767)));
    rightInt16[i] = Math.max(-32768, Math.min(32767, Math.floor(rightChannel[i] * 32767)));
  }

  // Process in blocks
  for (let i = 0; i < leftInt16.length; i += blockSize) {
    const leftChunk = leftInt16.subarray(i, i + blockSize);
    const rightChunk = rightInt16.subarray(i, i + blockSize);

    let mp3buf: Int8Array;
    if (numChannels > 1) {
      mp3buf = mp3encoder.encodeBuffer(leftChunk, rightChunk);
    } else {
      mp3buf = mp3encoder.encodeBuffer(leftChunk);
    }

    if (mp3buf.length > 0) {
      mp3Data.push(mp3buf);
    }
  }

  // Flush remaining data
  const mp3buf = mp3encoder.flush();
  if (mp3buf.length > 0) {
    mp3Data.push(mp3buf);
  }

  // Combine all chunks into a single Blob
  return new Blob(mp3Data.map((arr) => new Uint8Array(arr)), { type: "audio/mpeg" });
}

// Call the text_podcast API for transcription
export async function callTextPodcastAPI(audioBlob: Blob): Promise<{
  text: string;
  category: string;
  content: string;
}> {
  const formData = new FormData();

  // Determine filename based on blob type
  let filename = "recording.webm";
  if (audioBlob.type.includes("mp3") || audioBlob.type.includes("mpeg")) {
    filename = "recording.mp3";
  } else if (audioBlob.type.includes("wav")) {
    filename = "recording.wav";
  } else if (audioBlob.type.includes("ogg")) {
    filename = "recording.ogg";
  }

  formData.append("audio", audioBlob, filename);

  const response = await fetch(`${API_BASE_URL}/text_podcast`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "Unknown error");
    throw new Error(`Transcription failed: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return {
    text: data.text ?? "",
    category: data.category ?? "",
    content: data.content ?? "",
  };
}

// Format recording time as HH:MM:SS
export function formatRecordingTime(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const parts = [mins, secs];
  if (hrs > 0) {
    parts.unshift(hrs);
  }

  return parts.map((n) => n.toString().padStart(2, "0")).join(":");
}
