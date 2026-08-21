import React from 'react';

interface FormModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: React.ReactNode;
    children?: React.ReactNode;
    footer?: React.ReactNode;
}

const FormModal: React.FC<FormModalProps> = ({ isOpen, onClose, title, children, footer }) => {
    const titleId = React.useId();

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" role="presentation" onMouseDown={onClose}>
            <section
                className="modal-container"
                role="dialog"
                aria-modal="true"
                aria-labelledby={title ? titleId : undefined}
                onMouseDown={(event) => event.stopPropagation()}
            >
                <div className="modal-header">
                    {title && <h2 id={titleId}>{title}</h2>}
                    <button className="modal-close" type="button" onClick={onClose} aria-label="Cerrar">
                        x
                    </button>
                </div>
                <div className="modal-body">{children}</div>
                {footer && <div className="modal-footer">{footer}</div>}
            </section>
        </div>
    );
};

export default FormModal;
