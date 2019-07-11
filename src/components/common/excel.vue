<template>
  <el-button type="primary" plain icon="el-icon-document" @click="handleDownload()">{{source}}</el-button>
</template>
<script>
import { Post, PostBlob } from "@/api/api";

export default {
  name: "excel",
  data() {
    return {
      res: null,
      excelForm: {},
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
        this.res = await Post(this.url, this.form);
        if (this.res.success) {
          this.excelForm = this.res.result;
          this.downloadTempExcel(this.excelForm);
        }
      } catch (e) {
        console.log(e);
      }
    },
    async downloadTempExcel(data) {
      let url = "/api/file/download";
      try {
        const res = await PostBlob(url, data);
        var blob = new Blob([res], { type: data.fileType }); //xlsx类型
        var downloadElement = document.createElement("a");
        var href = window.URL.createObjectURL(blob); //创建下载的链接
        downloadElement.href = href;
        downloadElement.download = data.fileName; //下载后文件名
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
