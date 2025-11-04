module.exports=[194296,(a,b,c)=>{"use strict";b.exports=a.r(195109).vendored["react-ssr"].ReactDOM},224910,a=>{"use strict";var b=a.i(772213);let c=b.gql`
  fragment AuthResponseFragment on AuthResponse {
    accessToken
    refreshToken
    user {
      id
      email
      username
      firstName
      lastName
      avatar
      role
      isActive
      isVerified
      createdAt
    }
  }
`,d=b.gql`
  fragment OtpResponseFragment on OtpResponse {
    success
    message
  }
`,e=b.gql`
  ${c}
  mutation LoginUser($input: LoginUserInput!) {
    loginUser(input: $input) {
      ...AuthResponseFragment
    }
  }
`,f=b.gql`
  ${c}
  mutation LoginWithGoogle($input: SocialLoginInput!) {
    loginWithGoogle(input: $input) {
      ...AuthResponseFragment
    }
  }
`,g=b.gql`
  ${c}
  mutation LoginWithFacebook($input: SocialLoginInput!) {
    loginWithFacebook(input: $input) {
      ...AuthResponseFragment
    }
  }
`,h=b.gql`
  ${c}
  mutation LoginWithPhone($input: PhoneLoginInput!) {
    loginWithPhone(input: $input) {
      ...AuthResponseFragment
    }
  }
`,i=b.gql`
  ${d}
  mutation RequestPhoneVerification($input: RequestPhoneVerificationInput!) {
    requestPhoneVerification(input: $input) {
      ...OtpResponseFragment
    }
  }
`,j=b.gql`
  ${c}
  mutation RegisterUser($input: RegisterUserInput!) {
    registerUser(input: $input) {
      ...AuthResponseFragment
    }
  }
`;b.gql`
  mutation AdminResetPassword($input: AdminResetPasswordInput!) {
    adminResetPassword(input: $input) {
      success
      message
      newPassword
      user {
        id
        email
        username
        firstName
        lastName
        avatar
        roleType
        isActive
        isVerified
        createdAt
      }
    }
  }
`,b.gql`
  mutation UpdateProfile($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
      id
      email
      username
      firstName
      lastName
      avatar
      phone
      roleType
      isActive
      isVerified
    }
  }
`,b.gql`
  mutation ChangePassword($input: ChangePasswordInput!) {
    changePassword(input: $input)
  }
`,b.gql`
  mutation SetPassword($input: SetPasswordInput!) {
    setPassword(input: $input)
  }
`,b.gql`
  query HasPassword {
    hasPassword
  }
`,b.gql`
  query GetMe {
    getMe {
      id
      email
      username
      firstName
      lastName
      avatar
      phone
      roleType
      isActive
      isVerified
      createdAt
      updatedAt
    }
  }
`,a.s(["LOGIN_USER",0,e,"LOGIN_WITH_FACEBOOK",0,g,"LOGIN_WITH_GOOGLE",0,f,"LOGIN_WITH_PHONE",0,h,"REGISTER_USER",0,j,"REQUEST_PHONE_VERIFICATION",0,i])},514272,a=>{"use strict";var b=a.i(651332);let c=(0,b.createContext)(null);function d({clientId:a,nonce:d,onScriptLoadSuccess:e,onScriptLoadError:f,children:g}){let h=function(a={}){let{nonce:c,onScriptLoadSuccess:d,onScriptLoadError:e}=a,[f,g]=(0,b.useState)(!1),h=(0,b.useRef)(d);h.current=d;let i=(0,b.useRef)(e);return i.current=e,(0,b.useEffect)(()=>{let a=document.createElement("script");return a.src="https://accounts.google.com/gsi/client",a.async=!0,a.defer=!0,a.nonce=c,a.onload=()=>{var a;g(!0),null==(a=h.current)||a.call(h)},a.onerror=()=>{var a;g(!1),null==(a=i.current)||a.call(i)},document.body.appendChild(a),()=>{document.body.removeChild(a)}},[c]),f}({nonce:d,onScriptLoadSuccess:e,onScriptLoadError:f}),i=(0,b.useMemo)(()=>({clientId:a,scriptLoadedSuccessfully:h}),[a,h]);return b.default.createElement(c.Provider,{value:i},g)}let e={large:40,medium:32,small:20};function f({onSuccess:a,onError:d,useOneTap:f,promptMomentNotification:g,type:h="standard",theme:i="outline",size:j="large",text:k,shape:l,logo_alignment:m,width:n,locale:o,click_listener:p,containerProps:q,...r}){let s=(0,b.useRef)(null),{clientId:t,scriptLoadedSuccessfully:u}=function(){let a=(0,b.useContext)(c);if(!a)throw Error("Google OAuth components must be used within GoogleOAuthProvider");return a}(),v=(0,b.useRef)(a);v.current=a;let w=(0,b.useRef)(d);w.current=d;let x=(0,b.useRef)(g);return x.current=g,(0,b.useEffect)(()=>{var a,b,c,d,e,g,q,y,z;if(u)return null==(c=null==(b=null==(a=null==window?void 0:window.google)?void 0:a.accounts)?void 0:b.id)||c.initialize({client_id:t,callback:a=>{var b,c;if(!(null==a?void 0:a.credential))return null==(b=w.current)?void 0:b.call(w);let{credential:d,select_by:e}=a;v.current({credential:d,clientId:null!=(c=null==a?void 0:a.clientId)?c:null==a?void 0:a.client_id,select_by:e})},...r}),null==(g=null==(e=null==(d=null==window?void 0:window.google)?void 0:d.accounts)?void 0:e.id)||g.renderButton(s.current,{type:h,theme:i,size:j,text:k,shape:l,logo_alignment:m,width:n,locale:o,click_listener:p}),f&&(null==(z=null==(y=null==(q=null==window?void 0:window.google)?void 0:q.accounts)?void 0:y.id)||z.prompt(x.current)),()=>{var a,b,c;f&&(null==(c=null==(b=null==(a=null==window?void 0:window.google)?void 0:a.accounts)?void 0:b.id)||c.cancel())}},[t,u,f,h,i,j,k,l,m,n,o]),b.default.createElement("div",{...q,ref:s,style:{height:e[j],...null==q?void 0:q.style}})}a.s(["GoogleLogin",()=>f,"GoogleOAuthProvider",()=>d])},937768,288764,a=>{"use strict";var b=a.i(321248),c=a.i(8912),d=a.i(514272),e=a.i(224910),f=a.i(189101),g=a.i(53627),h=a.i(651332);class i extends Error{}function j(){let[a,j]=(0,h.useState)(!1);(0,g.useRouter)();let[k]=(0,c.useMutation)(e.LOGIN_WITH_GOOGLE),l=async a=>{if(!a.credential){console.error("No credential received from Google"),f.toast.error("Google login failed. Please try again.");return}try{j(!0);let b=function(a,b){let c;if("string"!=typeof a)throw new i("Invalid token specified: must be a string");b||(b={});let d=+(!0!==b.header),e=a.split(".")[d];if("string"!=typeof e)throw new i(`Invalid token specified: missing part #${d+1}`);try{c=function(a){let b=a.replace(/-/g,"+").replace(/_/g,"/");switch(b.length%4){case 0:break;case 2:b+="==";break;case 3:b+="=";break;default:throw Error("base64 string is not of the correct length")}try{var c;return c=b,decodeURIComponent(atob(c).replace(/(.)/g,(a,b)=>{let c=b.charCodeAt(0).toString(16).toUpperCase();return c.length<2&&(c="0"+c),"%"+c}))}catch(a){return atob(b)}}(e)}catch(a){throw new i(`Invalid token specified: invalid base64 for part #${d+1} (${a.message})`)}try{return JSON.parse(c)}catch(a){throw new i(`Invalid token specified: invalid json for part #${d+1} (${a.message})`)}}(a.credential);console.log("Decoded Google token:",b);let{data:c}=await k({variables:{input:{token:a.credential,provider:"GOOGLE",email:b.email,providerId:b.sub,firstName:b.given_name,lastName:b.family_name,avatar:b.picture}}});if(console.log("Login response:",c),c?.loginWithGoogle){let{accessToken:a,refreshToken:b,user:d}=c.loginWithGoogle;localStorage.setItem("accessToken",a),b&&localStorage.setItem("refreshToken",b),localStorage.setItem("user",JSON.stringify(d)),d.createdAt&&new Date(d.createdAt)>new Date(Date.now()-5e3)?f.toast.success(`Welcome to rausachcore, ${d.firstName||d.username}! Your account has been created.`):f.toast.success(`Welcome back, ${d.firstName||d.username}!`),setTimeout(()=>{window.location.href="/admin"},500)}else f.toast.error("Google login failed. Please try again.")}catch(a){console.error("Error processing Google login:",a),a.message.includes("User not found")?f.toast.error("Account not found. Please register first."):a.message.includes("Account is disabled")?f.toast.error("Your account has been disabled. Please contact support."):f.toast.error("Google login failed. Please try again.")}finally{j(!1)}};return(0,b.jsxs)("div",{className:"w-full",children:[(0,b.jsx)(d.GoogleLogin,{onSuccess:l,onError:()=>{console.error("Google login failed"),f.toast.error("Google login failed. Please try again.")},text:"continue_with",shape:"rectangular",theme:"outline",size:"large",logo_alignment:"center"}),a&&(0,b.jsxs)("div",{className:"flex items-center justify-center mt-2",children:[(0,b.jsx)("div",{className:"animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"}),(0,b.jsx)("span",{className:"ml-2 text-sm text-gray-600",children:"Signing you in..."})]})]})}i.prototype.name="InvalidTokenError",a.s(["default",()=>j],937768);var k=a.i(772213);k.gql`
  mutation LoginWithGoogle($input: SocialLoginInput!) {
    loginWithGoogle(input: $input) {
      token
      user {
        id
        email
        name
        avatar
        gid
        createdAt
        updatedAt
      }
    }
  }
`;let l=k.gql`
  mutation LoginWithFacebook($input: SocialLoginInput!) {
    loginWithFacebook(input: $input) {
      token
      user {
        id
        email
        name
        avatar
        fid
        createdAt
        updatedAt
      }
    }
  }
`;k.gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      user {
        id
        email
        name
        avatar
        createdAt
        updatedAt
      }
    }
  }
