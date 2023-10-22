<template>
  <div class="my-0 mx-auto max-w-screen-xl h-full flex flex-col">
    <div class="p-20 m-4 h-[85%]">
      <div class="w-full h-full">
        <div 
          v-if="isLoading && recordingStatus !== 'NOT_STARTED'"
          class="items-center flex h-full justify-center w-full"
        >
          <span>
            <svg class="animate-spin ml-1 mr-3 h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </span>
        </div>
        <div v-if="recordingStatus === 'STARTED'" class="items-center flex justify-center w-full h-full">
          <div class="relative lg:h-full">
            <video ref="video" class="rounded-xl h-full" src="" muted autoplay></video>
            <span v-if="!isLoading && recordingStatus === 'STARTED'" class="animate-pulse bg-red-500 rounded-full absolute left-2 right-0 top-2 bottom-0 w-4 h-4">
            </span>
          </div>
        </div>
        <div v-show="recordingStatus === 'ENDED'" class="flex items-center justify-center w-full h-full relative">
          <video
            ref="videoPreview" 
            id="player-element"
            class="rounded-xl overflow-hidden video-js vjs-theme-fantasy w-full h-full"
            controls
          >
          </video>
          <div
            v-if="isUploadStarted"
            class="w-full h-full opacity-80 bg-black absolute left-0 right-0 top-0 bottom-0 rounded-lg flex flex-col justify-between"
          >

            <div class="action-button flex justify-center mt-8">
              <button 
                id="endRecording" 
                class="inline-flex items-center justify-center w-12 h-12 mr-2 text-white transition-colors duration-150 bg-pink-700 rounded-full focus:shadow-outline hover:bg-pink-800 group relative"
                @click="handleCancelUpload()"
              >
                <!-- Icon -->
                <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2C6.47,2 2,6.47 2,12C2,17.53 6.47,22 12,22C17.53,22 22,17.53 22,12C22,6.47 17.53,2 12,2M14.59,8L12,10.59L9.41,8L8,9.41L10.59,12L8,14.59L9.41,16L12,13.41L14.59,16L16,14.59L13.41,12L16,9.41L14.59,8Z" />
                </svg>              
                <!-- Tooltip -->
                <span 
                  class="group-hover:opacity-100 transition-opacity bg-gray-800 text-sm text-gray-100 rounded-md absolute left-1/2 
                  -translate-x-1/2 translate-y-full opacity-0 m-4 mt-14 mx-auto w-[110px] px-2 py-0.5">
                  Cancel uploading
                </span>
              </button>
            </div>

            <div class="progressbar p-2">
              <progressbar color="red" :percentage="uploadProgress" :rounded="true" :indeterminate="false">
                <span class="text-xs text-white w-full flex justify-end pr-2">{{uploadProgress}}%</span>
              </progressbar>
            </div>
          </div>
        </div>
      </div>

    </div>
    <div class="p-8 m-4 h-[15%] flex justify-center items-center">
      <div class="w-full flex justify-center items-center">
        <button 
          v-if="recordingStatus === 'NOT_STARTED' || recordingStatus === 'ENDED'" 
          id="startRecording"
          class="inline-flex items-center justify-center w-12 h-12 mr-2 text-white transition-colors duration-150 bg-pink-700 rounded-full focus:shadow-outline hover:bg-pink-800 group relative"
          @click="handleStartRecording()"
        >
          <!-- Icon -->
          <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9Z" />
          </svg>
          <!-- Tooltip -->
          <span 
            class="group-hover:opacity-100 transition-opacity bg-gray-800 text-sm text-gray-100 rounded-md absolute left-1/2 
            -translate-x-1/2 translate-y-full opacity-0 m-4 mt-14 mx-auto w-[110px] px-2 py-0.5">
            Start recording
          </span>
        </button>
        <button 
          v-if="recordingStatus === 'STARTED'"
          id="endRecording" 
          class="inline-flex items-center justify-center w-12 h-12 mr-2 text-white transition-colors duration-150 bg-pink-700 rounded-full focus:shadow-outline hover:bg-pink-800 group relative"
          @click="handleStopRecording()"
        >
          <!-- Icon -->
          <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4M9,9V15H15V9" />
          </svg>
          <!-- Tooltip -->
          <span 
            class="group-hover:opacity-100 transition-opacity bg-gray-800 text-sm text-gray-100 rounded-md absolute left-1/2 
            -translate-x-1/2 translate-y-full opacity-0 m-4 mt-14 mx-auto w-[110px] px-2 py-0.5">
            Stop recording
          </span>
        </button>
        <button 
          v-if="recordingStatus === 'ENDED'"
          id="endRecording" 
          class="inline-flex items-center justify-center w-12 h-12 mr-2 text-white transition-colors duration-150 bg-pink-700 rounded-full focus:shadow-outline hover:bg-pink-800 group relative"
          @click="handleUpload()"
        >
          <!-- Icon -->
          <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9,16V10H5L12,3L19,10H15V16H9M5,20V18H19V20H5Z" />
          </svg>          
          <!-- Tooltip -->
          <span 
            class="group-hover:opacity-100 transition-opacity bg-gray-800 text-sm text-gray-100 rounded-md absolute left-1/2 
            -translate-x-1/2 translate-y-full opacity-0 m-4 mt-14 mx-auto w-[110px] px-2 py-0.5">
            Upload the video
          </span>
        </button>
      </div>
    </div>
  </div>

  <div>
    <audio ref="recordingSoundStart">
      <source src="../assets/start.mp3" type="audio/mpeg">
      Your browser does not support the audio element.
    </audio>
    <audio ref="recordingSoundStop">
      <source src="../assets/stop.mp3" type="audio/mpeg">
      Your browser does not support the audio element.
    </audio>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onUnmounted } from 'vue';
