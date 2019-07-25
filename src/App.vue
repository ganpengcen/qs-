<template>
    <div id="app">
       
        <router-view></router-view>
        
    </div>
</template>
<style>
    @import "../static/css/main.css";
    @import "../static/css/color-dark.css";    /* 深色主题*/
    /* @import "../static/css/theme-green/color-green.css";  浅绿色主题*/
   
   /* 滚动条样式 */
  .common_content ::-webkit-scrollbar {
    width: 4px;
    height: 4px;
    background-color: #fff;
  }

  .common_content ::-webkit-scrollbar-thumb {
    border-radius: 5px;
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, .2);
    background-color: #57c2eb
  }
</style>
