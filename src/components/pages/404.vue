<template lang="pug">
    div
        el-row(type="flex" justify="center")
            el-col(:span="6")
                h1 404
                p Запрашиваемая страница не найдена.
</template>

<script lang="ts">
  import { Component, Vue } from "vue-property-decorator";

  @Component
  export default class PageNotFound extends Vue {}
</script>
