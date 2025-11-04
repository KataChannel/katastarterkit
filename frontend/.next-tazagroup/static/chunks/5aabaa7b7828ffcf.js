(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,138227,e=>{"use strict";var t=e.i(874061);e.s(["Trash2",()=>t.default])},606443,e=>{"use strict";var t=e.i(994315);e.s(["Plus",()=>t.default])},257117,e=>{"use strict";var t=e.i(838049);e.s(["XCircle",()=>t.default])},835819,e=>{"use strict";var t=e.i(403055);e.i(940392);let a=Array(12).fill(0),r=1,s=new class{constructor(){this.subscribe=e=>(this.subscribers.push(e),()=>{let t=this.subscribers.indexOf(e);this.subscribers.splice(t,1)}),this.publish=e=>{this.subscribers.forEach(t=>t(e))},this.addToast=e=>{this.publish(e),this.toasts=[...this.toasts,e]},this.create=e=>{var t;let{message:a,...s}=e,o="number"==typeof(null==e?void 0:e.id)||(null==(t=e.id)?void 0:t.length)>0?e.id:r++,i=this.toasts.find(e=>e.id===o),n=void 0===e.dismissible||e.dismissible;return this.dismissedToasts.has(o)&&this.dismissedToasts.delete(o),i?this.toasts=this.toasts.map(t=>t.id===o?(this.publish({...t,...e,id:o,title:a}),{...t,...e,id:o,dismissible:n,title:a}):t):this.addToast({title:a,...s,dismissible:n,id:o}),o},this.dismiss=e=>(e?(this.dismissedToasts.add(e),requestAnimationFrame(()=>this.subscribers.forEach(t=>t({id:e,dismiss:!0})))):this.toasts.forEach(e=>{this.subscribers.forEach(t=>t({id:e.id,dismiss:!0}))}),e),this.message=(e,t)=>this.create({...t,message:e}),this.error=(e,t)=>this.create({...t,message:e,type:"error"}),this.success=(e,t)=>this.create({...t,type:"success",message:e}),this.info=(e,t)=>this.create({...t,type:"info",message:e}),this.warning=(e,t)=>this.create({...t,type:"warning",message:e}),this.loading=(e,t)=>this.create({...t,type:"loading",message:e}),this.promise=(e,a)=>{let r,s;if(!a)return;void 0!==a.loading&&(s=this.create({...a,promise:e,type:"loading",message:a.loading,description:"function"!=typeof a.description?a.description:void 0}));let i=Promise.resolve(e instanceof Function?e():e),n=void 0!==s,l=i.then(async e=>{if(r=["resolve",e],t.default.isValidElement(e))n=!1,this.create({id:s,type:"default",message:e});else if(o(e)&&!e.ok){n=!1;let r="function"==typeof a.error?await a.error(`HTTP error! status: ${e.status}`):a.error,o="function"==typeof a.description?await a.description(`HTTP error! status: ${e.status}`):a.description,i="object"!=typeof r||t.default.isValidElement(r)?{message:r}:r;this.create({id:s,type:"error",description:o,...i})}else if(e instanceof Error){n=!1;let r="function"==typeof a.error?await a.error(e):a.error,o="function"==typeof a.description?await a.description(e):a.description,i="object"!=typeof r||t.default.isValidElement(r)?{message:r}:r;this.create({id:s,type:"error",description:o,...i})}else if(void 0!==a.success){n=!1;let r="function"==typeof a.success?await a.success(e):a.success,o="function"==typeof a.description?await a.description(e):a.description,i="object"!=typeof r||t.default.isValidElement(r)?{message:r}:r;this.create({id:s,type:"success",description:o,...i})}}).catch(async e=>{if(r=["reject",e],void 0!==a.error){n=!1;let r="function"==typeof a.error?await a.error(e):a.error,o="function"==typeof a.description?await a.description(e):a.description,i="object"!=typeof r||t.default.isValidElement(r)?{message:r}:r;this.create({id:s,type:"error",description:o,...i})}}).finally(()=>{n&&(this.dismiss(s),s=void 0),null==a.finally||a.finally.call(a)}),d=()=>new Promise((e,t)=>l.then(()=>"reject"===r[0]?t(r[1]):e(r[1])).catch(t));return"string"!=typeof s&&"number"!=typeof s?{unwrap:d}:Object.assign(s,{unwrap:d})},this.custom=(e,t)=>{let a=(null==t?void 0:t.id)||r++;return this.create({jsx:e(a),id:a,...t}),a},this.getActiveToasts=()=>this.toasts.filter(e=>!this.dismissedToasts.has(e.id)),this.subscribers=[],this.toasts=[],this.dismissedToasts=new Set}},o=e=>e&&"object"==typeof e&&"ok"in e&&"boolean"==typeof e.ok&&"status"in e&&"number"==typeof e.status,i=Object.assign((e,t)=>{let a=(null==t?void 0:t.id)||r++;return s.addToast({title:e,...t,id:a}),a},{success:s.success,info:s.info,warning:s.warning,error:s.error,custom:s.custom,message:s.message,promise:s.promise,dismiss:s.dismiss,loading:s.loading},{getHistory:()=>s.toasts,getToasts:()=>s.getActiveToasts()});!function(e){if(!e||"undefined"==typeof document)return;let t=document.head||document.getElementsByTagName("head")[0],a=document.createElement("style");a.type="text/css",t.appendChild(a),a.styleSheet?a.styleSheet.cssText=e:a.appendChild(document.createTextNode(e))}("[data-sonner-toaster][dir=ltr],html[dir=ltr]{--toast-icon-margin-start:-3px;--toast-icon-margin-end:4px;--toast-svg-margin-start:-1px;--toast-svg-margin-end:0px;--toast-button-margin-start:auto;--toast-button-margin-end:0;--toast-close-button-start:0;--toast-close-button-end:unset;--toast-close-button-transform:translate(-35%, -35%)}[data-sonner-toaster][dir=rtl],html[dir=rtl]{--toast-icon-margin-start:4px;--toast-icon-margin-end:-3px;--toast-svg-margin-start:0px;--toast-svg-margin-end:-1px;--toast-button-margin-start:0;--toast-button-margin-end:auto;--toast-close-button-start:unset;--toast-close-button-end:0;--toast-close-button-transform:translate(35%, -35%)}[data-sonner-toaster]{position:fixed;width:var(--width);font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;--gray1:hsl(0, 0%, 99%);--gray2:hsl(0, 0%, 97.3%);--gray3:hsl(0, 0%, 95.1%);--gray4:hsl(0, 0%, 93%);--gray5:hsl(0, 0%, 90.9%);--gray6:hsl(0, 0%, 88.7%);--gray7:hsl(0, 0%, 85.8%);--gray8:hsl(0, 0%, 78%);--gray9:hsl(0, 0%, 56.1%);--gray10:hsl(0, 0%, 52.3%);--gray11:hsl(0, 0%, 43.5%);--gray12:hsl(0, 0%, 9%);--border-radius:8px;box-sizing:border-box;padding:0;margin:0;list-style:none;outline:0;z-index:999999999;transition:transform .4s ease}@media (hover:none) and (pointer:coarse){[data-sonner-toaster][data-lifted=true]{transform:none}}[data-sonner-toaster][data-x-position=right]{right:var(--offset-right)}[data-sonner-toaster][data-x-position=left]{left:var(--offset-left)}[data-sonner-toaster][data-x-position=center]{left:50%;transform:translateX(-50%)}[data-sonner-toaster][data-y-position=top]{top:var(--offset-top)}[data-sonner-toaster][data-y-position=bottom]{bottom:var(--offset-bottom)}[data-sonner-toast]{--y:translateY(100%);--lift-amount:calc(var(--lift) * var(--gap));z-index:var(--z-index);position:absolute;opacity:0;transform:var(--y);touch-action:none;transition:transform .4s,opacity .4s,height .4s,box-shadow .2s;box-sizing:border-box;outline:0;overflow-wrap:anywhere}[data-sonner-toast][data-styled=true]{padding:16px;background:var(--normal-bg);border:1px solid var(--normal-border);color:var(--normal-text);border-radius:var(--border-radius);box-shadow:0 4px 12px rgba(0,0,0,.1);width:var(--width);font-size:13px;display:flex;align-items:center;gap:6px}[data-sonner-toast]:focus-visible{box-shadow:0 4px 12px rgba(0,0,0,.1),0 0 0 2px rgba(0,0,0,.2)}[data-sonner-toast][data-y-position=top]{top:0;--y:translateY(-100%);--lift:1;--lift-amount:calc(1 * var(--gap))}[data-sonner-toast][data-y-position=bottom]{bottom:0;--y:translateY(100%);--lift:-1;--lift-amount:calc(var(--lift) * var(--gap))}[data-sonner-toast][data-styled=true] [data-description]{font-weight:400;line-height:1.4;color:#3f3f3f}[data-rich-colors=true][data-sonner-toast][data-styled=true] [data-description]{color:inherit}[data-sonner-toaster][data-sonner-theme=dark] [data-description]{color:#e8e8e8}[data-sonner-toast][data-styled=true] [data-title]{font-weight:500;line-height:1.5;color:inherit}[data-sonner-toast][data-styled=true] [data-icon]{display:flex;height:16px;width:16px;position:relative;justify-content:flex-start;align-items:center;flex-shrink:0;margin-left:var(--toast-icon-margin-start);margin-right:var(--toast-icon-margin-end)}[data-sonner-toast][data-promise=true] [data-icon]>svg{opacity:0;transform:scale(.8);transform-origin:center;animation:sonner-fade-in .3s ease forwards}[data-sonner-toast][data-styled=true] [data-icon]>*{flex-shrink:0}[data-sonner-toast][data-styled=true] [data-icon] svg{margin-left:var(--toast-svg-margin-start);margin-right:var(--toast-svg-margin-end)}[data-sonner-toast][data-styled=true] [data-content]{display:flex;flex-direction:column;gap:2px}[data-sonner-toast][data-styled=true] [data-button]{border-radius:4px;padding-left:8px;padding-right:8px;height:24px;font-size:12px;color:var(--normal-bg);background:var(--normal-text);margin-left:var(--toast-button-margin-start);margin-right:var(--toast-button-margin-end);border:none;font-weight:500;cursor:pointer;outline:0;display:flex;align-items:center;flex-shrink:0;transition:opacity .4s,box-shadow .2s}[data-sonner-toast][data-styled=true] [data-button]:focus-visible{box-shadow:0 0 0 2px rgba(0,0,0,.4)}[data-sonner-toast][data-styled=true] [data-button]:first-of-type{margin-left:var(--toast-button-margin-start);margin-right:var(--toast-button-margin-end)}[data-sonner-toast][data-styled=true] [data-cancel]{color:var(--normal-text);background:rgba(0,0,0,.08)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast][data-styled=true] [data-cancel]{background:rgba(255,255,255,.3)}[data-sonner-toast][data-styled=true] [data-close-button]{position:absolute;left:var(--toast-close-button-start);right:var(--toast-close-button-end);top:0;height:20px;width:20px;display:flex;justify-content:center;align-items:center;padding:0;color:var(--gray12);background:var(--normal-bg);border:1px solid var(--gray4);transform:var(--toast-close-button-transform);border-radius:50%;cursor:pointer;z-index:1;transition:opacity .1s,background .2s,border-color .2s}[data-sonner-toast][data-styled=true] [data-close-button]:focus-visible{box-shadow:0 4px 12px rgba(0,0,0,.1),0 0 0 2px rgba(0,0,0,.2)}[data-sonner-toast][data-styled=true] [data-disabled=true]{cursor:not-allowed}[data-sonner-toast][data-styled=true]:hover [data-close-button]:hover{background:var(--gray2);border-color:var(--gray5)}[data-sonner-toast][data-swiping=true]::before{content:'';position:absolute;left:-100%;right:-100%;height:100%;z-index:-1}[data-sonner-toast][data-y-position=top][data-swiping=true]::before{bottom:50%;transform:scaleY(3) translateY(50%)}[data-sonner-toast][data-y-position=bottom][data-swiping=true]::before{top:50%;transform:scaleY(3) translateY(-50%)}[data-sonner-toast][data-swiping=false][data-removed=true]::before{content:'';position:absolute;inset:0;transform:scaleY(2)}[data-sonner-toast][data-expanded=true]::after{content:'';position:absolute;left:0;height:calc(var(--gap) + 1px);bottom:100%;width:100%}[data-sonner-toast][data-mounted=true]{--y:translateY(0);opacity:1}[data-sonner-toast][data-expanded=false][data-front=false]{--scale:var(--toasts-before) * 0.05 + 1;--y:translateY(calc(var(--lift-amount) * var(--toasts-before))) scale(calc(-1 * var(--scale)));height:var(--front-toast-height)}[data-sonner-toast]>*{transition:opacity .4s}[data-sonner-toast][data-x-position=right]{right:0}[data-sonner-toast][data-x-position=left]{left:0}[data-sonner-toast][data-expanded=false][data-front=false][data-styled=true]>*{opacity:0}[data-sonner-toast][data-visible=false]{opacity:0;pointer-events:none}[data-sonner-toast][data-mounted=true][data-expanded=true]{--y:translateY(calc(var(--lift) * var(--offset)));height:var(--initial-height)}[data-sonner-toast][data-removed=true][data-front=true][data-swipe-out=false]{--y:translateY(calc(var(--lift) * -100%));opacity:0}[data-sonner-toast][data-removed=true][data-front=false][data-swipe-out=false][data-expanded=true]{--y:translateY(calc(var(--lift) * var(--offset) + var(--lift) * -100%));opacity:0}[data-sonner-toast][data-removed=true][data-front=false][data-swipe-out=false][data-expanded=false]{--y:translateY(40%);opacity:0;transition:transform .5s,opacity .2s}[data-sonner-toast][data-removed=true][data-front=false]::before{height:calc(var(--initial-height) + 20%)}[data-sonner-toast][data-swiping=true]{transform:var(--y) translateY(var(--swipe-amount-y,0)) translateX(var(--swipe-amount-x,0));transition:none}[data-sonner-toast][data-swiped=true]{user-select:none}[data-sonner-toast][data-swipe-out=true][data-y-position=bottom],[data-sonner-toast][data-swipe-out=true][data-y-position=top]{animation-duration:.2s;animation-timing-function:ease-out;animation-fill-mode:forwards}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=left]{animation-name:swipe-out-left}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=right]{animation-name:swipe-out-right}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=up]{animation-name:swipe-out-up}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=down]{animation-name:swipe-out-down}@keyframes swipe-out-left{from{transform:var(--y) translateX(var(--swipe-amount-x));opacity:1}to{transform:var(--y) translateX(calc(var(--swipe-amount-x) - 100%));opacity:0}}@keyframes swipe-out-right{from{transform:var(--y) translateX(var(--swipe-amount-x));opacity:1}to{transform:var(--y) translateX(calc(var(--swipe-amount-x) + 100%));opacity:0}}@keyframes swipe-out-up{from{transform:var(--y) translateY(var(--swipe-amount-y));opacity:1}to{transform:var(--y) translateY(calc(var(--swipe-amount-y) - 100%));opacity:0}}@keyframes swipe-out-down{from{transform:var(--y) translateY(var(--swipe-amount-y));opacity:1}to{transform:var(--y) translateY(calc(var(--swipe-amount-y) + 100%));opacity:0}}@media (max-width:600px){[data-sonner-toaster]{position:fixed;right:var(--mobile-offset-right);left:var(--mobile-offset-left);width:100%}[data-sonner-toaster][dir=rtl]{left:calc(var(--mobile-offset-left) * -1)}[data-sonner-toaster] [data-sonner-toast]{left:0;right:0;width:calc(100% - var(--mobile-offset-left) * 2)}[data-sonner-toaster][data-x-position=left]{left:var(--mobile-offset-left)}[data-sonner-toaster][data-y-position=bottom]{bottom:var(--mobile-offset-bottom)}[data-sonner-toaster][data-y-position=top]{top:var(--mobile-offset-top)}[data-sonner-toaster][data-x-position=center]{left:var(--mobile-offset-left);right:var(--mobile-offset-right);transform:none}}[data-sonner-toaster][data-sonner-theme=light]{--normal-bg:#fff;--normal-border:var(--gray4);--normal-text:var(--gray12);--success-bg:hsl(143, 85%, 96%);--success-border:hsl(145, 92%, 87%);--success-text:hsl(140, 100%, 27%);--info-bg:hsl(208, 100%, 97%);--info-border:hsl(221, 91%, 93%);--info-text:hsl(210, 92%, 45%);--warning-bg:hsl(49, 100%, 97%);--warning-border:hsl(49, 91%, 84%);--warning-text:hsl(31, 92%, 45%);--error-bg:hsl(359, 100%, 97%);--error-border:hsl(359, 100%, 94%);--error-text:hsl(360, 100%, 45%)}[data-sonner-toaster][data-sonner-theme=light] [data-sonner-toast][data-invert=true]{--normal-bg:#000;--normal-border:hsl(0, 0%, 20%);--normal-text:var(--gray1)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast][data-invert=true]{--normal-bg:#fff;--normal-border:var(--gray3);--normal-text:var(--gray12)}[data-sonner-toaster][data-sonner-theme=dark]{--normal-bg:#000;--normal-bg-hover:hsl(0, 0%, 12%);--normal-border:hsl(0, 0%, 20%);--normal-border-hover:hsl(0, 0%, 25%);--normal-text:var(--gray1);--success-bg:hsl(150, 100%, 6%);--success-border:hsl(147, 100%, 12%);--success-text:hsl(150, 86%, 65%);--info-bg:hsl(215, 100%, 6%);--info-border:hsl(223, 43%, 17%);--info-text:hsl(216, 87%, 65%);--warning-bg:hsl(64, 100%, 6%);--warning-border:hsl(60, 100%, 9%);--warning-text:hsl(46, 87%, 65%);--error-bg:hsl(358, 76%, 10%);--error-border:hsl(357, 89%, 16%);--error-text:hsl(358, 100%, 81%)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast] [data-close-button]{background:var(--normal-bg);border-color:var(--normal-border);color:var(--normal-text)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast] [data-close-button]:hover{background:var(--normal-bg-hover);border-color:var(--normal-border-hover)}[data-rich-colors=true][data-sonner-toast][data-type=success]{background:var(--success-bg);border-color:var(--success-border);color:var(--success-text)}[data-rich-colors=true][data-sonner-toast][data-type=success] [data-close-button]{background:var(--success-bg);border-color:var(--success-border);color:var(--success-text)}[data-rich-colors=true][data-sonner-toast][data-type=info]{background:var(--info-bg);border-color:var(--info-border);color:var(--info-text)}[data-rich-colors=true][data-sonner-toast][data-type=info] [data-close-button]{background:var(--info-bg);border-color:var(--info-border);color:var(--info-text)}[data-rich-colors=true][data-sonner-toast][data-type=warning]{background:var(--warning-bg);border-color:var(--warning-border);color:var(--warning-text)}[data-rich-colors=true][data-sonner-toast][data-type=warning] [data-close-button]{background:var(--warning-bg);border-color:var(--warning-border);color:var(--warning-text)}[data-rich-colors=true][data-sonner-toast][data-type=error]{background:var(--error-bg);border-color:var(--error-border);color:var(--error-text)}[data-rich-colors=true][data-sonner-toast][data-type=error] [data-close-button]{background:var(--error-bg);border-color:var(--error-border);color:var(--error-text)}.sonner-loading-wrapper{--size:16px;height:var(--size);width:var(--size);position:absolute;inset:0;z-index:10}.sonner-loading-wrapper[data-visible=false]{transform-origin:center;animation:sonner-fade-out .2s ease forwards}.sonner-spinner{position:relative;top:50%;left:50%;height:var(--size);width:var(--size)}.sonner-loading-bar{animation:sonner-spin 1.2s linear infinite;background:var(--gray11);border-radius:6px;height:8%;left:-10%;position:absolute;top:-3.9%;width:24%}.sonner-loading-bar:first-child{animation-delay:-1.2s;transform:rotate(.0001deg) translate(146%)}.sonner-loading-bar:nth-child(2){animation-delay:-1.1s;transform:rotate(30deg) translate(146%)}.sonner-loading-bar:nth-child(3){animation-delay:-1s;transform:rotate(60deg) translate(146%)}.sonner-loading-bar:nth-child(4){animation-delay:-.9s;transform:rotate(90deg) translate(146%)}.sonner-loading-bar:nth-child(5){animation-delay:-.8s;transform:rotate(120deg) translate(146%)}.sonner-loading-bar:nth-child(6){animation-delay:-.7s;transform:rotate(150deg) translate(146%)}.sonner-loading-bar:nth-child(7){animation-delay:-.6s;transform:rotate(180deg) translate(146%)}.sonner-loading-bar:nth-child(8){animation-delay:-.5s;transform:rotate(210deg) translate(146%)}.sonner-loading-bar:nth-child(9){animation-delay:-.4s;transform:rotate(240deg) translate(146%)}.sonner-loading-bar:nth-child(10){animation-delay:-.3s;transform:rotate(270deg) translate(146%)}.sonner-loading-bar:nth-child(11){animation-delay:-.2s;transform:rotate(300deg) translate(146%)}.sonner-loading-bar:nth-child(12){animation-delay:-.1s;transform:rotate(330deg) translate(146%)}@keyframes sonner-fade-in{0%{opacity:0;transform:scale(.8)}100%{opacity:1;transform:scale(1)}}@keyframes sonner-fade-out{0%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(.8)}}@keyframes sonner-spin{0%{opacity:1}100%{opacity:.15}}@media (prefers-reduced-motion){.sonner-loading-bar,[data-sonner-toast],[data-sonner-toast]>*{transition:none!important;animation:none!important}}.sonner-loader{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);transform-origin:center;transition:opacity .2s,transform .2s}.sonner-loader[data-visible=false]{opacity:0;transform:scale(.8) translate(-50%,-50%)}");e.s(["toast",()=>i])},965120,e=>{"use strict";var t=e.i(381299);e.s(["Edit",()=>t.default])},415733,e=>{"use strict";var t=e.i(44990),a=e.i(403055),r=e.i(541428);let s=a.forwardRef(({className:e,...a},s)=>(0,t.jsx)("div",{ref:s,role:"alert",className:(0,r.cn)("relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",e),...a}));s.displayName="Alert";let o=a.forwardRef(({className:e,...a},s)=>(0,t.jsx)("div",{ref:s,className:(0,r.cn)("text-sm [&_p]:leading-relaxed",e),...a}));o.displayName="AlertDescription",e.s(["Alert",()=>s,"AlertDescription",()=>o])},455461,e=>{"use strict";var t=e.i(979426);e.s(["Upload",()=>t.default])},741850,e=>{"use strict";var t=e.i(44990),a=e.i(403055);let r=a.forwardRef(({className:e,...a},r)=>(0,t.jsx)("div",{className:"relative w-full overflow-auto",children:(0,t.jsx)("table",{ref:r,className:`w-full caption-bottom text-sm ${e||""}`,...a})}));r.displayName="Table";let s=a.forwardRef(({className:e,...a},r)=>(0,t.jsx)("thead",{ref:r,className:`[&_tr]:border-b ${e||""}`,...a}));s.displayName="TableHeader";let o=a.forwardRef(({className:e,...a},r)=>(0,t.jsx)("tbody",{ref:r,className:`[&_tr:last-child]:border-0 ${e||""}`,...a}));o.displayName="TableBody",a.forwardRef(({className:e,...a},r)=>(0,t.jsx)("tfoot",{ref:r,className:`border-t bg-gray-100/50 font-medium [&>tr]:last:border-b-0 ${e||""}`,...a})).displayName="TableFooter";let i=a.forwardRef(({className:e,...a},r)=>(0,t.jsx)("tr",{ref:r,className:`border-b transition-colors hover:bg-gray-100/50 data-[state=selected]:bg-gray-100 ${e||""}`,...a}));i.displayName="TableRow";let n=a.forwardRef(({className:e,...a},r)=>(0,t.jsx)("th",{ref:r,className:`h-12 px-4 text-left align-middle font-medium text-gray-500 [&:has([role=checkbox])]:pr-0 ${e||""}`,...a}));n.displayName="TableHead";let l=a.forwardRef(({className:e,...a},r)=>(0,t.jsx)("td",{ref:r,className:`p-4 align-middle [&:has([role=checkbox])]:pr-0 ${e||""}`,...a}));l.displayName="TableCell",a.forwardRef(({className:e,...a},r)=>(0,t.jsx)("caption",{ref:r,className:`mt-4 text-sm text-gray-500 ${e||""}`,...a})).displayName="TableCaption",e.s(["Table",()=>r,"TableBody",()=>o,"TableCell",()=>l,"TableHead",()=>n,"TableHeader",()=>s,"TableRow",()=>i])},645030,e=>{"use strict";var t=e.i(44990),a=e.i(403055),r=e.i(316618),s=e.i(873273),o="Progress",[i,n]=(0,r.createContextScope)(o),[l,d]=i(o),c=a.forwardRef((e,a)=>{var r,o;let{__scopeProgress:i,value:n=null,max:d,getValueLabel:c=p,...u}=e;(d||0===d)&&!f(d)&&console.error((r=`${d}`,`Invalid prop \`max\` of value \`${r}\` supplied to \`Progress\`. Only numbers greater than 0 are valid max values. Defaulting to \`100\`.`));let m=f(d)?d:100;null===n||x(n,m)||console.error((o=`${n}`,`Invalid prop \`value\` of value \`${o}\` supplied to \`Progress\`. The \`value\` prop must be:
  - a positive number
  - less than the value passed to \`max\` (or 100 if no \`max\` prop is set)
  - \`null\` or \`undefined\` if the progress is indeterminate.

Defaulting to \`null\`.`));let y=x(n,m)?n:null,v=h(y)?c(y,m):void 0;return(0,t.jsx)(l,{scope:i,value:y,max:m,children:(0,t.jsx)(s.Primitive.div,{"aria-valuemax":m,"aria-valuemin":0,"aria-valuenow":h(y)?y:void 0,"aria-valuetext":v,role:"progressbar","data-state":g(y,m),"data-value":y??void 0,"data-max":m,...u,ref:a})})});c.displayName=o;var u="ProgressIndicator",m=a.forwardRef((e,a)=>{let{__scopeProgress:r,...o}=e,i=d(u,r);return(0,t.jsx)(s.Primitive.div,{"data-state":g(i.value,i.max),"data-value":i.value??void 0,"data-max":i.max,...o,ref:a})});function p(e,t){return`${Math.round(e/t*100)}%`}function g(e,t){return null==e?"indeterminate":e===t?"complete":"loading"}function h(e){return"number"==typeof e}function f(e){return h(e)&&!isNaN(e)&&e>0}function x(e,t){return h(e)&&!isNaN(e)&&e<=t&&e>=0}m.displayName=u;var y=e.i(541428);let v=a.forwardRef(({className:e,value:a,indicatorClassName:r,...s},o)=>(0,t.jsx)(c,{ref:o,className:(0,y.cn)("relative h-4 w-full overflow-hidden rounded-full bg-secondary",e),...s,children:(0,t.jsx)(m,{className:(0,y.cn)("h-full w-full flex-1 bg-primary transition-all",r),style:{transform:`translateX(-${100-(a||0)}%)`}})}));v.displayName=c.displayName,e.s(["Progress",()=>v],645030)},404210,e=>{"use strict";var t=e.i(591353);e.s(["Eye",()=>t.default])},580523,e=>{"use strict";var t=e.i(403055),a=e.i(119836),r=e.i(569658),s=e.i(316618),o=e.i(559663),i=e.i(346412),n=e.i(430840),l=e.i(621829),d=e.i(581263),c=e.i(767478),u=e.i(873273),m=e.i(767835),p=e.i(896438),g=e.i(739045),h=e.i(599488),f=e.i(44990),x="Dialog",[y,v]=(0,s.createContextScope)(x),[b,C]=y(x),T=e=>{let{__scopeDialog:a,children:r,open:s,defaultOpen:n,onOpenChange:l,modal:d=!0}=e,c=t.useRef(null),u=t.useRef(null),[m,p]=(0,i.useControllableState)({prop:s,defaultProp:n??!1,onChange:l,caller:x});return(0,f.jsx)(b,{scope:a,triggerRef:c,contentRef:u,contentId:(0,o.useId)(),titleId:(0,o.useId)(),descriptionId:(0,o.useId)(),open:m,onOpenChange:p,onOpenToggle:t.useCallback(()=>p(e=>!e),[p]),modal:d,children:r})};T.displayName=x;var j="DialogTrigger",w=t.forwardRef((e,t)=>{let{__scopeDialog:s,...o}=e,i=C(j,s),n=(0,r.useComposedRefs)(t,i.triggerRef);return(0,f.jsx)(u.Primitive.button,{type:"button","aria-haspopup":"dialog","aria-expanded":i.open,"aria-controls":i.contentId,"data-state":H(i.open),...o,ref:n,onClick:(0,a.composeEventHandlers)(e.onClick,i.onOpenToggle)})});w.displayName=j;var N="DialogPortal",[P,R]=y(N,{forceMount:void 0}),E=e=>{let{__scopeDialog:a,forceMount:r,children:s,container:o}=e,i=C(N,a);return(0,f.jsx)(P,{scope:a,forceMount:r,children:t.Children.map(s,e=>(0,f.jsx)(c.Presence,{present:r||i.open,children:(0,f.jsx)(d.Portal,{asChild:!0,container:o,children:e})}))})};E.displayName=N;var D="DialogOverlay",A=t.forwardRef((e,t)=>{let a=R(D,e.__scopeDialog),{forceMount:r=a.forceMount,...s}=e,o=C(D,e.__scopeDialog);return o.modal?(0,f.jsx)(c.Presence,{present:r||o.open,children:(0,f.jsx)(F,{...s,ref:t})}):null});A.displayName=D;var $=(0,h.createSlot)("DialogOverlay.RemoveScroll"),F=t.forwardRef((e,t)=>{let{__scopeDialog:a,...r}=e,s=C(D,a);return(0,f.jsx)(p.RemoveScroll,{as:$,allowPinchZoom:!0,shards:[s.contentRef],children:(0,f.jsx)(u.Primitive.div,{"data-state":H(s.open),...r,ref:t,style:{pointerEvents:"auto",...r.style}})})}),I="DialogContent",_=t.forwardRef((e,t)=>{let a=R(I,e.__scopeDialog),{forceMount:r=a.forceMount,...s}=e,o=C(I,e.__scopeDialog);return(0,f.jsx)(c.Presence,{present:r||o.open,children:o.modal?(0,f.jsx)(O,{...s,ref:t}):(0,f.jsx)(k,{...s,ref:t})})});_.displayName=I;var O=t.forwardRef((e,s)=>{let o=C(I,e.__scopeDialog),i=t.useRef(null),n=(0,r.useComposedRefs)(s,o.contentRef,i);return t.useEffect(()=>{let e=i.current;if(e)return(0,g.hideOthers)(e)},[]),(0,f.jsx)(S,{...e,ref:n,trapFocus:o.open,disableOutsidePointerEvents:!0,onCloseAutoFocus:(0,a.composeEventHandlers)(e.onCloseAutoFocus,e=>{e.preventDefault(),o.triggerRef.current?.focus()}),onPointerDownOutside:(0,a.composeEventHandlers)(e.onPointerDownOutside,e=>{let t=e.detail.originalEvent,a=0===t.button&&!0===t.ctrlKey;(2===t.button||a)&&e.preventDefault()}),onFocusOutside:(0,a.composeEventHandlers)(e.onFocusOutside,e=>e.preventDefault())})}),k=t.forwardRef((e,a)=>{let r=C(I,e.__scopeDialog),s=t.useRef(!1),o=t.useRef(!1);return(0,f.jsx)(S,{...e,ref:a,trapFocus:!1,disableOutsidePointerEvents:!1,onCloseAutoFocus:t=>{e.onCloseAutoFocus?.(t),t.defaultPrevented||(s.current||r.triggerRef.current?.focus(),t.preventDefault()),s.current=!1,o.current=!1},onInteractOutside:t=>{e.onInteractOutside?.(t),t.defaultPrevented||(s.current=!0,"pointerdown"===t.detail.originalEvent.type&&(o.current=!0));let a=t.target;r.triggerRef.current?.contains(a)&&t.preventDefault(),"focusin"===t.detail.originalEvent.type&&o.current&&t.preventDefault()}})}),S=t.forwardRef((e,a)=>{let{__scopeDialog:s,trapFocus:o,onOpenAutoFocus:i,onCloseAutoFocus:d,...c}=e,u=C(I,s),p=t.useRef(null),g=(0,r.useComposedRefs)(a,p);return(0,m.useFocusGuards)(),(0,f.jsxs)(f.Fragment,{children:[(0,f.jsx)(l.FocusScope,{asChild:!0,loop:!0,trapped:o,onMountAutoFocus:i,onUnmountAutoFocus:d,children:(0,f.jsx)(n.DismissableLayer,{role:"dialog",id:u.contentId,"aria-describedby":u.descriptionId,"aria-labelledby":u.titleId,"data-state":H(u.open),...c,ref:g,onDismiss:()=>u.onOpenChange(!1)})}),(0,f.jsxs)(f.Fragment,{children:[(0,f.jsx)(K,{titleId:u.titleId}),(0,f.jsx)(X,{contentRef:p,descriptionId:u.descriptionId})]})]})}),U="DialogTitle",G=t.forwardRef((e,t)=>{let{__scopeDialog:a,...r}=e,s=C(U,a);return(0,f.jsx)(u.Primitive.h2,{id:s.titleId,...r,ref:t})});G.displayName=U;var B="DialogDescription",q=t.forwardRef((e,t)=>{let{__scopeDialog:a,...r}=e,s=C(B,a);return(0,f.jsx)(u.Primitive.p,{id:s.descriptionId,...r,ref:t})});q.displayName=B;var M="DialogClose",Y=t.forwardRef((e,t)=>{let{__scopeDialog:r,...s}=e,o=C(M,r);return(0,f.jsx)(u.Primitive.button,{type:"button",...s,ref:t,onClick:(0,a.composeEventHandlers)(e.onClick,()=>o.onOpenChange(!1))})});function H(e){return e?"open":"closed"}Y.displayName=M;var V="DialogTitleWarning",[L,z]=(0,s.createContext)(V,{contentName:I,titleName:U,docsSlug:"dialog"}),K=({titleId:e})=>{let a=z(V),r=`\`${a.contentName}\` requires a \`${a.titleName}\` for the component to be accessible for screen reader users.

If you want to hide the \`${a.titleName}\`, you can wrap it with our VisuallyHidden component.

For more information, see https://radix-ui.com/primitives/docs/components/${a.docsSlug}`;return t.useEffect(()=>{e&&(document.getElementById(e)||console.error(r))},[r,e]),null},X=({contentRef:e,descriptionId:a})=>{let r=z("DialogDescriptionWarning"),s=`Warning: Missing \`Description\` or \`aria-describedby={undefined}\` for {${r.contentName}}.`;return t.useEffect(()=>{let t=e.current?.getAttribute("aria-describedby");a&&t&&(document.getElementById(a)||console.warn(s))},[s,e,a]),null};e.s(["Close",()=>Y,"Content",()=>_,"Description",()=>q,"Overlay",()=>A,"Portal",()=>E,"Root",()=>T,"Title",()=>G,"Trigger",()=>w])},137651,e=>{"use strict";var t=e.i(44990),a=e.i(403055),r=e.i(580523),s=e.i(888540),o=e.i(541428);let i=r.Root,n=r.Trigger,l=a.forwardRef(({className:e,...a},s)=>(0,t.jsx)(r.Overlay,{ref:s,className:(0,o.cn)("fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",e),...a}));l.displayName=r.Overlay.displayName;let d=a.forwardRef(({className:e,children:a,...i},n)=>(0,t.jsxs)(r.Portal,{children:[(0,t.jsx)(l,{}),(0,t.jsxs)(r.Content,{ref:n,className:(0,o.cn)("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",e),...i,children:[a,(0,t.jsxs)(r.Close,{className:"absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-gray-100 data-[state=open]:text-gray-500",children:[(0,t.jsx)(s.X,{className:"h-4 w-4"}),(0,t.jsx)("span",{className:"sr-only",children:"Close"})]})]})]}));d.displayName=r.Content.displayName;let c=({className:e,...a})=>(0,t.jsx)("div",{className:(0,o.cn)("flex flex-col space-y-1.5 text-center sm:text-left",e),...a});c.displayName="DialogHeader";let u=a.forwardRef(({className:e,...a},s)=>(0,t.jsx)(r.Title,{ref:s,className:(0,o.cn)("text-lg font-semibold leading-none tracking-tight",e),...a}));u.displayName=r.Title.displayName;let m=a.forwardRef(({className:e,...a},s)=>(0,t.jsx)(r.Description,{ref:s,className:(0,o.cn)("text-sm text-muted-foreground",e),...a}));m.displayName=r.Description.displayName;let p=({className:e,...a})=>(0,t.jsx)("div",{className:(0,o.cn)("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",e),...a});p.displayName="DialogFooter",e.s(["Dialog",()=>i,"DialogContent",()=>d,"DialogDescription",()=>m,"DialogFooter",()=>p,"DialogHeader",()=>c,"DialogTitle",()=>u,"DialogTrigger",()=>n])},897711,e=>{"use strict";var t=e.i(980295);e.s(["Download",()=>t.default])},248025,e=>{"use strict";var t=e.i(32826);e.s(["FileSpreadsheet",()=>t.default])},574375,e=>{"use strict";var t=e.i(984804);let a=t.gql`
  fragment CategoryBasicFields on CategoryType {
    id
    name
    slug
    description
    image
    displayOrder
    isActive
    createdAt
  }
`,r=t.gql`
  ${a}
  fragment CategoryWithCountFields on CategoryType {
    ...CategoryBasicFields
    productCount
  }
`,s=t.gql`
  ${r}
  fragment CategoryTreeFields on CategoryType {
    ...CategoryWithCountFields
    parent {
      id
      name
      slug
    }
    children {
      ...CategoryWithCountFields
    }
  }
`,o=t.gql`
  fragment ProductImageFields on ProductImageType {
    id
    url
    alt
    isPrimary
    order
    createdAt
  }
`,i=t.gql`
  fragment ProductVariantFields on ProductVariantType {
    id
    name
    sku
    price
    stock
    order
    isActive
    attributes
    createdAt
  }
`;t.gql`
  fragment ProductBasicFields on ProductType {
    id
    name
    slug
    description
    shortDesc
    price
    compareAtPrice
    status
    isActive
    sku
    createdAt
  }
`;let n=t.gql`
  fragment UserFragment on User {
    id
    email
    username
    firstName
    lastName
    phone
    avatar
    roleType
    isActive
    isVerified
    isTwoFactorEnabled
    failedLoginAttempts
    lockedUntil
    lastLoginAt
    createdAt
    updatedAt
  }
`,l=t.gql`
  fragment PostFragment on Post {
    id
    title
    slug
    content
    excerpt
    featured_image
    author {
      id
      username
    }
    category {
      id
      name
    }
    published_at
    created_at
  }
`,d=t.gql`
  fragment CommentFragment on Comment {
    id
    content
    author {
      id
      username
    }
    post {
      id
      title
    }
    created_at
  }
`;e.s(["CATEGORY_BASIC_FRAGMENT",0,a,"CATEGORY_TREE_FRAGMENT",0,s,"CATEGORY_WITH_COUNT_FRAGMENT",0,r,"COMMENT_FRAGMENT",0,d,"POST_FRAGMENT",0,l,"PRODUCT_IMAGE_FRAGMENT",0,o,"PRODUCT_VARIANT_FRAGMENT",0,i,"USER_FRAGMENT",0,n])},355422,e=>{"use strict";var t=e.i(984804),a=e.i(574375);let r=a.PRODUCT_IMAGE_FRAGMENT,s=a.PRODUCT_VARIANT_FRAGMENT,o=t.gql`
  fragment ProductBasicFields on ProductType {
    id
    name
    slug
    description
    shortDesc
    sku
    barcode
    price
    originalPrice
    costPrice
    unit
    stock
    minStock
    status
    thumbnail
    origin
    createdAt
    updatedAt
  }
`,i=t.gql`
  ${o}
  ${r}
  ${s}
  ${a.CATEGORY_BASIC_FRAGMENT}
  fragment ProductFullFields on ProductType {
    ...ProductBasicFields
    category {
      ...CategoryBasicFields
    }
    images {
      ...ProductImageFields
    }
    variants {
      ...ProductVariantFields
    }
    isFeatured
    isNewArrival
    isBestSeller
    isOnSale
    weight
    attributes
    metaTitle
    metaDescription
    metaKeywords
  }
`,n=t.gql`
  ${o}
  ${a.CATEGORY_BASIC_FRAGMENT}
  query GetProducts($input: GetProductsInput) {
    products(input: $input) {
      items {
        ...ProductBasicFields
        category {
          ...CategoryBasicFields
        }
        isFeatured
        isNewArrival
        isBestSeller
        isOnSale
      }
      total
      page
      limit
      totalPages
    }
  }
`,l=t.gql`
  ${i}
  query GetProduct($id: ID!) {
    product(id: $id) {
      ...ProductFullFields
    }
  }
`,d=t.gql`
  ${i}
  query GetProductBySlug($slug: String!) {
    productBySlug(slug: $slug) {
      ...ProductFullFields
    }
  }
`,c=t.gql`
  ${o}
  query GetProductsByCategory($categoryId: ID!, $input: GetProductsInput) {
    productsByCategory(categoryId: $categoryId, input: $input) {
      items {
        ...ProductBasicFields
        isFeatured
        isNewArrival
        isBestSeller
        isOnSale
      }
      total
      page
      limit
      totalPages
    }
  }
`,u=t.gql`
  ${o}
  ${a.CATEGORY_BASIC_FRAGMENT}
  query GetFeaturedProducts($limit: Int) {
    products(input: { 
      filters: { isFeatured: true }
      limit: $limit
      sortBy: "createdAt"
      sortOrder: DESC
    }) {
      items {
        ...ProductBasicFields
        category {
          ...CategoryBasicFields
        }
        discountPercentage
      }
      total
    }
  }
`,m=t.gql`
  ${o}
  ${a.CATEGORY_BASIC_FRAGMENT}
  query SearchProducts($search: String!, $limit: Int, $page: Int) {
    products(input: { 
      filters: { search: $search }
      limit: $limit
      page: $page
    }) {
      items {
        ...ProductBasicFields
        category {
          ...CategoryBasicFields
        }
        discountPercentage
      }
      total
      page
      limit
      totalPages
    }
  }
`;t.gql`
  ${o}
  ${a.CATEGORY_BASIC_FRAGMENT}
  query GetCheapProducts($input: GetProductsInput) {
    products(input: $input) {
      items {
        ...ProductBasicFields
        category {
          ...CategoryBasicFields
        }
        isFeatured
        isNewArrival
        isBestSeller
        isOnSale
      }
      total
      page
      limit
      totalPages
    }
  }
`;let p=t.gql`
  ${i}
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
      ...ProductFullFields
    }
  }
`,g=t.gql`
  ${i}
  mutation UpdateProduct($input: UpdateProductInput!) {
    updateProduct(input: $input) {
      ...ProductFullFields
    }
  }
`,h=t.gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id)
  }
