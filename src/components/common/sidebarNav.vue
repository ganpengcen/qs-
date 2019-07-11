<template>
    <div class="sidebar" :class="{hideIcon:opened}">
        <el-menu  class="sidebar-el-menu" :default-active="currentMenu" :collapse="opened"  background-color="#0f3462" text-color="#fff" active-text-color="#20a0ff" unique-opened>
            <DynamicMenu :menuList="sidebarMenu" ></DynamicMenu>
        </el-menu>
    </div>
</template>

<script>
import bus from "../common/bus";
import DynamicMenu from "./dynamic-menu";
import { mapState } from "vuex";

export default {
  data() {
    return {
     
    };
  },
  computed: {
    //  ...mapState(['opend']),
    // ...mapState(['permissionList', 'sidebarMenu', 'currentMenu']),
    opened(){
      return this.$store.state.app.sidebar.opened;
    },
    sidebarMenu() {
      return this.$store.state.user.sidebarMenu;
    },
    currentMenu() {
      return this.$store.state.user.currentMenu;
    }

  },
  methods: {},
  components: {
    DynamicMenu
  },
  created() {
    // 通过 Event Bus 进行组件间通信，来折叠侧边栏
    // bus.$on("collapse", msg => {
    // this.collapse = msg;
    // });
  }
};
</script>
<style scoped>
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 70px;
  bottom: 0;
  overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
  width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
  width: 200px;
}
.sidebar > ul {
  height: 100%;
}


</style>
