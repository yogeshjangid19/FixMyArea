import React, { useState } from 'react';
import signupImg from '../assets/images/signup.gif';
import avatar from '../assets/images/doctor-img01.png';
import { Link } from 'react-router-dom';

const Signup = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState("");
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    photo: '',
    gender: '',
    role: 'patient',
  });

  // Handle input change
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle file selection
  const handleFileInputChange = async (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    // Convert file to Base64
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setFormData({ ...formData, photo: reader.result });
      setPreviewURL(reader.result);
    };
  };

  // Handle form submission
  const submitHandler = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/v1/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }

      console.log("Signup successful:", data);
      alert("Signup successful!");
    } catch (error) {
      console.error("Signup Error:", error);
      alert("Signup failed! " + error.message);
    }
  };

  return (
    <section className='px-5 xl:px-0'>
      <div className='max-w-[1170px] mx-auto'>
        <div className='grid grid-cols-1 lg:grid-cols-2'>
          {/* Left Side Image */}
          <div className='hidden lg:block bg-blue-500 rounded-l-lg'>
            <figure className='rounded-l-lg'>
              <img src={signupImg} alt="" />
            </figure>
          </div>

          {/* Signup Form */}
          <div className="rounded-l-lg lg:pl-16 py-10">
            <h3 className='text-headingColor text-[22px] leading-9 font-bold mb-10'>
              Create an <span className='text-[#32609f]'> account</span>
            </h3>

            <form onSubmit={submitHandler}>
              <div className='mb-5'>
                <input
                  type="text"
                  placeholder='Enter Your Full Name'
                  name='name'
                  value={formData.name}
                  onChange={handleInputChange}
                  className='w-full py-3 border-b focus:border-b-blue-500'
                  required
                />
              </div>
              <div className='mb-5'>
                <input
                  type="email"
                  placeholder='Enter Your Email'
                  name='email'
                  value={formData.email}
                  onChange={handleInputChange}
                  className='w-full py-3 border-b focus:border-b-blue-500'
                  required
                />
              </div>
              <div className='mb-5'>
                <input
                  type="password"
                  placeholder='Enter Your Password'
                  name='password'
                  value={formData.password}
                  onChange={handleInputChange}
                  className='w-full py-3 border-b focus:border-b-blue-500'
                  required
                />
              </div>

              <div className="mb-5 flex items-center justify-between">
                <label>
                  Role:
                  <select name="role" value={formData.role} onChange={handleInputChange}>
                    <option value="patient">Patient</option>
                    <option value="doctor">Doctor</option>
                  </select>
                </label>

                <label>
                  Gender:
                  <select name="gender" value={formData.gender} onChange={handleInputChange}>
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </label>
              </div>

              <div className="mb-5 flex items-center gap-3">
                <figure className='w-[60px] h-[60px] rounded-full border-2 flex items-center justify-center'>
                  <img src={previewURL || avatar} alt="Preview" className='w-full rounded-full' />
                </figure>

                <input
                  type="file"
                  accept='.jpg, .png, .jpeg'
                  onChange={handleFileInputChange}
                />
              </div>

              <button type='submit' className='w-full bg-blue-500 text-white px-4 py-3 rounded-lg'>
                Sign Up
              </button>

              <p className='mt-5 text-center'>
                Already have an account? 
                <Link className="text-blue-600 font-medium ml-1" to='/login'>Login</Link>
              </p>

            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Signup;
