<template>
  <div class="wrapper">
    <v-head></v-head>
    <!-- <v-sidebar></v-sidebar> -->
    <sidebar-nav></sidebar-nav>
    <!-- :class="classObj" -->
    <div class="content-box" :class="{hideSidebar:opened}" ref="viewBox">
      <v-tags></v-tags>
      <div class="content">
        <transition name="move" mode="out-in">
          <keep-alive :include="tagsList">
            <router-view></router-view>
          </keep-alive>
        </transition>
      </div>
      <!-- 回到顶部 -->
      <div id="goTop">
        <div class="goTop" v-show="goTopShow" @click="goTop">
          <i class="el-icon-arrow-up goTopIcon"></i>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import vHead from "./Header.vue";
import vSidebar from "./Sidebar.vue";
import sidebarNav from "./sidebarNav.vue";
import vTags from "./Tags.vue";
import bus from "./bus";

export default {
  data() {
    return {
      tagsList: [],
      collapse: false,
      scrollTop: "",
      box: null,
      goTopShow: false
    };
  },
  components: {
    vHead,
    vSidebar,
    vTags,
    sidebarNav
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar;
    },
    device() {
      return this.$store.state.app.device;
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened
      };
    },
    opened() {
      return this.$store.state.app.sidebar.opened;
    }
  },
  created() {
    bus.$on("collapse", msg => {
      this.collapse = msg;
    });
    // 只有在标签页列表里的页面才使用keep-alive，即关闭标签之后就不保存到内存中了。
    bus.$on("tags", msg => {
      let arr = [];
      for (let i = 0, len = msg.length; i < len; i++) {
        msg[i].name && arr.push(msg[i].name);
      }
      this.tagsList = arr;
    });
  },
  mounted() {
    this.box = this.$refs.viewBox;
    this.box.addEventListener("scroll", this.handleScroll, false);
  },
  destroyed() {
    this.box.removeEventListener("scroll", this.handleScroll);
  },

  methods: {
    goTop() {
      this.$refs.viewBox.scrollTop = 0;
    },
    handleScroll() {
      this.scrollTop = this.$refs.viewBox.scrollTop;
      if (this.scrollTop > 500) {
        this.goTopShow = true;
      } else {
        this.goTopShow = false;
      }
    }
  }
};
</script>
<style scoped>
.goTop {
  position: fixed;
  right: 20px;
  bottom: 50px;
  width: 50px;
  height: 50px;
  background: rgba(0, 0, 0, 0.65);
}
.goTop:hover {
  background: rgba(0, 0, 0, 0.85);
}
.goTopIcon {
  color: #d6d6d6;
  font-size: 50px;
}
</style>

