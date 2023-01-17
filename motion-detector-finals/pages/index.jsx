import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../styles/Index.module.css'
import { useEffect } from 'react';


export default function Index({ data }) {
  // Handles the submit event on form submit.
  const login = async (event) => {

    // Stop the form from submitting and refreshing the page.
    event.preventDefault()
     // Get data from the form.

     const username = event.target.username.value
     const password = event.target.password.value

    if ( password == null || password == '' ) {
      alert("Enter your password.");
      return false
    }

    if ( username == null || username == '' ) {
      alert("Enter your username.");
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
    const endpoint = 'http://localhost:4000/post-login'

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
    console.log(result.message)

    if ( result.message == 'Success' ) {
      window.location.replace("http://localhost:3000/home")
    } else {
      alert(result.message)
    }
} 
  useEffect(()=> {
    if ( data.redirect_home == 'yes' ) {
      window.location.replace("http://localhost:3000/home")
      return
    } 
  })
 return (
    <div>
      <Head>
        <title>Team Rocket</title>
        <meta name="description" content="Team Rocket Finals in Embedded System" />
        <link rel="icon" href="/rocketmind.ico" />
      </Head>

      <main className={ styles.main }>
        <div className={ styles.signin_wrapper }>
          <div className={ styles.left_wrapper }>
            <div className={ styles.header }>Sign in to</div>
            <div className={ styles.team }>Team Rocket</div>
            <div className={ styles.description }>and try our motion detector application!</div>
            <div className={ styles.register_link_wrapper }>
              You can&nbsp;
              <span>
                <Link className={ styles.register_link }href="/signup">register here.</Link>
              </span>
            </div>
            <div className={ styles.img_wrapper }>
              <Image width={300} height={350} src="/chat-smile.png" alt="image"></Image>
            </div>

          </div>

          <div className={ styles.right_wrapper }>
            <div className={ styles.login_form }>
              <div className={ styles.login }>Login</div>
              <form method="post" onSubmit={login}>
                <div className={ styles.input_wrapper }>
                  <input type="text" name="username" id="username" placeholder="Username" />
                  <br />
                  <input type="password" name="password" id="password" placeholder="Password" />
                </div>
                <div className={ styles.form_btns_wrapper }>
                  <button type="submit" className={ styles.login_btn }>Login</button>
                  <Link href="http://localhost:3000/signup">
                    <button className={ styles.signup_btn }>Signup</button>
                  </Link>
                  
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

export async function getServerSideProps() {
  // Fetch data from the server
  const res = await fetch('http://localhost:4000');

  // Get the json response
  const data = await res.json();
  console.log(data)

  return { props: { data } }
}