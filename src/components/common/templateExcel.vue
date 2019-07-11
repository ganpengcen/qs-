<template>
  <el-button type="primary" plain icon="el-icon-document" @click="handleDownload()">{{source}}</el-button>
</template>
<script>
import { Post, PostBlob } from "@/api/api";

export default {
  name: "templateExcel",
  data() {
    return {
    };
  },
  props: {
    form: {
      type: Object,
      required: true
    },
    source: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    }
  },
  mounted() {},
  methods: {
    async handleDownload() {
      try {
        const res = await PostBlob(this.url,this.form);
        var blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }); //xlsx类型
        var downloadElement = document.createElement("a");
        var href = window.URL.createObjectURL(blob); //创建下载的链接
        downloadElement.href = href;
        downloadElement.download = '模板'; //下载后文件名
        document.body.appendChild(downloadElement);
        downloadElement.click(); //点击下载
        document.body.removeChild(downloadElement); //下载完成移除元素
        window.URL.revokeObjectURL(href); //释放掉blob对象
      } catch (e) {
        console.log(e);
      }
    }
  }
};
</script>
<style scoped>
</style>
