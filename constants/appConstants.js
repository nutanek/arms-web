export const JOB_TYPES = [
    { id: 1, name: "งานปกติ" },
    { id: 2, name: "งานทดแทน" },
];

export const GENDERS = [
    { id: 1, key: "M", name: "ชาย" },
    { id: 2, key: "F", name: "หญิง" },
    { id: 3, key: "U", name: "ไม่ระบุ" },
];

export const GENDERS_MAPPING = {
    M: { id: 1, name: "ชาย" },
    F: { id: 2, name: "หญิง" },
    U: { id: 3, name: "ไม่ระบุ" },
};

export const ACCOUNT_APPROVE_STATUS = {
    0: { name: "ยังไม่ได้ส่งคำขอ", color: "#8c8c8c" },
    1: { name: "รออนุมัติ", color: "#faad14" },
    2: { name: "อนุมัติแล้ว", color: "#389e0d" },
    3: { name: "ไม่อนุมัติ", color: "#f5222d" },
};

export const REPORT_STATUS = {
    1: { name: "รอดำเนินการ", color: "#8c8c8c" },
    2: { name: "กำลังดำเนินการ", color: "#faad14" },
    3: { name: "ดำเนินการเสร็จสิ้น", color: "#389e0d" },
    4: { name: "ยกเลิกคำร้อง", color: "#f5222d" },
};

export const MEMBER_TYPES = {
    admin: { name: "ผู้ดูแลระบบ" },
    employee: { name: "ศิลปิน" },
    employer: { name: "ผู้ว่าจ้าง" },
    na: { name: "ไม่ระบุ" },
};

export const JOB_STATUS = {
    1: { name: "เปิดรับสมัคร", color: "#8c8c8c" },
    2: { name: "ขอรับงาน", color: "#faad14" },
    3: { name: "มอบหมายงานแล้ว", color: "#faad14" },
    4: { name: "สำเร็จ", color: "#389e0d" },
    5: { name: "ยกเลิก", color: "#389e0d" },
};
