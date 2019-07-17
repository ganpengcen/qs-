
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
            {
                path: 'AreaAdmin',
                name: 'AreaAdmin',
                component: resolve => require(['page/area-manage/AreaAdmin'], resolve),
                meta: {
                    title: '区域管理员',
                }
            },
            
        ]
    },
    {
        path: '/MonitoredPerson',
        component: resolve => require(['page/monitored-person-manage'], resolve),
        name: 'MonitoredPerson',
        meta: {
            title: '人员管理',
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
            {
                path: 'location',
                name: 'location',
                component: resolve => require(['page/monitored-person-manage/location'], resolve),
                meta: {
                    title: '人员定位',
                }
            },
            {
                path: 'gpsTracking',
                name: 'gpsTracking',
                component: resolve => require(['page/monitored-person-manage/gpsTracking'], resolve),
                meta: {
                    title: '行为轨迹',
                }
            },
            
        ]
    },
    {
        path: '/business',
        component: resolve => require(['page/business-manage'], resolve),
        name: 'business',
        meta: {
            title: '业务管理',
            icon: 'icon-xs-taiyang'
        },
        children: [
            {
                path: 'alarm',
                name: 'alarm',
                component: resolve => require(['page/business-manage/alarm'], resolve),
                meta: {
                    title: '警报',
                }
            },
            {
                path: 'leave',
                name: 'leave',
                component: resolve => require(['page/business-manage/leave'], resolve),
                meta: {
                    title: '请假管理',
                }
            },
            {
                path: 'InterviewRecord',
                name: 'InterviewRecord',
                component: resolve => require(['page/business-manage/InterviewRecord'], resolve),
                meta: {
                    title: '面谈记录',
                }
            },
            {
                path: 'StudyRecord',
                name: 'xyStudyRecord',
                component: resolve => require(['page/business-manage/StudyRecord'], resolve),
                meta: {
                    title: '教育学习',
                }
            },
            {
                path: 'ServiceRecord',
                name: 'xyServiceRecord',
                component: resolve => require(['page/business-manage/ServiceRecord'], resolve),
                meta: {
                    title: '社区服务',
                }
            },
            
        ]
    },
    {
        path: '/geoFence',
        component: resolve => require(['page/geoFence-manage'], resolve),
        name: 'geoFence',
        meta: {
            title: '地理围栏管理',
            icon: 'icon-xs-liebiao'
        },
        children: [
            {
                path: 'fencing',
                name: 'fencing',
                component: resolve => require(['page/geoFence-manage/fencing'], resolve),
                meta: {
                    title: '创建围栏',
                }
            },
            {
                path: 'listItem',
                name: 'listItem',
                component: resolve => require(['page/geoFence-manage/list-item'], resolve),
                meta: {
                    title: '围栏列表',
                }
            },
            
        ]
    }

   
]

export default dynamicRoutes
