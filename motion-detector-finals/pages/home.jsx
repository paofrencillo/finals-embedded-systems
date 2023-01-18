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

export async function getStaticProps() {
  // Fetch data from the server
  const res = await fetch('http://localhost:5000/home');

  // Get the json response
  const data = await res.json();
  
  // If user was not logged in, go to login page
  if ( data.is_logged_in == false ) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
      props: {},
    };
  }
  // If user was logged in, redirect to this current page
  return { props: {} }
}