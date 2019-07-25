<template>
    <div class="nav-header">
        <div class="item item1">
            <div class="lBorder" style="margin-right:20px" @click="$router.push({path:'/bigData/TablesOne'})">
                <span class="border row1"></span>
                <span class="border row2"></span>
                <span class="border col1"></span>
                <span class="border col2"></span>
                <p :class="{active: hash.indexOf('bigData/TablesOne') > -1}">社区矫正</p>
            </div>
            <div class="lBorder" @click="$router.push({path:'/Onlinelearning'})">
                <span class="border row1"></span>
                <span class="border row2"></span>
                <span class="border col1"></span>
                <span class="border col2"></span>
                <p :class="{active: hash.indexOf('/Onlinelearning') > -1 || hash.indexOf('Learningtime') > -1}">教育学习</p>
            </div>
        </div>
        <div class="item item2">
            <div class="mborder">
                <p>司法矫正人员管理平台</p>
            </div>
        </div>
        <div class="item item3">
            <div @click="fullScreen" v-show="!this.fullScreenState" class="btn_full">全屏</div>
            <div @click="exitScreen" v-show="this.fullScreenState" class="btn_full">退出</div>
            <div class="px23" style="display: flex; align-items: center;">
                <svg t="1561786850376" class="icon" viewBox="0 0 1024 1024" version="1.1"
                    xmlns="http://www.w3.org/2000/svg" p-id="3695" width="3.333rem" height="3.333rem">
                    <path
                        d="M281.583167 161.025417c3.1569 7.773034 10.643408 12.485359 18.545378 12.485359 2.5071 0 5.057179-0.473791 7.522324-1.475608 10.239202-4.157693 15.167444-15.829524 11.009751-26.067702l-26.532283-65.327868c-4.158716-10.240225-15.83157-15.167444-26.067702-11.009751-10.239202 4.157693-15.167444 15.829524-11.009751 26.067702L281.583167 161.025417z"
                        p-id="3696" fill="#ffffff"></path>
                    <path
                        d="M78.55103 290.170752l64.954361 27.431769c2.541893 1.073448 5.179976 1.582031 7.776104 1.582031 7.801686 0 15.21554-4.590552 18.441001-12.229532 4.299933-10.17985-0.467651-21.918195-10.647501-26.217105l-64.954361-27.431769c-10.17985-4.298909-21.919219 0.466628-26.217105 10.647501C63.603597 274.134521 68.37118 285.871843 78.55103 290.170752z"
                        p-id="3697" fill="#ffffff"></path>
                    <path
                        d="M157.393703 524.045337c10.239202-4.157693 15.167444-15.827477 11.009751-26.066679-4.158716-10.239202-15.829524-15.172561-26.067702-11.008728L77.007885 513.502213c-10.239202 4.157693-15.167444 15.827477-11.009751 26.066679 3.1569 7.773034 10.643408 12.486382 18.545378 12.486382 2.5071 0 5.056156-0.474814 7.522324-1.477654L157.393703 524.045337z"
                        p-id="3698" fill="#ffffff"></path>
                    <path
                        d="M651.359978 321.847196c2.5071 0 5.056156-0.473791 7.522324-1.475608l63.406099-25.7515c10.239202-4.157693 15.167444-15.829524 11.009751-26.067702-4.157693-10.240225-15.829524-15.167444-26.067702-11.009751l-63.406099 25.7515c-10.239202 4.157693-15.167444 15.829524-11.009751 26.067702C635.971499 317.134871 643.458007 321.847196 651.359978 321.847196z"
                        p-id="3699" fill="#ffffff"></path>
                    <path
                        d="M496.752738 174.136016c2.541893 1.073448 5.179976 1.582031 7.776104 1.582031 7.801686 0 15.21554-4.590552 18.441001-12.229532l27.432793-64.955384c4.299933-10.17985-0.466628-21.918195-10.647501-26.217105-10.18292-4.298909-21.919219 0.466628-26.217105 10.647501l-27.432793 64.955384C481.805304 158.098761 486.572888 169.837106 496.752738 174.136016z"
                        p-id="3700" fill="#ffffff"></path>
                    <path
                        d="M916.674623 693.742251c-23.938202-24.434505-54.67525-40.053228-88.025822-45.029566-7.003508-122.552174-106.647949-220.695425-229.836619-225.421053 0.496304-5.762237 0.76134-11.552104 0.76134-17.34504 0-110.179378-89.63753-199.815885-199.816908-199.815885s-199.815885 89.636506-199.815885 199.815885c0 56.262398 22.967084 108.316961 62.911842 145.645125-33.985022 18.200524-57.157791 54.05922-57.157791 95.231945 0 1.676176 0.038886 3.355421 0.118704 5.031597-66.419735 18.162662-114.362654 79.391165-114.362654 149.851936 0 85.653799 69.745481 155.338904 155.475004 155.338904l559.184649 0c40.85243 0 79.537498-16.07921 108.927875-45.278229 29.590945-29.39754 45.889143-68.352761 45.889143-109.687168C960.928522 761.346975 945.212586 722.872708 916.674623 693.742251zM239.959164 405.945569c0-88.112804 71.685669-159.797449 159.797449-159.797449 88.113827 0 159.798473 71.685669 159.798473 159.797449 0 6.4192-0.394996 12.830213-1.152243 19.176758-79.591733 10.394744-148.917658 60.171428-184.14088 132.332934-17.669428-12.011568-38.671765-18.584264-60.618613-18.584264-0.850367 0-1.696642 0.01228-2.541893 0.032746C266.426979 509.139859 239.959164 459.962833 239.959164 405.945569zM886.835014 883.378286c-21.841447 21.699208-50.510394 33.649378-80.723509 33.649378L246.926856 917.027663c-63.662949 0-115.456568-51.732222-115.456568-115.320469 0-57.346079 42.756803-106.451474 99.455129-114.224508 5.609765-0.76748 10.631128-3.87833 13.818727-8.558933 3.187599-4.679579 4.242627-10.490935 2.905166-15.993253-1.284249-5.279237-1.935072-10.69969-1.935072-16.10684 0-34.076096 25.218358-62.36335 57.969273-67.197448 1.010003 0.155543 2.025123 0.2415 3.036149 0.2415 2.081405 0 4.146437-0.327458 6.119371-0.958838 0.26913-0.00307 0.535189-0.020466 0.805342-0.020466 20.523429 0 39.736003 9.135054 52.710502 25.063839 4.588505 5.633301 11.875468 8.337899 19.026332 7.061836 7.154957-1.276063 13.054317-6.329149 15.413038-13.202697 27.64871-80.566944 103.490026-134.698818 188.720176-134.698818 110.010533 0 199.509916 89.456405 199.509916 199.409632 0 0.838088 0.019443 1.656733 0.040932 2.472308 0.013303 0.545422 0.034792 1.088798 0.023536 1.647523-0.224104 10.997472 8.470929 20.114107 19.465331 20.409842 30.166043 0.812505 58.411341 13.135158 79.533404 34.697243 21.166065 21.605064 32.82357 50.133817 32.82357 80.332606C920.91111 832.67551 908.809491 861.548094 886.835014 883.378286z"
                        p-id="3701" fill="#ffffff"></path>
                </svg>
                <span class="px42">多云</span>
            </div>
            <div style="text-align: right;font-size: 1.833rem;margin-left: 3.333rem">
                <p>星期三</p>
                <p>2019.02.30</p>
            </div>
        </div>
    </div>
