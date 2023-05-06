import qs from "qs";
import axios from "axios";
import { API_PATH } from "./../constants/config";

const API_URL_V1 = `${API_PATH}/v1`;

// Api Constants
const UPLOAD_IMAGE = `${API_URL_V1}/upload`;
const MEMBER_LIST = `${API_URL_V1}/member-list?page=:page&size=:size&keyword=:keyword&request_account=:request_account`;
const MEMBER_DETAIL = `${API_URL_V1}/member-detail?id=:id`;
const MEMBER_DETAIL_ADD = `${API_URL_V1}/member-detail-add`;
const MEMBER_DETAIL_UPDATE = `${API_URL_V1}/member-detail-update?id=:id`;
const MEMBER_DETAIL_REMOVE = `${API_URL_V1}/member-detail-remove?id=:id`;
const MEMBER_ACCOUNT_REQUEST = `${API_URL_V1}/member-account-request`;
const MEMBER_ACCOUNT_STATUS_UPDATE = `${API_URL_V1}/member-account-status-update?id=:id`;
const REPORT_LIST = `${API_URL_V1}/report-list?page=:page&size=:size&keyword=:keyword`;
const REPORT_DETAIL = `${API_URL_V1}/report-detail?id=:id`;
const REPORT_DETAIL_ADD = `${API_URL_V1}/report-detail-add`;
const REPORT_STATUS_UPDATE = `${API_URL_V1}/report-status-update?id=:id`;
const SKILL_LIST = `${API_URL_V1}/skill-list`;
const JOB_DETAIL_ADD = `${API_URL_V1}/job-detail-add`;

export const uploadImageApi = async (props) =>
    callApi({
        ...props,
        url: UPLOAD_IMAGE,
        method: "POST",
        dataType: "MULTIPART",
    });

export const getMemberListApi = async (props) =>
    callApi({
        ...props,
        url: MEMBER_LIST,
        method: "GET",
    });

export const getMemberDetailApi = async (props) =>
    callApi({
        ...props,
        url: MEMBER_DETAIL,
        method: "GET",
    });

export const addMemberDetailApi = async (props) =>
    callApi({
        ...props,
        url: MEMBER_DETAIL_ADD,
        method: "POST",
    });

export const updateMemberDetailApi = async (props) =>
    callApi({
        ...props,
        url: MEMBER_DETAIL_UPDATE,
        method: "POST",
    });

export const removeMemberDetailApi = async (props) =>
    callApi({
        ...props,
        url: MEMBER_DETAIL_REMOVE,
        method: "POST",
    });

export const requestMemberAccountApi = async (props) =>
    callApi({
        ...props,
        url: MEMBER_ACCOUNT_REQUEST,
        method: "POST",
    });

export const updateMemberAccountStatusApi = async (props) =>
    callApi({
        ...props,
        url: MEMBER_ACCOUNT_STATUS_UPDATE,
        method: "POST",
    });

export const getReportListApi = async (props) =>
    callApi({
        ...props,
        url: REPORT_LIST,
        method: "GET",
    });

export const getReportDetailApi = async (props) =>
    callApi({
        ...props,
        url: REPORT_DETAIL,
        method: "GET",
    });

export const addReportDetailApi = async (props) =>
    callApi({
        ...props,
        url: REPORT_DETAIL_ADD,
        method: "POST",
    });

export const updateReportStatusApi = async (props) =>
    callApi({
        ...props,
        url: REPORT_STATUS_UPDATE,
        method: "POST",
    });

export const getSkillListApi = async (props) =>
    callApi({
        ...props,
        url: SKILL_LIST,
        method: "GET",
    });

export const addJobDetailApi = async (props) =>
    callApi({
        ...props,
        url: JOB_DETAIL_ADD,
        method: "POST",
    });

const generateApiUrl = (url, params) => {
    let apiUrl = url;
    for (var key in params) {
        if (params.hasOwnProperty(key)) {
            apiUrl = apiUrl.replace(`:${key}`, params[key]);
        }
    }

    let token = "YWFhQGthbi5jb206MTIzNDU2";

    if (url.includes("?")) {
        apiUrl = `${apiUrl}&token=${token}`;
    } else {
        apiUrl = `${apiUrl}?token=${token}`;
    }

    return apiUrl;
};

const generateHeader = (req, dataType) => {
    let header = {
        Accept: "application/json, text/plain, */*",
        "Accept-Language": "en-US,en;q=0.9",
        // Authorization: accessToken
        //     ? `Bearer ${accessToken}`
        //     : `Basic ${APP_API_KEY}`,
        "Content-Type":
            dataType == "MULTIPART"
                ? "multipart/form-data; charset=UTF-8"
                : "application/x-www-form-urlencoded; charset=UTF-8",
    };
    return header;
};

const callApi = async ({ req, res, url, params, method, body, dataType }) => {
    let apiUrl = generateApiUrl(url, params);
    let apiHeaders = generateHeader(req, dataType);
    console.log("api url:", apiUrl);
    console.log("api headers:", apiHeaders);
    let bodyData;
    if (dataType == "MULTIPART") {
        bodyData = new FormData();
        Object.keys(body).forEach((key) => bodyData.append(key, body[key]));
    } else if (dataType === "JSON") {
        bodyData = body;
    } else {
        bodyData = qs.stringify(body);
    }
    try {
        let response = await axios({
            method,
            url: apiUrl,
            headers: apiHeaders,
            data: bodyData,
        });
        return response.data;
    } catch (error) {
        // let errInfo = handleApiError(error, req, res);
        let errInfo = error?.response?.data;
        throw errInfo;
    }
};
