<template>
  <div id="app">
    <my-upload field="/img"
               :width="200"
               :height="200"
               url="http://quickcq.com:8008/api/attachFile/uploadFile"
               :params="params"
               :headers="headers"
               lang-type="en"
               :value.sync="show"
               img-format="png" @input="close"></my-upload>
    <div style="margin-bottom: 15px">
        <a class="btn" @click="toggleShow">set avatar</a>
    </div>
    <img :src="imgDataUrl">
  </div>
</template>

<script>
/* eslint-disable */
import 'babel-polyfill' // es6 shim
import Vue from 'vue'
import myUpload from 'vue-image-crop-upload/upload-2.vue'
export default {
  name: 'HelloWorld',
  data () {
    return {
      show:false,
      params: {
        token: '123456798',
        name: 'avatar'
      },
      headers: {
        smail: '*_~'
      },
      imgDataUrl: '../../static/image/1.jpg'
    }
  },
  components: {
    'my-upload': myUpload
  },
  methods: {
    toggleShow () {
      this.show = !this.show
    },
    close (){
      this.show = false
    }
  },
//  events: {
//    /**
//     * crop success
//     *
//     * [param] imgDataUrl
//     * [param] field
//     */
//    cropSuccess(imgDataUrl, field){
//      console.log('-------- crop success --------');
//      this.imgDataUrl = imgDataUrl;
//    },
//    /**
//     * upload success
//     *
//     * [param] jsonData   server api return data, already json encode
//     * [param] field
//     */
//    cropUploadSuccess(jsonData, field){
//      console.log('-------- upload success --------');
//      console.log(jsonData);
//      console.log('field: ' + field);
//    },
//    /**
//     * upload fail
//     *
//     * [param] status    server api return error status, like 500
//     * [param] field
//     */
//    cropUploadFail(status, field){
//      console.log('-------- upload fail --------');
//      console.log(status);
//      console.log('field: ' + field);
//    }
//  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
