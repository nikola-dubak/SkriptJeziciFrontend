import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home.vue'
import Register from '@/views/Register.vue'
import Login from "@/views/Login.vue";
import CreateProfile from "@/views/CreateProfile.vue";
import Profile from "@/views/Profile.vue";
import Group from "@/views/Group.vue";
import PostPage from "@/views/PostPage.vue";
import MyGroups from "@/views/MyGroups.vue";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/create-profile',
    name: 'CreateProfile',
    component: CreateProfile
  },
  {
    path: '/profiles/:id',
    name: 'Profile',
    component: Profile
  },
  {
    path: '/groups/:id',
    name: 'Group',
    component: Group
  },
  {
    path: '/posts/:id',
    name: 'PostPage',
    component: PostPage
  },
  {
    path: '/groups',
    name: 'MyGroups',
    component: MyGroups
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
