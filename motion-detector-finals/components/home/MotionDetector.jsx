import styles from "../../styles/home/MotionDetector.module.css"
import Link from "next/link";
import Modal from "./Modal";
import { useState } from "react";


export default function MotionDetector() {
    const [showModal, setShowModal] = useState(false);

    return(
        <div className={styles.section_wrapper}>
            <Modal
                isVisible={showModal}
                onClose={()=> setShowModal(false)}
            />
            <div 
                className={styles.project_about}
                onClick={()=> setShowModal(true)}
            >
                ?
            </div>
            <div className={styles.container}>
                <h1 className={styles.title}>
                    MOTION DETECTOR
                </h1>
                <div className={styles.md_section}>
                    <img src="/motion.gif" alt="motion.gif" />
                    <Link href={'/showimgs'}>
                        <button className={styles.button}>
                            Check this out!
                        </button>
                    </Link>
                </div> 
            </div>
        </div>
    );
}