// NOTE:    In order for this Node.js app to work, I will need to provide authentication credentials to Google
//          by setting an environmental variable.  Because this environmental variable only applies to my
//          current shell session, I will have to set this variable EACH TIME I RUN THIS APPLICATION!
//
//          TLDR: Copy & paste the code below ("export ...") into the terminal before running!
//                node transcribe.js > transcription_file_name--transcription.txt
//
//          export GOOGLE_APPLICATION_CREDENTIALS="api_keys/node-lecture-transcription.json"
//
// DOCUMENTATION:   https://www.npmjs.com/package/@google-cloud/speech

// Imports the Google Cloud client library
const speech = require("@google-cloud/speech");
const { fstat } = require("fs");

// Creates a client
const client = new speech.SpeechClient();

// change gcsUri to whatever file I want to currently transcribe
const gcsUri = "gs://lecture_audio/astro_crash_course-4.mp3";
//  const encoding = 'M4A';
const encoding = "MP3";
const sampleRateHertz = 16000;
const languageCode = "en-US";

const config = {
  encoding: encoding,
  sampleRateHertz: sampleRateHertz,
  languageCode: languageCode,
};

const audio = {
  uri: gcsUri,
};

const request = {
  config: config,
  audio: audio,
};

// Wraps sample code in Google API in async function to prevent await keyword errors
async function transcribe() {
  // Detects speech in the audio file. This creates a recognition job that you
  // can wait for now, or get its result later.
  const [operation] = await client.longRunningRecognize(request);
  // Get a Promise representation of the final result of the job
  const [response] = await operation.promise();
  const transcription = response.results
    .map((result) => result.alternatives[0].transcript)
    .join("\n");
  console.log(`Transcription: ${transcription}`);
}

// Run async function and actually transcribe the audio file in line 9.
transcribe();
