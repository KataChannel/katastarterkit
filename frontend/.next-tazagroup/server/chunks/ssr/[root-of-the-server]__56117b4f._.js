module.exports=[59287,(a,b,c)=>{"use strict";b.exports=a.r(195109).vendored["react-ssr"].ReactServerDOMTurbopackClient},194296,(a,b,c)=>{"use strict";b.exports=a.r(195109).vendored["react-ssr"].ReactDOM},259689,(a,b,c)=>{"use strict";b.exports=a.r(195109).vendored.contexts.HooksClientContext},160324,(a,b,c)=>{"use strict";b.exports=a.r(195109).vendored.contexts.ServerInsertedHtml},556704,(a,b,c)=>{b.exports=a.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},832319,(a,b,c)=>{b.exports=a.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},120635,(a,b,c)=>{b.exports=a.x("next/dist/server/app-render/action-async-storage.external.js",()=>require("next/dist/server/app-render/action-async-storage.external.js"))},788787,(a,b,c)=>{"use strict";b.exports=a.r(195109).vendored.contexts.AppRouterContext},771160,(a,b,c)=>{"use strict";function d(a){if("function"!=typeof WeakMap)return null;var b=new WeakMap,c=new WeakMap;return(d=function(a){return a?c:b})(a)}c._=function(a,b){if(!b&&a&&a.__esModule)return a;if(null===a||"object"!=typeof a&&"function"!=typeof a)return{default:a};var c=d(b);if(c&&c.has(a))return c.get(a);var e={__proto__:null},f=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var g in a)if("default"!==g&&Object.prototype.hasOwnProperty.call(a,g)){var h=f?Object.getOwnPropertyDescriptor(a,g):null;h&&(h.get||h.set)?Object.defineProperty(e,g,h):e[g]=a[g]}return e.default=a,c&&c.set(a,e),e}},894955,(a,b,c)=>{"use strict";Object.defineProperty(c,"__esModule",{value:!0});var d={DEFAULT_SEGMENT_KEY:function(){return l},PAGE_SEGMENT_KEY:function(){return k},addSearchParamsIfPageSegment:function(){return i},computeSelectedLayoutSegment:function(){return j},getSegmentValue:function(){return f},getSelectedLayoutSegmentPath:function(){return function a(b,c,d=!0,e=[]){let g;if(d)g=b[1][c];else{let a=b[1];g=a.children??Object.values(a)[0]}if(!g)return e;let h=f(g[0]);return!h||h.startsWith(k)?e:(e.push(h),a(g,c,!1,e))}},isGroupSegment:function(){return g},isParallelRouteSegment:function(){return h}};for(var e in d)Object.defineProperty(c,e,{enumerable:!0,get:d[e]});function f(a){return Array.isArray(a)?a[1]:a}function g(a){return"("===a[0]&&a.endsWith(")")}function h(a){return a.startsWith("@")&&"@children"!==a}function i(a,b){if(a.includes(k)){let a=JSON.stringify(b);return"{}"!==a?k+"?"+a:k}return a}function j(a,b){if(!a||0===a.length)return null;let c="children"===b?a[0]:a[a.length-1];return c===l?null:c}let k="__PAGE__",l="__DEFAULT__"},535299,(a,b,c)=>{"use strict";Object.defineProperty(c,"__esModule",{value:!0}),Object.defineProperty(c,"InvariantError",{enumerable:!0,get:function(){return d}});class d extends Error{constructor(a,b){super(`Invariant: ${a.endsWith(".")?a:a+"."} This is a bug in Next.js.`,b),this.name="InvariantError"}}},735163,(a,b,c)=>{"use strict";function d(){let a,b,c=new Promise((c,d)=>{a=c,b=d});return{resolve:a,reject:b,promise:c}}Object.defineProperty(c,"__esModule",{value:!0}),Object.defineProperty(c,"createPromiseWithResolvers",{enumerable:!0,get:function(){return d}})},349161,(a,b,c)=>{"use strict";Object.defineProperty(c,"__esModule",{value:!0});var d={BailoutToCSRError:function(){return g},isBailoutToCSRError:function(){return h}};for(var e in d)Object.defineProperty(c,e,{enumerable:!0,get:d[e]});let f="BAILOUT_TO_CLIENT_SIDE_RENDERING";class g extends Error{constructor(a){super(`Bail out to client-side rendering: ${a}`),this.reason=a,this.digest=f}}function h(a){return"object"==typeof a&&null!==a&&"digest"in a&&a.digest===f}},619001,(a,b,c)=>{"use strict";Object.defineProperty(c,"__esModule",{value:!0}),Object.defineProperty(c,"useMergedRef",{enumerable:!0,get:function(){return e}});let d=a.r(651332);function e(a,b){let c=(0,d.useRef)(null),e=(0,d.useRef)(null);return(0,d.useCallback)(d=>{if(null===d){let a=c.current;a&&(c.current=null,a());let b=e.current;b&&(e.current=null,b())}else a&&(c.current=f(a,d)),b&&(e.current=f(b,d))},[a,b])}function f(a,b){if("function"!=typeof a)return a.current=b,()=>{a.current=null};{let c=a(b);return"function"==typeof c?c:()=>a(null)}}("function"==typeof c.default||"object"==typeof c.default&&null!==c.default)&&void 0===c.default.__esModule&&(Object.defineProperty(c.default,"__esModule",{value:!0}),Object.assign(c.default,c),b.exports=c.default)},17325,(a,b,c)=>{"use strict";Object.defineProperty(c,"__esModule",{value:!0}),Object.defineProperty(c,"warnOnce",{enumerable:!0,get:function(){return d}});let d=a=>{}},196915,a=>{"use strict";let b=(0,a.i(367990).default)("eye",[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",key:"1nclc0"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);a.s(["default",()=>b])},785903,a=>{"use strict";var b=a.i(196915);a.s(["Eye",()=>b.default])},843666,a=>{"use strict";let b=(0,a.i(367990).default)("eye-off",[["path",{d:"M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49",key:"ct8e1f"}],["path",{d:"M14.084 14.158a3 3 0 0 1-4.242-4.242",key:"151rxh"}],["path",{d:"M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143",key:"13bj9a"}],["path",{d:"m2 2 20 20",key:"1ooewy"}]]);a.s(["default",()=>b])},174110,a=>{"use strict";var b=a.i(843666);a.s(["EyeOff",()=>b.default])},598988,a=>{"use strict";var b=a.i(948428);let c=(a,c,d)=>{if(a&&"reportValidity"in a){let e=(0,b.get)(d,c);a.setCustomValidity(e&&e.message||""),a.reportValidity()}},d=(a,b)=>{for(let d in b.fields){let e=b.fields[d];e&&e.ref&&"reportValidity"in e.ref?c(e.ref,d,a):e&&e.refs&&e.refs.forEach(b=>c(b,d,a))}},e=(a,c)=>{c.shouldUseNativeValidation&&d(a,c);let e={};for(let d in a){let g=(0,b.get)(c.fields,d),h=Object.assign(a[d]||{},{ref:g&&g.ref});if(f(c.names||Object.keys(a),d)){let a=Object.assign({},(0,b.get)(e,d));(0,b.set)(a,"root",h),(0,b.set)(e,d,a)}else(0,b.set)(e,d,h)}return e},f=(a,b)=>{let c=g(b);return a.some(a=>g(a).match(`^${c}\\.\\d+`))};function g(a){return a.replace(/\]|\[/g,"")}a.s(["toNestErrors",()=>e,"validateFieldsNatively",()=>d])},514272,a=>{"use strict";var b=a.i(651332);let c=(0,b.createContext)(null);function d({clientId:a,nonce:d,onScriptLoadSuccess:e,onScriptLoadError:f,children:g}){let h=function(a={}){let{nonce:c,onScriptLoadSuccess:d,onScriptLoadError:e}=a,[f,g]=(0,b.useState)(!1),h=(0,b.useRef)(d);h.current=d;let i=(0,b.useRef)(e);return i.current=e,(0,b.useEffect)(()=>{let a=document.createElement("script");return a.src="https://accounts.google.com/gsi/client",a.async=!0,a.defer=!0,a.nonce=c,a.onload=()=>{var a;g(!0),null==(a=h.current)||a.call(h)},a.onerror=()=>{var a;g(!1),null==(a=i.current)||a.call(i)},document.body.appendChild(a),()=>{document.body.removeChild(a)}},[c]),f}({nonce:d,onScriptLoadSuccess:e,onScriptLoadError:f}),i=(0,b.useMemo)(()=>({clientId:a,scriptLoadedSuccessfully:h}),[a,h]);return b.default.createElement(c.Provider,{value:i},g)}let e={large:40,medium:32,small:20};function f({onSuccess:a,onError:d,useOneTap:f,promptMomentNotification:g,type:h="standard",theme:i="outline",size:j="large",text:k,shape:l,logo_alignment:m,width:n,locale:o,click_listener:p,containerProps:q,...r}){let s=(0,b.useRef)(null),{clientId:t,scriptLoadedSuccessfully:u}=function(){let a=(0,b.useContext)(c);if(!a)throw Error("Google OAuth components must be used within GoogleOAuthProvider");return a}(),v=(0,b.useRef)(a);v.current=a;let w=(0,b.useRef)(d);w.current=d;let x=(0,b.useRef)(g);return x.current=g,(0,b.useEffect)(()=>{var a,b,c,d,e,g,q,y,z;if(u)return null==(c=null==(b=null==(a=null==window?void 0:window.google)?void 0:a.accounts)?void 0:b.id)||c.initialize({client_id:t,callback:a=>{var b,c;if(!(null==a?void 0:a.credential))return null==(b=w.current)?void 0:b.call(w);let{credential:d,select_by:e}=a;v.current({credential:d,clientId:null!=(c=null==a?void 0:a.clientId)?c:null==a?void 0:a.client_id,select_by:e})},...r}),null==(g=null==(e=null==(d=null==window?void 0:window.google)?void 0:d.accounts)?void 0:e.id)||g.renderButton(s.current,{type:h,theme:i,size:j,text:k,shape:l,logo_alignment:m,width:n,locale:o,click_listener:p}),f&&(null==(z=null==(y=null==(q=null==window?void 0:window.google)?void 0:q.accounts)?void 0:y.id)||z.prompt(x.current)),()=>{var a,b,c;f&&(null==(c=null==(b=null==(a=null==window?void 0:window.google)?void 0:a.accounts)?void 0:b.id)||c.cancel())}},[t,u,f,h,i,j,k,l,m,n,o]),b.default.createElement("div",{...q,ref:s,style:{height:e[j],...null==q?void 0:q.style}})}a.s(["GoogleLogin",()=>f,"GoogleOAuthProvider",()=>d])},224910,a=>{"use strict";var b=a.i(772213);let c=b.gql`
  fragment AuthResponseFragment on AuthResponse {
    accessToken
    refreshToken
    redirectUrl
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
`,a.s(["LOGIN_USER",0,e,"LOGIN_WITH_FACEBOOK",0,g,"LOGIN_WITH_GOOGLE",0,f,"LOGIN_WITH_PHONE",0,h,"REGISTER_USER",0,j,"REQUEST_PHONE_VERIFICATION",0,i])},937768,288764,a=>{"use strict";var b=a.i(321248),c=a.i(8912),d=a.i(514272),e=a.i(224910),f=a.i(189101),g=a.i(53627),h=a.i(651332);class i extends Error{}function j(){let[a,j]=(0,h.useState)(!1);(0,g.useRouter)();let[k]=(0,c.useMutation)(e.LOGIN_WITH_GOOGLE),l=async a=>{if(!a.credential){console.error("No credential received from Google"),f.toast.error("Google login failed. Please try again.");return}try{j(!0);let b=function(a,b){let c;if("string"!=typeof a)throw new i("Invalid token specified: must be a string");b||(b={});let d=+(!0!==b.header),e=a.split(".")[d];if("string"!=typeof e)throw new i(`Invalid token specified: missing part #${d+1}`);try{c=function(a){let b=a.replace(/-/g,"+").replace(/_/g,"/");switch(b.length%4){case 0:break;case 2:b+="==";break;case 3:b+="=";break;default:throw Error("base64 string is not of the correct length")}try{var c;return c=b,decodeURIComponent(atob(c).replace(/(.)/g,(a,b)=>{let c=b.charCodeAt(0).toString(16).toUpperCase();return c.length<2&&(c="0"+c),"%"+c}))}catch(a){return atob(b)}}(e)}catch(a){throw new i(`Invalid token specified: invalid base64 for part #${d+1} (${a.message})`)}try{return JSON.parse(c)}catch(a){throw new i(`Invalid token specified: invalid json for part #${d+1} (${a.message})`)}}(a.credential);console.log("Decoded Google token:",b);let{data:c}=await k({variables:{input:{token:a.credential,provider:"GOOGLE",email:b.email,providerId:b.sub,firstName:b.given_name,lastName:b.family_name,avatar:b.picture}}});if(console.log("Login response:",c),c?.loginWithGoogle){let{accessToken:a,refreshToken:b,user:d,redirectUrl:e}=c.loginWithGoogle;localStorage.setItem("accessToken",a),b&&localStorage.setItem("refreshToken",b),localStorage.setItem("user",JSON.stringify(d)),d.createdAt&&new Date(d.createdAt)>new Date(Date.now()-5e3)?f.toast.success(`Welcome to rausachcore, ${d.firstName||d.username}! Your account has been created.`):f.toast.success(`Welcome back, ${d.firstName||d.username}!`),setTimeout(()=>{window.location.href=e||"/dashboard"},500)}else f.toast.error("Google login failed. Please try again.")}catch(a){console.error("Error processing Google login:",a),a.message.includes("User not found")?f.toast.error("Account not found. Please register first."):a.message.includes("Account is disabled")?f.toast.error("Your account has been disabled. Please contact support."):f.toast.error("Google login failed. Please try again.")}finally{j(!1)}};return(0,b.jsxs)("div",{className:"w-full",children:[(0,b.jsx)(d.GoogleLogin,{onSuccess:l,onError:()=>{console.error("Google login failed"),f.toast.error("Google login failed. Please try again.")},text:"continue_with",shape:"rectangular",theme:"outline",size:"large",logo_alignment:"center"}),a&&(0,b.jsxs)("div",{className:"flex items-center justify-center mt-2",children:[(0,b.jsx)("div",{className:"animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"}),(0,b.jsx)("span",{className:"ml-2 text-sm text-gray-600",children:"Signing you in..."})]})]})}i.prototype.name="InvalidTokenError",a.s(["default",()=>j],937768);var k=a.i(772213);k.gql`
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
`,a.s(["default",0,({onSuccess:a,onError:d})=>{let[e,i]=(0,h.useState)(!1),[j,k]=(0,h.useState)(!1),m=(0,g.useRouter)(),[n]=(0,c.useMutation)(l,{onCompleted:b=>{let{token:c,user:d,redirectUrl:e}=b.loginWithFacebook;localStorage.setItem("authToken",c),f.toast.success(`Welcome ${d.name||d.email}!`),a&&a(b.loginWithFacebook),m.push(e||"/dashboard")},onError:a=>{console.error("Facebook login error:",a),f.toast.error(a.message||"Facebook login failed"),d&&d(a),i(!1)}});return(0,h.useEffect)(()=>{(()=>{var a,b,c;if(window.FB)return k(!0);window.fbAsyncInit=function(){window.FB.init({appId:process.env.NEXT_PUBLIC_FACEBOOK_APP_ID,cookie:!0,xfbml:!0,version:"v18.0"}),k(!0)},c=(a=document).getElementsByTagName("script")[0],a.getElementById("facebook-jssdk")||((b=a.createElement("script")).id="facebook-jssdk",b.src="https://connect.facebook.net/en_US/sdk.js",c.parentNode?.insertBefore(b,c))})()},[]),(0,b.jsxs)("div",{className:"w-full",children:[(0,b.jsx)("button",{onClick:()=>{j&&window.FB?(i(!0),window.FB.login(a=>{if(a.authResponse){let{accessToken:b}=a.authResponse;n({variables:{input:{token:b,provider:"FACEBOOK"}}})}else i(!1),f.toast.error("Facebook login was cancelled")},{scope:"email,public_profile"})):f.toast.error("Facebook SDK not loaded")},disabled:e||!j,className:"w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200",children:e?(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)("div",{className:"animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-3"}),"Signing you in..."]}):(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)("svg",{className:"w-5 h-5 mr-3",viewBox:"0 0 24 24",fill:"currentColor",children:(0,b.jsx)("path",{d:"M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"})}),"Continue with Facebook"]})}),!j&&(0,b.jsxs)("div",{className:"flex items-center justify-center mt-2",children:[(0,b.jsx)("div",{className:"animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"}),(0,b.jsx)("span",{className:"ml-2 text-sm text-gray-600",children:"Loading Facebook..."})]})]})}],288764)},554865,a=>{"use strict";var b=a.i(321248),c=a.i(651332),d=a.i(53627),e=a.i(948428),f=a.i(83499),g=a.i(520677),h=a.i(439889),i=a.i(785903),j=a.i(174110),k=a.i(189101),l=a.i(40947),m=a.i(514272),n=a.i(937768),o=a.i(288764),p=a.i(106107);let q=g.object({email:g.string().email("Vui lòng nhập địa chỉ email hợp lệ").required("Email là bắt buộc"),password:g.string().min(8,"Mật khẩu phải có ít nhất 8 ký tự").required("Mật khẩu là bắt buộc")});function r(){let a=(0,d.useRouter)(),g=(0,d.useSearchParams)(),{login:r,isAuthenticated:s}=(0,l.useAuth)(),[t,u]=(0,c.useState)(!1),[v,w]=(0,c.useState)(!1),{siteName:x}=(0,p.useSiteName)();(0,c.useEffect)(()=>{if(s){let b=g?.get("returnUrl")||"/dashboard";a.push(b)}},[s,a,g]);let{register:y,handleSubmit:z,formState:{errors:A,isValid:B}}=(0,e.useForm)({resolver:(0,f.yupResolver)(q),mode:"onChange"}),C=async b=>{w(!0);try{let c=await r(b.email,b.password);if(c.success){k.toast.success("Chào mừng bạn quay lại!");let b=c.redirectUrl||g?.get("returnUrl")||"/dashboard";a.push(b)}else k.toast.error(c.error||"Đăng nhập thất bại. Vui lòng thử lại.")}catch(a){console.error("Login error:",a),k.toast.error("Đăng nhập thất bại. Vui lòng thử lại.")}finally{w(!1)}};return(0,b.jsx)("div",{className:"min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8",children:(0,b.jsxs)("div",{className:"max-w-md w-full space-y-8",children:[(0,b.jsxs)("div",{children:[(0,b.jsx)("div",{className:"mx-auto h-12 w-auto flex items-center justify-center",children:(0,b.jsx)("h1",{className:"text-3xl font-bold text-blue-600",children:x})}),(0,b.jsx)("h2",{className:"mt-6 text-center text-3xl font-extrabold text-gray-900",children:"Đăng nhập vào tài khoản của bạn"}),(0,b.jsxs)("p",{className:"mt-2 text-center text-sm text-gray-600",children:["Hoặc"," ",(0,b.jsx)(h.default,{href:"/register",className:"font-medium text-blue-600 hover:text-blue-500 transition-colors",children:"tạo tài khoản mới"})]})]}),(0,b.jsxs)("form",{className:"mt-8 space-y-6",onSubmit:z(C),"data-testid":"login-form",children:[(0,b.jsxs)("div",{className:"space-y-4",children:[(0,b.jsxs)("div",{children:[(0,b.jsx)("label",{htmlFor:"email",className:"block text-sm font-medium text-gray-700",children:"Địa chỉ email"}),(0,b.jsxs)("div",{className:"mt-1",children:[(0,b.jsx)("input",{...y("email"),type:"email",autoComplete:"email","data-testid":"email-input",className:`appearance-none relative block w-full px-3 py-2 border ${A.email?"border-red-300":"border-gray-300"} placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition-colors`,placeholder:"Nhập email của bạn"}),A.email&&(0,b.jsx)("p",{className:"mt-1 text-sm text-red-600",children:A.email.message})]})]}),(0,b.jsxs)("div",{children:[(0,b.jsx)("label",{htmlFor:"password",className:"block text-sm font-medium text-gray-700",children:"Mật khẩu"}),(0,b.jsxs)("div",{className:"mt-1 relative",children:[(0,b.jsx)("input",{...y("password"),type:t?"text":"password",autoComplete:"current-password","data-testid":"password-input",className:`appearance-none relative block w-full px-3 py-2 pr-10 border ${A.password?"border-red-300":"border-gray-300"} placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition-colors`,placeholder:"Nhập mật khẩu của bạn"}),(0,b.jsx)("button",{type:"button","data-testid":"password-toggle",className:"absolute inset-y-0 right-0 pr-3 flex items-center",onClick:()=>u(!t),children:t?(0,b.jsx)(j.EyeOff,{className:"h-5 w-5 text-gray-400 hover:text-gray-600"}):(0,b.jsx)(i.Eye,{className:"h-5 w-5 text-gray-400 hover:text-gray-600"})}),A.password&&(0,b.jsx)("p",{className:"mt-1 text-sm text-red-600",children:A.password.message})]})]})]}),(0,b.jsxs)("div",{className:"flex items-center justify-between",children:[(0,b.jsxs)("div",{className:"flex items-center",children:[(0,b.jsx)("input",{id:"remember-me",name:"remember-me",type:"checkbox",className:"h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"}),(0,b.jsx)("label",{htmlFor:"remember-me",className:"ml-2 block text-sm text-gray-900",children:"Ghi nhớ tôi"})]}),(0,b.jsx)("div",{className:"text-sm",children:(0,b.jsx)(h.default,{href:"/forgot-password",className:"font-medium text-blue-600 hover:text-blue-500 transition-colors",children:"Quên mật khẩu?"})})]}),(0,b.jsx)("div",{children:(0,b.jsx)("button",{type:"submit","data-testid":"login-button",disabled:!B||v,className:`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white transition-all duration-200 ${!B||v?"bg-gray-400 cursor-not-allowed":"bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform hover:scale-105"}`,children:v?(0,b.jsxs)("div",{className:"flex items-center",children:[(0,b.jsxs)("svg",{className:"animate-spin -ml-1 mr-3 h-5 w-5 text-white",xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",children:[(0,b.jsx)("circle",{className:"opacity-25",cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"4"}),(0,b.jsx)("path",{className:"opacity-75",fill:"currentColor",d:"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"})]}),"Đang đăng nhập..."]}):"Đăng nhập"})}),(0,b.jsxs)("div",{className:"mt-6",children:[(0,b.jsxs)("div",{className:"relative",children:[(0,b.jsx)("div",{className:"absolute inset-0 flex items-center",children:(0,b.jsx)("div",{className:"w-full border-t border-gray-300"})}),(0,b.jsx)("div",{className:"relative flex justify-center text-sm",children:(0,b.jsx)("span",{className:"px-2 bg-gray-50 text-gray-500",children:"Hoặc tiếp tục với"})})]}),(0,b.jsxs)("div",{className:"mt-6 space-y-3",children:[(0,b.jsx)(m.GoogleOAuthProvider,{clientId:"897974685698-621ekaodhnha7ssfaml6m1u418ab2ucq.apps.googleusercontent.com",children:(0,b.jsx)(n.default,{})}),(0,b.jsx)(o.default,{})]})]})]})]})})}function s(){return(0,b.jsx)(c.Suspense,{fallback:(0,b.jsx)("div",{children:"Loading..."}),children:(0,b.jsx)(r,{})})}a.s(["default",()=>s])}];

//# sourceMappingURL=%5Broot-of-the-server%5D__56117b4f._.js.map