<template>
  <div>
      <div>
        <p><strong class="title">{{title}}</strong></p>
      </div>

      <div class="legend">
        <div
          v-for="{text, colour} in entries"
          class="legend-entry"
          :class="{'selected': selected_entry === text}"
          @click="select(text)"
        >

          <div class="legend-colour" :style="{'background-color': colour, 'border': colour === '#fff' ? '1px solid #e8e8e8': 'none'}"></div>
          <div class="legend-name">{{text}}</div>
        </div>
      </div>
  </div>
</template>

<script>
export default {
  props: ['entries', 'selected_entry', 'title'],
  name: 'legend',
  methods: {
    select(text) {
      this.$emit('select', text)
    }
  }
};
</script>

<style scoped>
  .selected {
    background-color: rgba(165, 165, 165, 0.3);
  }

  .title {
    padding-right: 10px;
  }

  .legend {
    display: flex;
    width: 100%;
  }

  .legend-entry {
    flex-grow: 1;
    flex: 1;
    flex-direction: column;
    flex-basis: 33%;
    cursor: pointer;
    display: inline-block;
    border-radius: 2px;
  }

  .legend-colour {
    flex: 1;
    width: 100%;
    height: 15px;

  }

  .legend-name {
    flex: 1;
    text-align: right;
    border-right: 1px solid #dedcdc;
    padding-right: 2px;
  }
</style>
