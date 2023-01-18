import styles from "../styles/Navbar.module.css";
import Link from "next/link";


export default function Navbar() {
    return(
        <div className={styles.navbar}>
            <Link className={styles.navbar_brand_link} href='/home'>
                <h2 className={styles.navbar_brand}>TR</h2>
            </Link>
            <div>
                <ul className={styles.navbar_options_wrapper}>
                    <Link className={styles.navbar_links} href="#">
                        <li className={styles.navbar_options}>Motion Detector</li>
                    </Link>
                    <Link className={styles.navbar_links} href="/resetpass">
                        <li className={styles.navbar_options}>Reset Password</li>
                    </Link>
                    <Link className={styles.navbar_links} href="http://localhost:5000/logout">
                        <li className={styles.navbar_options}>Logout</li>
                    </Link>     
                </ul>
            </div>
        </div>
    );
}