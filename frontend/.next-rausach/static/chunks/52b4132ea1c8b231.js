(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,850384,62476,t=>{"use strict";let e=(0,t.i(930702).default)("search",[["path",{d:"m21 21-4.34-4.34",key:"14j7rj"}],["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}]]);t.s(["default",()=>e],62476),t.s(["Search",()=>e],850384)},169989,162207,t=>{"use strict";let e=(0,t.i(930702).default)("loader-circle",[["path",{d:"M21 12a9 9 0 1 1-6.219-8.56",key:"13zald"}]]);t.s(["default",()=>e],162207),t.s(["Loader2",()=>e],169989)},838049,t=>{"use strict";let e=(0,t.i(930702).default)("circle-x",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m15 9-6 6",key:"1uzhvr"}],["path",{d:"m9 9 6 6",key:"z0biqf"}]]);t.s(["default",()=>e])},257117,t=>{"use strict";var e=t.i(838049);t.s(["XCircle",()=>e.default])},835819,t=>{"use strict";var e=t.i(403055);t.i(940392);let a=Array(12).fill(0),r=1,s=new class{constructor(){this.subscribe=t=>(this.subscribers.push(t),()=>{let e=this.subscribers.indexOf(t);this.subscribers.splice(e,1)}),this.publish=t=>{this.subscribers.forEach(e=>e(t))},this.addToast=t=>{this.publish(t),this.toasts=[...this.toasts,t]},this.create=t=>{var e;let{message:a,...s}=t,o="number"==typeof(null==t?void 0:t.id)||(null==(e=t.id)?void 0:e.length)>0?t.id:r++,n=this.toasts.find(t=>t.id===o),i=void 0===t.dismissible||t.dismissible;return this.dismissedToasts.has(o)&&this.dismissedToasts.delete(o),n?this.toasts=this.toasts.map(e=>e.id===o?(this.publish({...e,...t,id:o,title:a}),{...e,...t,id:o,dismissible:i,title:a}):e):this.addToast({title:a,...s,dismissible:i,id:o}),o},this.dismiss=t=>(t?(this.dismissedToasts.add(t),requestAnimationFrame(()=>this.subscribers.forEach(e=>e({id:t,dismiss:!0})))):this.toasts.forEach(t=>{this.subscribers.forEach(e=>e({id:t.id,dismiss:!0}))}),t),this.message=(t,e)=>this.create({...e,message:t}),this.error=(t,e)=>this.create({...e,message:t,type:"error"}),this.success=(t,e)=>this.create({...e,type:"success",message:t}),this.info=(t,e)=>this.create({...e,type:"info",message:t}),this.warning=(t,e)=>this.create({...e,type:"warning",message:t}),this.loading=(t,e)=>this.create({...e,type:"loading",message:t}),this.promise=(t,a)=>{let r,s;if(!a)return;void 0!==a.loading&&(s=this.create({...a,promise:t,type:"loading",message:a.loading,description:"function"!=typeof a.description?a.description:void 0}));let n=Promise.resolve(t instanceof Function?t():t),i=void 0!==s,d=n.then(async t=>{if(r=["resolve",t],e.default.isValidElement(t))i=!1,this.create({id:s,type:"default",message:t});else if(o(t)&&!t.ok){i=!1;let r="function"==typeof a.error?await a.error(`HTTP error! status: ${t.status}`):a.error,o="function"==typeof a.description?await a.description(`HTTP error! status: ${t.status}`):a.description,n="object"!=typeof r||e.default.isValidElement(r)?{message:r}:r;this.create({id:s,type:"error",description:o,...n})}else if(t instanceof Error){i=!1;let r="function"==typeof a.error?await a.error(t):a.error,o="function"==typeof a.description?await a.description(t):a.description,n="object"!=typeof r||e.default.isValidElement(r)?{message:r}:r;this.create({id:s,type:"error",description:o,...n})}else if(void 0!==a.success){i=!1;let r="function"==typeof a.success?await a.success(t):a.success,o="function"==typeof a.description?await a.description(t):a.description,n="object"!=typeof r||e.default.isValidElement(r)?{message:r}:r;this.create({id:s,type:"success",description:o,...n})}}).catch(async t=>{if(r=["reject",t],void 0!==a.error){i=!1;let r="function"==typeof a.error?await a.error(t):a.error,o="function"==typeof a.description?await a.description(t):a.description,n="object"!=typeof r||e.default.isValidElement(r)?{message:r}:r;this.create({id:s,type:"error",description:o,...n})}}).finally(()=>{i&&(this.dismiss(s),s=void 0),null==a.finally||a.finally.call(a)}),l=()=>new Promise((t,e)=>d.then(()=>"reject"===r[0]?e(r[1]):t(r[1])).catch(e));return"string"!=typeof s&&"number"!=typeof s?{unwrap:l}:Object.assign(s,{unwrap:l})},this.custom=(t,e)=>{let a=(null==e?void 0:e.id)||r++;return this.create({jsx:t(a),id:a,...e}),a},this.getActiveToasts=()=>this.toasts.filter(t=>!this.dismissedToasts.has(t.id)),this.subscribers=[],this.toasts=[],this.dismissedToasts=new Set}},o=t=>t&&"object"==typeof t&&"ok"in t&&"boolean"==typeof t.ok&&"status"in t&&"number"==typeof t.status,n=Object.assign((t,e)=>{let a=(null==e?void 0:e.id)||r++;return s.addToast({title:t,...e,id:a}),a},{success:s.success,info:s.info,warning:s.warning,error:s.error,custom:s.custom,message:s.message,promise:s.promise,dismiss:s.dismiss,loading:s.loading},{getHistory:()=>s.toasts,getToasts:()=>s.getActiveToasts()});!function(t){if(!t||"undefined"==typeof document)return;let e=document.head||document.getElementsByTagName("head")[0],a=document.createElement("style");a.type="text/css",e.appendChild(a),a.styleSheet?a.styleSheet.cssText=t:a.appendChild(document.createTextNode(t))}("[data-sonner-toaster][dir=ltr],html[dir=ltr]{--toast-icon-margin-start:-3px;--toast-icon-margin-end:4px;--toast-svg-margin-start:-1px;--toast-svg-margin-end:0px;--toast-button-margin-start:auto;--toast-button-margin-end:0;--toast-close-button-start:0;--toast-close-button-end:unset;--toast-close-button-transform:translate(-35%, -35%)}[data-sonner-toaster][dir=rtl],html[dir=rtl]{--toast-icon-margin-start:4px;--toast-icon-margin-end:-3px;--toast-svg-margin-start:0px;--toast-svg-margin-end:-1px;--toast-button-margin-start:0;--toast-button-margin-end:auto;--toast-close-button-start:unset;--toast-close-button-end:0;--toast-close-button-transform:translate(35%, -35%)}[data-sonner-toaster]{position:fixed;width:var(--width);font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;--gray1:hsl(0, 0%, 99%);--gray2:hsl(0, 0%, 97.3%);--gray3:hsl(0, 0%, 95.1%);--gray4:hsl(0, 0%, 93%);--gray5:hsl(0, 0%, 90.9%);--gray6:hsl(0, 0%, 88.7%);--gray7:hsl(0, 0%, 85.8%);--gray8:hsl(0, 0%, 78%);--gray9:hsl(0, 0%, 56.1%);--gray10:hsl(0, 0%, 52.3%);--gray11:hsl(0, 0%, 43.5%);--gray12:hsl(0, 0%, 9%);--border-radius:8px;box-sizing:border-box;padding:0;margin:0;list-style:none;outline:0;z-index:999999999;transition:transform .4s ease}@media (hover:none) and (pointer:coarse){[data-sonner-toaster][data-lifted=true]{transform:none}}[data-sonner-toaster][data-x-position=right]{right:var(--offset-right)}[data-sonner-toaster][data-x-position=left]{left:var(--offset-left)}[data-sonner-toaster][data-x-position=center]{left:50%;transform:translateX(-50%)}[data-sonner-toaster][data-y-position=top]{top:var(--offset-top)}[data-sonner-toaster][data-y-position=bottom]{bottom:var(--offset-bottom)}[data-sonner-toast]{--y:translateY(100%);--lift-amount:calc(var(--lift) * var(--gap));z-index:var(--z-index);position:absolute;opacity:0;transform:var(--y);touch-action:none;transition:transform .4s,opacity .4s,height .4s,box-shadow .2s;box-sizing:border-box;outline:0;overflow-wrap:anywhere}[data-sonner-toast][data-styled=true]{padding:16px;background:var(--normal-bg);border:1px solid var(--normal-border);color:var(--normal-text);border-radius:var(--border-radius);box-shadow:0 4px 12px rgba(0,0,0,.1);width:var(--width);font-size:13px;display:flex;align-items:center;gap:6px}[data-sonner-toast]:focus-visible{box-shadow:0 4px 12px rgba(0,0,0,.1),0 0 0 2px rgba(0,0,0,.2)}[data-sonner-toast][data-y-position=top]{top:0;--y:translateY(-100%);--lift:1;--lift-amount:calc(1 * var(--gap))}[data-sonner-toast][data-y-position=bottom]{bottom:0;--y:translateY(100%);--lift:-1;--lift-amount:calc(var(--lift) * var(--gap))}[data-sonner-toast][data-styled=true] [data-description]{font-weight:400;line-height:1.4;color:#3f3f3f}[data-rich-colors=true][data-sonner-toast][data-styled=true] [data-description]{color:inherit}[data-sonner-toaster][data-sonner-theme=dark] [data-description]{color:#e8e8e8}[data-sonner-toast][data-styled=true] [data-title]{font-weight:500;line-height:1.5;color:inherit}[data-sonner-toast][data-styled=true] [data-icon]{display:flex;height:16px;width:16px;position:relative;justify-content:flex-start;align-items:center;flex-shrink:0;margin-left:var(--toast-icon-margin-start);margin-right:var(--toast-icon-margin-end)}[data-sonner-toast][data-promise=true] [data-icon]>svg{opacity:0;transform:scale(.8);transform-origin:center;animation:sonner-fade-in .3s ease forwards}[data-sonner-toast][data-styled=true] [data-icon]>*{flex-shrink:0}[data-sonner-toast][data-styled=true] [data-icon] svg{margin-left:var(--toast-svg-margin-start);margin-right:var(--toast-svg-margin-end)}[data-sonner-toast][data-styled=true] [data-content]{display:flex;flex-direction:column;gap:2px}[data-sonner-toast][data-styled=true] [data-button]{border-radius:4px;padding-left:8px;padding-right:8px;height:24px;font-size:12px;color:var(--normal-bg);background:var(--normal-text);margin-left:var(--toast-button-margin-start);margin-right:var(--toast-button-margin-end);border:none;font-weight:500;cursor:pointer;outline:0;display:flex;align-items:center;flex-shrink:0;transition:opacity .4s,box-shadow .2s}[data-sonner-toast][data-styled=true] [data-button]:focus-visible{box-shadow:0 0 0 2px rgba(0,0,0,.4)}[data-sonner-toast][data-styled=true] [data-button]:first-of-type{margin-left:var(--toast-button-margin-start);margin-right:var(--toast-button-margin-end)}[data-sonner-toast][data-styled=true] [data-cancel]{color:var(--normal-text);background:rgba(0,0,0,.08)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast][data-styled=true] [data-cancel]{background:rgba(255,255,255,.3)}[data-sonner-toast][data-styled=true] [data-close-button]{position:absolute;left:var(--toast-close-button-start);right:var(--toast-close-button-end);top:0;height:20px;width:20px;display:flex;justify-content:center;align-items:center;padding:0;color:var(--gray12);background:var(--normal-bg);border:1px solid var(--gray4);transform:var(--toast-close-button-transform);border-radius:50%;cursor:pointer;z-index:1;transition:opacity .1s,background .2s,border-color .2s}[data-sonner-toast][data-styled=true] [data-close-button]:focus-visible{box-shadow:0 4px 12px rgba(0,0,0,.1),0 0 0 2px rgba(0,0,0,.2)}[data-sonner-toast][data-styled=true] [data-disabled=true]{cursor:not-allowed}[data-sonner-toast][data-styled=true]:hover [data-close-button]:hover{background:var(--gray2);border-color:var(--gray5)}[data-sonner-toast][data-swiping=true]::before{content:'';position:absolute;left:-100%;right:-100%;height:100%;z-index:-1}[data-sonner-toast][data-y-position=top][data-swiping=true]::before{bottom:50%;transform:scaleY(3) translateY(50%)}[data-sonner-toast][data-y-position=bottom][data-swiping=true]::before{top:50%;transform:scaleY(3) translateY(-50%)}[data-sonner-toast][data-swiping=false][data-removed=true]::before{content:'';position:absolute;inset:0;transform:scaleY(2)}[data-sonner-toast][data-expanded=true]::after{content:'';position:absolute;left:0;height:calc(var(--gap) + 1px);bottom:100%;width:100%}[data-sonner-toast][data-mounted=true]{--y:translateY(0);opacity:1}[data-sonner-toast][data-expanded=false][data-front=false]{--scale:var(--toasts-before) * 0.05 + 1;--y:translateY(calc(var(--lift-amount) * var(--toasts-before))) scale(calc(-1 * var(--scale)));height:var(--front-toast-height)}[data-sonner-toast]>*{transition:opacity .4s}[data-sonner-toast][data-x-position=right]{right:0}[data-sonner-toast][data-x-position=left]{left:0}[data-sonner-toast][data-expanded=false][data-front=false][data-styled=true]>*{opacity:0}[data-sonner-toast][data-visible=false]{opacity:0;pointer-events:none}[data-sonner-toast][data-mounted=true][data-expanded=true]{--y:translateY(calc(var(--lift) * var(--offset)));height:var(--initial-height)}[data-sonner-toast][data-removed=true][data-front=true][data-swipe-out=false]{--y:translateY(calc(var(--lift) * -100%));opacity:0}[data-sonner-toast][data-removed=true][data-front=false][data-swipe-out=false][data-expanded=true]{--y:translateY(calc(var(--lift) * var(--offset) + var(--lift) * -100%));opacity:0}[data-sonner-toast][data-removed=true][data-front=false][data-swipe-out=false][data-expanded=false]{--y:translateY(40%);opacity:0;transition:transform .5s,opacity .2s}[data-sonner-toast][data-removed=true][data-front=false]::before{height:calc(var(--initial-height) + 20%)}[data-sonner-toast][data-swiping=true]{transform:var(--y) translateY(var(--swipe-amount-y,0)) translateX(var(--swipe-amount-x,0));transition:none}[data-sonner-toast][data-swiped=true]{user-select:none}[data-sonner-toast][data-swipe-out=true][data-y-position=bottom],[data-sonner-toast][data-swipe-out=true][data-y-position=top]{animation-duration:.2s;animation-timing-function:ease-out;animation-fill-mode:forwards}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=left]{animation-name:swipe-out-left}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=right]{animation-name:swipe-out-right}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=up]{animation-name:swipe-out-up}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=down]{animation-name:swipe-out-down}@keyframes swipe-out-left{from{transform:var(--y) translateX(var(--swipe-amount-x));opacity:1}to{transform:var(--y) translateX(calc(var(--swipe-amount-x) - 100%));opacity:0}}@keyframes swipe-out-right{from{transform:var(--y) translateX(var(--swipe-amount-x));opacity:1}to{transform:var(--y) translateX(calc(var(--swipe-amount-x) + 100%));opacity:0}}@keyframes swipe-out-up{from{transform:var(--y) translateY(var(--swipe-amount-y));opacity:1}to{transform:var(--y) translateY(calc(var(--swipe-amount-y) - 100%));opacity:0}}@keyframes swipe-out-down{from{transform:var(--y) translateY(var(--swipe-amount-y));opacity:1}to{transform:var(--y) translateY(calc(var(--swipe-amount-y) + 100%));opacity:0}}@media (max-width:600px){[data-sonner-toaster]{position:fixed;right:var(--mobile-offset-right);left:var(--mobile-offset-left);width:100%}[data-sonner-toaster][dir=rtl]{left:calc(var(--mobile-offset-left) * -1)}[data-sonner-toaster] [data-sonner-toast]{left:0;right:0;width:calc(100% - var(--mobile-offset-left) * 2)}[data-sonner-toaster][data-x-position=left]{left:var(--mobile-offset-left)}[data-sonner-toaster][data-y-position=bottom]{bottom:var(--mobile-offset-bottom)}[data-sonner-toaster][data-y-position=top]{top:var(--mobile-offset-top)}[data-sonner-toaster][data-x-position=center]{left:var(--mobile-offset-left);right:var(--mobile-offset-right);transform:none}}[data-sonner-toaster][data-sonner-theme=light]{--normal-bg:#fff;--normal-border:var(--gray4);--normal-text:var(--gray12);--success-bg:hsl(143, 85%, 96%);--success-border:hsl(145, 92%, 87%);--success-text:hsl(140, 100%, 27%);--info-bg:hsl(208, 100%, 97%);--info-border:hsl(221, 91%, 93%);--info-text:hsl(210, 92%, 45%);--warning-bg:hsl(49, 100%, 97%);--warning-border:hsl(49, 91%, 84%);--warning-text:hsl(31, 92%, 45%);--error-bg:hsl(359, 100%, 97%);--error-border:hsl(359, 100%, 94%);--error-text:hsl(360, 100%, 45%)}[data-sonner-toaster][data-sonner-theme=light] [data-sonner-toast][data-invert=true]{--normal-bg:#000;--normal-border:hsl(0, 0%, 20%);--normal-text:var(--gray1)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast][data-invert=true]{--normal-bg:#fff;--normal-border:var(--gray3);--normal-text:var(--gray12)}[data-sonner-toaster][data-sonner-theme=dark]{--normal-bg:#000;--normal-bg-hover:hsl(0, 0%, 12%);--normal-border:hsl(0, 0%, 20%);--normal-border-hover:hsl(0, 0%, 25%);--normal-text:var(--gray1);--success-bg:hsl(150, 100%, 6%);--success-border:hsl(147, 100%, 12%);--success-text:hsl(150, 86%, 65%);--info-bg:hsl(215, 100%, 6%);--info-border:hsl(223, 43%, 17%);--info-text:hsl(216, 87%, 65%);--warning-bg:hsl(64, 100%, 6%);--warning-border:hsl(60, 100%, 9%);--warning-text:hsl(46, 87%, 65%);--error-bg:hsl(358, 76%, 10%);--error-border:hsl(357, 89%, 16%);--error-text:hsl(358, 100%, 81%)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast] [data-close-button]{background:var(--normal-bg);border-color:var(--normal-border);color:var(--normal-text)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast] [data-close-button]:hover{background:var(--normal-bg-hover);border-color:var(--normal-border-hover)}[data-rich-colors=true][data-sonner-toast][data-type=success]{background:var(--success-bg);border-color:var(--success-border);color:var(--success-text)}[data-rich-colors=true][data-sonner-toast][data-type=success] [data-close-button]{background:var(--success-bg);border-color:var(--success-border);color:var(--success-text)}[data-rich-colors=true][data-sonner-toast][data-type=info]{background:var(--info-bg);border-color:var(--info-border);color:var(--info-text)}[data-rich-colors=true][data-sonner-toast][data-type=info] [data-close-button]{background:var(--info-bg);border-color:var(--info-border);color:var(--info-text)}[data-rich-colors=true][data-sonner-toast][data-type=warning]{background:var(--warning-bg);border-color:var(--warning-border);color:var(--warning-text)}[data-rich-colors=true][data-sonner-toast][data-type=warning] [data-close-button]{background:var(--warning-bg);border-color:var(--warning-border);color:var(--warning-text)}[data-rich-colors=true][data-sonner-toast][data-type=error]{background:var(--error-bg);border-color:var(--error-border);color:var(--error-text)}[data-rich-colors=true][data-sonner-toast][data-type=error] [data-close-button]{background:var(--error-bg);border-color:var(--error-border);color:var(--error-text)}.sonner-loading-wrapper{--size:16px;height:var(--size);width:var(--size);position:absolute;inset:0;z-index:10}.sonner-loading-wrapper[data-visible=false]{transform-origin:center;animation:sonner-fade-out .2s ease forwards}.sonner-spinner{position:relative;top:50%;left:50%;height:var(--size);width:var(--size)}.sonner-loading-bar{animation:sonner-spin 1.2s linear infinite;background:var(--gray11);border-radius:6px;height:8%;left:-10%;position:absolute;top:-3.9%;width:24%}.sonner-loading-bar:first-child{animation-delay:-1.2s;transform:rotate(.0001deg) translate(146%)}.sonner-loading-bar:nth-child(2){animation-delay:-1.1s;transform:rotate(30deg) translate(146%)}.sonner-loading-bar:nth-child(3){animation-delay:-1s;transform:rotate(60deg) translate(146%)}.sonner-loading-bar:nth-child(4){animation-delay:-.9s;transform:rotate(90deg) translate(146%)}.sonner-loading-bar:nth-child(5){animation-delay:-.8s;transform:rotate(120deg) translate(146%)}.sonner-loading-bar:nth-child(6){animation-delay:-.7s;transform:rotate(150deg) translate(146%)}.sonner-loading-bar:nth-child(7){animation-delay:-.6s;transform:rotate(180deg) translate(146%)}.sonner-loading-bar:nth-child(8){animation-delay:-.5s;transform:rotate(210deg) translate(146%)}.sonner-loading-bar:nth-child(9){animation-delay:-.4s;transform:rotate(240deg) translate(146%)}.sonner-loading-bar:nth-child(10){animation-delay:-.3s;transform:rotate(270deg) translate(146%)}.sonner-loading-bar:nth-child(11){animation-delay:-.2s;transform:rotate(300deg) translate(146%)}.sonner-loading-bar:nth-child(12){animation-delay:-.1s;transform:rotate(330deg) translate(146%)}@keyframes sonner-fade-in{0%{opacity:0;transform:scale(.8)}100%{opacity:1;transform:scale(1)}}@keyframes sonner-fade-out{0%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(.8)}}@keyframes sonner-spin{0%{opacity:1}100%{opacity:.15}}@media (prefers-reduced-motion){.sonner-loading-bar,[data-sonner-toast],[data-sonner-toast]>*{transition:none!important;animation:none!important}}.sonner-loader{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);transform-origin:center;transition:opacity .2s,transform .2s}.sonner-loader[data-visible=false]{opacity:0;transform:scale(.8) translate(-50%,-50%)}");t.s(["toast",()=>n])},833350,t=>{"use strict";let e=(0,t.i(930702).default)("refresh-cw",[["path",{d:"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8",key:"v9h5vc"}],["path",{d:"M21 3v5h-5",key:"1q7to0"}],["path",{d:"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16",key:"3uifl3"}],["path",{d:"M8 16H3v5",key:"1cv678"}]]);t.s(["default",()=>e])},791174,t=>{"use strict";var e=t.i(833350);t.s(["RefreshCw",()=>e.default])},574375,t=>{"use strict";var e=t.i(984804);let a=e.gql`
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
`,r=e.gql`
  ${a}
  fragment CategoryWithCountFields on CategoryType {
    ...CategoryBasicFields
    productCount
  }
`,s=e.gql`
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
`,o=e.gql`
  fragment ProductImageFields on ProductImageType {
    id
    url
    alt
    isPrimary
    order
    createdAt
  }
`,n=e.gql`
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
`;e.gql`
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
`;let i=e.gql`
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
`,d=e.gql`
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
`,l=e.gql`
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
`;t.s(["CATEGORY_BASIC_FRAGMENT",0,a,"CATEGORY_TREE_FRAGMENT",0,s,"CATEGORY_WITH_COUNT_FRAGMENT",0,r,"COMMENT_FRAGMENT",0,l,"POST_FRAGMENT",0,d,"PRODUCT_IMAGE_FRAGMENT",0,o,"PRODUCT_VARIANT_FRAGMENT",0,n,"USER_FRAGMENT",0,i])},222086,t=>{"use strict";let e=(0,t.i(930702).default)("database",[["ellipse",{cx:"12",cy:"5",rx:"9",ry:"3",key:"msslwz"}],["path",{d:"M3 5V19A9 3 0 0 0 21 19V5",key:"1wlel7"}],["path",{d:"M3 12A9 3 0 0 0 21 12",key:"mv7ke4"}]]);t.s(["default",()=>e])},257725,t=>{"use strict";var e=t.i(222086);t.s(["Database",()=>e.default])},416181,t=>{"use strict";let e=(0,t.i(930702).default)("play",[["path",{d:"M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z",key:"10ikf1"}]]);t.s(["default",()=>e])},490008,t=>{"use strict";var e=t.i(416181);t.s(["Play",()=>e.default])},125284,t=>{"use strict";var e=t.i(429105),a=t.i(950988),r=t.i(984804),s=t.i(574375);class o{static generateCRUDQueries(t,e=[],a={}){let s=t.toLowerCase();t.charAt(0).toLowerCase(),t.slice(1);let o=t.startsWith("ext_"),n=(e.length>0?e:["id","createdAt","updatedAt"]).join("\n    ");Object.keys(a).length>0&&Object.entries(a).forEach(([t,e])=>{n+=`
    ${t} {
      ${e.join("\n      ")}
    }`});let i=o?"JSON":`${t}FilterInput`;return{[`GET_${t.toUpperCase()}S`]:o?r.gql`
          query Get${t}s($filters: ${i}) {
            get${t}s(filters: $filters)
          }
        `:r.gql`
          query Get${t}s($filters: ${i}) {
            get${t}s(filters: $filters) {
              ${n}
            }
          }
        `,[`GET_${t.toUpperCase()}S_PAGINATED`]:o?r.gql`
          query Get${t}sPaginated($filters: ${i}) {
            get${t}sPaginated(filters: $filters)
          }
        `:r.gql`
          query Get${t}sPaginated($filters: ${i}) {
            get${t}sPaginated(filters: $filters) {
              data {
                ${n}
              }
              meta {
                total
                page
                limit
                totalPages
                hasNextPage
                hasPrevPage
              }
            }
          }
        `,[`GET_${t.toUpperCase()}_BY_ID`]:o?r.gql`
          query Get${t}ById($id: ID!, $options: JSON) {
            get${t}ById(id: $id, options: $options)
          }
        `:r.gql`
          query Get${t}ById($id: ID!, $options: JSON) {
            get${t}ById(id: $id, options: $options) {
              ${n}
            }
          }
        `,[`CREATE_${t.toUpperCase()}`]:o?r.gql`
          mutation Create${t}($data: JSON!, $options: JSON) {
            create${t}(data: $data, options: $options)
          }
        `:r.gql`
          mutation Create${t}($data: JSON!, $options: JSON) {
            create${t}(data: $data, options: $options) {
              ${n}
            }
          }
        `,[`CREATE_${t.toUpperCase()}S_BULK`]:o?r.gql`
          mutation Create${t}sBulk($input: JSON!, $options: JSON) {
            create${t}sBulk(input: $input, options: $options)
          }
        `:r.gql`
          mutation Create${t}sBulk($input: JSON!, $options: JSON) {
            create${t}sBulk(input: $input, options: $options) {
              success
              count
              data {
                ${n}
              }
              errors {
                index
                error
                data
              }
            }
          }
        `,[`UPDATE_${t.toUpperCase()}`]:o?r.gql`
          mutation Update${t}($id: ID!, $data: JSON!, $options: JSON) {
            update${t}(id: $id, data: $data, options: $options)
          }
        `:r.gql`
          mutation Update${t}($id: ID!, $data: JSON!, $options: JSON) {
            update${t}(id: $id, data: $data, options: $options) {
              ${n}
            }
          }
        `,[`UPDATE_${t.toUpperCase()}S_BULK`]:o?r.gql`
          mutation Update${t}sBulk($input: JSON!, $options: JSON) {
            update${t}sBulk(input: $input, options: $options)
          }
        `:r.gql`
          mutation Update${t}sBulk($input: JSON!, $options: JSON) {
            update${t}sBulk(input: $input, options: $options) {
              success
              count
              data {
                ${n}
              }
              errors {
                index
                error
                data
              }
            }
          }
        `,[`DELETE_${t.toUpperCase()}`]:o?r.gql`
          mutation Delete${t}($id: ID!, $options: JSON) {
            delete${t}(id: $id, options: $options)
          }
        `:r.gql`
          mutation Delete${t}($id: ID!, $options: JSON) {
            delete${t}(id: $id, options: $options) {
              ${n}
            }
          }
        `,[`DELETE_${t.toUpperCase()}S_BULK`]:o?r.gql`
          mutation Delete${t}sBulk($input: JSON!, $options: JSON) {
            delete${t}sBulk(input: $input, options: $options)
          }
        `:r.gql`
          mutation Delete${t}sBulk($input: JSON!, $options: JSON) {
            delete${t}sBulk(input: $input, options: $options) {
              success
              count
              data {
                ${n}
              }
              errors {
                index
                error
                data
              }
            }
          }
        `,[`UPSERT_${t.toUpperCase()}`]:o?r.gql`
          mutation Upsert${t}($where: JSON!, $create: JSON!, $update: JSON!, $options: JSON) {
            upsert${t}(where: $where, create: $create, update: $update, options: $options)
          }
        `:r.gql`
          mutation Upsert${t}($where: JSON!, $create: JSON!, $update: JSON!, $options: JSON) {
            upsert${t}(where: $where, create: $create, update: $update, options: $options) {
              ${n}
            }
          }
        `,[`COUNT_${t.toUpperCase()}S`]:r.gql`
        query Count${t}s($where: JSON) {
          count${t}s(where: $where)
        }
      `,[`${t.toUpperCase()}_EXISTS`]:r.gql`
        query ${t}Exists($where: JSON!) {
          ${s}Exists(where: $where)
        }
      `}}static generateUniversalQueries(){return{DYNAMIC_FIND_MANY:r.gql`
        query DynamicFindMany($modelName: String!, $filter: JSON) {
          dynamicFindMany(modelName: $modelName, filter: $filter)
        }
      `,DYNAMIC_FIND_BY_ID:r.gql`
        query DynamicFindById($modelName: String!, $id: ID!, $options: JSON) {
          dynamicFindById(modelName: $modelName, id: $id, options: $options)
        }
      `,DYNAMIC_CREATE:r.gql`
        mutation DynamicCreate($modelName: String!, $data: JSON!, $options: JSON) {
          dynamicCreate(modelName: $modelName, data: $data, options: $options)
        }
      `,DYNAMIC_UPDATE:r.gql`
        mutation DynamicUpdate($modelName: String!, $id: ID!, $data: JSON!, $options: JSON) {
          dynamicUpdate(modelName: $modelName, id: $id, data: $data, options: $options)
        }
      `,DYNAMIC_DELETE:r.gql`
        mutation DynamicDelete($modelName: String!, $id: ID!, $options: JSON) {
          dynamicDelete(modelName: $modelName, id: $id, options: $options)
        }
      `,DYNAMIC_CREATE_BULK:r.gql`
        mutation DynamicCreateBulk($modelName: String!, $input: JSON!, $options: JSON) {
          dynamicCreateBulk(modelName: $modelName, input: $input, options: $options) {
            success
            count
            data
            errors {
              index
              error
              data
            }
          }
        }
      `,DYNAMIC_UPDATE_BULK:r.gql`
        mutation DynamicUpdateBulk($modelName: String!, $input: JSON!, $options: JSON) {
          dynamicUpdateBulk(modelName: $modelName, input: $input, options: $options) {
            success
            count
            data
            errors {
              index
              error
              data
            }
          }
        }
      `,DYNAMIC_DELETE_BULK:r.gql`
        mutation DynamicDeleteBulk($modelName: String!, $input: JSON!, $options: JSON) {
          dynamicDeleteBulk(modelName: $modelName, input: $input, options: $options) {
            success
            count
            data
            errors {
              index
              error
              data
            }
          }
        }
      `}}static generateQueriesWithFragments(t,e){let a=t.toUpperCase();return{[`GET_${a}S_WITH_FRAGMENT`]:r.gql`
        ${e}
        query Get${t}s($filter: JSON) {
          get${t}s(filter: $filter) {
            ...${t}Fragment
          }
        }
      `,[`CREATE_${a}_WITH_FRAGMENT`]:r.gql`
        ${e}
        mutation Create${t}($data: JSON!, $options: JSON) {
          create${t}(data: $data, options: $options) {
            ...${t}Fragment
          }
        }
      `,[`UPDATE_${a}_WITH_FRAGMENT`]:r.gql`
        ${e}
        mutation Update${t}($id: ID!, $data: JSON!, $options: JSON) {
          update${t}(id: $id, data: $data, options: $options) {
            ...${t}Fragment
          }
        }
      `}}}s.USER_FRAGMENT,s.POST_FRAGMENT,r.gql`
    fragment DynamicTaskFragment on Task {
      id
      title
      description
      category
      priority
      status
      dueDate
      userId
      createdAt
      updatedAt
    }
  `,s.COMMENT_FRAGMENT;let n=o.generateCRUDQueries("User",["id","email","username","firstName","lastName","avatar","role","isActive","createdAt","updatedAt"]),i=o.generateCRUDQueries("Post",["id","title","content","excerpt","slug","status","publishedAt","authorId","createdAt","updatedAt"]),d=o.generateCRUDQueries("Task",["id","title","description","category","priority","status","dueDate","userId","createdAt","updatedAt"]),l=o.generateCRUDQueries("Comment",["id","content","postId","userId","parentId","createdAt","updatedAt"]),c=o.generateUniversalQueries();Object.entries({User:["id","email","username","firstName","lastName","avatar","role","isActive","createdAt","updatedAt"],Post:["id","title","content","excerpt","slug","status","publishedAt","authorId","createdAt","updatedAt"],Task:["id","title","description","category","priority","status","dueDate","userId","createdAt","updatedAt"],Comment:["id","content","postId","userId","parentId","createdAt","updatedAt"],Tag:["id","name","slug","description","color","createdAt","updatedAt"],Media:["id","filename","fileUrl","fileSize","mimeType","uploadedById","createdAt"],TaskComment:["id","content","taskId","authorId","parentId","createdAt","updatedAt"],TaskShare:["id","taskId","userId","permission","shareToken","expiresAt","isActive","createdAt"],TaskMedia:["id","filename","url","type","size","mimeType","taskId","uploadedBy","createdAt"]}).reduce((t,[e,a])=>(t[e]=o.generateCRUDQueries(e,a),t),{});let{GET_USERS:g,GET_USERS_PAGINATED:u,GET_USER_BY_ID:m,CREATE_USER:p,CREATE_USERS_BULK:h,UPDATE_USER:x,UPDATE_USERS_BULK:y,DELETE_USER:b,DELETE_USERS_BULK:f,UPSERT_USER:v,COUNT_USERS:N,USER_EXISTS:$}=n,{GET_POSTS:k,GET_POSTS_PAGINATED:w,GET_POST_BY_ID:j,CREATE_POST:C,CREATE_POSTS_BULK:T,UPDATE_POST:E,UPDATE_POSTS_BULK:S,DELETE_POST:A,DELETE_POSTS_BULK:D,UPSERT_POST:U,COUNT_POSTS:_,POST_EXISTS:O}=i,{GET_TASKS:I,GET_TASKS_PAGINATED:P,GET_TASK_BY_ID:q,CREATE_TASK:M,CREATE_TASKS_BULK:F,UPDATE_TASK:L,UPDATE_TASKS_BULK:B,DELETE_TASK:J,DELETE_TASKS_BULK:G,UPSERT_TASK:R,COUNT_TASKS:z,TASK_EXISTS:Y}=d,{GET_COMMENTS:K,GET_COMMENTS_PAGINATED:Q,GET_COMMENT_BY_ID:V,CREATE_COMMENT:H,CREATE_COMMENTS_BULK:X,UPDATE_COMMENT:W,UPDATE_COMMENTS_BULK:Z,DELETE_COMMENT:tt,DELETE_COMMENTS_BULK:te,UPSERT_COMMENT:ta,COUNT_COMMENTS:tr,COMMENT_EXISTS:ts}=l,{DYNAMIC_FIND_MANY:to,DYNAMIC_FIND_BY_ID:tn,DYNAMIC_CREATE:ti,DYNAMIC_UPDATE:td,DYNAMIC_DELETE:tl,DYNAMIC_CREATE_BULK:tc,DYNAMIC_UPDATE_BULK:tg,DYNAMIC_DELETE_BULK:tu}=c;var tm=t.i(403055);function tp(t,a,r={}){let{fields:s,nestedFields:n,...i}=r,d=(0,tm.useMemo)(()=>{let e=o.generateCRUDQueries(a,s);switch(t){case"GET_ALL":return e[`GET_${a.toUpperCase()}S`];case"GET_PAGINATED":return e[`GET_${a.toUpperCase()}S_PAGINATED`];case"GET_BY_ID":return e[`GET_${a.toUpperCase()}_BY_ID`];default:throw Error(`Unsupported operation type: ${t}`)}},[t,a,s,n]);return(0,e.useQuery)(d,i)}function th(t,e,r={}){let{fields:s,nestedFields:n,...i}=r,d=(0,tm.useMemo)(()=>{let a=o.generateCRUDQueries(e,s);switch(t){case"CREATE":return a[`CREATE_${e.toUpperCase()}`];case"CREATE_BULK":return a[`CREATE_${e.toUpperCase()}S_BULK`];case"UPDATE":return a[`UPDATE_${e.toUpperCase()}`];case"UPDATE_BULK":return a[`UPDATE_${e.toUpperCase()}S_BULK`];case"DELETE":return a[`DELETE_${e.toUpperCase()}`];case"DELETE_BULK":return a[`DELETE_${e.toUpperCase()}S_BULK`];default:throw Error(`Unsupported operation type: ${t}`)}},[t,e,s,n]);return(0,a.useMutation)(d,i)}function tx(t){let e=function(t,e={}){return tp("GET_ALL",t,e)}(t),a=function(t,e={}){return tp("GET_PAGINATED",t,e)}(t),[r]=function(t,e={}){return th("CREATE",t,e)}(t),[s]=function(t,e={}){return th("CREATE_BULK",t,e)}(t),[o]=function(t,e={}){return th("UPDATE",t,e)}(t),[n]=function(t,e={}){return th("UPDATE_BULK",t,e)}(t),[i]=function(t,e={}){return th("DELETE",t,e)}(t),[d]=function(t,e={}){return th("DELETE_BULK",t,e)}(t);return{getAll:e,getPaginated:a,getById:(0,tm.useCallback)(e=>(function(t,e={}){return tp("GET_BY_ID",t,e)})(t,{variables:{id:e}}),[t]),create:r,createBulk:s,update:o,updateBulk:n,delete:i,deleteBulk:d}}function ty(t){return t&&t.graphQLErrors&&void 0!==t.networkError}function tb(t){return t.graphQLErrors.length>0?t.graphQLErrors.map(t=>t.message).join(", "):t.networkError?`Network error: ${t.networkError.message}`:t.message||"Unknown GraphQL error"}t.s(["formatDynamicGraphQLError",()=>tb,"isDynamicGraphQLError",()=>ty,"useCRUD",()=>tx,"useDynamicMutation",()=>th,"useDynamicQuery",()=>tp],125284)},996701,t=>{"use strict";var e=t.i(214871);t.s(["ArrowUpDown",()=>e.default])},496781,391551,t=>{"use strict";var e=t.i(266184);t.s(["ArrowUp",()=>e.default],496781);var a=t.i(997793);t.s(["ArrowDown",()=>a.default],391551)},214871,t=>{"use strict";let e=(0,t.i(930702).default)("arrow-up-down",[["path",{d:"m21 16-4 4-4-4",key:"f6ql7i"}],["path",{d:"M17 20V4",key:"1ejh1v"}],["path",{d:"m3 8 4-4 4 4",key:"11wl7u"}],["path",{d:"M7 4v16",key:"1glfcx"}]]);t.s(["default",()=>e])},266184,t=>{"use strict";let e=(0,t.i(930702).default)("arrow-up",[["path",{d:"m5 12 7-7 7 7",key:"hav0vg"}],["path",{d:"M12 19V5",key:"x0mq9r"}]]);t.s(["default",()=>e])},997793,t=>{"use strict";let e=(0,t.i(930702).default)("arrow-down",[["path",{d:"M12 5v14",key:"s699le"}],["path",{d:"m19 12-7 7-7-7",key:"1idqje"}]]);t.s(["default",()=>e])},456099,t=>{"use strict";let e=(0,t.i(930702).default)("package-plus",[["path",{d:"M16 16h6",key:"100bgy"}],["path",{d:"M19 13v6",key:"85cyf1"}],["path",{d:"M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14",key:"e7tb2h"}],["path",{d:"m7.5 4.27 9 5.15",key:"1c824w"}],["polyline",{points:"3.29 7 12 12 20.71 7",key:"ousv84"}],["line",{x1:"12",x2:"12",y1:"22",y2:"12",key:"a4e8g8"}]]);t.s(["default",()=>e])},650169,t=>{"use strict";var e=t.i(44990),a=t.i(403055),r=t.i(835819),s=t.i(125284),o=t.i(950988),n=t.i(984804);let i=n.gql`
  mutation UpdateProductsFromDetails($dryRun: Boolean!, $limit: Int) {
    updateProductsFromDetails(dryRun: $dryRun, limit: $limit) {
      success
      message
      stats {
        totalDetails
        processed
        created
        updated
        skipped
        errors
      }
      output
    }
  }
`;n.gql`
  mutation NormalizeProducts($productIds: [String!], $threshold: Float) {
    normalizeProducts(productIds: $productIds, threshold: $threshold) {
      updated
      skipped
      errors
    }
  }
`,n.gql`
  query FindSimilarProducts($searchText: String!, $threshold: Float) {
    findSimilarProducts(searchText: $searchText, threshold: $threshold) {
      id
      ten
      ten2
      ma
      similarityScore
    }
  }
`,n.gql`
  query GetProductGroups($minGroupSize: Float) {
    getProductGroups(minGroupSize: $minGroupSize) {
      ten2
      productCount
      products {
        id
        ten
        ma
        dvt
        dgia
      }
    }
  }
`;var d=t.i(257725),l=t.i(112641),c=t.i(257117);let g=({stats:t})=>(0,e.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-4 mb-6",children:[(0,e.jsx)("div",{className:"bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4",children:(0,e.jsxs)("div",{className:"flex items-center justify-between",children:[(0,e.jsxs)("div",{children:[(0,e.jsx)("p",{className:"text-sm text-gray-600 dark:text-gray-400",children:"Tổng sản phẩm"}),(0,e.jsx)("p",{className:"text-2xl font-bold text-gray-900 dark:text-white",children:t.total})]}),(0,e.jsx)(d.Database,{className:"h-8 w-8 text-blue-500"})]})}),(0,e.jsx)("div",{className:"bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4",children:(0,e.jsxs)("div",{className:"flex items-center justify-between",children:[(0,e.jsxs)("div",{children:[(0,e.jsx)("p",{className:"text-sm text-gray-600 dark:text-gray-400",children:"Đã chuẩn hóa"}),(0,e.jsx)("p",{className:"text-2xl font-bold text-green-600",children:t.normalized})]}),(0,e.jsx)(l.CheckCircle2,{className:"h-8 w-8 text-green-500"})]})}),(0,e.jsx)("div",{className:"bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4",children:(0,e.jsxs)("div",{className:"flex items-center justify-between",children:[(0,e.jsxs)("div",{children:[(0,e.jsx)("p",{className:"text-sm text-gray-600 dark:text-gray-400",children:"Chưa chuẩn hóa"}),(0,e.jsx)("p",{className:"text-2xl font-bold text-orange-600",children:t.pending})]}),(0,e.jsx)(c.XCircle,{className:"h-8 w-8 text-orange-500"})]})})]});var u=t.i(850384),m=t.i(791174),p=t.i(456099),p=p;let h=({searchTerm:t,onSearchChange:a,filterStatus:r,onFilterChange:s,uniqueFilter:o,onUniqueFilterChange:n,stats:i,filteredCount:l,loading:c,onRefresh:g,onNormalize:h,onUpdate:x})=>(0,e.jsx)("div",{className:"bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6",children:(0,e.jsxs)("div",{className:"flex flex-col gap-4",children:[(0,e.jsxs)("div",{className:"flex flex-col md:flex-row gap-4 items-center justify-between",children:[(0,e.jsxs)("div",{className:"relative flex-1 max-w-md",children:[(0,e.jsx)(u.Search,{className:"absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"}),(0,e.jsx)("input",{type:"text",placeholder:"Tìm kiếm theo tên, mã, DVT...",value:t,onChange:t=>a(t.target.value),className:"w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"})]}),(0,e.jsxs)("div",{className:"flex gap-2",children:[(0,e.jsxs)("button",{onClick:g,disabled:c,className:"flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50",children:[(0,e.jsx)(m.RefreshCw,{className:`h-4 w-4 ${c?"animate-spin":""}`}),"Làm mới"]}),(0,e.jsxs)("button",{onClick:x,className:"flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700",children:[(0,e.jsx)(p.default,{className:"h-4 w-4"}),"Cập nhật SP"]}),(0,e.jsxs)("button",{onClick:h,className:"flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700",children:[(0,e.jsx)(d.Database,{className:"h-4 w-4"}),"Chuẩn hóa"]})]})]}),(0,e.jsxs)("div",{className:"flex gap-2 items-center",children:[(0,e.jsx)("span",{className:"text-sm text-gray-600 dark:text-gray-400",children:"Trạng thái:"}),(0,e.jsxs)("div",{className:"flex gap-2",children:[(0,e.jsxs)("button",{onClick:()=>s("all"),className:`px-3 py-1 text-sm rounded-lg transition-colors ${"all"===r?"bg-blue-600 text-white":"bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"}`,children:["Tất cả (",i.total,")"]}),(0,e.jsxs)("button",{onClick:()=>s("normalized"),className:`px-3 py-1 text-sm rounded-lg transition-colors ${"normalized"===r?"bg-green-600 text-white":"bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"}`,children:["Đã chuẩn hóa (",i.normalized,")"]}),(0,e.jsxs)("button",{onClick:()=>s("pending"),className:`px-3 py-1 text-sm rounded-lg transition-colors ${"pending"===r?"bg-orange-600 text-white":"bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"}`,children:["Chưa xử lý (",i.pending,")"]})]})]}),(0,e.jsxs)("div",{className:"flex gap-2 items-center",children:[(0,e.jsx)("span",{className:"text-sm text-gray-600 dark:text-gray-400",children:"Hiển thị unique:"}),(0,e.jsxs)("div",{className:"flex gap-2",children:[(0,e.jsxs)("button",{onClick:()=>n("none"),className:`px-3 py-1 text-sm rounded-lg transition-colors ${"none"===o?"bg-blue-600 text-white":"bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"}`,children:["Tất cả ","none"===o&&`(${l})`]}),(0,e.jsxs)("button",{onClick:()=>n("ma"),className:`px-3 py-1 text-sm rounded-lg transition-colors ${"ma"===o?"bg-purple-600 text-white":"bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"}`,children:["Theo mã sản phẩm ","ma"===o&&`(${l})`]}),(0,e.jsxs)("button",{onClick:()=>n("ten2"),className:`px-3 py-1 text-sm rounded-lg transition-colors ${"ten2"===o?"bg-indigo-600 text-white":"bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"}`,children:["Theo tên chuẩn hóa ","ten2"===o&&`(${l})`]})]})]})]})});var x=t.i(169989),y=t.i(996701),b=t.i(496781),f=t.i(391551);let v=({products:t,loading:a,sortField:r,sortDirection:s,onSort:o,emptyMessage:n="Không có dữ liệu"})=>{let i=t=>r!==t?(0,e.jsx)(y.ArrowUpDown,{className:"h-4 w-4 text-gray-400"}):"asc"===s?(0,e.jsx)(b.ArrowUp,{className:"h-4 w-4 text-blue-500"}):(0,e.jsx)(f.ArrowDown,{className:"h-4 w-4 text-blue-500"});return(0,e.jsx)("div",{className:"bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden",children:(0,e.jsx)("div",{className:"overflow-x-auto",children:(0,e.jsxs)("table",{className:"w-full",children:[(0,e.jsx)("thead",{className:"bg-gray-50 dark:bg-gray-700",children:(0,e.jsxs)("tr",{children:[(0,e.jsx)("th",{className:"px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600",onClick:()=>o("ma"),children:(0,e.jsxs)("div",{className:"flex items-center gap-2",children:["Mã SP",i("ma")]})}),(0,e.jsx)("th",{className:"px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600",onClick:()=>o("ten"),children:(0,e.jsxs)("div",{className:"flex items-center gap-2",children:["Tên sản phẩm",i("ten")]})}),(0,e.jsx)("th",{className:"px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider",children:"Tên chuẩn hóa"}),(0,e.jsx)("th",{className:"px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider",children:"ĐVT"}),(0,e.jsx)("th",{className:"px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600",onClick:()=>o("dgia"),children:(0,e.jsxs)("div",{className:"flex items-center justify-end gap-2",children:["Đơn giá",i("dgia")]})}),(0,e.jsx)("th",{className:"px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider",children:"Trạng thái"})]})}),(0,e.jsx)("tbody",{className:"divide-y divide-gray-200 dark:divide-gray-700",children:a?(0,e.jsx)("tr",{children:(0,e.jsx)("td",{colSpan:6,className:"px-4 py-8 text-center",children:(0,e.jsxs)("div",{className:"flex items-center justify-center gap-2",children:[(0,e.jsx)(x.Loader2,{className:"h-5 w-5 animate-spin text-blue-500"}),(0,e.jsx)("span",{className:"text-gray-500",children:"Đang tải..."})]})})}):0===t.length?(0,e.jsx)("tr",{children:(0,e.jsx)("td",{colSpan:6,className:"px-4 py-8 text-center text-gray-500",children:n})}):t.map(t=>{var a;return(0,e.jsxs)("tr",{className:"hover:bg-gray-50 dark:hover:bg-gray-700",children:[(0,e.jsx)("td",{className:"px-4 py-3 text-sm font-medium text-gray-900 dark:text-white",children:t.ma||"-"}),(0,e.jsx)("td",{className:"px-4 py-3 text-sm text-gray-700 dark:text-gray-300",children:t.ten||"-"}),(0,e.jsx)("td",{className:"px-4 py-3 text-sm",children:t.ten2?(0,e.jsx)("span",{className:"text-green-700 dark:text-green-400 font-medium",children:t.ten2}):(0,e.jsx)("span",{className:"text-gray-400 italic",children:"Chưa chuẩn hóa"})}),(0,e.jsx)("td",{className:"px-4 py-3 text-sm text-gray-700 dark:text-gray-300",children:t.dvt||"-"}),(0,e.jsx)("td",{className:"px-4 py-3 text-sm text-right text-gray-900 dark:text-white font-medium",children:null===(a=t.dgia)?"-":new Intl.NumberFormat("vi-VN",{style:"currency",currency:"VND"}).format(Number(a))}),(0,e.jsx)("td",{className:"px-4 py-3 text-center",children:t.ten2?(0,e.jsxs)("span",{className:"inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs rounded-full",children:[(0,e.jsx)(l.CheckCircle2,{className:"h-3 w-3"}),"Đã chuẩn hóa"]}):(0,e.jsxs)("span",{className:"inline-flex items-center gap-1 px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 text-xs rounded-full",children:[(0,e.jsx)(c.XCircle,{className:"h-3 w-3"}),"Chưa xử lý"]})})]},t.id)})})]})})})},N=({currentPage:t,totalItems:a,itemsPerPage:r,onPageChange:s})=>{let o=Math.ceil(a/r),n=Math.min(t*r,a);return a<=r?null:(0,e.jsx)("div",{className:"px-4 py-3 border-t border-gray-200 dark:border-gray-700",children:(0,e.jsxs)("div",{className:"flex items-center justify-between",children:[(0,e.jsxs)("div",{className:"text-sm text-gray-600 dark:text-gray-400",children:["Hiển thị ",(t-1)*r+1," - ",n," trong tổng số ",a," sản phẩm"]}),(0,e.jsxs)("div",{className:"flex items-center gap-2",children:[(0,e.jsx)("button",{onClick:()=>s(Math.max(1,t-1)),disabled:1===t,className:"px-4 py-2 text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed",children:"Trang trước"}),(0,e.jsxs)("span",{className:"text-sm text-gray-600 dark:text-gray-400",children:["Trang ",t," / ",o]}),(0,e.jsx)("button",{onClick:()=>s(t+1),disabled:t>=o,className:"px-4 py-2 text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed",children:"Trang sau"})]})]})})};var $=t.i(490008);let k=({isOpen:t,onClose:r,onNormalize:s,loading:o})=>{let[n,i]=(0,a.useState)("preview"),[d,l]=(0,a.useState)(10);if(!t)return null;let c=async()=>{await s("preview"===n,d)};return(0,e.jsx)("div",{className:"fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4",children:(0,e.jsxs)("div",{className:"bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6",children:[(0,e.jsx)("h3",{className:"text-lg font-semibold text-gray-900 dark:text-white mb-4",children:"Chuẩn hóa tên sản phẩm"}),(0,e.jsxs)("div",{className:"space-y-4",children:[(0,e.jsxs)("div",{children:[(0,e.jsx)("label",{className:"block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2",children:"Chế độ"}),(0,e.jsxs)("div",{className:"space-y-2",children:[(0,e.jsxs)("label",{className:"flex items-center gap-2",children:[(0,e.jsx)("input",{type:"radio",checked:"preview"===n,onChange:()=>i("preview"),className:"text-blue-600"}),(0,e.jsx)("span",{className:"text-sm text-gray-700 dark:text-gray-300",children:"Xem trước (Dry run)"})]}),(0,e.jsxs)("label",{className:"flex items-center gap-2",children:[(0,e.jsx)("input",{type:"radio",checked:"update"===n,onChange:()=>i("update"),className:"text-blue-600"}),(0,e.jsx)("span",{className:"text-sm text-gray-700 dark:text-gray-300",children:"Cập nhật thực tế"})]})]})]}),(0,e.jsxs)("div",{children:[(0,e.jsx)("label",{className:"block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2",children:"Số lượng sản phẩm"}),(0,e.jsxs)("select",{value:d,onChange:t=>l(Number(t.target.value)),className:"w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white",children:[(0,e.jsx)("option",{value:10,children:"10 sản phẩm"}),(0,e.jsx)("option",{value:100,children:"100 sản phẩm"}),(0,e.jsx)("option",{value:1e3,children:"1000 sản phẩm"}),(0,e.jsx)("option",{value:0,children:"Tất cả"})]})]}),(0,e.jsx)("div",{className:"bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3",children:(0,e.jsxs)("p",{className:"text-sm text-blue-800 dark:text-blue-300",children:[(0,e.jsx)("strong",{children:"Fuzzy Matching với pg_trgm:"})," Hệ thống sẽ tự động nhóm các sản phẩm có tên tương tự nhau bằng thuật toán fuzzy matching."]})})]}),(0,e.jsxs)("div",{className:"flex gap-2 mt-6",children:[(0,e.jsx)("button",{onClick:r,disabled:o,className:"flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700",children:"Hủy"}),(0,e.jsx)("button",{onClick:c,disabled:o,className:"flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2",children:o?(0,e.jsxs)(e.Fragment,{children:[(0,e.jsx)(x.Loader2,{className:"h-4 w-4 animate-spin"}),"Đang xử lý..."]}):(0,e.jsxs)(e.Fragment,{children:[(0,e.jsx)($.Play,{className:"h-4 w-4"}),"preview"===n?"Xem trước":"Chạy ngay"]})})]})]})})};var w=t.i(888540),p=p,j=t.i(169100);let C=({isOpen:t,onClose:r,onUpdate:s,loading:o})=>{let[n,i]=(0,a.useState)("preview"),[d,l]=(0,a.useState)(100),c=async()=>{await s("preview"===n,d)};return t?(0,e.jsx)("div",{className:"fixed inset-0 bg-black/50 flex items-center justify-center z-50",children:(0,e.jsxs)("div",{className:"bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4",children:[(0,e.jsxs)("div",{className:"flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700",children:[(0,e.jsxs)("div",{className:"flex items-center gap-3",children:[(0,e.jsx)(p.default,{className:"h-6 w-6 text-green-600"}),(0,e.jsx)("h2",{className:"text-xl font-semibold text-gray-900 dark:text-white",children:"Cập Nhật Sản Phẩm"})]}),(0,e.jsx)("button",{onClick:r,className:"text-gray-400 hover:text-gray-600 dark:hover:text-gray-200",children:(0,e.jsx)(w.X,{className:"h-6 w-6"})})]}),(0,e.jsxs)("div",{className:"p-6 space-y-6",children:[(0,e.jsxs)("div",{className:"bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4",children:[(0,e.jsx)("h3",{className:"font-medium text-blue-900 dark:text-blue-200 mb-2",children:"Chức năng"}),(0,e.jsxs)("p",{className:"text-sm text-blue-800 dark:text-blue-300",children:["Tự động đồng bộ sản phẩm từ ",(0,e.jsx)("strong",{children:"ext_detailhoadon"})," sang"," ",(0,e.jsx)("strong",{children:"ext_sanphamhoadon"}),"."]}),(0,e.jsxs)("ul",{className:"mt-2 text-sm text-blue-800 dark:text-blue-300 list-disc list-inside space-y-1",children:[(0,e.jsx)("li",{children:"Tạo sản phẩm mới nếu chưa tồn tại"}),(0,e.jsx)("li",{children:"Cập nhật thông tin nếu đã có"}),(0,e.jsx)("li",{children:"Tự động sinh mã sản phẩm từ tên"}),(0,e.jsx)("li",{children:"Tự động chuẩn hóa tên sản phẩm (ten2) bằng fuzzy matching"})]})]}),(0,e.jsxs)("div",{children:[(0,e.jsx)("label",{className:"block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2",children:"Chế độ thực thi"}),(0,e.jsxs)("div",{className:"grid grid-cols-2 gap-4",children:[(0,e.jsx)("button",{onClick:()=>i("preview"),className:`p-4 border-2 rounded-lg transition-all ${"preview"===n?"border-blue-500 bg-blue-50 dark:bg-blue-900/20":"border-gray-200 dark:border-gray-700 hover:border-blue-300"}`,children:(0,e.jsxs)("div",{className:"text-left",children:[(0,e.jsx)("div",{className:"font-medium text-gray-900 dark:text-white",children:"Xem trước"}),(0,e.jsx)("div",{className:"text-sm text-gray-600 dark:text-gray-400 mt-1",children:"Chỉ hiển thị thay đổi, không lưu vào database"})]})}),(0,e.jsx)("button",{onClick:()=>i("update"),className:`p-4 border-2 rounded-lg transition-all ${"update"===n?"border-green-500 bg-green-50 dark:bg-green-900/20":"border-gray-200 dark:border-gray-700 hover:border-green-300"}`,children:(0,e.jsxs)("div",{className:"text-left",children:[(0,e.jsx)("div",{className:"font-medium text-gray-900 dark:text-white",children:"Cập nhật"}),(0,e.jsx)("div",{className:"text-sm text-gray-600 dark:text-gray-400 mt-1",children:"Thực hiện và lưu thay đổi vào database"})]})})]})]}),(0,e.jsxs)("div",{children:[(0,e.jsx)("label",{className:"block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2",children:"Giới hạn số lượng (để test)"}),(0,e.jsx)("input",{type:"number",value:d,onChange:t=>l(Math.max(1,parseInt(t.target.value)||1)),min:"1",max:"10000",className:"w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"}),(0,e.jsx)("p",{className:"mt-1 text-sm text-gray-500 dark:text-gray-400",children:"Bỏ trống hoặc nhập số lớn để xử lý tất cả"})]}),"update"===n&&(0,e.jsx)("div",{className:"bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4",children:(0,e.jsxs)("div",{className:"flex gap-3",children:[(0,e.jsx)(j.AlertTriangle,{className:"h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5"}),(0,e.jsxs)("div",{children:[(0,e.jsx)("h4",{className:"font-medium text-yellow-900 dark:text-yellow-200",children:"Cảnh báo"}),(0,e.jsx)("p",{className:"text-sm text-yellow-800 dark:text-yellow-300 mt-1",children:"Chế độ cập nhật sẽ thay đổi dữ liệu trong database. Hãy đảm bảo bạn đã kiểm tra ở chế độ xem trước trước khi thực hiện."})]})]})})]}),(0,e.jsxs)("div",{className:"flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700",children:[(0,e.jsx)("button",{onClick:r,disabled:o,className:"px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50",children:"Hủy"}),(0,e.jsx)("button",{onClick:c,disabled:o,className:`px-6 py-2 rounded-lg text-white disabled:opacity-50 flex items-center gap-2 ${"preview"===n?"bg-blue-600 hover:bg-blue-700":"bg-green-600 hover:bg-green-700"}`,children:o?(0,e.jsxs)(e.Fragment,{children:[(0,e.jsx)("div",{className:"animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"}),"Đang xử lý..."]}):(0,e.jsxs)(e.Fragment,{children:[(0,e.jsx)(p.default,{className:"h-4 w-4"}),"preview"===n?"Xem trước":"Cập nhật ngay"]})})]})]})}):null};function T(){let[t,n]=(0,a.useState)(""),[d,l]=(0,a.useState)(1),[c]=(0,a.useState)(50),[u,m]=(0,a.useState)("createdAt"),[p,x]=(0,a.useState)("desc"),[y,b]=(0,a.useState)("all"),[f,$]=(0,a.useState)("none"),[w,j]=(0,a.useState)(!1),[T,E]=(0,a.useState)(!1),[S,A]=(0,a.useState)(!1),[D,U]=(0,a.useState)(!1),{data:_,loading:O,refetch:I}=(0,s.useDynamicQuery)("GET_ALL","ext_sanphamhoadon",{fetchPolicy:"network-only"}),[P]=(0,o.useMutation)(i),{filteredProducts:q,stats:M}=(({products:t,searchTerm:e,filterStatus:r,uniqueFilter:s,sortField:o,sortDirection:n})=>(0,a.useMemo)(()=>{if(!Array.isArray(t))return console.warn("Products data is not an array:",t),{filteredProducts:[],stats:{total:0,normalized:0,pending:0}};let a=[...t];if(e){let t=e.toLowerCase().trim();a=a.filter(e=>e.ten?.toLowerCase().includes(t)||e.ten2?.toLowerCase().includes(t)||e.ma?.toLowerCase().includes(t)||e.dvt?.toLowerCase().includes(t))}if("normalized"===r?a=a.filter(t=>t.ten2):"pending"===r&&(a=a.filter(t=>!t.ten2)),"ma"===s){let t=new Set;a=a.filter(e=>!e.ma||!t.has(e.ma)&&(t.add(e.ma),!0))}else if("ten2"===s){let t=new Set;a=a.filter(e=>!e.ten2||!t.has(e.ten2)&&(t.add(e.ten2),!0))}return a.sort((t,e)=>{let a=t[o],r=e[o];if(null===a)return 1;if(null===r)return -1;"dgia"===o?(a=Number(a)||0,r=Number(r)||0):"createdAt"===o?(a=new Date(a).getTime(),r=new Date(r).getTime()):(a=String(a).toLowerCase(),r=String(r).toLowerCase());let s=a<r?-1:+(a>r);return"asc"===n?s:-s}),{filteredProducts:a,stats:{total:t.length,normalized:t.filter(t=>t.ten2).length,pending:t.filter(t=>!t.ten2).length}}},[t,e,r,s,o,n]))({products:_?.getext_sanphamhoadons||[],searchTerm:t,filterStatus:y,uniqueFilter:f,sortField:u,sortDirection:p}),{paginatedProducts:F}=(({products:t,page:e,limit:r,setPage:s,dependencies:o=[]})=>((0,a.useEffect)(()=>{s(1)},o),{paginatedProducts:(0,a.useMemo)(()=>{let a=(e-1)*r;return t.slice(a,a+r)},[t,e,r]),totalPages:Math.ceil(t.length/r)}))({products:q,page:d,limit:c,setPage:l,dependencies:[t,y,f,u,p]}),L=async()=>{try{await I(),r.toast.success("Đã tải lại dữ liệu")}catch(t){console.error("Error loading products:",t),r.toast.error("Lỗi khi tải dữ liệu")}},B=async(t,e)=>{j(!0);try{let a=await fetch("/api/ketoan/normalize-products",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({dryRun:t,limit:e})}),s=await a.json();s.success?(r.toast.success(s.message),t||await L(),E(!1)):r.toast.error(s.message||"Lỗi khi chuẩn hóa dữ liệu")}catch(t){console.error("Normalization error:",t),r.toast.error("Không thể kết nối với server")}finally{j(!1)}},J=async(t,e)=>{A(!0);try{let{data:a}=await P({variables:{dryRun:t,limit:e}}),s=a?.updateProductsFromDetails;if(s?.success){if(r.toast.success(s.message),s.stats){let{created:t,updated:e,skipped:a,errors:r}=s.stats;console.log("Update stats:",{created:t,updated:e,skipped:a,errors:r})}t||await L(),U(!1)}else r.toast.error(s?.message||"Lỗi khi cập nhật sản phẩm")}catch(t){console.error("Update error:",t),r.toast.error(t.message||"Không thể kết nối với server")}finally{A(!1)}};return(0,e.jsxs)("div",{className:"container mx-auto p-6",children:[(0,e.jsxs)("div",{className:"mb-6",children:[(0,e.jsx)("h1",{className:"text-3xl font-bold text-gray-900 dark:text-white mb-2",children:"Quản Lý Sản Phẩm"}),(0,e.jsx)("p",{className:"text-gray-600 dark:text-gray-400",children:"Danh sách sản phẩm từ hóa đơn với tính năng chuẩn hóa tên sản phẩm"})]}),(0,e.jsx)(h,{searchTerm:t,onSearchChange:n,filterStatus:y,onFilterChange:b,uniqueFilter:f,onUniqueFilterChange:$,stats:M,filteredCount:q.length,loading:O,onRefresh:L,onNormalize:()=>E(!0),onUpdate:()=>U(!0)}),(0,e.jsx)(g,{stats:M}),(0,e.jsx)(v,{products:F,loading:O,sortField:u,sortDirection:p,onSort:t=>{u===t?x("asc"===p?"desc":"asc"):(m(t),x("asc"))},emptyMessage:t||"all"!==y?"Không tìm thấy sản phẩm phù hợp":"Không có dữ liệu"}),(0,e.jsx)(N,{currentPage:d,totalItems:q.length,itemsPerPage:c,onPageChange:l}),(0,e.jsx)(k,{isOpen:T,onClose:()=>E(!1),onNormalize:B,loading:w}),(0,e.jsx)(C,{isOpen:D,onClose:()=>U(!1),onUpdate:J,loading:S})]})}t.s(["default",()=>T],650169)}]);