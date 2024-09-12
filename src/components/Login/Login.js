import React from 'react'
import Button from "../Button_white/Button_white";
import { signInWithPopup } from 'firebase/auth';
function Login() {
  return (
    <div>
			<SignInButton/>
		</div>
	)
}

export default Login

//サインインボタン
function SignInButton(){
	const signInWithGoogle = () =>{
		//ログインする
		sign
	};

	return(
		<Button onClick={signInWithGoogle}>
			<p>ログイン</p>
		</Button>
	)
}