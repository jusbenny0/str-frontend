import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from '../../redux/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import OAuth from '../components/Auth/OAuth';
import { ArrowLeft, CheckSquare, Square } from '@phosphor-icons/react';
import GoBackArrow from '../components/Auth/GoBackArrow';
import ShowPass from '../components/Auth/ShowPass';

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const [showPassword, setShowPassword] = useState(false)

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data));
        return;
      }
      dispatch(signInSuccess(data));
      navigate('/');
    } catch (error) {
      dispatch(signInFailure(error));
    }
  };


  const inputClassUserEmail = "w-full p-2 placeholder:opacity-60  rounded-lg focus:outline-none bg-gray-300 placeholder:text-black focus:bg-opacity-60 bg-opacity-25 transition-colors duration-300"
  const passwordClass = "w-full rounded-lg placeholder:opacity-60 bg-gray-300 placeholder:text-black text-black p-2 focus:outline-none focus:bg-opacity-60 bg-opacity-25 transition-colors duration-300"




  return (
    <div>
      <div className="w-screen h-screen flex flex-col justify-center items-center bg-gradient-to-tr from-pink-400 to-pink-100">
        <h2 className="text-3xl font-bold mb-6 gradient-text h-[40px]">Log In</h2>
        <form
          className="sm:w-full w-[80%] max-w-sm bg-opacity-60 bg-black p-6 rounded-lg shadow-xl flex flex-col space-y-4 "
          onSubmit={handleSubmit}
        >
          <div>
            <label
              htmlFor="email"
              className="block text-white font-medium mb-1">
              Email
            </label>
            <div className="border-gradient">
              <input
                type='email'
                placeholder='Enter your email or username'
                id='email'
                className={`${inputClassUserEmail}`}
                onChange={handleChange}
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-white font-medium mb-1">
              Heslo
            </label>
            <div className="border-gradient">
              <input
                type={showPassword ? "text" : "password"}
                placeholder='Enter your password'
                id='password'
                className={`${passwordClass}`}
                onChange={handleChange}
                title='Your password must have at least 8 symbols, 1 special, 1 capital letter and 1 number'
              />
            </div>
          </div>
          <ShowPass yourState={showPassword} setYourState={setShowPassword} />
          <div className="flex gap-2">

            <button
              disabled={loading}
              className='w-full py-3 text-white rounded-md mesh-gradient transition-all'
            >
              {loading ? 'Načítám...' : 'Přihlásit se'}
            </button>
            <OAuth />
          </div>
        </form>

        <h3 className="text-gray-700 sm:w-full flex flex-row justify-center items-center gap-2 mt-3">
          <p className="text-white">Nemáš učet?{' '}</p>
          <Link
            to="/register"
            className="text-black hover:font-bold transition-all hover:text-[#ba2ae6] duration-300 w-[100px] flex justify-center"
          >
            Registruj se!
          </Link>
        </h3>
      </div>
      <GoBackArrow componentColor='white' whereTo="/" />
    </div>

  );
}
