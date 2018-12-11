import Vue from 'vue';
import Router from 'vue-router';
import Chat from '@/views/Chat';
import selectLanguage from '@/views/selectLanguage';
import illegal from '@/views/illegal';

Vue.use(Router)
var router=new Router({
  routes: [
    {
      path: '/:id',
      name: 'selectLanguage',
      component: selectLanguage,
    },
    {
      path: '/home/Chat',
      name: 'Chat',
      component: Chat
    },
    {
      path: '/home/All',
      name: 'Chat',
      component: Chat
    },
    {
      path: '/home/illegal',
      name: 'illegal',
      component: illegal,
    },
  ]
});
export default router;
