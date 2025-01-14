import initializeFirebase from "../firebase/firebase.init";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, sendPasswordResetEmail, deleteUser, sendEmailVerification } from "firebase/auth";
import { useEffect, useState } from "react";
import { adminEmail } from "../keys/adminEmail";

initializeFirebase();

const useFirebase = () => {
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [admin, setAdmin] = useState(false);
    const googleProvider = new GoogleAuthProvider();
    const auth = getAuth();
    const hanldeUserVerification = (navigate) => {
        setLoading(true)
        
        sendEmailVerification(auth.currentUser)
            .then(() => {
                // Email verification sent!
                // ...

                alert("A verification email is sent!!!")
                window.open("https://mail.google.com/", "_blank");
                handleLogOut()
                navigate('/login')


            })
            .catch(error => {
                setError(error)
                alert(`Verification is failed. Reason: ${error?.message}`)
            })
        setLoading(false)
    }
    const registerNewUser = async (name, email, password, navigate) => {
        setLoading(true);

        await createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {

                const newUser = { displayName: name, email: email, password: password };
                setUser(newUser);
                updateProfile(auth.currentUser, {
                    displayName: name
                }).then(() => {
                    // Set User Display Name

                }).catch((error) => {
                    // An error occurred At the time of setting user displayName

                });

                fetch("http://localhost:5000/users", {
                    method: "PUT",
                    headers: {
                        "content-type": "application/json"
                    },
                    body: JSON.stringify(newUser)
                })
                    .then()
                hanldeUserVerification(navigate)
                // sendEmailVerification(auth.currentUser)
                //     .then(() => {
                //         // Email verification sent!
                //         // ...

                //         alert("A verification email is sent!!!")
                //         window.open("https://mail.google.com/", "_blank");
                //         navigate('/login')

                //     })
                //     .catch(error => {
                //         setError(error)
                //         alert(`Verification is failed. Reason: ${error?.message}`)
                //     })

            })
            .catch((error) => {

                console.log(error)
                setError(error.message);

            })
            .finally(() => setLoading(false))
            ;
    }
   
    const loginUser = (email, password, navigate, location) => {
        setLoading(true);
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {

                console.log(userCredential)
                setError("");
                const redirect_url = location?.state?.from || "/";
                navigate(`../${redirect_url}`, { replace: true })
            })
            .catch((error) => {

                setError(error.message);
            })
            .finally(() => setLoading(false))
            ;
    }
    const googleLogIn = (navigate, location) => {
        setLoading(true);
        signInWithPopup(auth, googleProvider)
            .then((result) => {
                setError("");
                const newUser = { displayName: result.user.displayName, email: result.user.email };

                fetch("http://localhost:5000/users", {
                    method: "PUT",
                    headers: {
                        "content-type": "application/json"
                    },
                    body: JSON.stringify(newUser)
                })
                    .then()

                const redirect_url = location?.state?.from || "/home";
                navigate(`../${redirect_url}`, { replace: true })
            }).catch((error) => {
                setError(error.message);
            })
            .finally(() => setLoading(false))
            ;
    }
    const forgetPassword = (email) => {
        try {
            sendPasswordResetEmail(auth, email).then(() => {
                alert(`An email to reset your password is sent to your email address ${email}`);

            })
        }
        catch (error) {
            alert(error.message);
        }

    }

    const handleLogOut = () => {
        setLoading(true);
        signOut(auth).then(() => {
            setUser({})
            setAdmin(false)
            setLoading(false);
        })
    }
    
    const handleDeleteAccount = async (id, navigate) => {

        setLoading(true)

        await deleteUser(auth.currentUser).then(async () => {
            // handleLogOut()
            try {
                await fetch(`http://localhost:5000/users/${id}`, {
                    method: 'DELETE'
                })
                    .then(res => res.json())
                    .then(data => {
                        // Do some stuff...
                        console.log(data)
                    })
                    .catch(err => console.log(err));
            } catch (error) {
                console.log(error)
                setError(error?.message)
            }

            // User deleted.
        }).catch((error) => {
            // An error ocurred
            // ...

            setError(error?.message)
        })

        setLoading(false)

    }
    useEffect(() => {
        setLoading(true);

        onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
                
                if (user?.email === adminEmail) setAdmin(true)
                else setAdmin(false)
            }
            else {
                setUser({});

            }
            setLoading(false);
        });
    }, [auth])

    return {
        user,
        googleLogIn,
        handleLogOut,
        loading,
        setLoading,
        registerNewUser,
        loginUser,
        error,
        admin,
        forgetPassword,
        handleDeleteAccount,
        hanldeUserVerification
    }
}
export default useFirebase;