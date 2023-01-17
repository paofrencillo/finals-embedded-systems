import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '../components/Navbar';
import styles from '../styles/resetpass/ResetPass.module.css'


export default function ResetPass() {
  return (
    <div>

        <Head>
            <title>Team Rocket</title>
            <meta name="description" content="Team Rocket Finals in Embedded System" />
            <link rel="icon" href="/rocketmind.ico" />
        </Head>

        <Navbar />
    
        <main className={ styles.main }>
            <div className={ styles.reset_wrapper }>
                <div className={ styles.left_wrapper }>
                    <div className={ styles.img_wrapper }>
                        <Image width={500} height={500} src="/out-power.png" alt="image"></Image>
                    </div>
                </div>

            <div className={ styles.right_wrapper }>
                <div className={ styles.reset_form }>
                <div className={ styles.reset }>Reset Password</div>
                <form action="">
                    <div className={ styles.input_wrapper }>
                        <input type="password" name="old_password" id="old_password" placeholder="Old Password" />
                        <input type="password" name="new_password" id="new_password" placeholder="New Password" />
                        <input type="password" name="confirm_password" id="confirm_password" placeholder="Confirm Password" />
                    </div>
                    <div className={ styles.form_btns_wrapper }>
                    <button className={ styles.reset_btn }>Confirm</button>
                    </div>
                </form>
                <div className={ styles.team_logo }>TR</div>
                </div>
            </div>
            </div>
        </main>
    </div>
  )
}