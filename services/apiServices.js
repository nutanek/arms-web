import qs from "qs";
import axios from "axios";
import { assetPrefix } from "./../next.config";
import { API_PATH } from "./../constants/config";
import { getLocalAccessToken, signout } from "./../services/appServices";

const API_URL_V1 = `${API_PATH}/v1`;

// Api Constants
const SIGNIN = `${API_URL_V1}/signin.php`;
const SIGNUP = `${API_URL_V1}/signup.php`;
const UPLOAD_IMAGE = `${API_URL_V1}/upload.php`;

const USER_PROFILE = `${API_URL_V1}/user-profile.php`;

const MEMBER_LIST = `${API_URL_V1}/member-list.php?page=:page&size=:size&keyword=:keyword&request_account=:request_account&approved_status=:approved_status&member_type=:member_type`;
const MEMBER_DETAIL = `${API_URL_V1}/member-detail.php?id=:id`;
const MEMBER_DETAIL_ADD = `${API_URL_V1}/member-detail-add.php`;
const MEMBER_DETAIL_UPDATE = `${API_URL_V1}/member-detail-update.php?id=:id`;
const MEMBER_DETAIL_REMOVE = `${API_URL_V1}/member-detail-remove.php?id=:id`;
const MEMBER_ACCOUNT_REQUEST = `${API_URL_V1}/member-account-request.php`;
const MEMBER_ACCOUNT_STATUS_UPDATE = `${API_URL_V1}/member-account-status-update.php?id=:id`;

const REPORT_LIST = `${API_URL_V1}/report-list.php?page=:page&size=:size&keyword=:keyword&id_member=:id_member`;
const REPORT_DETAIL = `${API_URL_V1}/report-detail.php?id=:id`;
const REPORT_DETAIL_ADD = `${API_URL_V1}/report-detail-add.php`;
const REPORT_STATUS_UPDATE = `${API_URL_V1}/report-status-update.php?id=:id`;

const JOB_LIST = `${API_URL_V1}/job-list.php?page=:page&size=:size&keyword=:keyword&id_employer=:id_employer&id_employee=:id_employee&status=:status`;
const JOB_DETAIL = `${API_URL_V1}/job-detail.php?id=:id`;
const JOB_DETAIL_ADD = `${API_URL_V1}/job-detail-add.php`;
const JOB_DETAIL_UPDATE = `${API_URL_V1}/job-detail-update.php?id=:id`;
const JOB_REQUEST = `${API_URL_V1}/job-request.php?id=:id`;
const JOB_STATUS_UPDATE = `${API_URL_V1}/job-status-update.php?id=:id`;
const JOB_RATING_UPDATE = `${API_URL_V1}/job-rating-update.php?id=:id`;

const FEE_LIST = `${API_URL_V1}/fee-list.php?page=:page&size=:size`;
const FEE_DETAIL = `${API_URL_V1}/fee-detail.php?id=:id`;
const FEE_DETAIL_ADD = `${API_URL_V1}/fee-detail-add.php`;
const FEE_DETAIL_UPDATE = `${API_URL_V1}/fee-detail-update.php?id=:id`;
const FEE_DETAIL_REMOVE = `${API_URL_V1}/fee-detail-remove.php?id=:id`;

const BANK_ACCOUNT_LIST = `${API_URL_V1}/bank-account-list.php?page=:page&size=:size`;
const BANK_ACCOUNT_DETAIL = `${API_URL_V1}/bank-account-detail.php?id=:id`;
const BANK_ACCOUNT_DETAIL_ADD = `${API_URL_V1}/bank-account-detail-add.php`;
const BANK_ACCOUNT_DETAIL_UPDATE = `${API_URL_V1}/bank-account-detail-update.php?id=:id`;
const BANK_ACCOUNT_DETAIL_REMOVE = `${API_URL_V1}/bank-account-detail-remove.php?id=:id`;

const NOTIFICATION_LIST = `${API_URL_V1}/notification-list.php?page=:page&size=:size`;
const NOTIFICATION_MARK_AS_READ = `${API_URL_V1}/notification-mark-as-read.php`;

const PAYMENT_LIST = `${API_URL_V1}/payment-list.php?page=:page&size=:size`;

const SKILL_LIST = `${API_URL_V1}/skill-list.php`;
const SKILL_ADD = `${API_URL_V1}/skill-add.php`;

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

export const getUserProfileListApi = async (props) =>
    callApi({
        ...props,
        url: USER_PROFILE,
        method: "GET",
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

export const addSkillListApi = async (props) =>
    callApi({
        ...props,
        url: SKILL_ADD,
        method: "POST",
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

export const updateJobRatingApi = async (props) =>
    callApi({
        ...props,
        url: JOB_RATING_UPDATE,
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

export const getBankAccountListApi = async (props) =>
    callApi({
        ...props,
        url: BANK_ACCOUNT_LIST,
        method: "GET",
    });

export const getBankAccountDetailApi = async (props) =>
    callApi({
        ...props,
        url: BANK_ACCOUNT_DETAIL,
        method: "GET",
    });

export const addBankAccountDetailApi = async (props) =>
    callApi({
        ...props,
        url: BANK_ACCOUNT_DETAIL_ADD,
        method: "POST",
    });

export const updateBankAccountDetailApi = async (props) =>
    callApi({
        ...props,
        url: BANK_ACCOUNT_DETAIL_UPDATE,
        method: "POST",
    });

export const removeBankAccountDetailApi = async (props) =>
    callApi({
        ...props,
        url: BANK_ACCOUNT_DETAIL_REMOVE,
        method: "POST",
    });

export const getNotificationListApi = async (props) =>
    callApi({
        ...props,
        url: NOTIFICATION_LIST,
        method: "GET",
    });

export const markAsReadNotificationApi = async (props) =>
    callApi({
        ...props,
        url: NOTIFICATION_MARK_AS_READ,
        method: "POST",
    });

export const getPaymentListApi = async (props) =>
    callApi({
        ...props,
        url: PAYMENT_LIST,
        method: "GET",
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
        if (error?.request?.status === 403) {
            signout();
        }
        let errInfo = error?.response?.data;
        throw errInfo;
    }
};
