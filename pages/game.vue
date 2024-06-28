<template>
  <div>
    <h1>Welcome to Minesweeper</h1>
    <MinesweeperGame />
  </div>
</template>

<script>
import MinesweeperGame from '~/components/MinesweeperGame.vue';

export default {
  components: {
    MinesweeperGame
  }
}
</script>

<style>
/* Add any additional styles if needed */
</style>
