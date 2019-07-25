<template>
  <div>
       
        <router-view></router-view>

  </div>
</template>

<script>
  import TablesOne from './TablesOne.vue'
  import Tables from './Tables.vue'
  export default {
    name: 'TablesMain',
    components: {
      TablesOne,
      Tables
    },
    methods: {

    }
  }

</script>
<style scoped>
  
</style>
