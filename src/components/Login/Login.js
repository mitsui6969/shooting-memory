import React from 'react'
import Button from "../Button_white/Button_white";
import {auth,provider} from'../../firebase/firebase-app';
import { signInWithPopup } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

function Login() {

	const [user] = useAuthState(auth);

  return (
    <div>
			{user ? (
				<>
					<UserInfo/>
					<SignOutButton />
				</>
			) : (
				<SignInButton/>
			)}
			<SignInButton/>
		</div>
	)
}

export default Login

//サインインボタン
function SignInButton(){
	const signInWithGoogle = () =>{
		signInWithPopup(auth,provider);
		
	};

	return(
		<Button onClick={signInWithGoogle}>
			<p>ログイン</p>
		</Button>
	)
}

//サインアウトボタン
function SignOutButton(){

	return(
		<Button onClick={() => auth.signOut}>
			<p>サインアウト</p>
		</Button>
	)
}


function UserInfo(){

	return(
		<div>
			
		</div>
	)
}