`,f=t.gql`
  ${o}
  mutation UpdateProductStock($id: ID!, $quantity: Float!) {
    updateProductStock(id: $id, quantity: $quantity) {
      ...ProductBasicFields
    }
  }
`,x=t.gql`
  ${r}
  mutation AddProductImage($input: CreateProductImageInput!) {
    addProductImage(input: $input) {
      ...ProductImageFields
    }
  }
`,y=t.gql`
  mutation DeleteProductImage($id: ID!) {
    deleteProductImage(id: $id)
  }
`,v=t.gql`
  ${s}
  mutation AddProductVariant($input: CreateProductVariantInput!) {
    addProductVariant(input: $input) {
      ...ProductVariantFields
    }
  }
`,b=t.gql`
  ${s}
  mutation UpdateProductVariant($input: UpdateProductVariantInput!) {
    updateProductVariant(input: $input) {
      ...ProductVariantFields
    }
  }
`,C=t.gql`
  mutation DeleteProductVariant($id: ID!) {
    deleteProductVariant(id: $id)
  }
`;e.s(["ADD_PRODUCT_IMAGE",0,x,"ADD_PRODUCT_VARIANT",0,v,"CREATE_PRODUCT",0,p,"DELETE_PRODUCT",0,h,"DELETE_PRODUCT_IMAGE",0,y,"DELETE_PRODUCT_VARIANT",0,C,"GET_FEATURED_PRODUCTS",0,u,"GET_PRODUCT",0,l,"GET_PRODUCTS",0,n,"GET_PRODUCTS_BY_CATEGORY",0,c,"GET_PRODUCT_BY_SLUG",0,d,"PRODUCT_FULL_FRAGMENT",0,i,"SEARCH_PRODUCTS",0,m,"UPDATE_PRODUCT",0,g,"UPDATE_PRODUCT_STOCK",0,f,"UPDATE_PRODUCT_VARIANT",0,b])},900950,e=>{"use strict";var t=e.i(429105),a=e.i(950988);e.i(403055);var r=e.i(984804),s=e.i(574375);let o=r.gql`
  ${s.CATEGORY_WITH_COUNT_FRAGMENT}
  query GetCategories($input: GetCategoriesInput) {
    categories(input: $input) {
      items {
        ...CategoryWithCountFields
        parent {
          id
          name
        }
      }
      total
      page
      limit
      totalPages
    }
  }
