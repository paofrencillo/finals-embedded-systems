import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/motion/Motion.module.css';
import Navbar from '../components/Navbar';


export default function Motion({ data }) {
    // Render into HTML
    if ( data.message ) {
        return (
            <div className={styles.main}>
                <Head>
                    <title>Motion Detector | Team Rocket</title>
                    <meta name="description" content="Team Rocket Finals in Embedded System" />
                    <link rel="icon" href="/rocketmind.ico" />
                </Head>
                <Navbar />
                <div className={styles.container}>   
                    <h1>NO IMAGE DETECTED.</h1>
                    <h1>LET THE PYTHON SCRIPT TO RUN AND REFRESH THE PAGE.</h1>
                </div>
            </div>
        )
    }
    return (
        <div className={styles.main}>
            <Head>q
                <title>Motion Detector | Team Rocket</title>
                <meta name="description" content="Team Rocket Finals in Embedded System" />
                <link rel="icon" href="/rocketmind.ico" />
            </Head>
            <Navbar />
            <div className={styles.container}>
                <h3>*** This page shows the last 10 captured motion ***</h3>
            {data.imgData.map(function(imgData, index) {
                // Get the image data
                let image = imgData['captured_image']['data'];

                // Convert into blob into string with charset=utf-8
                let base64Image = Buffer.from(image, 'base64').toString('utf-8');

                // Configure the image tag attribute (src)
                let imgSrc = "data:image/png;base64," + base64Image;
                 
                // Get the image number
                let img_num = imgData['id'];
                
                // Get the date time
                let captured_on = imgData['captured_on'];
                
                return (
                    <div>
                        <p>{ 10 - index }. Image #{ img_num } | Captured On: { captured_on }</p>
                        <Image src={ imgSrc } alt="captured image" width={500} height={400} />
                    </div>    
                )
            }).reverse()}
            </div> 
        </div>
    ) 
}

export async function getStaticProps() {
    // Fetch data from the server
    const res = await fetch('http://localhost:5000/motion');

    // Get the json response
    const data = await res.json();

    // If user was not logged in, redirect to login page
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
    return { props: { data } }
  }