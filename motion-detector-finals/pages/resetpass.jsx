import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '../components/Navbar';
import styles from '../styles/resetpass/ResetPass.module.css'


export default function ResetPass() {
// Handles the submit event on form submit.
  const handleSubmit = async (event) => {

    // Stop the form from submitting and refreshing the page.
    event.preventDefault()
     // Get data from the form.

    const old_password = event.target.old_password.value
    const new_password = event.target.new_password.value
    const confirm_password = event.target.confirm_password.value

    if ( old_password == null || old_password == '' ) {
      alert("Enter your old password.");
      return
    }

    if ( new_password == null || new_password == '' ) {
        alert("Enter your new password.");
        return
    }

    if ( new_password != confirm_password ) {
      alert("Password don't match!");
      return
    }

    // Get data from the form.
    const data = {
        old_password: event.target.old_password.value,
        new_password: event.target.new_password.value
    }

    // Send the data to the server in JSON format.
    const JSONdata = JSON.stringify(data)

    // API endpoint where we send form data.
    const endpoint = 'http://localhost:5000/post-resetpass'

    // Form the request for sending data to the server.
    const options = {
      // The method is POST because we are sending data.
      method: 'POST',
      // Tell the server we're sending JSON.
      headers: {
        'Content-Type': 'application/json',
      },
      // Body of the request is the JSON data we created above.
      body: JSONdata,
    }

    // Send the form data to our forms API on Vercel and get a response.
    const response = await fetch(endpoint, options)

    // Get the response data from server as JSON.
    // If server returns the name submitted, that means the form works.
    const result = await response.json()

    if ( result.error_code == 'ER_DUP_ENTRY' ) {
      alert(result.message)
    } else {
      alert(`Resetting password successful.`)
    }
  }

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
                <form onSubmit={handleSubmit}>
                    <div className={ styles.input_wrapper }>
                        <input type="password" name="old_password" id="old_password" placeholder="Old Password" />
                        <input type="password" name="new_password" id="new_password" placeholder="New Password" />
                        <input type="password" name="confirm_password" id="confirm_password" placeholder="Confirm Password" />
                    </div>
                    <div className={ styles.form_btns_wrapper }>
                    <button type="submit" className={ styles.reset_btn }>Confirm</button>
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

export async function getStaticProps() {
    // Fetch data from the server
    const res = await fetch('http://localhost:5000/resetpass');

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