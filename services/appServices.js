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

export function signout({ isCallback }) {
    clearAuth();
    if (isCallback) {
        let callbackUrl = encodeURIComponent(window.location.href);
        // window.location.replace(`${ROOT_PATH}/login?callback=${callbackUrl}`);
    } else {
        window.location.reload();
    }
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
