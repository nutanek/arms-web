import qs from "qs";
import axios from "axios";
import { API_PATH } from "./../constants/config";
import { getLocalAccessToken } from "./../services/appServices";

const API_URL_V1 = `${API_PATH}/v1`;

// Api Constants
const SIGNIN = `${API_URL_V1}/signin`;
const SIGNUP = `${API_URL_V1}/signup`;
const UPLOAD_IMAGE = `${API_URL_V1}/upload`;

const MEMBER_LIST = `${API_URL_V1}/member-list?page=:page&size=:size&keyword=:keyword&request_account=:request_account&approved_status=:approved_status&member_type=:member_type`;
const MEMBER_DETAIL = `${API_URL_V1}/member-detail?id=:id`;
const MEMBER_DETAIL_ADD = `${API_URL_V1}/member-detail-add`;
const MEMBER_DETAIL_UPDATE = `${API_URL_V1}/member-detail-update?id=:id`;
const MEMBER_DETAIL_REMOVE = `${API_URL_V1}/member-detail-remove?id=:id`;
const MEMBER_ACCOUNT_REQUEST = `${API_URL_V1}/member-account-request`;
const MEMBER_ACCOUNT_STATUS_UPDATE = `${API_URL_V1}/member-account-status-update?id=:id`;

const REPORT_LIST = `${API_URL_V1}/report-list?page=:page&size=:size&keyword=:keyword&id_member=:id_member`;
const REPORT_DETAIL = `${API_URL_V1}/report-detail?id=:id`;
const REPORT_DETAIL_ADD = `${API_URL_V1}/report-detail-add`;
const REPORT_STATUS_UPDATE = `${API_URL_V1}/report-status-update?id=:id`;

const JOB_LIST = `${API_URL_V1}/job-list?page=:page&size=:size&keyword=:keyword&id_employer=:id_employer&id_employee=:id_employee&status=:status`;
const JOB_DETAIL = `${API_URL_V1}/job-detail?id=:id`;
const JOB_DETAIL_ADD = `${API_URL_V1}/job-detail-add`;
const JOB_DETAIL_UPDATE = `${API_URL_V1}/job-detail-update?id=:id`;
const JOB_REQUEST = `${API_URL_V1}/job-request?id=:id`;
const JOB_STATUS_UPDATE = `${API_URL_V1}/job-status-update?id=:id`;

const FEE_LIST = `${API_URL_V1}/fee-list?page=:page&size=:size`;
const FEE_DETAIL = `${API_URL_V1}/fee-detail?id=:id`;
const FEE_DETAIL_ADD = `${API_URL_V1}/fee-detail-add`;
const FEE_DETAIL_UPDATE = `${API_URL_V1}/fee-detail-update?id=:id`;
const FEE_DETAIL_REMOVE = `${API_URL_V1}/fee-detail-remove?id=:id`;

const SKILL_LIST = `${API_URL_V1}/skill-list`;

export const signinApi = async (props) =>
    callApi({
        ...props,
        url: SIGNIN,
        method: "POST",
    });

export const signupApi = async (props) =>
    callApi({
        ...props,
        url: SIGNUP,
        method: "POST",
    });

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

export const getJobListApi = async (props) =>
    callApi({
        ...props,
        url: JOB_LIST,
        method: "GET",
    });

export const getJobDetailApi = async (props) =>
    callApi({
        ...props,
        url: JOB_DETAIL,
        method: "GET",
    });

export const addJobDetailApi = async (props) =>
    callApi({
        ...props,
        url: JOB_DETAIL_ADD,
        method: "POST",
    });

export const updateJobDetailApi = async (props) =>
    callApi({
        ...props,
        url: JOB_DETAIL_UPDATE,
        method: "POST",
    });

export const requestJobApi = async (props) =>
    callApi({
        ...props,
        url: JOB_REQUEST,
        method: "POST",
    });

export const updateJobStatusApi = async (props) =>
    callApi({
        ...props,
        url: JOB_STATUS_UPDATE,
        method: "POST",
    });

export const getFeeListApi = async (props) =>
    callApi({
        ...props,
        url: FEE_LIST,
        method: "GET",
    });

export const getFeeDetailApi = async (props) =>
    callApi({
        ...props,
        url: FEE_DETAIL,
        method: "GET",
    });

export const addFeeDetailApi = async (props) =>
    callApi({
        ...props,
        url: FEE_DETAIL_ADD,
        method: "POST",
    });

export const updateFeeDetailApi = async (props) =>
    callApi({
        ...props,
        url: FEE_DETAIL_UPDATE,
        method: "POST",
    });

export const removeFeeDetailApi = async (props) =>
    callApi({
        ...props,
        url: FEE_DETAIL_REMOVE,
        method: "POST",
    });

const generateApiUrl = (url, params) => {
    let apiUrl = url;
    for (var key in params) {
        if (params.hasOwnProperty(key)) {
            apiUrl = apiUrl.replace(`:${key}`, params[key]);
        }
    }

    let token = getLocalAccessToken();

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