`,k.gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      token
      user {
        id
        email
        name
        avatar
        createdAt
        updatedAt
      }
    }
  }
`,a.s(["default",0,({onSuccess:a,onError:d})=>{let[e,i]=(0,h.useState)(!1),[j,k]=(0,h.useState)(!1),m=(0,g.useRouter)(),[n]=(0,c.useMutation)(l,{onCompleted:b=>{let{token:c,user:d}=b.loginWithFacebook;localStorage.setItem("authToken",c),f.toast.success(`Welcome ${d.name||d.email}!`),a&&a(b.loginWithFacebook),m.push("/admin")},onError:a=>{console.error("Facebook login error:",a),f.toast.error(a.message||"Facebook login failed"),d&&d(a),i(!1)}});return(0,h.useEffect)(()=>{(()=>{var a,b,c;if(window.FB)return k(!0);window.fbAsyncInit=function(){window.FB.init({appId:process.env.NEXT_PUBLIC_FACEBOOK_APP_ID,cookie:!0,xfbml:!0,version:"v18.0"}),k(!0)},c=(a=document).getElementsByTagName("script")[0],a.getElementById("facebook-jssdk")||((b=a.createElement("script")).id="facebook-jssdk",b.src="https://connect.facebook.net/en_US/sdk.js",c.parentNode?.insertBefore(b,c))})()},[]),(0,b.jsxs)("div",{className:"w-full",children:[(0,b.jsx)("button",{onClick:()=>{j&&window.FB?(i(!0),window.FB.login(a=>{if(a.authResponse){let{accessToken:b}=a.authResponse;n({variables:{input:{token:b,provider:"FACEBOOK"}}})}else i(!1),f.toast.error("Facebook login was cancelled")},{scope:"email,public_profile"})):f.toast.error("Facebook SDK not loaded")},disabled:e||!j,className:"w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200",children:e?(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)("div",{className:"animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-3"}),"Signing you in..."]}):(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)("svg",{className:"w-5 h-5 mr-3",viewBox:"0 0 24 24",fill:"currentColor",children:(0,b.jsx)("path",{d:"M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"})}),"Continue with Facebook"]})}),!j&&(0,b.jsxs)("div",{className:"flex items-center justify-center mt-2",children:[(0,b.jsx)("div",{className:"animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"}),(0,b.jsx)("span",{className:"ml-2 text-sm text-gray-600",children:"Loading Facebook..."})]})]})}],288764)},870729,a=>{"use strict";var b=a.i(321248),c=a.i(651332),d=a.i(8912),e=a.i(224910),f=a.i(514272),g=a.i(937768),h=a.i(288764);a.s(["default",0,()=>{let{handleLogin:a,handleGoogleLogin:i,handleFacebookLogin:j,handlePhoneLogin:k,handleRequestOtp:l,handleRegister:m,logout:n,loginLoading:o,googleLoading:p,facebookLoading:q,phoneLoading:r,otpLoading:s,registerLoading:t}=(()=>{let[a,{loading:b}]=(0,d.useMutation)(e.LOGIN_USER),[c,{loading:f}]=(0,d.useMutation)(e.LOGIN_WITH_GOOGLE),[g,{loading:h}]=(0,d.useMutation)(e.LOGIN_WITH_FACEBOOK),[i,{loading:j}]=(0,d.useMutation)(e.LOGIN_WITH_PHONE),[k,{loading:l}]=(0,d.useMutation)(e.REQUEST_PHONE_VERIFICATION),[m,{loading:n}]=(0,d.useMutation)(e.REGISTER_USER);return{handleLogin:async b=>{try{let{accessToken:c,refreshToken:d,user:e}=(await a({variables:{input:b}})).data.loginUser;return localStorage.setItem("accessToken",c),localStorage.setItem("refreshToken",d),localStorage.setItem("user",JSON.stringify(e)),{success:!0,user:e,accessToken:c,refreshToken:d}}catch(a){return{success:!1,error:a.message}}},handleGoogleLogin:async a=>{try{let{accessToken:b,refreshToken:d,user:e}=(await c({variables:{input:a}})).data.loginWithGoogle;return localStorage.setItem("accessToken",b),localStorage.setItem("refreshToken",d),localStorage.setItem("user",JSON.stringify(e)),{success:!0,user:e,accessToken:b,refreshToken:d}}catch(a){return{success:!1,error:a.message}}},handleFacebookLogin:async a=>{try{let{accessToken:b,refreshToken:c,user:d}=(await g({variables:{input:a}})).data.loginWithFacebook;return localStorage.setItem("accessToken",b),localStorage.setItem("refreshToken",c),localStorage.setItem("user",JSON.stringify(d)),{success:!0,user:d,accessToken:b,refreshToken:c}}catch(a){return{success:!1,error:a.message}}},handlePhoneLogin:async a=>{try{let{accessToken:b,refreshToken:c,user:d}=(await i({variables:{input:a}})).data.loginWithPhone;return localStorage.setItem("accessToken",b),localStorage.setItem("refreshToken",c),localStorage.setItem("user",JSON.stringify(d)),{success:!0,user:d,accessToken:b,refreshToken:c}}catch(a){return{success:!1,error:a.message}}},handleRequestOtp:async a=>{try{return(await k({variables:{input:a}})).data.requestPhoneVerification}catch(a){return{success:!1,message:a.message}}},handleRegister:async a=>{try{let{accessToken:b,refreshToken:c,user:d}=(await m({variables:{input:a}})).data.registerUser;return localStorage.setItem("accessToken",b),localStorage.setItem("refreshToken",c),localStorage.setItem("user",JSON.stringify(d)),{success:!0,user:d,accessToken:b,refreshToken:c}}catch(a){return{success:!1,error:a.message}}},logout:()=>{localStorage.removeItem("accessToken"),localStorage.removeItem("refreshToken"),localStorage.removeItem("user")},loginLoading:b,googleLoading:f,facebookLoading:h,phoneLoading:j,otpLoading:l,registerLoading:n}})(),[u,v]=(0,c.useState)(""),[w,x]=(0,c.useState)(""),[y,z]=(0,c.useState)(!1),[A,B]=(0,c.useState)(""),C=async()=>{if(!u)return void B("Vui lòng nhập số điện thoại");let a=await l({phone:u});a.success&&z(!0),B(a.message)},D=async()=>{if(!u||!w)return void B("Vui lòng nhập số điện thoại và mã OTP");let a=await k({phone:u,otp:w});a.success?(B("Đăng nhập thành công!"),console.log("User:",a.user)):B(a.error)};return(0,b.jsxs)("div",{className:"p-6 max-w-md mx-auto bg-white rounded-lg shadow-md",children:[(0,b.jsx)("h2",{className:"text-2xl font-bold mb-6",children:"Demo Authentication"}),A&&(0,b.jsx)("div",{className:"mb-4 p-3 bg-blue-100 border border-blue-300 rounded",children:A}),(0,b.jsxs)("div",{className:"mb-6 p-4 bg-gray-50 rounded-lg",children:[(0,b.jsx)("h3",{className:"text-sm font-semibold text-gray-700 mb-2",children:"Current Status"}),(0,b.jsxs)("p",{className:"text-sm text-gray-600",children:["User authenticated: ",(0,b.jsx)("span",{className:"font-medium",children:"Not checked"})]}),(0,b.jsx)("p",{className:"text-sm text-gray-600",children:"Authentication tokens are handled automatically by OAuth components"})]}),(0,b.jsxs)("div",{className:"mb-6",children:[(0,b.jsx)("h3",{className:"text-lg font-semibold mb-3",children:"Đăng nhập bằng số điện thoại"}),(0,b.jsx)("input",{type:"tel",placeholder:"Số điện thoại",value:u,onChange:a=>v(a.target.value),className:"w-full p-2 border rounded mb-2"}),y?(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)("input",{type:"text",placeholder:"Nhập mã OTP",value:w,onChange:a=>x(a.target.value),className:"w-full p-2 border rounded mb-2"}),(0,b.jsx)("button",{onClick:D,disabled:r,className:"w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 disabled:opacity-50",children:r?"Đang đăng nhập...":"Đăng nhập"})]}):(0,b.jsx)("button",{onClick:C,disabled:s,className:"w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50",children:s?"Đang gửi...":"Gửi mã OTP"})]}),(0,b.jsxs)("div",{className:"mb-6",children:[(0,b.jsx)("h3",{className:"text-lg font-semibold mb-3",children:"Đăng nhập mạng xã hội"}),(0,b.jsxs)("div",{className:"space-y-3",children:[(0,b.jsx)(f.GoogleOAuthProvider,{clientId:"897974685698-621ekaodhnha7ssfaml6m1u418ab2ucq.apps.googleusercontent.com",children:(0,b.jsx)(g.default,{})}),(0,b.jsx)(h.default,{})]})]}),(0,b.jsx)("button",{onClick:n,className:"w-full bg-gray-500 text-white p-2 rounded hover:bg-gray-600 mb-6",children:"Đăng xuất"}),(0,b.jsxs)("div",{className:"mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg",children:[(0,b.jsx)("h4",{className:"text-sm font-semibold text-yellow-800 mb-2",children:"Demo Instructions"}),(0,b.jsxs)("ul",{className:"text-xs text-yellow-700 space-y-1",children:[(0,b.jsx)("li",{children:"• Google/Facebook OAuth buttons connect to real authentication APIs"}),(0,b.jsx)("li",{children:"• Phone OTP is simulated for demo purposes"}),(0,b.jsx)("li",{children:"• Successful logins redirect to dashboard automatically"}),(0,b.jsx)("li",{children:"• JWT tokens are stored in localStorage"})]})]})]})}],870729)}];

//# sourceMappingURL=_392b5a70._.js.map