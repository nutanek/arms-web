import { Modal } from "antd";

const LoadingModal = ({ isOpen }) => (
    <Modal
        centered
        open={isOpen}
        footer={null}
        closable={false}
        wrapClassName="loading-modal"
    >
        {/* <Spin size="large" /> */}

        <div className="lds-hourglass"></div>
    </Modal>
);

export default LoadingModal;