import { storage } from '../utils/firebase.ts';
import { ref as storageRef, uploadBytesResumable, getDownloadURL  } from 'firebase/storage';
import progressbar from './progressbar.vue';

const uploadTask = ref<any>(null);
const isUploadStarted = ref<boolean>(false);
const isUploadCanceled = ref<boolean>(false);
const uploadProgress = ref<number>(0);

interface VideoAttributes {
  name: string,
  url: any
}

let recordingStatus = ref<string>('NOT_STARTED');
let isLoading = ref<boolean>(false);

const video = ref();
const videoPreview = ref();
const videoUrl = ref();
const recordingSoundStart = ref();
const recordingSoundStop = ref();

let camera: any = null;
let mediaRecorder: any = null;
let recordedBlobs: Blob[] = [];
let blobVideo = ref<any>();
let fileVideo = ref<any>();
let currentVideo: VideoAttributes = reactive({
  name: '',
  url: null
});

const storeCameraFeed = async () => {
  camera = await navigator.mediaDevices.getUserMedia({video: true, audio: true})
  video.value.srcObject = camera;

  mediaRecorder = new MediaRecorder(camera, {mimeType: 'video/webm'});

  recordingSoundStart.value.play();
  mediaRecorder.addEventListener('dataavailable', (e: any) => {
    recordedBlobs.push(e.data);
  })
}

const stopCameraFeed = async () => {
  mediaRecorder.addEventListener('stop', () => {
    blobVideo.value = new Blob(recordedBlobs, {type: 'video/webm'});
    let localVideo = URL.createObjectURL(new Blob(recordedBlobs, {type: 'video/webm'}));

    currentVideo.name = Date.now() + '_recorded.webm';
    currentVideo.url = localVideo;
    console.log('videoPreview.value: ', videoPreview.value);
    videoPreview.value.src = currentVideo.url;
    mediaRecorder.stream.getTracks().forEach((track: any) => {
        if (track.readyState == 'live') {
          track.stop();
        }
    });
    recordedBlobs = [];

    videoPlayback();
  })
}

const showRecordedVideo = (videoURL: string) => {
  videoPlayback();
  videoPreview.value.src = videoURL;
}

const handleStartRecording = async () => {
  recordingStatus.value = 'STARTED';
  uploadProgress.value = 0;
  videoUrl.value = null;
  isLoading.value = true;
  await storeCameraFeed();
  stopCameraFeed();
  mediaRecorder.start();
  isLoading.value = false;
}

const handleStopRecording = async () => {
  recordingStatus.value = 'ENDED';
  isLoading.value = true;
  mediaRecorder.stop();
  recordingSoundStop.value.play();
  isLoading.value = false;
}

const handleUpload = () => {
  isUploadStarted.value = true;
  isUploadCanceled.value = false;
  videoPreview.value.pause();
  const storageReferance = storageRef(storage, 'video/' + currentVideo.name)

  fileVideo.value = blobToFile(blobVideo.value, currentVideo.name)

  uploadTask.value = uploadBytesResumable(storageReferance, fileVideo.value);
  uploadTask.value.on('state_change', (snapshot: any) => {
    // Observe state change events such as progress, pause, and resume
    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    uploadProgress.value = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)-1;
    switch (snapshot.state) {
      case 'running':
        console.log('Upload is running');
        break;
    }
  },
  (error: object) => {
    // Handle unsuccessful uploads
    console.log('error: ', error);
    isUploadStarted.value = false;
    isUploadCanceled.value = true;
  }, 
  () => {
    // Handle successful uploads on complete
    // For instance, get the download URL: https://firebasestorage.googleapis.com/...
    getDownloadURL(uploadTask.value.snapshot.ref).then((downloadURL) => {
      isUploadStarted.value = false;
      isUploadCanceled.value = false;
      uploadProgress.value = uploadProgress.value + 1;
      videoUrl.value = downloadURL;
      showRecordedVideo(downloadURL);
      console.log('File available at', downloadURL);
    });
  })
}
const handleCancelUpload = () => {
  uploadTask.value.cancel();
  isUploadCanceled.value = true;
  isUploadStarted.value = false;
  uploadProgress.value = 0;
}

const blobToFile = (theBlob: any, fileName:string): File => {
  const b: any = theBlob;
  //A Blob() is almost a File() - it's just missing the two properties below which we will add
  b.lastModifiedDate = new Date();
  b.name = fileName;
    
  //Cast to a File() type
  return theBlob as File;
}


import videojs from 'video.js'
import 'video.js/dist/video-js.css'
import '@videojs/themes/dist/fantasy/index.css';

type videoOptionsType = {
  autoplay?: boolean
  controls?: boolean
  muted?: boolean
  loop?: boolean
  sources: videoOptionsSourcesType[]
}

type videoOptionsSourcesType = {
  src: string
  type: string
}

let VideoJSPlayerInstance: any = null;

const videoOptions:videoOptionsType = reactive({
  autoplay: false,
  controls: true,
  sources: [{
    src: '',
    type: 'video/mp4'
  }]
})

const videoPlayback = () => {
  videoOptions.sources = [{
    src: videoUrl.value || currentVideo.url,
    type: 'video/mp4'
  }]
  VideoJSPlayerInstance = videojs(
    'player-element',
    videoOptions,
    function onPlayerReady() {
      console.log('Player Is: ', VideoJSPlayerInstance)
    },
  )
  console.log('VideoJSPlayerInstance: ', VideoJSPlayerInstance);
}

onUnmounted(() => {
  if (VideoJSPlayerInstance) {
    VideoJSPlayerInstance.dispose();
  }
})

</script>
