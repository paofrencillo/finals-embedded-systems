import styles from '../../styles/home/Modal.module.css';


export default function Modal({ isVisible, onClose }) {
    if ( !isVisible ) return null;

    const handleCLose = (e) => {
        if ( e.target.id === 'wrapper' ) onClose();
    }

    return(
        <div
            className={styles.modal_wrapper}
            id="wrapper"
            onClick={handleCLose}
            >
            <div className={styles.modal}>
                <div className={styles.modal_header}>
                    <h3 className={styles.modal_title}>
                        About Motion Detector
                    </h3>      
                    <button
                        className={styles.modal_close}
                        onClick={()=> onClose()}
                    >
                        X
                    </button>
                </div>
                <div className={styles.modal_content}>
                    <p className={styles.modal_paragraph}>
                        Motion detector is an application running on python script.
                        By using a camera (laptop, usb cam), the program will detect
                        movement caught in your camera and you can have the option to
                        save the captured data in the database as BLOB image. Only the
                        last 10 captured image will be shown.
                    </p>
                    <p className={styles.modal_paragraph}>
                        Upon opening this project, a python script will run, and
                        it will open your camera recorder. Press 'q' on keyboard to
                        stop the script.
                    </p>       
                </div>
                <div className={styles.modal_footer}>      
                    <button
                        className={styles.modal_footer_close}
                        onClick={()=> onClose()}
                    >
                        OK, I got it!
                    </button>
                </div>
            </div>
        </div>
    );
}