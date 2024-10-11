// src/components/Signup.tsx
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';
import { getFirestore, setDoc, doc } from 'firebase/firestore'; // Import Firestore functions

const Signup = () => {
    const navigate = useNavigate();
    const db = getFirestore(); // Initialize Firestore

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); // State to hold error messages

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevent default form submission
        setError(''); // Reset any previous errors

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            // Signed in
            const user = userCredential.user;
            console.log('User signed up:', user);

            // Create a document in the Users collection
            await setDoc(doc(db, 'Users', user.uid), {
                email: user.email,
                created_at: new Date(),
            });

            navigate("/login"); // Navigate to login after successful sign-up
        } catch (error) {
            const errorCode = (error as any).code;
            const errorMessage = (error as any).message;
            console.error('Error signing up:', errorCode, errorMessage);
            setError(errorMessage); // Set the error message to be displayed
        }
    };

    return (
        <main>        
            <section>
                <div>
                    <div>                  
                        <h1> ForecastAI </h1>                                                                            
                        <form onSubmit={onSubmit}> {/* Attach onSubmit here */}                                                                                         
                            <div>
                                <label htmlFor="email-address">
                                    Email address
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}  
                                    required                                    
                                    placeholder="Email address"                                
                                />
                            </div>

                            <div>
                                <label htmlFor="password">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)} 
                                    required                                 
                                    placeholder="Password"              
                                />
                            </div>

                            {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message */}

                            <button type="submit">  
                                Sign up                                
                            </button>

                        </form>

                        <p>
                            Already have an account?{' '}
                            <NavLink to="/login">
                                Sign in
                            </NavLink>
                        </p>                   
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Signup;
