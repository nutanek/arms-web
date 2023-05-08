import moment from "moment";
import { assetPrefix } from "../next.config";

export const KEY_ACCESS_TOKEN = "arms_access_token";
export const KEY_USER_INFO = "arms_user_info";

export function getLocalAccessToken() {
    const token = localStorage.getItem(KEY_ACCESS_TOKEN);
    return token;
}

export function setLocalAccessToken(token) {
    localStorage.setItem(KEY_ACCESS_TOKEN, token);
}

export function getLocalUserInfo() {
    const userInfoStr = localStorage.getItem(KEY_USER_INFO) || "{}";
    try {
        let userInfo = JSON.parse(userInfoStr);
        return userInfo;
    } catch (error) {
        return {};
    }
}

export function setLocalUserInfo(data) {
    let jsonStr = JSON.stringify(data);
    localStorage.setItem(KEY_USER_INFO, jsonStr);
}

export function clearAuth() {
    localStorage.removeItem(KEY_ACCESS_TOKEN);
    localStorage.removeItem(KEY_USER_INFO);
}

export function signout() {
    clearAuth();
    window.location.replace(`${assetPrefix}/signin`);
}

export function isLoggedIn() {
    let accessToken = getLocalAccessToken();
    let userInfo = getLocalUserInfo();
    if (userInfo.id && userInfo.token === accessToken) {
        return true;
    }
    return false;
}

export function getUserRole() {
    let userInfo = getLocalUserInfo();
    return userInfo.role;
}

export function getTimeFromNow(time) {
    var duration = moment.duration(moment().diff(time));
    var secs = duration.asSeconds();
    if (secs <= 20) {
        return "เมื่อสักครู่นี้";
    } else if (secs <= 60) {
        return `เมื่อ ${Math.floor(secs)} วินาทีก่อน`;
    } else if (secs <= 3600) {
        return `${Math.floor(secs / 60)} นาทีก่อน`;
    } else if (secs <= 86400) {
        return `${Math.floor(secs / 3600)} ชั่วโมงก่อน`;
    } else {
        return `${moment(time).format("DD/MM/YYYY HH:mm")}`;
    }
}