`,i=r.gql`
  ${s.CATEGORY_TREE_FRAGMENT}
  query GetCategoryTree {
    categoryTree {
      ...CategoryTreeFields
      children {
        ...CategoryTreeFields
        children {
          ...CategoryWithCountFields
        }
      }
    }
  }
`;r.gql`
  ${s.CATEGORY_TREE_FRAGMENT}
  query GetCategory($id: String!) {
    category(id: $id) {
      ...CategoryTreeFields
    }
  }
`,r.gql`
  ${s.CATEGORY_TREE_FRAGMENT}
  query GetCategoryBySlug($slug: String!) {
    categoryBySlug(slug: $slug) {
      ...CategoryTreeFields
    }
  }
`;let n=r.gql`
  ${s.CATEGORY_WITH_COUNT_FRAGMENT}
  query GetActiveCategories {
    categories(input: { 
      filters: { isActive: true }
      sortBy: "displayOrder"
      sortOrder: "asc"
    }) {
      items {
        ...CategoryWithCountFields
      }
      total
    }
  }
`,l=r.gql`
  ${s.CATEGORY_TREE_FRAGMENT}
  mutation CreateCategory($input: CreateCategoryInput!) {
    createCategory(input: $input) {
      ...CategoryTreeFields
    }
  }
`,d=r.gql`
  ${s.CATEGORY_TREE_FRAGMENT}
  mutation UpdateCategory($id: String!, $input: UpdateCategoryInput!) {
    updateCategory(id: $id, input: $input) {
      ...CategoryTreeFields
    }
  }
