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
    8: { name: "รอชำระเงิน", color: "#8c8c8c" },
    6: { name: "รออนุมัติ", color: "#faad14" },
    7: { name: "ไม่อนุมัติ", color: "#8c8c8c" },
    1: { name: "เปิดรับสมัคร", color: "#d46b08" },
    2: { name: "ขอรับงาน", color: "#9254de" },
    3: { name: "มอบหมายงานแล้ว", color: "#1677ff" },
    4: { name: "สำเร็จ", color: "#389e0d" },
    5: { name: "ยกเลิก", color: "#f5222d" },
};

export const REPORT_TYPES = [
    {
        id: 1,
        name: "การจ้างงาน",
    },
    {
        id: 2,
        name: "การหางาน",
    },
    {
        id: 3,
        name: "ศิลปิน",
    },
    {
        id: 4,
        name: "การขออนุมัติบัญชี",
    },
    {
        id: 5,
        name: "การเงิน",
    },
    {
        id: 6,
        name: "ระบบเว็บ",
    },
    {
        id: 7,
        name: "อื่นๆ",
    },
];

export const BANKS = [
    {
        key: "BBL",
        name: "ธนาคารกรุงเทพ",
    },
    {
        key: "KBANK",
        name: "ธนาคารกสิกรไทย",
    },
    {
        key: "SCB",
        name: "ธนาคารไทยพาณิชย์",
    },
    {
        key: "KTB",
        name: "ธนาคารกรุงไทย",
    },
    {
        key: "Krungsri",
        name: "ธนาคารกรุงศรีอยุธยา",
    },
    {
        key: "TTB",
        name: "ธนาคารทหารไทยธนชาต",
    },
    {
        key: "CIMB",
        name: "ธนาคารซีไอเอ็มบีไทย",
    },
    {
        key: "SCBT",
        name: "ธนาคารสแตนดาร์ดชาร์เตอร์ (ไทย)",
    },
    {
        key: "BOC",
        name: "ธนาคารจีน (ไทย)",
    },
    {
        key: "UOB",
        name: "ธนาคารยูโอบี (ไทย)",
    },
    {
        key: "ICBC",
        name: "ธนาคารไอซีบีซี (ไทย)",
    },
    {
        key: "Mizuho",
        name: "ธนาคารมิซูโฮ (ไทย)",
    },
    {
        key: "SMBC",
        name: "ธนาคารสมิทธิโกะ มิตซู บันกิ้ง คอร์ปอเรชั่น (ไทย)",
    },
    {
        key: "Deutsche",
        name: "ธนาคารเดอตุช (ไทย)",
    },
    {
        key: "HSBC",
        name: "ธนาคารเอชเอสบีซี (ไทย)",
    },
    {
        key: "Citi",
        name: "ธนาคารซิตี้แบงค์ (ไทย)",
    },
    {
        key: "LH Bank",
        name: "ธนาคารแลนด์ แอนด์ เฮ้า",
    },
    {
        key: "GSB",
        name: "ธนาคารออมสิน",
    },
];
