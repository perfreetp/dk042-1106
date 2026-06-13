export default defineAppConfig({
  pages: [
    'pages/inbox/index',
    'pages/matching/index',
    'pages/growth/index',
    'pages/mine/index',
    'pages/publish/index',
    'pages/detail/index',
    'pages/respond/index',
    'pages/actions/index',
    'pages/rules/index',
    'pages/settings/index',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#FFFFFF',
    navigationBarTitleText: '烦恼交换',
    navigationBarTextStyle: 'black',
    backgroundColor: '#F7F5FF',
  },
  tabBar: {
    color: '#9D9AB8',
    selectedColor: '#7C6BF0',
    backgroundColor: '#FFFFFF',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/inbox/index',
        text: '收件箱',
      },
      {
        pagePath: 'pages/matching/index',
        text: '匹配池',
      },
      {
        pagePath: 'pages/growth/index',
        text: '成长',
      },
      {
        pagePath: 'pages/mine/index',
        text: '我的',
      },
    ],
  },
});
