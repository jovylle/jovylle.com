<template>
  <div class="py-40">
    <div class="flex flex-col items-center justify-center">
      <div
        class=" w-player flex flex-col rounded-xl  border border-player-light-border dark:border-m4 border-4 dark:shadow-player-dark dark:bg-player-dark-background dark:border-player-dark-border dark:backdrop-blur-xl"
      >
        <div class="px-10 pt-10 pb-4 flex items-center z-50">
          <img
            data-amplitude-song-info="cover_art_url"
            class="w-24 h-24 rounded-md mr-6 border-2 dark:border-m4"
            src="https://cdn.pixabay.com/audio/2022/06/13/08-33-36-161_200x200.jpg"
          />

          <div class="flex flex-col">
            <span
              data-amplitude-song-info="name"
              class="font-sans text-xl font-medium leading-7 "
              >Soft Rain Ambient</span
            >
            <span
              data-amplitude-song-info="artist"
              class="font-sans text-base font-medium leading-6 text-gray-500 dark:text-gray-400"
              >SoundsForYou</span
            >
            <span
              data-amplitude-song-info="album"
              class="font-sans text-base font-medium leading-6 text-gray-500 dark:text-gray-400"
              >https://pixabay.com/sound-effects/soft-rain-ambient-111154/</span
            >
          </div>
        </div>
        <!-- <div class="w-full flex flex-col px-10 pb-6 z-50">
					<input type="range" id="song-percentage-played" class="amplitude-song-slider mb-3" step=".1"/>
					<div class="flex w-full justify-between">
						<span class="amplitude-current-time text-xs font-sans tracking-wide font-medium text-sky-500 dark:text-sky-300"></span>
						<span class="amplitude-duration-time text-xs font-sans tracking-wide font-medium text-gray-500"></span>
					</div>
				</div> -->
        <div
          class="h-control-panel p-10 rounded-b-xl bg-control-panel-light-background  flex items-center justify-between z-50 dark:bg-control-panel-dark-background "
        >
          <div class="opacity-0"></div>
          <button
            type="button"
            @click="togglePlay"
            class="cursor-pointer amplitude-play-pause w-24 h-24 rounded-full bg-m4 border-play-pause-light-border shadow-xl flex items-center justify-center dark:bg-play-pause-dark-background dark:border-play-pause-dark-border"
          >
            <svg
              v-if="status == 'loading'"
              class="animate-spin h-10 w-10 "
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                class="fill-white"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <svg
              v-else-if="!playing"
              id="play-icon"
              class="ml-[10px]"
              width="31"
              height="37"
              viewBox="0 0 31 37"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M29.6901 16.6608L4.00209 0.747111C2.12875 -0.476923 0.599998 0.421814 0.599998 2.75545V33.643C0.599998 35.9728 2.12747 36.8805 4.00209 35.6514L29.6901 19.7402C29.6901 19.7402 30.6043 19.0973 30.6043 18.2012C30.6043 17.3024 29.6901 16.6608 29.6901 16.6608Z"
                class="fill-white"
              />
            </svg>

            <svg
              v-else
              id="pause-icon"
              width="24"
              height="36"
              viewBox="0 0 24 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                width="6"
                height="36"
                rx="3"
                class="fill-white"
              />
              <rect
                x="18"
                width="6"
                height="36"
                rx="3"
                class="fill-white"
              />
            </svg>
          </button>
          <button
            type="button"
            @click="toggleLoop"
            :class="'cursor-pointer amplitude-repeat-song '+ (looping? 'opacity-100':'opacity-50')"
          >
            <svg
              width="26"
              height="24"
              viewBox="0 0 26 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                class="dark:fill-ternary-light fill-ternary-dark"
                d="M17.7071 15.7071C18.0976 15.3166 18.0976 14.6834 17.7071 14.2929C17.3166 13.9024 16.6834 13.9024 16.2929 14.2929L17.7071 15.7071ZM13 19L12.2929 18.2929C11.9024 18.6834 11.9024 19.3166 12.2929 19.7071L13 19ZM16.2929 23.7071C16.6834 24.0976 17.3166 24.0976 17.7071 23.7071C18.0976 23.3166 18.0976 22.6834 17.7071 22.2929L16.2929 23.7071ZM19.9359 18.7035L19.8503 17.7072L19.9359 18.7035ZM8.95082 19.9005C9.50243 19.9277 9.97163 19.5025 9.99879 18.9509C10.026 18.3993 9.6008 17.9301 9.04918 17.9029L8.95082 19.9005ZM6.06408 18.7035L5.97851 19.6998L6.06408 18.7035ZM1.07501 13.4958L0.075929 13.5387L1.07501 13.4958ZM1.07501 6.50423L0.0759292 6.46127L1.07501 6.50423ZM6.06409 1.29649L6.14965 2.29282L6.06409 1.29649ZM19.9359 1.29649L19.8503 2.29283L19.9359 1.29649ZM24.925 6.50423L23.9259 6.54718L24.925 6.50423ZM24.925 13.4958L25.9241 13.5387V13.5387L24.925 13.4958ZM16.2929 14.2929L12.2929 18.2929L13.7071 19.7071L17.7071 15.7071L16.2929 14.2929ZM12.2929 19.7071L16.2929 23.7071L17.7071 22.2929L13.7071 18.2929L12.2929 19.7071ZM19.8503 17.7072C17.5929 17.901 15.3081 18 13 18V20C15.3653 20 17.7072 19.8986 20.0215 19.6998L19.8503 17.7072ZM9.04918 17.9029C8.07792 17.8551 7.1113 17.7898 6.14964 17.7072L5.97851 19.6998C6.96438 19.7845 7.95525 19.8515 8.95082 19.9005L9.04918 17.9029ZM2.07408 13.4528C2.02486 12.3081 2 11.157 2 10H0C0 11.1856 0.0254804 12.3654 0.075929 13.5387L2.07408 13.4528ZM2 10C2 8.84302 2.02486 7.69192 2.07408 6.54718L0.0759292 6.46127C0.0254806 7.63461 0 8.81436 0 10H2ZM6.14965 2.29282C8.4071 2.09896 10.6919 2 13 2V0C10.6347 0 8.29281 0.101411 5.97853 0.30016L6.14965 2.29282ZM13 2C15.3081 2 17.5929 2.09896 19.8503 2.29283L20.0215 0.30016C17.7072 0.101411 15.3653 0 13 0V2ZM23.9259 6.54718C23.9751 7.69192 24 8.84302 24 10H26C26 8.81436 25.9745 7.63461 25.9241 6.46127L23.9259 6.54718ZM24 10C24 11.157 23.9751 12.3081 23.9259 13.4528L25.9241 13.5387C25.9745 12.3654 26 11.1856 26 10H24ZM19.8503 2.29283C22.092 2.48534 23.8293 4.29889 23.9259 6.54718L25.9241 6.46127C25.7842 3.20897 23.2653 0.578736 20.0215 0.30016L19.8503 2.29283ZM6.14964 17.7072C3.90797 17.5147 2.17075 15.7011 2.07408 13.4528L0.075929 13.5387C0.215764 16.791 2.7347 19.4213 5.97851 19.6998L6.14964 17.7072ZM2.07408 6.54718C2.17075 4.29889 3.90798 2.48534 6.14965 2.29282L5.97853 0.30016C2.73471 0.578735 0.215764 3.20897 0.0759292 6.46127L2.07408 6.54718ZM20.0215 19.6998C23.2653 19.4213 25.7842 16.791 25.9241 13.5387L23.9259 13.4528C23.8292 15.7011 22.092 17.5147 19.8503 17.7072L20.0215 19.6998Z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
    <div
      v-if="status =='error'"
      class="bg-red-100 mt-20 border border-red-400 text-red-700 px-4 py-3 rounded relative"
      role="alert"
    >
      <strong class="font-bold">Audio connection error!</strong>
      <span class="block sm:inline">Please try again later.</span>
      <span class="absolute top-0 bottom-0 right-0 px-4 py-3">
        <svg
          class="fill-current h-6 w-6 text-red-500"
          role="button"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <title>Close</title>
          <path
            d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"
          />
        </svg>
      </span>
    </div>
    <giscus />
  </div>
