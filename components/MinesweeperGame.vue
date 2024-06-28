<template>
  <div class="game-container">
    <iframe
      ref="gameFrame"
      width="800"
      height="600"
      frameborder="0"
      allowfullscreen="true"
      src="https://labs.phaser.io/mobile.html?src=src\games\minesweeper\minesweeper.js"
    ></iframe>
  </div>
</template>
<style scoped>
.game-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
iframe {
  width: 100%;
  height: 100%;
}
</style>
