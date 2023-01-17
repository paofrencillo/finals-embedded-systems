import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../styles/Signup.module.css'


export default function Signup() {
  // Handles the submit event on form submit.
  const handleSubmit = async (event) => {

    // Stop the form from submitting and refreshing the page.
    event.preventDefault()
     // Get data from the form.

    const username = event.target.username.value
    const password = event.target.password.value
    const confirm_password = event.target.confirm_password.value

    if ( password == null || password == '' ) {
      alert("Enter your desired password.");
      return false
    }

    if ( password != confirm_password ) {
      alert("Password don't match!");
      return false
    }
    if ( username == null || username == '' ) {
      alert("Enter your desired username.");
      return false
    }

    // Get data from the form.
    const data = {
      username: event.target.username.value,
      password: event.target.password.value,
    }

    // Send the data to the server in JSON format.
    const JSONdata = JSON.stringify(data)

    // API endpoint where we send form data.
    const endpoint = 'http://192.168.0.110:4000/post-register'

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
      alert(`Registration successfull for username ${result.username}. You will be redirected to login page.`)
      window.location.replace("http://localhost:3000")
    }
}

  return (
    <div>
      <Head>
        <title>Sign Up | Team Rocket</title>
        <meta name="description" content="Team Rocket Finals in Embedded System" />
        <link rel="icon" href="/rocketmind.ico" />
      </Head>

      <main className={ styles.main }>
        <div className={ styles.signup_wrapper }>
          <div className={ styles.left_wrapper }>
            <div className={ styles.header }>Sign up to</div>
            <div className={ styles.team }>Team Rocket</div>
            <div className={ styles.description }>and try our motion detector application!</div>
            <div className={ styles.login_link_wrapper }>
              Already have an account? &nbsp;
              <span>
                <Link className={ styles.login_link }href="/">Login here.</Link>
              </span>
            </div>
            <div className={ styles.img_wrapper }>
              <Image width={300} height={350} src="/chat-smile.png" alt="image"></Image>
            </div>

          </div>

          <div className={ styles.right_wrapper }>
            <div className={ styles.signup_form } id="reg_form">
              <div className={ styles.signup }>Sign Up</div>
              <form method="post" onSubmit={handleSubmit}>
                <div className={ styles.input_wrapper }>
                  <input type="text" name="username" id="username" placeholder="Username" />
                  <br />
                  <input type="password" name="password" id="password" placeholder="Password" />
                  <br />
                  <input type="password" name="confirm_password" id="confirm_password" placeholder="Confirm Password" />
                </div>
                <div className={ styles.form_btns_wrapper }>
                  <button type="submit" className={ styles.register_btn } id="register_btn">Register</button>
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