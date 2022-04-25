/* eslint-disable */
import router from "@/router";
import * as jwt from "@/services/jwt";
import JwtDecode from "jwt-decode";

const mapAuthProviders = {
  jwt: {
    login: jwt.login,
    loginStudent: jwt.loginStudent,
    register: jwt.register,
    currentAccount: jwt.currentAccount,
    logout: jwt.logout,
  },
};

export default {
  namespaced: true,
  state: {
    email: "",
    fName: "",
    lName: "",
    phone: "",
    access: {},
    status: "",
    avatar: "",
    authorized: /* process.env.VUE_APP_AUTHENTICATED || */ false, // false is default value
    loading: false,
  },
  mutations: {
    SET_STATE(state, payload) {
      Object.assign(state, {
        ...payload,
      });
    },
  },
  actions: {
    SET_STATES(commit, { payload }) {
      commit("SET_STATE", payload)
    },
    LOGIN({ commit, dispatch, rootState }, { payload }) {
      return new Promise((resolve, reject) => {
        const { email, password } = payload;
        commit("SET_STATE", {
          loading: true,
        });

        const login = mapAuthProviders[rootState.settings.authProvider].login;
        login(email, password).then((success) => {
          if (success) {
            console.log(success)
            const { access, fName, phone, lName, status, email, avatar } = success;
            let accessList = []
            if (access)
              for (let i in access)
                if (access[i] === true) accessList.push(i)
            commit("SET_STATE", {
              email: email,
              fName: fName,
              lName: lName,
              phone: phone,
              access: accessList,
              status: status,
              avatar: avatar,
              authorized: true,
            });
            resolve(success);
            router.push('/admin')
          }
        })
          .catch((er) => reject(er))
          .finally(() => commit("SET_STATE", { loading: false }))
      });
    },
    LOGIN_STUDENT({ commit, dispatch, rootState }, { payload }) {
      return new Promise((resolve, reject) => {
        const { email, password } = payload;
        commit("SET_STATE", {
          loading: true,
        });

        const login = mapAuthProviders[rootState.settings.authProvider].loginStudent;
        login(email, password).then((success) => {
          if (success) {
            const { access, fName, phone, lName, status, email, avatar } = success;
            let accessList = []
            if (access)
              for (let i in access)
                if (access[i] === true) accessList.push(i)
            commit("SET_STATE", {
              email: email,
              fName: fName,
              lName: lName,
              phone: phone,
              status: status,
              avatar: avatar,
              authorized: true,
            }); router.replace({ path: '/student/organismes' })
            resolve(success);

          }
        })
          .catch((er) => {
            reject(er)
            console.log(er)
          })
          .finally(() => commit("SET_STATE", { loading: false }))
      });
    },
    REGISTER({ commit, dispatch, rootState }, { payload }) {
      const { email, password, name } = payload;
      commit("SET_STATE", {
        loading: true,
      });

      const register =
        mapAuthProviders[rootState.settings.authProvider].register;
      register(email, password, name).then((success) => {
        if (success) {
        }
        if (!success) {
          commit("SET_STATE", {
            loading: false,
          });
        }
      });
    },
    LOAD_CURRENT_ACCOUNT({ dispatch, commit, getters }, payload) {
      const token = localStorage.getItem("accessToken");
      if (!!token) {
        var decoded = JwtDecode(token);
        if (decoded.exp < Date.now() / 1000) {
          commit("SET_STATE", {
            email: "",
            fName: "",
            lName: "",
            phone: "",
            access: {},
            status: "",
            avatar: "",
            authorized: false,
            loading: false,
          });
          localStorage.removeItem("accessToken");
        } else {
          /*  commit("setSelectedEnterpriseId", payload.params.EnterpriseID)  */
          let accessList = []
          if (decoded.access)
            for (let i in decoded.access)
              if (decoded.access[i] === true) accessList.push(i)
          commit("SET_STATE", {
            email: decoded.email,
            fName: decoded.fName,
            lName: decoded.lName,
            phone: decoded.phone,
            access: accessList,
            status: decoded.status,
            avatar: process.env.VUE_APP_API_URL + decoded.avatar,
            authorized: true,
          });
        }
      }
    },
    LOGOUTSTUDENT({ commit, rootState }) {
      const logout = mapAuthProviders[rootState.settings.authProvider].logout;
      logout().then(() => {
        commit("SET_STATE", {
          email: "",
          fName: "",
          lName: "",
          phone: "",
          access: {},
          status: "",
          avatar: "",
          authorized: false,
          loading: false,
        });
        router.push({ name: 'loginStudent' })
      });
    },
    LOGOUT({ commit, rootState }) {
      const logout = mapAuthProviders[rootState.settings.authProvider].logout;
      logout().then(() => {
        commit("SET_STATE", {
          email: "",
          fName: "",
          lName: "",
          phone: "",
          access: {},
          status: "",
          avatar: "",
          authorized: false,
          loading: false,
        });
        router.push({ name: 'login' })
      });
    },
  },
  getters: {
    user: (state) => state,
  },
};