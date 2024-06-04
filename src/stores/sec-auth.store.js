import { defineStore, getActivePinia } from "pinia";
import { fetchWrapper } from "../_services/fetch-wrapper";
import router from "../router";
import moment from "moment";


export const useAuthStore = defineStore({
  id: "auth",
  state: () => ({
    // initialize state from local storage to enable user to stay logged in
    user: sessionStorage.getItem("user")
      ? JSON.parse(sessionStorage.getItem("user"))
      : null,
    unconfirmeduser: null,
    returnUrl: null,
    confirmed: false,
    checkpwdcombinations: [
      { regex: /.{8}/, key: 0, valid: false },
      { regex: /[A-Z]/, key: 1, valid: false },
      { regex: /[a-z]/, key: 2, valid: false },
      { regex: /[0-9]/, key: 3, valid: false },
      { regex: /[^A-Za-z0-9]/, key: 4, valid: false },
    ],
  }),
  getters: {
    getUser: (state) => () =>
      state.user
        ? {
            id: state.user.id,
            email: state.user.email,
            name: state.user.name,
            firstname: state.user.firstname,
          }
        : {},
  },
  actions: {
    async login(email, password) {
      try {
        const user = await fetchWrapper.login("users/login", {
          email,
          password,
        });
        console.log(user);
        if (user && user.result && user.result == 1) {
          // update pinia state
            this.user = user.data;
            sessionStorage.setItem("user", JSON.stringify(user.data));
            //set user language
            // redirect to previous url or default to home page
            router.push(this.returnUrl || "/");
        }
      } catch (error) {
       console.log(error);
      }
    },
    async allUsers() {
      try {
        const user = await fetchWrapper.get("users/");
        console.log(user);
        if (user && user.result && user.result == 1) {
            router.push(this.returnUrl || "/");
        }
      } catch (error) {
       console.log(error);
      }
    },
    logout() {
      fetchWrapper.get("users/logout");
      this.user = null;
      sessionStorage.removeItem("user");
      const pinia = getActivePinia();
      pinia._s.forEach((store) => store.$reset());
      console.log("Logged out");
    },
    isTokenValid() {
      if (this.user && this.user.expiresAt) {
        const r = moment(this.user.expiresAt) > moment();
        return r;
      }
      return false;
    },
    validatePassword(pw) {
      const combinations = this.checkpwdcombinations;
      for (const item of combinations) {
        this.checkpwdcombinations[item.key].valid = item.regex.test(pw);
      }
    },
  },
});
