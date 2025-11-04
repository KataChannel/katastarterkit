(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,835819,t=>{"use strict";var e=t.i(403055);t.i(940392);let a=Array(12).fill(0),o=1,r=new class{constructor(){this.subscribe=t=>(this.subscribers.push(t),()=>{let e=this.subscribers.indexOf(t);this.subscribers.splice(e,1)}),this.publish=t=>{this.subscribers.forEach(e=>e(t))},this.addToast=t=>{this.publish(t),this.toasts=[...this.toasts,t]},this.create=t=>{var e;let{message:a,...r}=t,s="number"==typeof(null==t?void 0:t.id)||(null==(e=t.id)?void 0:e.length)>0?t.id:o++,n=this.toasts.find(t=>t.id===s),i=void 0===t.dismissible||t.dismissible;return this.dismissedToasts.has(s)&&this.dismissedToasts.delete(s),n?this.toasts=this.toasts.map(e=>e.id===s?(this.publish({...e,...t,id:s,title:a}),{...e,...t,id:s,dismissible:i,title:a}):e):this.addToast({title:a,...r,dismissible:i,id:s}),s},this.dismiss=t=>(t?(this.dismissedToasts.add(t),requestAnimationFrame(()=>this.subscribers.forEach(e=>e({id:t,dismiss:!0})))):this.toasts.forEach(t=>{this.subscribers.forEach(e=>e({id:t.id,dismiss:!0}))}),t),this.message=(t,e)=>this.create({...e,message:t}),this.error=(t,e)=>this.create({...e,message:t,type:"error"}),this.success=(t,e)=>this.create({...e,type:"success",message:t}),this.info=(t,e)=>this.create({...e,type:"info",message:t}),this.warning=(t,e)=>this.create({...e,type:"warning",message:t}),this.loading=(t,e)=>this.create({...e,type:"loading",message:t}),this.promise=(t,a)=>{let o,r;if(!a)return;void 0!==a.loading&&(r=this.create({...a,promise:t,type:"loading",message:a.loading,description:"function"!=typeof a.description?a.description:void 0}));let n=Promise.resolve(t instanceof Function?t():t),i=void 0!==r,l=n.then(async t=>{if(o=["resolve",t],e.default.isValidElement(t))i=!1,this.create({id:r,type:"default",message:t});else if(s(t)&&!t.ok){i=!1;let o="function"==typeof a.error?await a.error(`HTTP error! status: ${t.status}`):a.error,s="function"==typeof a.description?await a.description(`HTTP error! status: ${t.status}`):a.description,n="object"!=typeof o||e.default.isValidElement(o)?{message:o}:o;this.create({id:r,type:"error",description:s,...n})}else if(t instanceof Error){i=!1;let o="function"==typeof a.error?await a.error(t):a.error,s="function"==typeof a.description?await a.description(t):a.description,n="object"!=typeof o||e.default.isValidElement(o)?{message:o}:o;this.create({id:r,type:"error",description:s,...n})}else if(void 0!==a.success){i=!1;let o="function"==typeof a.success?await a.success(t):a.success,s="function"==typeof a.description?await a.description(t):a.description,n="object"!=typeof o||e.default.isValidElement(o)?{message:o}:o;this.create({id:r,type:"success",description:s,...n})}}).catch(async t=>{if(o=["reject",t],void 0!==a.error){i=!1;let o="function"==typeof a.error?await a.error(t):a.error,s="function"==typeof a.description?await a.description(t):a.description,n="object"!=typeof o||e.default.isValidElement(o)?{message:o}:o;this.create({id:r,type:"error",description:s,...n})}}).finally(()=>{i&&(this.dismiss(r),r=void 0),null==a.finally||a.finally.call(a)}),d=()=>new Promise((t,e)=>l.then(()=>"reject"===o[0]?e(o[1]):t(o[1])).catch(e));return"string"!=typeof r&&"number"!=typeof r?{unwrap:d}:Object.assign(r,{unwrap:d})},this.custom=(t,e)=>{let a=(null==e?void 0:e.id)||o++;return this.create({jsx:t(a),id:a,...e}),a},this.getActiveToasts=()=>this.toasts.filter(t=>!this.dismissedToasts.has(t.id)),this.subscribers=[],this.toasts=[],this.dismissedToasts=new Set}},s=t=>t&&"object"==typeof t&&"ok"in t&&"boolean"==typeof t.ok&&"status"in t&&"number"==typeof t.status,n=Object.assign((t,e)=>{let a=(null==e?void 0:e.id)||o++;return r.addToast({title:t,...e,id:a}),a},{success:r.success,info:r.info,warning:r.warning,error:r.error,custom:r.custom,message:r.message,promise:r.promise,dismiss:r.dismiss,loading:r.loading},{getHistory:()=>r.toasts,getToasts:()=>r.getActiveToasts()});!function(t){if(!t||"undefined"==typeof document)return;let e=document.head||document.getElementsByTagName("head")[0],a=document.createElement("style");a.type="text/css",e.appendChild(a),a.styleSheet?a.styleSheet.cssText=t:a.appendChild(document.createTextNode(t))}("[data-sonner-toaster][dir=ltr],html[dir=ltr]{--toast-icon-margin-start:-3px;--toast-icon-margin-end:4px;--toast-svg-margin-start:-1px;--toast-svg-margin-end:0px;--toast-button-margin-start:auto;--toast-button-margin-end:0;--toast-close-button-start:0;--toast-close-button-end:unset;--toast-close-button-transform:translate(-35%, -35%)}[data-sonner-toaster][dir=rtl],html[dir=rtl]{--toast-icon-margin-start:4px;--toast-icon-margin-end:-3px;--toast-svg-margin-start:0px;--toast-svg-margin-end:-1px;--toast-button-margin-start:0;--toast-button-margin-end:auto;--toast-close-button-start:unset;--toast-close-button-end:0;--toast-close-button-transform:translate(35%, -35%)}[data-sonner-toaster]{position:fixed;width:var(--width);font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;--gray1:hsl(0, 0%, 99%);--gray2:hsl(0, 0%, 97.3%);--gray3:hsl(0, 0%, 95.1%);--gray4:hsl(0, 0%, 93%);--gray5:hsl(0, 0%, 90.9%);--gray6:hsl(0, 0%, 88.7%);--gray7:hsl(0, 0%, 85.8%);--gray8:hsl(0, 0%, 78%);--gray9:hsl(0, 0%, 56.1%);--gray10:hsl(0, 0%, 52.3%);--gray11:hsl(0, 0%, 43.5%);--gray12:hsl(0, 0%, 9%);--border-radius:8px;box-sizing:border-box;padding:0;margin:0;list-style:none;outline:0;z-index:999999999;transition:transform .4s ease}@media (hover:none) and (pointer:coarse){[data-sonner-toaster][data-lifted=true]{transform:none}}[data-sonner-toaster][data-x-position=right]{right:var(--offset-right)}[data-sonner-toaster][data-x-position=left]{left:var(--offset-left)}[data-sonner-toaster][data-x-position=center]{left:50%;transform:translateX(-50%)}[data-sonner-toaster][data-y-position=top]{top:var(--offset-top)}[data-sonner-toaster][data-y-position=bottom]{bottom:var(--offset-bottom)}[data-sonner-toast]{--y:translateY(100%);--lift-amount:calc(var(--lift) * var(--gap));z-index:var(--z-index);position:absolute;opacity:0;transform:var(--y);touch-action:none;transition:transform .4s,opacity .4s,height .4s,box-shadow .2s;box-sizing:border-box;outline:0;overflow-wrap:anywhere}[data-sonner-toast][data-styled=true]{padding:16px;background:var(--normal-bg);border:1px solid var(--normal-border);color:var(--normal-text);border-radius:var(--border-radius);box-shadow:0 4px 12px rgba(0,0,0,.1);width:var(--width);font-size:13px;display:flex;align-items:center;gap:6px}[data-sonner-toast]:focus-visible{box-shadow:0 4px 12px rgba(0,0,0,.1),0 0 0 2px rgba(0,0,0,.2)}[data-sonner-toast][data-y-position=top]{top:0;--y:translateY(-100%);--lift:1;--lift-amount:calc(1 * var(--gap))}[data-sonner-toast][data-y-position=bottom]{bottom:0;--y:translateY(100%);--lift:-1;--lift-amount:calc(var(--lift) * var(--gap))}[data-sonner-toast][data-styled=true] [data-description]{font-weight:400;line-height:1.4;color:#3f3f3f}[data-rich-colors=true][data-sonner-toast][data-styled=true] [data-description]{color:inherit}[data-sonner-toaster][data-sonner-theme=dark] [data-description]{color:#e8e8e8}[data-sonner-toast][data-styled=true] [data-title]{font-weight:500;line-height:1.5;color:inherit}[data-sonner-toast][data-styled=true] [data-icon]{display:flex;height:16px;width:16px;position:relative;justify-content:flex-start;align-items:center;flex-shrink:0;margin-left:var(--toast-icon-margin-start);margin-right:var(--toast-icon-margin-end)}[data-sonner-toast][data-promise=true] [data-icon]>svg{opacity:0;transform:scale(.8);transform-origin:center;animation:sonner-fade-in .3s ease forwards}[data-sonner-toast][data-styled=true] [data-icon]>*{flex-shrink:0}[data-sonner-toast][data-styled=true] [data-icon] svg{margin-left:var(--toast-svg-margin-start);margin-right:var(--toast-svg-margin-end)}[data-sonner-toast][data-styled=true] [data-content]{display:flex;flex-direction:column;gap:2px}[data-sonner-toast][data-styled=true] [data-button]{border-radius:4px;padding-left:8px;padding-right:8px;height:24px;font-size:12px;color:var(--normal-bg);background:var(--normal-text);margin-left:var(--toast-button-margin-start);margin-right:var(--toast-button-margin-end);border:none;font-weight:500;cursor:pointer;outline:0;display:flex;align-items:center;flex-shrink:0;transition:opacity .4s,box-shadow .2s}[data-sonner-toast][data-styled=true] [data-button]:focus-visible{box-shadow:0 0 0 2px rgba(0,0,0,.4)}[data-sonner-toast][data-styled=true] [data-button]:first-of-type{margin-left:var(--toast-button-margin-start);margin-right:var(--toast-button-margin-end)}[data-sonner-toast][data-styled=true] [data-cancel]{color:var(--normal-text);background:rgba(0,0,0,.08)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast][data-styled=true] [data-cancel]{background:rgba(255,255,255,.3)}[data-sonner-toast][data-styled=true] [data-close-button]{position:absolute;left:var(--toast-close-button-start);right:var(--toast-close-button-end);top:0;height:20px;width:20px;display:flex;justify-content:center;align-items:center;padding:0;color:var(--gray12);background:var(--normal-bg);border:1px solid var(--gray4);transform:var(--toast-close-button-transform);border-radius:50%;cursor:pointer;z-index:1;transition:opacity .1s,background .2s,border-color .2s}[data-sonner-toast][data-styled=true] [data-close-button]:focus-visible{box-shadow:0 4px 12px rgba(0,0,0,.1),0 0 0 2px rgba(0,0,0,.2)}[data-sonner-toast][data-styled=true] [data-disabled=true]{cursor:not-allowed}[data-sonner-toast][data-styled=true]:hover [data-close-button]:hover{background:var(--gray2);border-color:var(--gray5)}[data-sonner-toast][data-swiping=true]::before{content:'';position:absolute;left:-100%;right:-100%;height:100%;z-index:-1}[data-sonner-toast][data-y-position=top][data-swiping=true]::before{bottom:50%;transform:scaleY(3) translateY(50%)}[data-sonner-toast][data-y-position=bottom][data-swiping=true]::before{top:50%;transform:scaleY(3) translateY(-50%)}[data-sonner-toast][data-swiping=false][data-removed=true]::before{content:'';position:absolute;inset:0;transform:scaleY(2)}[data-sonner-toast][data-expanded=true]::after{content:'';position:absolute;left:0;height:calc(var(--gap) + 1px);bottom:100%;width:100%}[data-sonner-toast][data-mounted=true]{--y:translateY(0);opacity:1}[data-sonner-toast][data-expanded=false][data-front=false]{--scale:var(--toasts-before) * 0.05 + 1;--y:translateY(calc(var(--lift-amount) * var(--toasts-before))) scale(calc(-1 * var(--scale)));height:var(--front-toast-height)}[data-sonner-toast]>*{transition:opacity .4s}[data-sonner-toast][data-x-position=right]{right:0}[data-sonner-toast][data-x-position=left]{left:0}[data-sonner-toast][data-expanded=false][data-front=false][data-styled=true]>*{opacity:0}[data-sonner-toast][data-visible=false]{opacity:0;pointer-events:none}[data-sonner-toast][data-mounted=true][data-expanded=true]{--y:translateY(calc(var(--lift) * var(--offset)));height:var(--initial-height)}[data-sonner-toast][data-removed=true][data-front=true][data-swipe-out=false]{--y:translateY(calc(var(--lift) * -100%));opacity:0}[data-sonner-toast][data-removed=true][data-front=false][data-swipe-out=false][data-expanded=true]{--y:translateY(calc(var(--lift) * var(--offset) + var(--lift) * -100%));opacity:0}[data-sonner-toast][data-removed=true][data-front=false][data-swipe-out=false][data-expanded=false]{--y:translateY(40%);opacity:0;transition:transform .5s,opacity .2s}[data-sonner-toast][data-removed=true][data-front=false]::before{height:calc(var(--initial-height) + 20%)}[data-sonner-toast][data-swiping=true]{transform:var(--y) translateY(var(--swipe-amount-y,0)) translateX(var(--swipe-amount-x,0));transition:none}[data-sonner-toast][data-swiped=true]{user-select:none}[data-sonner-toast][data-swipe-out=true][data-y-position=bottom],[data-sonner-toast][data-swipe-out=true][data-y-position=top]{animation-duration:.2s;animation-timing-function:ease-out;animation-fill-mode:forwards}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=left]{animation-name:swipe-out-left}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=right]{animation-name:swipe-out-right}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=up]{animation-name:swipe-out-up}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=down]{animation-name:swipe-out-down}@keyframes swipe-out-left{from{transform:var(--y) translateX(var(--swipe-amount-x));opacity:1}to{transform:var(--y) translateX(calc(var(--swipe-amount-x) - 100%));opacity:0}}@keyframes swipe-out-right{from{transform:var(--y) translateX(var(--swipe-amount-x));opacity:1}to{transform:var(--y) translateX(calc(var(--swipe-amount-x) + 100%));opacity:0}}@keyframes swipe-out-up{from{transform:var(--y) translateY(var(--swipe-amount-y));opacity:1}to{transform:var(--y) translateY(calc(var(--swipe-amount-y) - 100%));opacity:0}}@keyframes swipe-out-down{from{transform:var(--y) translateY(var(--swipe-amount-y));opacity:1}to{transform:var(--y) translateY(calc(var(--swipe-amount-y) + 100%));opacity:0}}@media (max-width:600px){[data-sonner-toaster]{position:fixed;right:var(--mobile-offset-right);left:var(--mobile-offset-left);width:100%}[data-sonner-toaster][dir=rtl]{left:calc(var(--mobile-offset-left) * -1)}[data-sonner-toaster] [data-sonner-toast]{left:0;right:0;width:calc(100% - var(--mobile-offset-left) * 2)}[data-sonner-toaster][data-x-position=left]{left:var(--mobile-offset-left)}[data-sonner-toaster][data-y-position=bottom]{bottom:var(--mobile-offset-bottom)}[data-sonner-toaster][data-y-position=top]{top:var(--mobile-offset-top)}[data-sonner-toaster][data-x-position=center]{left:var(--mobile-offset-left);right:var(--mobile-offset-right);transform:none}}[data-sonner-toaster][data-sonner-theme=light]{--normal-bg:#fff;--normal-border:var(--gray4);--normal-text:var(--gray12);--success-bg:hsl(143, 85%, 96%);--success-border:hsl(145, 92%, 87%);--success-text:hsl(140, 100%, 27%);--info-bg:hsl(208, 100%, 97%);--info-border:hsl(221, 91%, 93%);--info-text:hsl(210, 92%, 45%);--warning-bg:hsl(49, 100%, 97%);--warning-border:hsl(49, 91%, 84%);--warning-text:hsl(31, 92%, 45%);--error-bg:hsl(359, 100%, 97%);--error-border:hsl(359, 100%, 94%);--error-text:hsl(360, 100%, 45%)}[data-sonner-toaster][data-sonner-theme=light] [data-sonner-toast][data-invert=true]{--normal-bg:#000;--normal-border:hsl(0, 0%, 20%);--normal-text:var(--gray1)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast][data-invert=true]{--normal-bg:#fff;--normal-border:var(--gray3);--normal-text:var(--gray12)}[data-sonner-toaster][data-sonner-theme=dark]{--normal-bg:#000;--normal-bg-hover:hsl(0, 0%, 12%);--normal-border:hsl(0, 0%, 20%);--normal-border-hover:hsl(0, 0%, 25%);--normal-text:var(--gray1);--success-bg:hsl(150, 100%, 6%);--success-border:hsl(147, 100%, 12%);--success-text:hsl(150, 86%, 65%);--info-bg:hsl(215, 100%, 6%);--info-border:hsl(223, 43%, 17%);--info-text:hsl(216, 87%, 65%);--warning-bg:hsl(64, 100%, 6%);--warning-border:hsl(60, 100%, 9%);--warning-text:hsl(46, 87%, 65%);--error-bg:hsl(358, 76%, 10%);--error-border:hsl(357, 89%, 16%);--error-text:hsl(358, 100%, 81%)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast] [data-close-button]{background:var(--normal-bg);border-color:var(--normal-border);color:var(--normal-text)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast] [data-close-button]:hover{background:var(--normal-bg-hover);border-color:var(--normal-border-hover)}[data-rich-colors=true][data-sonner-toast][data-type=success]{background:var(--success-bg);border-color:var(--success-border);color:var(--success-text)}[data-rich-colors=true][data-sonner-toast][data-type=success] [data-close-button]{background:var(--success-bg);border-color:var(--success-border);color:var(--success-text)}[data-rich-colors=true][data-sonner-toast][data-type=info]{background:var(--info-bg);border-color:var(--info-border);color:var(--info-text)}[data-rich-colors=true][data-sonner-toast][data-type=info] [data-close-button]{background:var(--info-bg);border-color:var(--info-border);color:var(--info-text)}[data-rich-colors=true][data-sonner-toast][data-type=warning]{background:var(--warning-bg);border-color:var(--warning-border);color:var(--warning-text)}[data-rich-colors=true][data-sonner-toast][data-type=warning] [data-close-button]{background:var(--warning-bg);border-color:var(--warning-border);color:var(--warning-text)}[data-rich-colors=true][data-sonner-toast][data-type=error]{background:var(--error-bg);border-color:var(--error-border);color:var(--error-text)}[data-rich-colors=true][data-sonner-toast][data-type=error] [data-close-button]{background:var(--error-bg);border-color:var(--error-border);color:var(--error-text)}.sonner-loading-wrapper{--size:16px;height:var(--size);width:var(--size);position:absolute;inset:0;z-index:10}.sonner-loading-wrapper[data-visible=false]{transform-origin:center;animation:sonner-fade-out .2s ease forwards}.sonner-spinner{position:relative;top:50%;left:50%;height:var(--size);width:var(--size)}.sonner-loading-bar{animation:sonner-spin 1.2s linear infinite;background:var(--gray11);border-radius:6px;height:8%;left:-10%;position:absolute;top:-3.9%;width:24%}.sonner-loading-bar:first-child{animation-delay:-1.2s;transform:rotate(.0001deg) translate(146%)}.sonner-loading-bar:nth-child(2){animation-delay:-1.1s;transform:rotate(30deg) translate(146%)}.sonner-loading-bar:nth-child(3){animation-delay:-1s;transform:rotate(60deg) translate(146%)}.sonner-loading-bar:nth-child(4){animation-delay:-.9s;transform:rotate(90deg) translate(146%)}.sonner-loading-bar:nth-child(5){animation-delay:-.8s;transform:rotate(120deg) translate(146%)}.sonner-loading-bar:nth-child(6){animation-delay:-.7s;transform:rotate(150deg) translate(146%)}.sonner-loading-bar:nth-child(7){animation-delay:-.6s;transform:rotate(180deg) translate(146%)}.sonner-loading-bar:nth-child(8){animation-delay:-.5s;transform:rotate(210deg) translate(146%)}.sonner-loading-bar:nth-child(9){animation-delay:-.4s;transform:rotate(240deg) translate(146%)}.sonner-loading-bar:nth-child(10){animation-delay:-.3s;transform:rotate(270deg) translate(146%)}.sonner-loading-bar:nth-child(11){animation-delay:-.2s;transform:rotate(300deg) translate(146%)}.sonner-loading-bar:nth-child(12){animation-delay:-.1s;transform:rotate(330deg) translate(146%)}@keyframes sonner-fade-in{0%{opacity:0;transform:scale(.8)}100%{opacity:1;transform:scale(1)}}@keyframes sonner-fade-out{0%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(.8)}}@keyframes sonner-spin{0%{opacity:1}100%{opacity:.15}}@media (prefers-reduced-motion){.sonner-loading-bar,[data-sonner-toast],[data-sonner-toast]>*{transition:none!important;animation:none!important}}.sonner-loader{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);transform-origin:center;transition:opacity .2s,transform .2s}.sonner-loader[data-visible=false]{opacity:0;transform:scale(.8) translate(-50%,-50%)}");t.s(["toast",()=>n])},301347,t=>{"use strict";var e=t.i(984804);let a=e.gql`
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
`,o=e.gql`
  fragment OtpResponseFragment on OtpResponse {
    success
    message
  }
`,r=e.gql`
  ${a}
  mutation LoginUser($input: LoginUserInput!) {
    loginUser(input: $input) {
      ...AuthResponseFragment
    }
  }
`,s=e.gql`
  ${a}
  mutation LoginWithGoogle($input: SocialLoginInput!) {
    loginWithGoogle(input: $input) {
      ...AuthResponseFragment
    }
  }
`,n=e.gql`
  ${a}
  mutation LoginWithFacebook($input: SocialLoginInput!) {
    loginWithFacebook(input: $input) {
      ...AuthResponseFragment
    }
  }
`,i=e.gql`
  ${a}
  mutation LoginWithPhone($input: PhoneLoginInput!) {
    loginWithPhone(input: $input) {
      ...AuthResponseFragment
    }
  }
`,l=e.gql`
  ${o}
  mutation RequestPhoneVerification($input: RequestPhoneVerificationInput!) {
    requestPhoneVerification(input: $input) {
      ...OtpResponseFragment
    }
  }
`,d=e.gql`
  ${a}
  mutation RegisterUser($input: RegisterUserInput!) {
    registerUser(input: $input) {
      ...AuthResponseFragment
    }
  }
`;e.gql`
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
`,e.gql`
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
`,e.gql`
  mutation ChangePassword($input: ChangePasswordInput!) {
    changePassword(input: $input)
  }
`,e.gql`
  mutation SetPassword($input: SetPasswordInput!) {
    setPassword(input: $input)
  }
`,e.gql`
  query HasPassword {
    hasPassword
  }
`,e.gql`
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
`,t.s(["LOGIN_USER",0,r,"LOGIN_WITH_FACEBOOK",0,n,"LOGIN_WITH_GOOGLE",0,s,"LOGIN_WITH_PHONE",0,i,"REGISTER_USER",0,d,"REQUEST_PHONE_VERIFICATION",0,l])},100518,t=>{"use strict";var e=t.i(403055);let a=(0,e.createContext)(null);function o({clientId:t,nonce:o,onScriptLoadSuccess:r,onScriptLoadError:s,children:n}){let i=function(t={}){let{nonce:a,onScriptLoadSuccess:o,onScriptLoadError:r}=t,[s,n]=(0,e.useState)(!1),i=(0,e.useRef)(o);i.current=o;let l=(0,e.useRef)(r);return l.current=r,(0,e.useEffect)(()=>{let t=document.createElement("script");return t.src="https://accounts.google.com/gsi/client",t.async=!0,t.defer=!0,t.nonce=a,t.onload=()=>{var t;n(!0),null==(t=i.current)||t.call(i)},t.onerror=()=>{var t;n(!1),null==(t=l.current)||t.call(l)},document.body.appendChild(t),()=>{document.body.removeChild(t)}},[a]),s}({nonce:o,onScriptLoadSuccess:r,onScriptLoadError:s}),l=(0,e.useMemo)(()=>({clientId:t,scriptLoadedSuccessfully:i}),[t,i]);return e.default.createElement(a.Provider,{value:l},n)}let r={large:40,medium:32,small:20};function s({onSuccess:t,onError:o,useOneTap:s,promptMomentNotification:n,type:i="standard",theme:l="outline",size:d="large",text:c,shape:u,logo_alignment:g,width:m,locale:p,click_listener:h,containerProps:f,...b}){let v=(0,e.useRef)(null),{clientId:y,scriptLoadedSuccessfully:x}=function(){let t=(0,e.useContext)(a);if(!t)throw Error("Google OAuth components must be used within GoogleOAuthProvider");return t}(),w=(0,e.useRef)(t);w.current=t;let k=(0,e.useRef)(o);k.current=o;let I=(0,e.useRef)(n);return I.current=n,(0,e.useEffect)(()=>{var t,e,a,o,r,n,f,N,S;if(x)return null==(a=null==(e=null==(t=null==window?void 0:window.google)?void 0:t.accounts)?void 0:e.id)||a.initialize({client_id:y,callback:t=>{var e,a;if(!(null==t?void 0:t.credential))return null==(e=k.current)?void 0:e.call(k);let{credential:o,select_by:r}=t;w.current({credential:o,clientId:null!=(a=null==t?void 0:t.clientId)?a:null==t?void 0:t.client_id,select_by:r})},...b}),null==(n=null==(r=null==(o=null==window?void 0:window.google)?void 0:o.accounts)?void 0:r.id)||n.renderButton(v.current,{type:i,theme:l,size:d,text:c,shape:u,logo_alignment:g,width:m,locale:p,click_listener:h}),s&&(null==(S=null==(N=null==(f=null==window?void 0:window.google)?void 0:f.accounts)?void 0:N.id)||S.prompt(I.current)),()=>{var t,e,a;s&&(null==(a=null==(e=null==(t=null==window?void 0:window.google)?void 0:t.accounts)?void 0:e.id)||a.cancel())}},[y,x,s,i,l,d,c,u,g,m,p]),e.default.createElement("div",{...f,ref:v,style:{height:r[d],...null==f?void 0:f.style}})}t.s(["GoogleLogin",()=>s,"GoogleOAuthProvider",()=>o])},780139,262825,t=>{"use strict";var e=t.i(44990),a=t.i(950988),o=t.i(100518),r=t.i(301347),s=t.i(835819),n=t.i(130775),i=t.i(403055);class l extends Error{}function d(){let[t,d]=(0,i.useState)(!1);(0,n.useRouter)();let[c]=(0,a.useMutation)(r.LOGIN_WITH_GOOGLE),u=async t=>{if(!t.credential){console.error("No credential received from Google"),s.toast.error("Google login failed. Please try again.");return}try{d(!0);let e=function(t,e){let a;if("string"!=typeof t)throw new l("Invalid token specified: must be a string");e||(e={});let o=+(!0!==e.header),r=t.split(".")[o];if("string"!=typeof r)throw new l(`Invalid token specified: missing part #${o+1}`);try{a=function(t){let e=t.replace(/-/g,"+").replace(/_/g,"/");switch(e.length%4){case 0:break;case 2:e+="==";break;case 3:e+="=";break;default:throw Error("base64 string is not of the correct length")}try{var a;return a=e,decodeURIComponent(atob(a).replace(/(.)/g,(t,e)=>{let a=e.charCodeAt(0).toString(16).toUpperCase();return a.length<2&&(a="0"+a),"%"+a}))}catch(t){return atob(e)}}(r)}catch(t){throw new l(`Invalid token specified: invalid base64 for part #${o+1} (${t.message})`)}try{return JSON.parse(a)}catch(t){throw new l(`Invalid token specified: invalid json for part #${o+1} (${t.message})`)}}(t.credential);console.log("Decoded Google token:",e);let{data:a}=await c({variables:{input:{token:t.credential,provider:"GOOGLE",email:e.email,providerId:e.sub,firstName:e.given_name,lastName:e.family_name,avatar:e.picture}}});if(console.log("Login response:",a),a?.loginWithGoogle){let{accessToken:t,refreshToken:e,user:o}=a.loginWithGoogle;localStorage.setItem("accessToken",t),e&&localStorage.setItem("refreshToken",e),localStorage.setItem("user",JSON.stringify(o)),o.createdAt&&new Date(o.createdAt)>new Date(Date.now()-5e3)?s.toast.success(`Welcome to rausachcore, ${o.firstName||o.username}! Your account has been created.`):s.toast.success(`Welcome back, ${o.firstName||o.username}!`),setTimeout(()=>{window.location.href="/admin"},500)}else s.toast.error("Google login failed. Please try again.")}catch(t){console.error("Error processing Google login:",t),t.message.includes("User not found")?s.toast.error("Account not found. Please register first."):t.message.includes("Account is disabled")?s.toast.error("Your account has been disabled. Please contact support."):s.toast.error("Google login failed. Please try again.")}finally{d(!1)}};return(0,e.jsxs)("div",{className:"w-full",children:[(0,e.jsx)(o.GoogleLogin,{onSuccess:u,onError:()=>{console.error("Google login failed"),s.toast.error("Google login failed. Please try again.")},text:"continue_with",shape:"rectangular",theme:"outline",size:"large",logo_alignment:"center"}),t&&(0,e.jsxs)("div",{className:"flex items-center justify-center mt-2",children:[(0,e.jsx)("div",{className:"animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"}),(0,e.jsx)("span",{className:"ml-2 text-sm text-gray-600",children:"Signing you in..."})]})]})}l.prototype.name="InvalidTokenError",t.s(["default",()=>d],780139);var c=t.i(308140),u=t.i(984804);u.gql`
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
`;let g=u.gql`
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
`;u.gql`
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
`,u.gql`
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
`,t.s(["default",0,({onSuccess:t,onError:o})=>{let[r,l]=(0,i.useState)(!1),[d,u]=(0,i.useState)(!1),m=(0,n.useRouter)(),[p]=(0,a.useMutation)(g,{onCompleted:e=>{let{token:a,user:o}=e.loginWithFacebook;localStorage.setItem("authToken",a),s.toast.success(`Welcome ${o.name||o.email}!`),t&&t(e.loginWithFacebook),m.push("/admin")},onError:t=>{console.error("Facebook login error:",t),s.toast.error(t.message||"Facebook login failed"),o&&o(t),l(!1)}});return(0,i.useEffect)(()=>{(()=>{var t,e,a;if(window.FB)return u(!0);window.fbAsyncInit=function(){window.FB.init({appId:c.default.env.NEXT_PUBLIC_FACEBOOK_APP_ID,cookie:!0,xfbml:!0,version:"v18.0"}),u(!0)},a=(t=document).getElementsByTagName("script")[0],t.getElementById("facebook-jssdk")||((e=t.createElement("script")).id="facebook-jssdk",e.src="https://connect.facebook.net/en_US/sdk.js",a.parentNode?.insertBefore(e,a))})()},[]),(0,e.jsxs)("div",{className:"w-full",children:[(0,e.jsx)("button",{onClick:()=>{d&&window.FB?(l(!0),window.FB.login(t=>{if(t.authResponse){let{accessToken:e}=t.authResponse;p({variables:{input:{token:e,provider:"FACEBOOK"}}})}else l(!1),s.toast.error("Facebook login was cancelled")},{scope:"email,public_profile"})):s.toast.error("Facebook SDK not loaded")},disabled:r||!d,className:"w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200",children:r?(0,e.jsxs)(e.Fragment,{children:[(0,e.jsx)("div",{className:"animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-3"}),"Signing you in..."]}):(0,e.jsxs)(e.Fragment,{children:[(0,e.jsx)("svg",{className:"w-5 h-5 mr-3",viewBox:"0 0 24 24",fill:"currentColor",children:(0,e.jsx)("path",{d:"M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"})}),"Continue with Facebook"]})}),!d&&(0,e.jsxs)("div",{className:"flex items-center justify-center mt-2",children:[(0,e.jsx)("div",{className:"animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"}),(0,e.jsx)("span",{className:"ml-2 text-sm text-gray-600",children:"Loading Facebook..."})]})]})}],262825)},477051,t=>{"use strict";t.i(308140);var e=t.i(44990),a=t.i(403055),o=t.i(950988),r=t.i(301347),s=t.i(100518),n=t.i(780139),i=t.i(262825);t.s(["default",0,()=>{let{handleLogin:t,handleGoogleLogin:l,handleFacebookLogin:d,handlePhoneLogin:c,handleRequestOtp:u,handleRegister:g,logout:m,loginLoading:p,googleLoading:h,facebookLoading:f,phoneLoading:b,otpLoading:v,registerLoading:y}=(()=>{let[t,{loading:e}]=(0,o.useMutation)(r.LOGIN_USER),[a,{loading:s}]=(0,o.useMutation)(r.LOGIN_WITH_GOOGLE),[n,{loading:i}]=(0,o.useMutation)(r.LOGIN_WITH_FACEBOOK),[l,{loading:d}]=(0,o.useMutation)(r.LOGIN_WITH_PHONE),[c,{loading:u}]=(0,o.useMutation)(r.REQUEST_PHONE_VERIFICATION),[g,{loading:m}]=(0,o.useMutation)(r.REGISTER_USER);return{handleLogin:async e=>{try{let{accessToken:a,refreshToken:o,user:r}=(await t({variables:{input:e}})).data.loginUser;return localStorage.setItem("accessToken",a),localStorage.setItem("refreshToken",o),localStorage.setItem("user",JSON.stringify(r)),{success:!0,user:r,accessToken:a,refreshToken:o}}catch(t){return{success:!1,error:t.message}}},handleGoogleLogin:async t=>{try{let{accessToken:e,refreshToken:o,user:r}=(await a({variables:{input:t}})).data.loginWithGoogle;return localStorage.setItem("accessToken",e),localStorage.setItem("refreshToken",o),localStorage.setItem("user",JSON.stringify(r)),{success:!0,user:r,accessToken:e,refreshToken:o}}catch(t){return{success:!1,error:t.message}}},handleFacebookLogin:async t=>{try{let{accessToken:e,refreshToken:a,user:o}=(await n({variables:{input:t}})).data.loginWithFacebook;return localStorage.setItem("accessToken",e),localStorage.setItem("refreshToken",a),localStorage.setItem("user",JSON.stringify(o)),{success:!0,user:o,accessToken:e,refreshToken:a}}catch(t){return{success:!1,error:t.message}}},handlePhoneLogin:async t=>{try{let{accessToken:e,refreshToken:a,user:o}=(await l({variables:{input:t}})).data.loginWithPhone;return localStorage.setItem("accessToken",e),localStorage.setItem("refreshToken",a),localStorage.setItem("user",JSON.stringify(o)),{success:!0,user:o,accessToken:e,refreshToken:a}}catch(t){return{success:!1,error:t.message}}},handleRequestOtp:async t=>{try{return(await c({variables:{input:t}})).data.requestPhoneVerification}catch(t){return{success:!1,message:t.message}}},handleRegister:async t=>{try{let{accessToken:e,refreshToken:a,user:o}=(await g({variables:{input:t}})).data.registerUser;return localStorage.setItem("accessToken",e),localStorage.setItem("refreshToken",a),localStorage.setItem("user",JSON.stringify(o)),{success:!0,user:o,accessToken:e,refreshToken:a}}catch(t){return{success:!1,error:t.message}}},logout:()=>{localStorage.removeItem("accessToken"),localStorage.removeItem("refreshToken"),localStorage.removeItem("user")},loginLoading:e,googleLoading:s,facebookLoading:i,phoneLoading:d,otpLoading:u,registerLoading:m}})(),[x,w]=(0,a.useState)(""),[k,I]=(0,a.useState)(""),[N,S]=(0,a.useState)(!1),[j,T]=(0,a.useState)(""),E=async()=>{if(!x)return void T("Vui lòng nhập số điện thoại");let t=await u({phone:x});t.success&&S(!0),T(t.message)},O=async()=>{if(!x||!k)return void T("Vui lòng nhập số điện thoại và mã OTP");let t=await c({phone:x,otp:k});t.success?(T("Đăng nhập thành công!"),console.log("User:",t.user)):T(t.error)};return(0,e.jsxs)("div",{className:"p-6 max-w-md mx-auto bg-white rounded-lg shadow-md",children:[(0,e.jsx)("h2",{className:"text-2xl font-bold mb-6",children:"Demo Authentication"}),j&&(0,e.jsx)("div",{className:"mb-4 p-3 bg-blue-100 border border-blue-300 rounded",children:j}),(0,e.jsxs)("div",{className:"mb-6 p-4 bg-gray-50 rounded-lg",children:[(0,e.jsx)("h3",{className:"text-sm font-semibold text-gray-700 mb-2",children:"Current Status"}),(0,e.jsxs)("p",{className:"text-sm text-gray-600",children:["User authenticated: ",(0,e.jsx)("span",{className:"font-medium",children:"Not checked"})]}),(0,e.jsx)("p",{className:"text-sm text-gray-600",children:"Authentication tokens are handled automatically by OAuth components"})]}),(0,e.jsxs)("div",{className:"mb-6",children:[(0,e.jsx)("h3",{className:"text-lg font-semibold mb-3",children:"Đăng nhập bằng số điện thoại"}),(0,e.jsx)("input",{type:"tel",placeholder:"Số điện thoại",value:x,onChange:t=>w(t.target.value),className:"w-full p-2 border rounded mb-2"}),N?(0,e.jsxs)(e.Fragment,{children:[(0,e.jsx)("input",{type:"text",placeholder:"Nhập mã OTP",value:k,onChange:t=>I(t.target.value),className:"w-full p-2 border rounded mb-2"}),(0,e.jsx)("button",{onClick:O,disabled:b,className:"w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 disabled:opacity-50",children:b?"Đang đăng nhập...":"Đăng nhập"})]}):(0,e.jsx)("button",{onClick:E,disabled:v,className:"w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50",children:v?"Đang gửi...":"Gửi mã OTP"})]}),(0,e.jsxs)("div",{className:"mb-6",children:[(0,e.jsx)("h3",{className:"text-lg font-semibold mb-3",children:"Đăng nhập mạng xã hội"}),(0,e.jsxs)("div",{className:"space-y-3",children:[(0,e.jsx)(s.GoogleOAuthProvider,{clientId:"897974685698-621ekaodhnha7ssfaml6m1u418ab2ucq.apps.googleusercontent.com",children:(0,e.jsx)(n.default,{})}),(0,e.jsx)(i.default,{})]})]}),(0,e.jsx)("button",{onClick:m,className:"w-full bg-gray-500 text-white p-2 rounded hover:bg-gray-600 mb-6",children:"Đăng xuất"}),(0,e.jsxs)("div",{className:"mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg",children:[(0,e.jsx)("h4",{className:"text-sm font-semibold text-yellow-800 mb-2",children:"Demo Instructions"}),(0,e.jsxs)("ul",{className:"text-xs text-yellow-700 space-y-1",children:[(0,e.jsx)("li",{children:"• Google/Facebook OAuth buttons connect to real authentication APIs"}),(0,e.jsx)("li",{children:"• Phone OTP is simulated for demo purposes"}),(0,e.jsx)("li",{children:"• Successful logins redirect to dashboard automatically"}),(0,e.jsx)("li",{children:"• JWT tokens are stored in localStorage"})]})]})]})}],477051)}]);