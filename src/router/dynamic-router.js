
/* 需要权限判断的路由 */
const dynamicRoutes = [
    {
        path: 'dashboard',
        name: 'p-dashboard',
        component: resolve => require(['page/Dashboard.vue'], resolve),
        meta: {
            title: '工作台',
            icon: "icon-xs-zhuye",     
        }
    },
    {
        path: 'bigDatas',
        name: 'big-data',
        component: resolve => require(['page/big-data-manage/dashboard'], resolve),
        meta: {
            title: '大数据展示',
            icon: "icon-xs-dashuju",     
        }
    },
    
    {
        path: '/system',
        component: resolve => require(['page/system-manage'], resolve),
        name: 'system',
        meta: {
            title: '管理',
            icon: 'icon-xs-xitong'
        },
        children: [
            {
                path: 'organizationUnits',
                name: 'p-organizationUnits',
                component: resolve => require(['page/system-manage/organizationUnits'], resolve),
                meta: {
                    title: '组织架构单元',
                    // icon: 'icon-xs-sitemap'                  
                }
            },
            {
                path: 'roles',
                name: 'p-roles',
                component: resolve => require(['page/system-manage/roles'], resolve),
                meta: {
                    title: '角色',
                    // icon: 'icon-xs-role'                 
                }
            },
            {
                path: 'users',
                name: 'p-users',
                component: resolve => require(['page/system-manage/users'], resolve),
                meta: {
                    title: '用户',
                    // icon: 'icon-xs-users'                 
                }
            }            
        ]
    },

    {
        path: '/basicData',
        component: resolve => require(['page/data-manage'], resolve),
        name: 'basicData',
        meta: {
            title: '基础数据',
            icon: 'icon-xs-shuju'
        },
        children: [
            {
                path: 'dicData',
                name: 'p-dicData',
                component: resolve => require(['page/data-manage/dicData'], resolve),
                meta: {
                    title: '字典数据',
                    // icon: 'icon-xs-book'                 
                }
            },
            {
                path: 'Districts',
                name: 'Districts',
                component: resolve => require(['page/data-manage/Districts'], resolve),
                meta: {
                    title: '区域',
                    // icon: 'icon-xs-quyuguanli'                   
                }
            },
            {
                path: 'ReportUnit',
                name: 'ReportUnit',
                component: resolve => require(['page/data-manage/ReportUnit'], resolve),
                meta: {
                    title: '上报单位',
                    // icon: 'icon-xs-jilu'                   
                }
            }            
        ]
    },
    
    {
        path: '/device',
        component: resolve => require(['page/device-manage'], resolve),
        name: 'device',
        meta: {
            title: '设备管理',
            icon: 'icon-xs-xitong'
        },
        children: [
            {
                path: 'deviceList',
                name: 'deviceList',
                component: resolve => require(['page/device-manage/deviceList'], resolve),
                meta: {
                    title: '设备列表',
                }
            },
            
        ]
    },
    {
        path: '/area',
        component: resolve => require(['page/area-manage'], resolve),
        name: 'area',
        meta: {
            title: '区域管理',
            icon: 'icon-xs-quyuguanli'
        },
        children: [
            {
                path: 'areaList',
                name: 'areaList',
                component: resolve => require(['page/area-manage/areaList'], resolve),
                meta: {
                    title: '区域列表',
                }
            },
            
        ]
    },
    {
        path: '/MonitoredPerson',
        component: resolve => require(['page/monitored-person-manage'], resolve),
        name: 'MonitoredPerson',
        meta: {
            title: '监管人员管理',
            icon: 'icon-xs-peoples'
        },
        children: [
            {
                path: 'MonitoredPersonList',
                name: 'MonitoredPersonList',
                component: resolve => require(['page/monitored-person-manage/MonitoredPersonList'], resolve),
                meta: {
                    title: '人员列表',
                }
            },
            
        ]
    },
    {
        path: 'FeedBack',
        name: 'FeedBack',
        component: resolve => require(['page/FeedBack-manage/FeedBack'], resolve),
        meta: {
            title: '意见反馈',
            icon: "icon-xs-xiaolian",     
        }
    },

   
]

export default dynamicRoutes
