import Head from 'next/head';
import styles from '../styles/home/Home.module.css'
import Navbar from '../components/Navbar';
import MotionDetector from '../components/home/MotionDetector';


export default function Home() {
    return (
        <div>
          <Head>
            <title>Home | Team Rocket</title>
            <meta name="description" content="Team Rocket Finals in Embedded System" />
            <link rel="icon" href="/rocketmind.ico" />
          </Head>
    
            <main className={styles.main}>
                <Navbar />
                <MotionDetector />    
            </main>
        </div>
    );
}
