import Vue from 'vue'
const has = Vue.directive('has', {
    // inserted：被绑定元素插入父节点时调用。
    inserted: function (el, binding, vnode) {
        // 获取页面按钮权限
        let btnPermission = binding.value;//el元素绑定的权限名称    
        let permissionList = localStorage.getItem("Permission-List");
        if (permissionList) {
            let btnPermissionsArr = permissionList.split(","); //后台返回的权限列表
            let isExist = false;
            //  遍历权限列表，查看该btn权限是否存在于权限列表中
            btnPermissionsArr.forEach(e => {
                if (e == btnPermission) {
                    isExist = true;
                }
            });
            //    此btn权限不存在于列表中，删除el
            if (el.parentNode !== null && !isExist) {
                el.parentNode.removeChild(el);
            }
        }

    }
});

export { has }