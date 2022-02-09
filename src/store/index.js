import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: null,
    profiles: [],
    posts: [],
    feed: null,
    groups: [],
    follows: null,
    joinedGroupIds: null,
    joinedGroups: null,
    likedPostIds: []
  },

  mutations: {
    setToken(state, token) {
      state.token = token;
      localStorage.token = token;
    },

    removeToken(state) {
      state.token = null;
      localStorage.removeItem("token");
      state.feed = null;
      state.follows = null;
      state.joinedGroupIds = null;
    },

    addProfile(state, profile) {
      state.profiles.push(profile);
    },

    addPost(state, post) {
      state.posts.push(post);
    },

    setFeed(state, feed) {
      state.feed = feed;
    },

    addToFeed(state, post) {
      state.feed.unshift(post);
    },

    addGroup(state, group) {
      state.groups.push(group);
    },

    joinGroup(state, groupId) {
      state.joinedGroupIds.push(groupId);
    },

    leaveGroup(state, groupId) {
      state.joinedGroupIds = state.joinedGroupIds.filter(joinedGroupId => joinedGroupId != groupId);
    },

    setFollows(state, follows) {
      state.follows = follows;
    },

    addFollow(state, follow) {
      state.follows.push(follow);
    },

    removeFollow(state, removedFollow) {
      state.follows = state.follows.filter(follow => follow.followedId != removedFollow.followedId);
    },

    setJoinedGroupIds(state, joinedGroupIds) {
      state.joinedGroupIds = joinedGroupIds;
    },

    setLikedPostIds(state, likedPostIds) {
      state.likedPostIds = likedPostIds;
    },

    addLike(state, postId) {
      state.likedPostIds.push(postId);
    },

    removeLike(state, removedPostId) {
      state.likedPostIds = state.likedPostIds.filter(postId => postId != removedPostId);
    }
  },

  actions: {
    async register({ commit }, data) {
      const response = await fetch("http://localhost:9000/register", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        alert("Registration failed");
        return false;
      }
      const responseBody = await response.json();
      commit("setToken", responseBody.token);
      return true;
    },

    async login({ commit }, data) {
      const response = await fetch("http://localhost:9000/login", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        alert("Login failed");
        return false;
      }
      const responseBody = await response.json();
      commit("setToken", responseBody.token);
      return true;
    },

    getUser({ state }) {
      if (!state.token) {
        return null;
      }
      const base64Payload = state.token.split('.')[1];
      const payload = Buffer.from(base64Payload, 'base64');
      return JSON.parse(payload.toString());
    },

    async createProfile({ commit, state }, data) {
      const response = await fetch(`http://localhost:8000/api/profiles`, {
        method: 'POST',
        headers: { 
          "Authorization": `Bearer ${state.token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        return false;
      }
      const profile = await response.json();
      commit("addProfile", profile);
      return true;
    },

    async getProfile({ commit, state }, userId) {
      let profile = state.profiles.filter(profile => profile.userId == userId)[0];
      if (profile) {
        return profile;
      }

      const response = await fetch(`http://localhost:8000/api/profiles/${userId}`, {
        headers: { "Authorization": `Bearer ${state.token}` }
      });
      if (!response.ok) {
        return null;
      }
      profile = await response.json();
      commit("addProfile", profile);
      return profile;
    },

    async createPost({ commit, state }, data) {
      const response = await fetch(`http://localhost:8000/api/posts`, {
        method: 'POST',
        headers: { 
          "Authorization": `Bearer ${state.token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        return false;
      }
      const post = await response.json();
      commit("addPost", post);
      commit("addToFeed", post);
      return true;
    },

    async getPost({ commit, state }, postId) {
      let post = state.posts.filter(post => post.id == postId)[0];
      if (post) {
        return post;
      }

      const response = await fetch(`http://localhost:8000/api/posts/${postId}`, {
        headers: { "Authorization": `Bearer ${state.token}` }
      });
      if (!response.ok) {
        return null;
      }
      post = await response.json();
      commit("addPost", post);
      return post;
    },

    async getFeed({ commit, state, dispatch }) {
      if (state.feed) {
        return state.feed;
      }
      
      const user = await dispatch("getUser");
      const response = await fetch(`http://localhost:8000/api/posts/users/${user.id}/feed`, {
        headers: { "Authorization": `Bearer ${state.token}` }
      });
      if (!response.ok) {
        return null;
      }
      const feed = await response.json();
      commit("setFeed", feed);
      return feed;
    },

    async getGroup({ commit, state }, groupId) {
      let group = state.groups.filter(group => group.id == groupId)[0];
      if (group) {
        return group;
      }

      const response = await fetch(`http://localhost:8000/api/groups/${groupId}`, {
        headers: { "Authorization": `Bearer ${state.token}` }
      });
      if (!response.ok) {
        return null;
      }
      group = await response.json();
      commit("addGroup", group);
      return group;
    },

    async getFollows({ commit, state, dispatch }) {
      if (state.follows) {
        return state.follows;
      }
      
      const user = await dispatch("getUser");
      const response = await fetch(`http://localhost:8000/api/follows/users/${user.id}`, {
        headers: { "Authorization": `Bearer ${state.token}` }
      });
      if (!response.ok) {
        return null;
      }
      const follows = await response.json();
      commit("setFollows", follows);
      return follows;
    },

    async getJoinedGroupIds({ commit, state, dispatch }) {
      if (state.joinedGroupIds) {
        return state.joinedGroupIds;
      }

      const user = await dispatch("getUser");
      const response = await fetch(`http://localhost:8000/api/groupMembers/users/${user.id}`, {
        headers: { "Authorization": `Bearer ${state.token}` }
      });
      if (!response.ok) {
        return null;
      }
      const groupMemberships = await response.json();
      const joinedGroupIds = groupMemberships.map(groupMembership => groupMembership.groupId);
      commit("setJoinedGroupIds", joinedGroupIds);
      return joinedGroupIds;
    },

    async joinGroup({ commit, state, dispatch }, groupId) {
      const user = await dispatch("getUser");
      const data = {
        userId: user.id,
        groupId: groupId
      };
      const response = await fetch(`http://localhost:8000/api/groupMembers`, {
        method: 'POST',
        headers: { 
          "Authorization": `Bearer ${state.token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        return false;
      }
      commit("joinGroup", groupId);
      commit("setFeed", null);
      await dispatch("getFeed");
      return true;
    },

    async leaveGroup({ commit, state, dispatch }, groupId) {
      const user = await dispatch("getUser");
      const data = {
        userId: user.id,
        groupId: groupId
      };
      const response = await fetch(`http://localhost:8000/api/groupMembers`, {
        method: 'DELETE',
        headers: { 
          "Authorization": `Bearer ${state.token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        return false;
      }
      commit("leaveGroup", groupId);
      commit("setFeed", null);
      await dispatch("getFeed");
      return true;
    },

    async follow({ commit, state, dispatch }, followedId) {
      const user = await dispatch("getUser");
      const data = {
        followerId: user.id,
        followedId: followedId
      };
      const response = await fetch(`http://localhost:8000/api/follows`, {
        method: 'POST',
        headers: { 
          "Authorization": `Bearer ${state.token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        return false;
      }
      const follow = await response.json();
      commit("addFollow", follow);
      commit("setFeed", null);
      await dispatch("getFeed");
      return true;
    },

    async unfollow({ commit, state, dispatch }, followedId) {
      const user = await dispatch("getUser");
      const data = {
        followerId: user.id,
        followedId: followedId
      };
      const response = await fetch(`http://localhost:8000/api/follows`, {
        method: 'DELETE',
        headers: { 
          "Authorization": `Bearer ${state.token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        return false;
      }
      commit("removeFollow", data);
      commit("setFeed", null);
      await dispatch("getFeed");
      return true;
    },

    async getLikedPostIds({ commit, state, dispatch }) {
      if (state.getLikedPostIds) {
        return state.getLikedPostIds;
      }

      const user = await dispatch("getUser");
      const response = await fetch(`http://localhost:8000/api/likes/users/${user.id}`, {
        headers: { "Authorization": `Bearer ${state.token}` }
      });
      if (!response.ok) {
        return null;
      }
      const likes = await response.json();
      const likedPostIds = likes.map(like => like.postId);
      commit("setLikedPostIds", likedPostIds);
      return likedPostIds;
    },

    async like({ commit, state, dispatch}, postId) {
      const user = await dispatch("getUser");
      const data = {
        userId: user.id,
        postId: postId
      };
      const response = await fetch(`http://localhost:8000/api/likes`, {
        method: 'POST',
        headers: { 
          "Authorization": `Bearer ${state.token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        return false;
      }
      const follow = await response.json();
      commit("addLike", follow.postId);
      return true;
    },

    async unlike({ commit, state, dispatch }, postId) {
      const user = await dispatch("getUser");
      const data = {
        userId: user.id,
        postId: postId
      };
      const response = await fetch(`http://localhost:8000/api/likes`, {
        method: 'DELETE',
        headers: { 
          "Authorization": `Bearer ${state.token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        return false;
      }
      commit("removeLike", postId);
      return true;
    }
  }
})
