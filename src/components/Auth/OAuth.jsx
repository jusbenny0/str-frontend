import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import { app } from '../../../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../../../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';

export default function OAuth() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleGoogleClick = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);

            const result = await signInWithPopup(auth, provider);
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/google`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: result.user.displayName,
                    email: result.user.email,
                    photo: result.user.photoURL,
                }),
            });
            const data = await res.json();
            console.log(data);
            dispatch(signInSuccess(data));
            setTimeout(() => {
                navigate('/getinfo');
            }, 200);
        } catch (error) {
            console.log('could not login with google', error);
        }
    };
    return (
        <button
            type='button'
            onClick={handleGoogleClick}
            className='bg-white hover:bg-opacity-80 transition-colors flex justify-center items-center text-white rounded-lg uppercase hover:opacity-95 w-fit p-2 px-3 '
        >
            <img src="/img/googleLogo.png" alt="" width={30} />
        </button>
    );
}