</template>

<script>
    import {
        mapState
    } from 'vuex'
    export default {
        data() {
            return {
                hash: location.hash
            }
        },
        methods: {
            fullScreen() {
                let el = document.querySelector('.common_content')
                var rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el
                    .msRequestFullscreen;
                if (typeof rfs != "undefined" && rfs) {
                    rfs.call(el)
                }
                // 获取全屏元素
                setTimeout(() => {
                    let fullEl = document.fullscreenElement ||
                        document.msFullscreenElement ||
                        document.mozFullScreenElement ||
                        document.webkitFullscreenElement || false;
                }, 1000)
                this.$store.commit('changeFull', true)
            },
            exitScreen() {
                document.exitFullscreen()
                this.$store.commit('changeFull', false)
                this.$router.push('/dashboard')
            }
        },
        computed: {
            fullScreenState(){
                return this.$store.state.app.fullScreenState;
            },
        },
        mounted() {
        },
        created() {
            this.$nextTick(() => {
                if (this.fullScreenState) {
                    setTimeout(() => {
                        this.fullScreen()
                    }, 100)
                }
            })
        },
        beforeDestroy() {}
    }

</script>

<style scoped>  
    .active {
        color: #57c2eb;
    }

    .btn_full {
        margin-right: 10px;
        font-size: 20px;
        cursor: pointer;
    }

    .btn_full:hover {
        color: #57c2eb;
    }

    .nav-header {
        height: 70px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        
    }

    .nav-header .item {
        height: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }

    .nav-header .item1 {
        padding: 0 20px;
        box-sizing: border-box;
    }

    .px42 {
        font-size: 22px;
        vertical-align: bottom;
        display: inline-block;
        margin-left: 10px;
    }

    .nav-header .item3 {
        padding: 0 30px;
        color: #fff;
    }

    .mborder {
        text-align: center;
        background: url(/static/img/dashboard/Path.png) center;
        background-size: 100% 100%;
        width: 100%;
        /* height: 7rem; */
        line-height: 5rem;
        padding: 0 4.1667rem;
    }
    .lBorder {
        position: relative;
        width: 8.3333rem;
        border: 1px solid #57c2eb;
        text-align: center;
        line-height: 2.5rem;
        color: white;
        font-size: 1.5rem;
        margin-right: 0.8333rem;
        padding: 3px 5px;
        cursor: pointer;
        margin-top: 0.8333rem;
    }

    .border {
        position: absolute;
        padding: 5px;
        border-style: solid;
        border-color: #57c2eb;
    }

    .row1 {
        border-width: 5px 0 0 5px;
        top: -5px;
        left: -5px;
    }

    .row2 {
        border-width: 5px 5px 0 0;
        top: -5px;
        right: -5px;
    }

    .col1 {
        border-width: 0 0 5px 5px;
        bottom: -5px;
        left: -5px;
    }

    .col2 {
        border-width: 0 5px 5px 0;
        bottom: -5px;
        right: -5px;
    }

    .mborder>p {
        font-size: 2.667rem;
        margin: 0 0;
        color: white;
        white-space: nowrap;
    }

</style>