</template>
<script setup>
import {Howl, Howler} from 'howler';
// const {Howl, Howler} = require('howler');

const playing = useState('playing', ()=>false)
const status = useState('status', ()=>'loading')
const looping = useState('looping', ()=>false)
var sound = new Howl({
  // src: ['/sample-3s.mp3']
  src: ['soft-rain-ambient-111154.mp3'],
  src: ['audio_257112ce99.mp3']
});

// var id1 = "";
// var id1 = sound.play();
sound.once('load', function() {
  status.value="loaded"
  sound.play();
});
const togglePlay = () => {
  if(!playing.value){
    sound.play();
  }else{
    sound.pause();
  }
  // playing.value = !playing.value
}
const toggleLoop = () => {
  sound.loop(!looping.value);
  looping.value = !looping.value
}
sound.on('play', () => {
  playing.value = true
  console.log('played')
})
sound.on('pause', () => {
  playing.value = false
  console.log('paused')
})
sound.on('end', () => {
  playing.value = false
  console.log('paused')
})
sound.on('playerror', () => {
  console.log('end')
  status.value="error"
})

sound.on('playerror', () => {
  console.log('end')
  status.value="error"
})


useHead({
  title: 'Rain Sound/Noise',
  meta: [
    { hid: 'Rain Sound/Noise', name: 'Rain Sound/Noise', content: 'Ambience for focus studying or coding for work' }
  ],
  bodyAttrs: {
    class: 'test'
  },
  script: [ { src: 'https://cdnjs.cloudflare.com/ajax/libs/howler/2.2.4/howler.spatial.min.js' }]
})
</script>

<style scoped>
::before,
::after {
  --tw-content: '';
}
</style>
