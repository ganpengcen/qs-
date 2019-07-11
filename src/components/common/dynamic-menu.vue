<template>
  <div>
    <template v-for="v in menuList">
      <!-- 含二级一级 -->
      <el-submenu :index="v.name" v-if="v.children&&v.children.length>0" :key="v.name">
        <template slot="title">
          <i :class="v.meta.icon"></i>
          <span :class="{'slide-tit':sidebar.opened}" slot="title">{{ v.meta.title }}</span>
        </template>
        <el-menu-item-group>
          <!-- 二级子 -->
          <my-nav :menuList="v.children"></my-nav>
        </el-menu-item-group>
      </el-submenu>
      <!-- 不含二级一级 -->
      <el-menu-item :key="v.name" :index="v.name" @click="gotoRoute(v.name)" v-else>
        <i :class="v.meta.icon"></i>
        <span slot="title">{{v.meta.title}}</span>
      </el-menu-item>
    </template>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import router from "../../router";
export default {
  name: "my-nav",
  props: {
    menuList: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  computed: {
    ...mapGetters(["sidebar"])
  },
  methods: {
    gotoRoute(name) {
      if (name == "big-data") {
      //  window.location.href = "http://121.41.73.6:808/"
      this.$router.push('/bigData')
      }  else {
        router.push({ name });
      }               
    }
  }
};
</script>
<style>
.slide-tit {
  display: none;
}
</style>




