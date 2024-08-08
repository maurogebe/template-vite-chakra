import { useSelector, useDispatch } from "react-redux";
import { initialState, setUser } from "../../store/auth/userSlice";
import { apiSignIn } from "../../services/AuthService";
import {
	AuthState,
  onSignInSuccess,
  onSignOutSuccess
} from "../../store/auth/sessionSlice";
import appConfig from "../../configs/app.config";
import { REDIRECT_URL_KEY } from "../../constants/app.constant";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../store";
import useQuery from "./useQuery";
import { toast } from "../../App";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../configs/firebase.config";

function useAuth() {

  const dispatch = useDispatch();
  const navigate = useNavigate();
	const query = useQuery()

  const { token, signedIn }: AuthState = useSelector((state: RootState) => state.auth.session);
  
  const provider = new GoogleAuthProvider();

  const signInWithGoogle = async() => {
    const signInGoogle = await signInWithPopup(auth, provider);
    let token: string | null = null;
    if(auth?.currentUser) token = await auth.currentUser.getIdToken();
    if (token && signInGoogle) {
      const user = signInGoogle.user;
      dispatch(onSignInSuccess(token));
        if (user) {
          dispatch(
            setUser({
              avatar: user.photoURL,
              userName: user.displayName,
              authority: ["USER"],
              email: user.email
            }));
        }
        const redirectUrl = query.get(REDIRECT_URL_KEY);
        navigate(redirectUrl ? redirectUrl : appConfig.authenticatedEntryPath);
        return {
          status: "success",
          message: "",
        };
    }
  }

  const signIn = async ({ email, password }: any) => {
    try {
      const resp = await apiSignIn({ email, password });
      if (resp.data) {
        const { token } = resp.data;
        dispatch(onSignInSuccess(token));
        if (resp.data.user) {
          dispatch(
            setUser(
              resp.data?.id ? {
                avatar: "",
                userName: `${resp.data.firstName} ${resp.data.lastName}`,
                authority: ["USER"],
                email: resp.data.email
              } : {
                avatar: "",
                userName: "Anonymous",
                authority: ["USER"],
                email: ""
              }
            )
          );
        }
        const redirectUrl = query.get(REDIRECT_URL_KEY);
        navigate(redirectUrl ? redirectUrl : appConfig.authenticatedEntryPath);
        return {
          status: "success",
          message: "",
        };
      }
    } catch (errors: any) {
      if(errors?.response?.status === 401) {
        toast({
          title: errors.response?.data?.message,
          status: 'error',
          duration: 6000,
          isClosable: true
        })
      }
      return {
        status: "failed",
        message: errors?.response?.data?.message || errors.toString(),
      };
    }
  };
  
	const signOut = ()  => {
		dispatch(onSignOutSuccess())
		dispatch(setUser(initialState))
		navigate(appConfig.unAuthenticatedEntryPath)
	}

  return {
    authenticated: token && signedIn,
    signIn,
    signInWithGoogle,
    signOut
  };
}

export default useAuth;
