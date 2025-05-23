//MBIX
import { makeAutoObservable, runInAction } from "mobx";
import { User } from "../models/user";

export class UserStore {
  user: User | null = null;

  constructor() {
    makeAutoObservable(this);
    this.loadUserFromLocalStorage();
  }

  setUser(user: User|null) {
    console.log(user);
    
    this.user = user;
    localStorage.setItem("user", JSON.stringify(user));
  }

  logout() {
    this.user = null;
    localStorage.removeItem("user");
  }

  loadUserFromLocalStorage() {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userObj = JSON.parse(storedUser);
        runInAction(() => {
          this.user = userObj;
        });
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
      }
    }
  }

  get isLoggedIn() {
    return this.user !== null;
  }

  get isAdmin() {
    return this.user?.role === "Admin";
  }

  get userName() {
    return this.user?.name;
  }
}

const userStore = new UserStore();
export default userStore;