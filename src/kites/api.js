export default {
	tokens: '/token',//认证
	//--------------------------------大数据------------------------------
	GetDashboardStatisticCount: '/api/services/app/dashboard/GetDashboardStatisticCount',//机构、案件统计
	LegalAidSummary: '/api/services/app/dashboard/LegalAidSummary',//法律援助类型统计
	GetAreaMonitedPersonSummary: '/api/services/app/dashboard/GetAreaMonitedPersonSummary',//社区矫正人数统计
	GetWeekCaseSummary: '/api/services/app/dashboard/GetWeekCaseSummary',//本周案件统计
	PeopleMediationSummary: '/api/services/app/dashboard/PeopleMediationSummary',//人民调解分类统计
	GetTopMostChatGroups: '/api/services/app/dashboard/GetTopMostChatGroups',//群发言总排行数
	GetTopMostChatGroupMembers: '/api/services/app/dashboard/GetTopMostChatGroupMembers',//用户发言排行
	GetDistrictSummary: '/api/services/app/dashboard/GetDistrictSummary',//街道案件统计
	GetInfoCaseSummaryGroupByArea: '/api/services/app/dashboard/GetInfoCaseSummaryGroupByArea',//根据区域统计上报信息
	GetDetailSummary: '/api/services/app/dashboard/GetDetailSummary',//获取案件统计详情
	GetDashboardSummary: '/api/services/app/dashboard/GetDashboardSummary',//获取工作台统计信息
	GetServiceAgencies: '/api/services/app/frontWeb/GetServiceAgencies',//获取公共服务机构
	GetServiceAgencyMembers: '/api/services/app/frontWeb/GetServiceAgencyMembers',//获取机构成员
	OnlineQuestionNowTop5: '/api/services/app/dashboard/OnlineQuestionNowTop5',//实施问题咨询top5
	PublicServiceQuestionSummary: '/api/services/app/dashboard/PublicServiceQuestionSummary',//公共服务机构问题统计
	OnlineQuestionSummary: '/api/services/app/dashboard/OnlineQuestionSummary',//在线咨询分类统计
	LawyerAnswerRank: '/api/services/app/dashboard/LawyerAnswerRank',//在线律师回复排行
	OnlineQuestionSexSummary: '/api/services/app/dashboard/OnlineQuestionSexSummary',//性别
	OnlineQuestionAgeSummary: '/api/services/app/dashboard/OnlineQuestionAgeSummary',//年龄
	GetXyGenderSummary: '/api/services/app/dashboard/GetXyGenderSummary',//监管人员性别
	GetXyTypeSummary: '/api/services/app/dashboard/GetXyTypeSummary',//社区矫正类型统计
	GetXyDateRangeSummary: '/api/services/app/dashboard/GetXyDateRangeSummary',//监管周期统计
	GetXyStatisticsSummary: '/api/services/app/dashboard/GetXyStatisticsSummary',//社区矫正统计概况
	GetXyFinishedReporting: '/api/services/app/dashboard/GetXyFinishedReporting',//教育学习社区服务完成情况
	GetOnlineQuestionHotWord: '/api/services/app/dashboard/GetOnlineQuestionHotWord',//在线法律咨询热词
	OnlineLawyerNowSummary: '/api/services/app/dashboard/OnlineLawyerNowSummary',//当前活跃律师
	OnlineQuestionYearMonthTotalSummary: '/api/services/app/dashboard/OnlineQuestionYearMonthTotalSummary',//在线法律咨询总量分析

	//---------------------------excel--------------------------------------
	GetDayReportingToExcel:'/api/services/app/infoCase/GetDayReportingToExcel',
	GetWeekReportingToExcel:'/api/services/app/infoCase/GetWeekReportingToExcel',
	GetMonthReportingToExcel:'/api/services/app/infoCase/GetMonthReportingToExcel',
	GetUsersToExcel:'/api/services/app/user/GetUsersToExcel',
	GetMonitedPersonToExcel:'/api/services/app/xiangYangMonitedPerson/GetMonitedPersonToExcel',
	GetStudyRecordToExcel:'/api/services/app/studyRecord/GetStudyRecordToExcel',
	GetServiceRecordToExcel:'/api/services/app/serviceRecord/GetServiceRecordToExcel',
	GetVisitRecordToExcel:'/api/services/app/visitRecord/GetVisitRecordToExcel',
	GetReportingToExcel:'/api/services/app/xyReporting/GetReportingToExcel',
	GetReportingAnaliticsToExcel:'/api/services/app/xyReporting/GetReportingAnaliticsToExcel',
	GetReportingDetailsAnaliticsToExcel:'/api/services/app/xyReporting/GetReportingDetailsAnaliticsToExcel',
	GetInvitationCodeToExcel:'/api/services/app/weChat/GetInvitationCodeToExcel',
	SummaryQuizTimeQuestionForExcel:'/api/services/app/quiz/SummaryQuizTimeQuestionForExcel',
	SummaryQuizQuestionForExcel:'/api/services/app/quiz/SummaryQuizQuestionForExcel',
	GetLawRecordsToExcel:'/api/services/app/lawRecord/GetLawRecordsToExcel',


	//---------------------------系统--------------------------------------
	// 组织架构
	GetOrganizationUnitTree: '/api/services/app/organizationUnit/GetOrganizationUnitTree',//获取组织架构树
	GetOrganizationUnitUsers: '/api/services/app/organizationUnit/GetOrganizationUnitUsers',//获取组织下成员
	CreateOrganizationUnit: '/api/services/app/organizationUnit/CreateOrganizationUnit',//添加组织架构
	UpdateOrganizationUnit: '/api/services/app/organizationUnit/UpdateOrganizationUnit',//修改组织架构
	GetUsersType: '/api/services/app/user/GetUsersType',//用户类别
	//---------------------------用户--------------------------------------
	GetUserRoleList: '/api/services/app/user/GetUserRoleList',//获取权限列表
	
	//---------------------------字典数据--------------------------------------
	GetDicTypes:'/api/dicData/types',
	GetDicList:'/api/dicData/list',
	DicData:'/api/dicData/',
	CreateDicData:'/api/dicData',
	//----------------------------frontWeb-----------------------------------
	GetSelectionDatasByType: '/api/services/app/frontWeb/GetSelectionDatasByType',//获取下拉列表数据
	GetDistricts: '/api/services/app/frontWeb/GetDistricts',//获取区域列表

	//----------------------------设备管理-----------------------------------
	GetDeviceList:'/api/device/list',//获取设备列表
	CreateDevice:'/api/device',
	Device:'/api/device/',
	GetDevice:'/api/device/list/',
	ActiveDevice:'/api/device/active/',

	//----------------------------区域管理-----------------------------------
	GetAreaList:'/api/area/list',
	GetAllArea:'/api/area/all',
	CreateArea:'/api/area',
	Area:'/api/area/',
	
	//----------------------------区域管理员---------------------------------
	GetAreaAdminList:'/api/areaAdmin/list',
	CreateAreaAdmin:'/api/areaAdmin',
	AreaAdmin:'/api/areaAdmin/',

	//----------------------------围栏管理-----------------------------------
	GetFenceList:'/api/fence/list',
	CreateFence:'/api/fence',
	Fence:'/api/fence/',

	//----------------------------轨迹-----------------------------------
	TrackingLine:'/api/tracking/line',
	TrackingTime:'/api/tracking/time',

	//----------------------------监管人员管理-----------------------------------
	GetPersonList:'/api/person/list',
	GetPersonByArea:'/api/person/area/',
	CreatePerson:'/api/person',
	Person:'/api/person/',
	BindDevice:'/api/person/bind',
	Unbind:'/api/person/unbind/',
	GetTalkList:'/api/talk/list',
	CreateTalk:'/api/talk',
	GetTalkForEdit:'/api/talk/edit/',
	Talk:'/api/talk/',
	ExecutionTalk:'/api/talk/execution/',
	//----------------------------业务管理-----------------------------------
	// 报警
	GetAlarmList:'/api/alarm/list',
	Alarm:'/api/alarm/',
	AlarmProcess:'/api/alarm/process/',
	// 学习
	GetStudyRecordList:'/api/studyRecord/list',
	StudyRecord:'/api/studyRecord/',
	
    // 服务
	GetServiceRecordList:'/api/serviceRecord/list',
	ServiceRecord:'/api/serviceRecord/'

}