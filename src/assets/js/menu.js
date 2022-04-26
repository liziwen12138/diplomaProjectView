import Layout from "@/layout/index.vue";
import router from "../../router";
import store from "../../store";
import axios from "axios";
import Vue from "vue";

export function generaMenu() {
  // 查询用户菜单
  axios.get("/api/user/menus").then(({ data }) => {
    if (data.flag) {
      console.log(data.data);
      var userMenuList = data.data;
      //对于返回的json数据进行数据处理， 使其符合动态路由的添加规则
      userMenuList.forEach(item => {
        console.log(item);
        if (item.icon != null) {
          item.icon = "iconfont " + item.icon;
        }
        if (item.component == "Layout") {
          item.component = Layout;
        }
        if (item.children && item.children.length > 0) {
          item.children.forEach(route => {
            route.icon = "iconfont " + route.icon;
            route.component = loadView(route.component);
          });
        }
      });
      // 添加侧边栏菜单
      store.commit("saveUserMenuList", userMenuList);
      // 添加菜单到路由
      // 下atest是测试动态路由添加的规则
      // let Atest = [
      //     { path:"/",redirect:"/user"},
      //     {path: "/user", component: Layout }
      // ];
      router.addRoutes(userMenuList); //bug, 在于如果直接用/admin/menus, 由于返回给前端的json数组构成的userMenuList并不符合addRoutes的路由数组规则，所以会发生stringId异常，导致页面加载失败
    } else {
      Vue.prototype.$message.error(data.message);
      router.push({ path: "/login" });
    }
  });
}

export const loadView = view => {
  // 路由懒加载
  return resolve => require([`@/views${view}`], resolve);
};