`,c=r.gql`
  mutation DeleteCategory($id: String!) {
    deleteCategory(id: $id)
  }
`;function u(){let{data:e,loading:a,error:r,refetch:s}=(0,t.useQuery)(i);return{categoryTree:e?.categoryTree||[],loading:a,error:r,refetch:s}}function m(){let{data:e,loading:a,error:r,refetch:s}=(0,t.useQuery)(n);return{categories:e?.categories.items||[],total:e?.categories.total||0,loading:a,error:r,refetch:s}}function p(){let[e,{data:t,loading:r,error:s}]=(0,a.useMutation)(l,{refetchQueries:[{query:o},{query:i}]});return{createCategory:t=>e({variables:{input:t}}),category:t?.createCategory,loading:r,error:s}}function g(){let[e,{data:t,loading:r,error:s}]=(0,a.useMutation)(d,{refetchQueries:[{query:i}]});return{updateCategory:(t,a)=>e({variables:{id:t,input:a}}),category:t?.updateCategory,loading:r,error:s}}function h(){let[e,{data:t,loading:r,error:s}]=(0,a.useMutation)(c,{refetchQueries:[{query:o},{query:i}]});return{deleteCategory:t=>e({variables:{id:t}}),success:t?.deleteCategory,loading:r,error:s}}e.s(["useActiveCategories",()=>m,"useCategoryTree",()=>u,"useCreateCategory",()=>p,"useDeleteCategory",()=>h,"useUpdateCategory",()=>g],900950)},735917,e=>{"use strict";var t=e.i(429105),a=e.i(950988),r=e.i(355422);function s(e){let{data:a,loading:s,error:o,refetch:i}=(0,t.useQuery)(r.GET_PRODUCTS,{variables:{input:e}});return{products:a?.products.items||[],pagination:{total:a?.products.total||0,page:a?.products.page||1,limit:a?.products.limit||10,totalPages:a?.products.totalPages||0},loading:s,error:o,refetch:i}}function o(e){let{data:a,loading:s,error:o,refetch:i}=(0,t.useQuery)(r.GET_PRODUCT,{variables:{id:e},skip:!e});return{product:a?.product,loading:s,error:o,refetch:i}}function i(){let[e,{data:t,loading:s,error:o}]=(0,a.useMutation)(r.CREATE_PRODUCT,{refetchQueries:[{query:r.GET_PRODUCTS}]});return{createProduct:t=>e({variables:{input:t}}),product:t?.createProduct,loading:s,error:o}}function n(){let[e,{data:t,loading:s,error:o}]=(0,a.useMutation)(r.UPDATE_PRODUCT);return{updateProduct:t=>e({variables:{input:t}}),product:t?.updateProduct,loading:s,error:o}}function l(){let[e,{data:t,loading:s,error:o}]=(0,a.useMutation)(r.DELETE_PRODUCT,{refetchQueries:[{query:r.GET_PRODUCTS}]});return{deleteProduct:t=>e({variables:{id:t}}),success:t?.deleteProduct,loading:s,error:o}}e.i(403055),e.s(["useCreateProduct",()=>i,"useDeleteProduct",()=>l,"useProduct",()=>o,"useProducts",()=>s,"useUpdateProduct",()=>n])},993977,e=>{"use strict";var t=e.i(44990),a=e.i(403055),r=e.i(137651),s=e.i(885205),o=e.i(645030),i=e.i(415733),n=e.i(455461),l=e.i(897711),d=e.i(248025),c=e.i(112641),u=e.i(257117),m=e.i(198513),p=e.i(169989),g=e.i(4993);function h({open:e,onOpenChange:h,title:f,description:x,templateUrl:y,importUrl:v,onImportSuccess:b}){let[C,T]=(0,a.useState)(null),[j,w]=(0,a.useState)(!1),[N,P]=(0,a.useState)(null),[R,E]=(0,a.useState)(0),D=(0,a.useRef)(null),{toast:A}=(0,g.useToast)(),$=async()=>{try{let e=localStorage.getItem("accessToken"),t="http://116.118.49.243:13001/graphql".replace("/graphql","")||"http://localhost:12001",a=await fetch(`${t}${y}`,{headers:{Authorization:`Bearer ${e}`}});if(!a.ok)throw Error("Download failed");let r=await a.blob(),s=window.URL.createObjectURL(r),o=document.createElement("a");o.href=s,o.download=`template_${Date.now()}.xlsx`,document.body.appendChild(o),o.click(),window.URL.revokeObjectURL(s),document.body.removeChild(o),A({title:"Thành công",description:"Đã tải xuống file mẫu",type:"success"})}catch(e){A({title:"Lỗi",description:"Không thể tải file mẫu",type:"error"})}},F=async()=>{if(C){w(!0),E(0),P(null);try{let e=new FormData;e.append("file",C);let t=setInterval(()=>{E(e=>Math.min(e+10,90))},200),a=localStorage.getItem("accessToken"),r="http://116.118.49.243:13001/graphql".replace("/graphql","")||"http://localhost:12001",s=await fetch(`${r}${v}`,{method:"POST",headers:{Authorization:`Bearer ${a}`},body:e});clearInterval(t),E(100);let o=await s.json();P(o),o.success?(A({title:"Import thành công",description:o.message,type:"success"}),b?.()):A({title:"Import có lỗi",description:o.message,type:"error"})}catch(e){A({title:"Lỗi",description:"Không thể import file",type:"error"}),P({success:!1,totalRows:0,successCount:0,errorCount:1,errors:[{row:0,error:"Lỗi kết nối server"}],message:"Import thất bại"})}finally{w(!1)}}},I=()=>{T(null),P(null),E(0),h(!1)};return(0,t.jsx)(r.Dialog,{open:e,onOpenChange:I,children:(0,t.jsxs)(r.DialogContent,{className:"max-w-2xl max-h-[90vh] overflow-y-auto",children:[(0,t.jsxs)(r.DialogHeader,{children:[(0,t.jsx)(r.DialogTitle,{children:f}),x&&(0,t.jsx)(r.DialogDescription,{children:x})]}),(0,t.jsxs)("div",{className:"space-y-4",children:[(0,t.jsxs)("div",{className:"flex items-center gap-2 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg",children:[(0,t.jsx)(d.FileSpreadsheet,{className:"w-5 h-5 text-blue-600"}),(0,t.jsxs)("div",{className:"flex-1",children:[(0,t.jsx)("p",{className:"font-medium text-sm",children:"Bước 1: Tải file mẫu"}),(0,t.jsx)("p",{className:"text-xs text-gray-600 dark:text-gray-400",children:"File Excel có dữ liệu mẫu và hướng dẫn"})]}),(0,t.jsxs)(s.Button,{variant:"outline",size:"sm",onClick:$,children:[(0,t.jsx)(l.Download,{className:"w-4 h-4 mr-2"}),"Tải mẫu"]})]}),(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsx)("p",{className:"font-medium text-sm",children:"Bước 2: Chọn file để import"}),(0,t.jsxs)("div",{className:"flex items-center gap-2",children:[(0,t.jsx)("input",{ref:D,type:"file",accept:".xlsx,.xls",onChange:e=>{let t=e.target.files?.[0];if(t){if(!t.name.match(/\.(xlsx|xls)$/))return void A({title:"Lỗi",description:"Chỉ chấp nhận file Excel (.xlsx, .xls)",type:"error"});T(t),P(null)}},className:"hidden"}),(0,t.jsxs)(s.Button,{variant:"outline",onClick:()=>D.current?.click(),disabled:j,children:[(0,t.jsx)(n.Upload,{className:"w-4 h-4 mr-2"}),"Chọn file"]}),C&&(0,t.jsxs)("span",{className:"text-sm text-gray-600",children:[C.name," (",(C.size/1024).toFixed(1)," KB)"]})]})]}),j&&(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsxs)("div",{className:"flex items-center gap-2",children:[(0,t.jsx)(p.Loader2,{className:"w-4 h-4 animate-spin"}),(0,t.jsx)("span",{className:"text-sm",children:"Đang import..."})]}),(0,t.jsx)(o.Progress,{value:R,className:"h-2"})]}),N&&(0,t.jsxs)("div",{className:"space-y-3",children:[(0,t.jsx)(i.Alert,{className:N.success?"border-green-200 bg-green-50":"border-red-200 bg-red-50",children:(0,t.jsxs)("div",{className:"flex items-start gap-2",children:[N.success?(0,t.jsx)(c.CheckCircle2,{className:"w-5 h-5 text-green-600 mt-0.5"}):(0,t.jsx)(u.XCircle,{className:"w-5 h-5 mt-0.5"}),(0,t.jsxs)("div",{className:"flex-1",children:[(0,t.jsx)(i.AlertDescription,{className:"font-medium",children:N.message}),(0,t.jsxs)("div",{className:"mt-2 text-sm space-y-1",children:[(0,t.jsxs)("p",{children:["Tổng số dòng: ",N.totalRows]}),(0,t.jsxs)("p",{className:"text-green-600",children:["✓ Thành công: ",N.successCount]}),N.errorCount>0&&(0,t.jsxs)("p",{className:"text-red-600",children:["✗ Lỗi: ",N.errorCount]}),N.statistics&&(0,t.jsxs)("div",{className:"mt-2 pt-2 border-t",children:[void 0!==N.statistics.categoriesCreated&&(0,t.jsxs)("p",{children:["→ Tạo mới: ",N.statistics.categoriesCreated]}),void 0!==N.statistics.categoriesUpdated&&(0,t.jsxs)("p",{children:["→ Cập nhật: ",N.statistics.categoriesUpdated]}),void 0!==N.statistics.productsCreated&&(0,t.jsxs)("p",{children:["→ Tạo mới: ",N.statistics.productsCreated]}),void 0!==N.statistics.productsUpdated&&(0,t.jsxs)("p",{children:["→ Cập nhật: ",N.statistics.productsUpdated]})]})]})]})]})}),N.errors&&N.errors.length>0&&(0,t.jsxs)("div",{className:"max-h-60 overflow-y-auto border rounded-lg p-3 bg-gray-50 dark:bg-gray-900",children:[(0,t.jsxs)("p",{className:"font-medium text-sm mb-2 flex items-center gap-2",children:[(0,t.jsx)(m.AlertCircle,{className:"w-4 h-4 text-orange-600"}),"Chi tiết lỗi:"]}),(0,t.jsxs)("div",{className:"space-y-1 text-xs",children:[N.errors.slice(0,20).map((e,a)=>(0,t.jsxs)("div",{className:"flex gap-2 text-gray-700 dark:text-gray-300",children:[(0,t.jsxs)("span",{className:"font-medium",children:["Dòng ",e.row,":"]}),(0,t.jsx)("span",{children:e.error})]},a)),N.errors.length>20&&(0,t.jsxs)("p",{className:"text-gray-500 italic pt-1",children:["... và ",N.errors.length-20," lỗi khác"]})]})]})]}),(0,t.jsxs)("div",{className:"flex justify-end gap-2 pt-4 border-t",children:[(0,t.jsx)(s.Button,{variant:"outline",onClick:I,children:"Đóng"}),(0,t.jsx)(s.Button,{onClick:F,disabled:!C||j,children:j?(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(p.Loader2,{className:"w-4 h-4 mr-2 animate-spin"}),"Đang import..."]}):(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.Upload,{className:"w-4 h-4 mr-2"}),"Import"]})})]})]})]})})}e.s(["ImportExportDialog",()=>h])},387155,e=>{"use strict";var t=e.i(44990),a=e.i(403055),r=e.i(130775),s=e.i(735917),o=e.i(993977),i=e.i(885205),n=e.i(696134),l=e.i(741850),d=e.i(183194),c=e.i(702470),u=e.i(775680),m=e.i(606443),p=e.i(850384),g=e.i(965120),h=e.i(138227),f=e.i(404210),x=e.i(630596),y=e.i(567961),v=e.i(169989),b=e.i(897711),C=e.i(455461),T=e.i(900950),j=e.i(835819);let w={DRAFT:{label:"Nháp",variant:"secondary"},ACTIVE:{label:"Đang bán",variant:"default"},INACTIVE:{label:"Ngừng bán",variant:"outline"},OUT_OF_STOCK:{label:"Hết hàng",variant:"destructive"},DISCONTINUED:{label:"Ngừng kinh doanh",variant:"destructive"}},N={KG:"kg",G:"g",BUNDLE:"bó",PIECE:"củ",BAG:"túi",BOX:"hộp"};function P(){let e=(0,r.useRouter)(),[P,R]=a.default.useState({page:1,limit:20,sortBy:"createdAt",sortOrder:"desc",filters:{}}),[E,D]=a.default.useState(""),[A,$]=a.default.useState(!1),{products:F,pagination:I,loading:_,error:O,refetch:k}=(0,s.useProducts)(P),{categories:S}=(0,T.useActiveCategories)(),{deleteProduct:U,loading:G}=(0,s.useDeleteProduct)();a.default.useEffect(()=>{let e=setTimeout(()=>{R(e=>({...e,page:1,filters:{...e.filters,search:E||void 0}}))},500);return()=>clearTimeout(e)},[E]);let B=e=>new Intl.NumberFormat("vi-VN",{style:"currency",currency:"VND"}).format(e),q=(e,t)=>{R(a=>({...a,page:1,filters:{...a.filters,[e]:t||void 0}}))},M=e=>{R(t=>({...t,page:e}))},Y=async e=>{try{await U(e.id),j.toast.success(`Đ\xe3 x\xf3a sản phẩm "${e.name}"`),k()}catch(e){j.toast.error("Lỗi khi xóa sản phẩm"),console.error(e)}},H=async()=>{try{let e=localStorage.getItem("accessToken"),t=new URLSearchParams;P.filters?.categoryId&&t.append("categoryId",P.filters.categoryId),P.filters?.status&&t.append("status",P.filters.status);let a="http://116.118.49.243:13001/graphql".replace("/graphql","")||"http://localhost:12001",r=`${a}/api/product-import-export/export${t.toString()?"?"+t.toString():""}`,s=await fetch(r,{headers:{Authorization:`Bearer ${e}`}});if(!s.ok)throw Error("Export failed");let o=await s.blob(),i=window.URL.createObjectURL(o),n=document.createElement("a");n.href=i,n.download=`SanPham_${Date.now()}.xlsx`,document.body.appendChild(n),n.click(),window.URL.revokeObjectURL(i),document.body.removeChild(n),j.toast.success("Đã export sản phẩm thành công")}catch(e){j.toast.error("Không thể export sản phẩm")}};return(0,t.jsxs)("div",{className:"container mx-auto py-6 space-y-6",children:[(0,t.jsxs)("div",{className:"flex items-center justify-between",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("h1",{className:"text-3xl font-bold",children:"Quản lý sản phẩm"}),(0,t.jsx)("p",{className:"text-muted-foreground mt-1",children:"Quản lý danh sách sản phẩm, giá cả và tồn kho"})]}),(0,t.jsxs)("div",{className:"flex gap-2",children:[(0,t.jsxs)(i.Button,{variant:"outline",onClick:()=>$(!0),children:[(0,t.jsx)(C.Upload,{className:"h-4 w-4 mr-2"}),"Import Excel"]}),(0,t.jsxs)(i.Button,{variant:"outline",onClick:H,children:[(0,t.jsx)(b.Download,{className:"h-4 w-4 mr-2"}),"Export Excel"]}),(0,t.jsxs)(i.Button,{onClick:()=>e.push("/admin/products/create"),children:[(0,t.jsx)(m.Plus,{className:"h-4 w-4 mr-2"}),"Tạo sản phẩm mới"]})]})]}),(0,t.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-4 gap-4",children:[(0,t.jsxs)(u.Card,{children:[(0,t.jsx)(u.CardHeader,{className:"pb-2",children:(0,t.jsx)(u.CardTitle,{className:"text-sm font-medium text-muted-foreground",children:"Tổng sản phẩm"})}),(0,t.jsx)(u.CardContent,{children:(0,t.jsx)("div",{className:"text-2xl font-bold",children:I.total})})]}),(0,t.jsxs)(u.Card,{children:[(0,t.jsx)(u.CardHeader,{className:"pb-2",children:(0,t.jsx)(u.CardTitle,{className:"text-sm font-medium text-muted-foreground",children:"Đang bán"})}),(0,t.jsx)(u.CardContent,{children:(0,t.jsx)("div",{className:"text-2xl font-bold text-green-600",children:F.filter(e=>"ACTIVE"===e.status).length})})]}),(0,t.jsxs)(u.Card,{children:[(0,t.jsx)(u.CardHeader,{className:"pb-2",children:(0,t.jsx)(u.CardTitle,{className:"text-sm font-medium text-muted-foreground",children:"Hết hàng"})}),(0,t.jsx)(u.CardContent,{children:(0,t.jsx)("div",{className:"text-2xl font-bold text-red-600",children:F.filter(e=>"OUT_OF_STOCK"===e.status).length})})]}),(0,t.jsxs)(u.Card,{children:[(0,t.jsx)(u.CardHeader,{className:"pb-2",children:(0,t.jsx)(u.CardTitle,{className:"text-sm font-medium text-muted-foreground",children:"Nháp"})}),(0,t.jsx)(u.CardContent,{children:(0,t.jsx)("div",{className:"text-2xl font-bold text-gray-600",children:F.filter(e=>"DRAFT"===e.status).length})})]})]}),(0,t.jsx)(u.Card,{children:(0,t.jsx)(u.CardContent,{className:"pt-6",children:(0,t.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-4 gap-4",children:[(0,t.jsx)("div",{className:"md:col-span-2",children:(0,t.jsxs)("div",{className:"relative",children:[(0,t.jsx)(p.Search,{className:"absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"}),(0,t.jsx)(n.Input,{placeholder:"Tìm kiếm sản phẩm...",value:E,onChange:e=>D(e.target.value),className:"pl-10"})]})}),(0,t.jsxs)(d.Select,{value:P.filters?.categoryId||"all",onValueChange:e=>q("categoryId","all"===e?void 0:e),children:[(0,t.jsx)(d.SelectTrigger,{children:(0,t.jsx)(d.SelectValue,{placeholder:"Tất cả danh mục"})}),(0,t.jsxs)(d.SelectContent,{children:[(0,t.jsx)(d.SelectItem,{value:"all",children:"Tất cả danh mục"}),S.map(e=>(0,t.jsx)(d.SelectItem,{value:e.id,children:e.name},e.id))]})]}),(0,t.jsxs)(d.Select,{value:P.filters?.status||"all",onValueChange:e=>q("status","all"===e?void 0:e),children:[(0,t.jsx)(d.SelectTrigger,{children:(0,t.jsx)(d.SelectValue,{placeholder:"Tất cả trạng thái"})}),(0,t.jsxs)(d.SelectContent,{children:[(0,t.jsx)(d.SelectItem,{value:"all",children:"Tất cả trạng thái"}),Object.entries(w).map(([e,{label:a}])=>(0,t.jsx)(d.SelectItem,{value:e,children:a},e))]})]})]})})}),(0,t.jsx)(u.Card,{children:(0,t.jsx)(u.CardContent,{className:"p-0",children:_?(0,t.jsx)("div",{className:"flex justify-center items-center py-12",children:(0,t.jsx)(v.Loader2,{className:"h-8 w-8 animate-spin text-primary"})}):O?(0,t.jsxs)("div",{className:"text-center py-12 text-red-500",children:["Lỗi: ",O.message]}):0===F.length?(0,t.jsx)("div",{className:"text-center py-12 text-muted-foreground",children:"Không tìm thấy sản phẩm nào"}):(0,t.jsxs)(t.Fragment,{children:[(0,t.jsxs)(l.Table,{children:[(0,t.jsx)(l.TableHeader,{children:(0,t.jsxs)(l.TableRow,{children:[(0,t.jsx)(l.TableHead,{className:"w-[80px]",children:"Ảnh"}),(0,t.jsx)(l.TableHead,{children:"Tên sản phẩm"}),(0,t.jsx)(l.TableHead,{children:"Danh mục"}),(0,t.jsx)(l.TableHead,{children:"Giá"}),(0,t.jsx)(l.TableHead,{children:"Tồn kho"}),(0,t.jsx)(l.TableHead,{children:"Trạng thái"}),(0,t.jsx)(l.TableHead,{className:"text-right",children:"Thao tác"})]})}),(0,t.jsx)(l.TableBody,{children:F.map(a=>(0,t.jsxs)(l.TableRow,{children:[(0,t.jsx)(l.TableCell,{children:(0,t.jsx)("img",{src:a.thumbnail||a.images?.[0]?.url||"/placeholder-product.png",alt:a.name,className:"w-12 h-12 object-cover rounded"})}),(0,t.jsxs)(l.TableCell,{className:"font-medium",children:[(0,t.jsxs)("div",{children:[a.name,a.isFeatured&&(0,t.jsx)(c.Badge,{variant:"outline",className:"ml-2 text-xs",children:"Nổi bật"})]}),a.sku&&(0,t.jsxs)("div",{className:"text-xs text-muted-foreground",children:["SKU: ",a.sku]})]}),(0,t.jsx)(l.TableCell,{children:a.category?.name}),(0,t.jsx)(l.TableCell,{children:(0,t.jsxs)("div",{children:[(0,t.jsx)("div",{className:"font-medium",children:B(a.price)}),a.originalPrice&&a.originalPrice>a.price&&(0,t.jsx)("div",{className:"text-xs text-muted-foreground line-through",children:B(a.originalPrice)})]})}),(0,t.jsx)(l.TableCell,{children:(0,t.jsxs)("div",{className:0===a.stock?"text-red-600 font-medium":a.stock<=a.minStock?"text-yellow-600 font-medium":"",children:[a.stock," ",N[a.unit]]})}),(0,t.jsx)(l.TableCell,{children:(0,t.jsx)(c.Badge,{variant:w[a.status].variant,children:w[a.status].label})}),(0,t.jsx)(l.TableCell,{className:"text-right",children:(0,t.jsxs)("div",{className:"flex justify-end gap-2",children:[(0,t.jsx)(i.Button,{size:"icon",variant:"ghost",onClick:()=>e.push(`/sanpham/${a.slug}`),title:"Xem",children:(0,t.jsx)(f.Eye,{className:"h-4 w-4"})}),(0,t.jsx)(i.Button,{size:"icon",variant:"ghost",onClick:()=>e.push(`/admin/products/${a.id}`),title:"Chỉnh sửa",children:(0,t.jsx)(g.Edit,{className:"h-4 w-4"})}),(0,t.jsx)(i.Button,{size:"icon",variant:"ghost",onClick:()=>Y(a),title:"Xóa",className:"text-red-500 hover:text-red-600",children:(0,t.jsx)(h.Trash2,{className:"h-4 w-4"})})]})})]},a.id))})]}),(0,t.jsxs)("div",{className:"flex items-center justify-between px-6 py-4 border-t",children:[(0,t.jsxs)("div",{className:"text-sm text-muted-foreground",children:["Hiển thị ",(I.page-1)*I.limit+1," -"," ",Math.min(I.page*I.limit,I.total)," của"," ",I.total," sản phẩm"]}),(0,t.jsxs)("div",{className:"flex gap-2",children:[(0,t.jsxs)(i.Button,{variant:"outline",size:"sm",onClick:()=>M(I.page-1),disabled:1===I.page,children:[(0,t.jsx)(x.ChevronLeft,{className:"h-4 w-4 mr-1"}),"Trước"]}),(0,t.jsxs)(i.Button,{variant:"outline",size:"sm",onClick:()=>M(I.page+1),disabled:I.page>=I.totalPages,children:["Sau",(0,t.jsx)(y.ChevronRight,{className:"h-4 w-4 ml-1"})]})]})]})]})})}),(0,t.jsx)(o.ImportExportDialog,{open:A,onOpenChange:$,title:"Import Sản Phẩm từ Excel",description:"Tải file mẫu, điền thông tin sản phẩm, và upload để import hàng loạt",templateUrl:"/api/product-import-export/template",importUrl:"/api/product-import-export/import",onImportSuccess:()=>{k(),j.toast.success("Import sản phẩm thành công")}})]})}e.s(["default",()=>P])}]);