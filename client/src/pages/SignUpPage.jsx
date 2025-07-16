import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IoEye, IoEyeOff } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { FiLoader } from 'react-icons/fi';
import { signup } from '@/services/authService';

function SignUpPage({ buttonText }) {

  const { isSigningUp } = useSelector(store => store.auth);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await dispatch(signup(data));
    if (success) {
      navigate('/');
      setData({name:'' , email: '', password: '' });
    }
  };

  return (
    <div className='h-screen flex justify-center items-center'>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Create your account</CardTitle>
          <CardDescription>
            Enter your details below to create a new account
          </CardDescription>
          <CardAction onClick={() => navigate('/login')}>
            <Button variant="link">Sign In</Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Name</Label>
                <Input
                  type="text"
                  placeholder="John Doe"
                  value={data.name}
                  onChange={(e) => setData({ ...data, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  type="text"
                  placeholder="m@example.com"
                  value={data.email}
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <div className="flex items-center justify-center gap-2">
                  <Input
                    type={`${showPassword ? 'text' : 'password'}`}
                    value={data.password}
                    onChange={(e) => setData({ ...data, password: e.target.value })}
                  />
                  {showPassword ?
                    <IoEyeOff size={20} onClick={() => setShowPassword(false)} /> :
                    <IoEye size={20} onClick={() => setShowPassword(true)} />}
                </div>
              </div>

              <Button type='submit'>
                {isSigningUp ? <FiLoader className='size-8 animate-spin' /> : buttonText || 'Submit'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default SignUpPage