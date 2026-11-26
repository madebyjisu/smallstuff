import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import './scss/Modal.scss';
import { ICONS } from '../constants/icons';

interface ModalProps {
    open: boolean;
    title: string;
    children: ReactNode;
    width?: string | number;
    onClose: () => void;
}

export const Modal = ({
    open,
    title,
    children,
    width = 400,
    onClose,
}: ModalProps) => {
    const modalRef = useRef<HTMLDialogElement>(null);

    // open 값에 따라 팝업 열기 및 닫기
    useEffect(() => {
        const modal = modalRef.current;

        if (!modal) return;

        if (open && !modal.open) {
            modal.showModal();
        } else if (!open && modal.open) {
            modal.close();
        }
    }, [open]);

    return (
        <dialog
            ref={modalRef}
            className='modal'
            style={{ width: width }}
            aria-label={title}
            onCancel={(e) => {
                e.preventDefault();
                onClose();
            }}
            onClick={(e) => {
                // 팝업 바깥 영역 클릭 시 닫기
                if (e.target === e.currentTarget) {
                    onClose();
                }
            }}
        >
            <div className="modal-header">
                <h2>{title}</h2>

                <button
                    type='button'
                    className='modal-close'
                    aria-label='팝업 닫기'
                    onClick={onClose}>
                    <img src={ICONS.close} alt="닫기" />
                </button>
            </div>

            {/* 팝업 내부 콘텐츠 */}
            <div className="modal-content">
                {children}
            </div>
        </dialog>
    );
};
