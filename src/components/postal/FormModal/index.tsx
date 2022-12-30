import React from 'react';
import { Modal } from 'antd';

interface FormModalProps {
    emailsList: EmailSearchData[],
    formModalOpen: boolean | undefined,
    setFormModalOpenHandler: Function
}

const FormModal: React.FC<FormModalProps> = (props) => {
    const { setFormModalOpenHandler, emailsList, formModalOpen } = props

    return (
        <>
            <Modal
                title="Modal 1000px width"
                centered
                open={formModalOpen}
                onOk={() => setFormModalOpenHandler(false)}
                onCancel={() => setFormModalOpenHandler(false)}
                width={1000}
            >
                <p>some contents...</p>
                <p>some contents...</p>
                <p>some contents...</p>
            </Modal>
        </>
    )
}

export default FormModal