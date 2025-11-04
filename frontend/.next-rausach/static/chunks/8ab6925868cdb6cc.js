(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,165429,t=>{"use strict";var e=t.i(44990),a=t.i(403055),r=t.i(873273),o=a.forwardRef((t,a)=>(0,e.jsx)(r.Primitive.label,{...t,ref:a,onMouseDown:e=>{e.target.closest("button, input, select, textarea")||(t.onMouseDown?.(e),!e.defaultPrevented&&e.detail>1&&e.preventDefault())}}));o.displayName="Label";var s=t.i(541428);function n({className:t,...a}){return(0,e.jsx)(o,{"data-slot":"label",className:(0,s.cn)("flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",t),...a})}t.s(["Label",()=>n],165429)},600547,t=>{"use strict";var e=t.i(44990),a=t.i(403055),r=t.i(541428);let o=a.forwardRef(({className:t,...a},o)=>(0,e.jsx)("textarea",{className:(0,r.cn)("flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",t),ref:o,...a}));o.displayName="Textarea",t.s(["Textarea",()=>o])},138227,t=>{"use strict";var e=t.i(874061);t.s(["Trash2",()=>e.default])},606443,t=>{"use strict";var e=t.i(994315);t.s(["Plus",()=>e.default])},835819,t=>{"use strict";var e=t.i(403055);t.i(940392);let a=Array(12).fill(0),r=1,o=new class{constructor(){this.subscribe=t=>(this.subscribers.push(t),()=>{let e=this.subscribers.indexOf(t);this.subscribers.splice(e,1)}),this.publish=t=>{this.subscribers.forEach(e=>e(t))},this.addToast=t=>{this.publish(t),this.toasts=[...this.toasts,t]},this.create=t=>{var e;let{message:a,...o}=t,s="number"==typeof(null==t?void 0:t.id)||(null==(e=t.id)?void 0:e.length)>0?t.id:r++,n=this.toasts.find(t=>t.id===s),i=void 0===t.dismissible||t.dismissible;return this.dismissedToasts.has(s)&&this.dismissedToasts.delete(s),n?this.toasts=this.toasts.map(e=>e.id===s?(this.publish({...e,...t,id:s,title:a}),{...e,...t,id:s,dismissible:i,title:a}):e):this.addToast({title:a,...o,dismissible:i,id:s}),s},this.dismiss=t=>(t?(this.dismissedToasts.add(t),requestAnimationFrame(()=>this.subscribers.forEach(e=>e({id:t,dismiss:!0})))):this.toasts.forEach(t=>{this.subscribers.forEach(e=>e({id:t.id,dismiss:!0}))}),t),this.message=(t,e)=>this.create({...e,message:t}),this.error=(t,e)=>this.create({...e,message:t,type:"error"}),this.success=(t,e)=>this.create({...e,type:"success",message:t}),this.info=(t,e)=>this.create({...e,type:"info",message:t}),this.warning=(t,e)=>this.create({...e,type:"warning",message:t}),this.loading=(t,e)=>this.create({...e,type:"loading",message:t}),this.promise=(t,a)=>{let r,o;if(!a)return;void 0!==a.loading&&(o=this.create({...a,promise:t,type:"loading",message:a.loading,description:"function"!=typeof a.description?a.description:void 0}));let n=Promise.resolve(t instanceof Function?t():t),i=void 0!==o,d=n.then(async t=>{if(r=["resolve",t],e.default.isValidElement(t))i=!1,this.create({id:o,type:"default",message:t});else if(s(t)&&!t.ok){i=!1;let r="function"==typeof a.error?await a.error(`HTTP error! status: ${t.status}`):a.error,s="function"==typeof a.description?await a.description(`HTTP error! status: ${t.status}`):a.description,n="object"!=typeof r||e.default.isValidElement(r)?{message:r}:r;this.create({id:o,type:"error",description:s,...n})}else if(t instanceof Error){i=!1;let r="function"==typeof a.error?await a.error(t):a.error,s="function"==typeof a.description?await a.description(t):a.description,n="object"!=typeof r||e.default.isValidElement(r)?{message:r}:r;this.create({id:o,type:"error",description:s,...n})}else if(void 0!==a.success){i=!1;let r="function"==typeof a.success?await a.success(t):a.success,s="function"==typeof a.description?await a.description(t):a.description,n="object"!=typeof r||e.default.isValidElement(r)?{message:r}:r;this.create({id:o,type:"success",description:s,...n})}}).catch(async t=>{if(r=["reject",t],void 0!==a.error){i=!1;let r="function"==typeof a.error?await a.error(t):a.error,s="function"==typeof a.description?await a.description(t):a.description,n="object"!=typeof r||e.default.isValidElement(r)?{message:r}:r;this.create({id:o,type:"error",description:s,...n})}}).finally(()=>{i&&(this.dismiss(o),o=void 0),null==a.finally||a.finally.call(a)}),l=()=>new Promise((t,e)=>d.then(()=>"reject"===r[0]?e(r[1]):t(r[1])).catch(e));return"string"!=typeof o&&"number"!=typeof o?{unwrap:l}:Object.assign(o,{unwrap:l})},this.custom=(t,e)=>{let a=(null==e?void 0:e.id)||r++;return this.create({jsx:t(a),id:a,...e}),a},this.getActiveToasts=()=>this.toasts.filter(t=>!this.dismissedToasts.has(t.id)),this.subscribers=[],this.toasts=[],this.dismissedToasts=new Set}},s=t=>t&&"object"==typeof t&&"ok"in t&&"boolean"==typeof t.ok&&"status"in t&&"number"==typeof t.status,n=Object.assign((t,e)=>{let a=(null==e?void 0:e.id)||r++;return o.addToast({title:t,...e,id:a}),a},{success:o.success,info:o.info,warning:o.warning,error:o.error,custom:o.custom,message:o.message,promise:o.promise,dismiss:o.dismiss,loading:o.loading},{getHistory:()=>o.toasts,getToasts:()=>o.getActiveToasts()});!function(t){if(!t||"undefined"==typeof document)return;let e=document.head||document.getElementsByTagName("head")[0],a=document.createElement("style");a.type="text/css",e.appendChild(a),a.styleSheet?a.styleSheet.cssText=t:a.appendChild(document.createTextNode(t))}("[data-sonner-toaster][dir=ltr],html[dir=ltr]{--toast-icon-margin-start:-3px;--toast-icon-margin-end:4px;--toast-svg-margin-start:-1px;--toast-svg-margin-end:0px;--toast-button-margin-start:auto;--toast-button-margin-end:0;--toast-close-button-start:0;--toast-close-button-end:unset;--toast-close-button-transform:translate(-35%, -35%)}[data-sonner-toaster][dir=rtl],html[dir=rtl]{--toast-icon-margin-start:4px;--toast-icon-margin-end:-3px;--toast-svg-margin-start:0px;--toast-svg-margin-end:-1px;--toast-button-margin-start:0;--toast-button-margin-end:auto;--toast-close-button-start:unset;--toast-close-button-end:0;--toast-close-button-transform:translate(35%, -35%)}[data-sonner-toaster]{position:fixed;width:var(--width);font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;--gray1:hsl(0, 0%, 99%);--gray2:hsl(0, 0%, 97.3%);--gray3:hsl(0, 0%, 95.1%);--gray4:hsl(0, 0%, 93%);--gray5:hsl(0, 0%, 90.9%);--gray6:hsl(0, 0%, 88.7%);--gray7:hsl(0, 0%, 85.8%);--gray8:hsl(0, 0%, 78%);--gray9:hsl(0, 0%, 56.1%);--gray10:hsl(0, 0%, 52.3%);--gray11:hsl(0, 0%, 43.5%);--gray12:hsl(0, 0%, 9%);--border-radius:8px;box-sizing:border-box;padding:0;margin:0;list-style:none;outline:0;z-index:999999999;transition:transform .4s ease}@media (hover:none) and (pointer:coarse){[data-sonner-toaster][data-lifted=true]{transform:none}}[data-sonner-toaster][data-x-position=right]{right:var(--offset-right)}[data-sonner-toaster][data-x-position=left]{left:var(--offset-left)}[data-sonner-toaster][data-x-position=center]{left:50%;transform:translateX(-50%)}[data-sonner-toaster][data-y-position=top]{top:var(--offset-top)}[data-sonner-toaster][data-y-position=bottom]{bottom:var(--offset-bottom)}[data-sonner-toast]{--y:translateY(100%);--lift-amount:calc(var(--lift) * var(--gap));z-index:var(--z-index);position:absolute;opacity:0;transform:var(--y);touch-action:none;transition:transform .4s,opacity .4s,height .4s,box-shadow .2s;box-sizing:border-box;outline:0;overflow-wrap:anywhere}[data-sonner-toast][data-styled=true]{padding:16px;background:var(--normal-bg);border:1px solid var(--normal-border);color:var(--normal-text);border-radius:var(--border-radius);box-shadow:0 4px 12px rgba(0,0,0,.1);width:var(--width);font-size:13px;display:flex;align-items:center;gap:6px}[data-sonner-toast]:focus-visible{box-shadow:0 4px 12px rgba(0,0,0,.1),0 0 0 2px rgba(0,0,0,.2)}[data-sonner-toast][data-y-position=top]{top:0;--y:translateY(-100%);--lift:1;--lift-amount:calc(1 * var(--gap))}[data-sonner-toast][data-y-position=bottom]{bottom:0;--y:translateY(100%);--lift:-1;--lift-amount:calc(var(--lift) * var(--gap))}[data-sonner-toast][data-styled=true] [data-description]{font-weight:400;line-height:1.4;color:#3f3f3f}[data-rich-colors=true][data-sonner-toast][data-styled=true] [data-description]{color:inherit}[data-sonner-toaster][data-sonner-theme=dark] [data-description]{color:#e8e8e8}[data-sonner-toast][data-styled=true] [data-title]{font-weight:500;line-height:1.5;color:inherit}[data-sonner-toast][data-styled=true] [data-icon]{display:flex;height:16px;width:16px;position:relative;justify-content:flex-start;align-items:center;flex-shrink:0;margin-left:var(--toast-icon-margin-start);margin-right:var(--toast-icon-margin-end)}[data-sonner-toast][data-promise=true] [data-icon]>svg{opacity:0;transform:scale(.8);transform-origin:center;animation:sonner-fade-in .3s ease forwards}[data-sonner-toast][data-styled=true] [data-icon]>*{flex-shrink:0}[data-sonner-toast][data-styled=true] [data-icon] svg{margin-left:var(--toast-svg-margin-start);margin-right:var(--toast-svg-margin-end)}[data-sonner-toast][data-styled=true] [data-content]{display:flex;flex-direction:column;gap:2px}[data-sonner-toast][data-styled=true] [data-button]{border-radius:4px;padding-left:8px;padding-right:8px;height:24px;font-size:12px;color:var(--normal-bg);background:var(--normal-text);margin-left:var(--toast-button-margin-start);margin-right:var(--toast-button-margin-end);border:none;font-weight:500;cursor:pointer;outline:0;display:flex;align-items:center;flex-shrink:0;transition:opacity .4s,box-shadow .2s}[data-sonner-toast][data-styled=true] [data-button]:focus-visible{box-shadow:0 0 0 2px rgba(0,0,0,.4)}[data-sonner-toast][data-styled=true] [data-button]:first-of-type{margin-left:var(--toast-button-margin-start);margin-right:var(--toast-button-margin-end)}[data-sonner-toast][data-styled=true] [data-cancel]{color:var(--normal-text);background:rgba(0,0,0,.08)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast][data-styled=true] [data-cancel]{background:rgba(255,255,255,.3)}[data-sonner-toast][data-styled=true] [data-close-button]{position:absolute;left:var(--toast-close-button-start);right:var(--toast-close-button-end);top:0;height:20px;width:20px;display:flex;justify-content:center;align-items:center;padding:0;color:var(--gray12);background:var(--normal-bg);border:1px solid var(--gray4);transform:var(--toast-close-button-transform);border-radius:50%;cursor:pointer;z-index:1;transition:opacity .1s,background .2s,border-color .2s}[data-sonner-toast][data-styled=true] [data-close-button]:focus-visible{box-shadow:0 4px 12px rgba(0,0,0,.1),0 0 0 2px rgba(0,0,0,.2)}[data-sonner-toast][data-styled=true] [data-disabled=true]{cursor:not-allowed}[data-sonner-toast][data-styled=true]:hover [data-close-button]:hover{background:var(--gray2);border-color:var(--gray5)}[data-sonner-toast][data-swiping=true]::before{content:'';position:absolute;left:-100%;right:-100%;height:100%;z-index:-1}[data-sonner-toast][data-y-position=top][data-swiping=true]::before{bottom:50%;transform:scaleY(3) translateY(50%)}[data-sonner-toast][data-y-position=bottom][data-swiping=true]::before{top:50%;transform:scaleY(3) translateY(-50%)}[data-sonner-toast][data-swiping=false][data-removed=true]::before{content:'';position:absolute;inset:0;transform:scaleY(2)}[data-sonner-toast][data-expanded=true]::after{content:'';position:absolute;left:0;height:calc(var(--gap) + 1px);bottom:100%;width:100%}[data-sonner-toast][data-mounted=true]{--y:translateY(0);opacity:1}[data-sonner-toast][data-expanded=false][data-front=false]{--scale:var(--toasts-before) * 0.05 + 1;--y:translateY(calc(var(--lift-amount) * var(--toasts-before))) scale(calc(-1 * var(--scale)));height:var(--front-toast-height)}[data-sonner-toast]>*{transition:opacity .4s}[data-sonner-toast][data-x-position=right]{right:0}[data-sonner-toast][data-x-position=left]{left:0}[data-sonner-toast][data-expanded=false][data-front=false][data-styled=true]>*{opacity:0}[data-sonner-toast][data-visible=false]{opacity:0;pointer-events:none}[data-sonner-toast][data-mounted=true][data-expanded=true]{--y:translateY(calc(var(--lift) * var(--offset)));height:var(--initial-height)}[data-sonner-toast][data-removed=true][data-front=true][data-swipe-out=false]{--y:translateY(calc(var(--lift) * -100%));opacity:0}[data-sonner-toast][data-removed=true][data-front=false][data-swipe-out=false][data-expanded=true]{--y:translateY(calc(var(--lift) * var(--offset) + var(--lift) * -100%));opacity:0}[data-sonner-toast][data-removed=true][data-front=false][data-swipe-out=false][data-expanded=false]{--y:translateY(40%);opacity:0;transition:transform .5s,opacity .2s}[data-sonner-toast][data-removed=true][data-front=false]::before{height:calc(var(--initial-height) + 20%)}[data-sonner-toast][data-swiping=true]{transform:var(--y) translateY(var(--swipe-amount-y,0)) translateX(var(--swipe-amount-x,0));transition:none}[data-sonner-toast][data-swiped=true]{user-select:none}[data-sonner-toast][data-swipe-out=true][data-y-position=bottom],[data-sonner-toast][data-swipe-out=true][data-y-position=top]{animation-duration:.2s;animation-timing-function:ease-out;animation-fill-mode:forwards}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=left]{animation-name:swipe-out-left}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=right]{animation-name:swipe-out-right}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=up]{animation-name:swipe-out-up}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=down]{animation-name:swipe-out-down}@keyframes swipe-out-left{from{transform:var(--y) translateX(var(--swipe-amount-x));opacity:1}to{transform:var(--y) translateX(calc(var(--swipe-amount-x) - 100%));opacity:0}}@keyframes swipe-out-right{from{transform:var(--y) translateX(var(--swipe-amount-x));opacity:1}to{transform:var(--y) translateX(calc(var(--swipe-amount-x) + 100%));opacity:0}}@keyframes swipe-out-up{from{transform:var(--y) translateY(var(--swipe-amount-y));opacity:1}to{transform:var(--y) translateY(calc(var(--swipe-amount-y) - 100%));opacity:0}}@keyframes swipe-out-down{from{transform:var(--y) translateY(var(--swipe-amount-y));opacity:1}to{transform:var(--y) translateY(calc(var(--swipe-amount-y) + 100%));opacity:0}}@media (max-width:600px){[data-sonner-toaster]{position:fixed;right:var(--mobile-offset-right);left:var(--mobile-offset-left);width:100%}[data-sonner-toaster][dir=rtl]{left:calc(var(--mobile-offset-left) * -1)}[data-sonner-toaster] [data-sonner-toast]{left:0;right:0;width:calc(100% - var(--mobile-offset-left) * 2)}[data-sonner-toaster][data-x-position=left]{left:var(--mobile-offset-left)}[data-sonner-toaster][data-y-position=bottom]{bottom:var(--mobile-offset-bottom)}[data-sonner-toaster][data-y-position=top]{top:var(--mobile-offset-top)}[data-sonner-toaster][data-x-position=center]{left:var(--mobile-offset-left);right:var(--mobile-offset-right);transform:none}}[data-sonner-toaster][data-sonner-theme=light]{--normal-bg:#fff;--normal-border:var(--gray4);--normal-text:var(--gray12);--success-bg:hsl(143, 85%, 96%);--success-border:hsl(145, 92%, 87%);--success-text:hsl(140, 100%, 27%);--info-bg:hsl(208, 100%, 97%);--info-border:hsl(221, 91%, 93%);--info-text:hsl(210, 92%, 45%);--warning-bg:hsl(49, 100%, 97%);--warning-border:hsl(49, 91%, 84%);--warning-text:hsl(31, 92%, 45%);--error-bg:hsl(359, 100%, 97%);--error-border:hsl(359, 100%, 94%);--error-text:hsl(360, 100%, 45%)}[data-sonner-toaster][data-sonner-theme=light] [data-sonner-toast][data-invert=true]{--normal-bg:#000;--normal-border:hsl(0, 0%, 20%);--normal-text:var(--gray1)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast][data-invert=true]{--normal-bg:#fff;--normal-border:var(--gray3);--normal-text:var(--gray12)}[data-sonner-toaster][data-sonner-theme=dark]{--normal-bg:#000;--normal-bg-hover:hsl(0, 0%, 12%);--normal-border:hsl(0, 0%, 20%);--normal-border-hover:hsl(0, 0%, 25%);--normal-text:var(--gray1);--success-bg:hsl(150, 100%, 6%);--success-border:hsl(147, 100%, 12%);--success-text:hsl(150, 86%, 65%);--info-bg:hsl(215, 100%, 6%);--info-border:hsl(223, 43%, 17%);--info-text:hsl(216, 87%, 65%);--warning-bg:hsl(64, 100%, 6%);--warning-border:hsl(60, 100%, 9%);--warning-text:hsl(46, 87%, 65%);--error-bg:hsl(358, 76%, 10%);--error-border:hsl(357, 89%, 16%);--error-text:hsl(358, 100%, 81%)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast] [data-close-button]{background:var(--normal-bg);border-color:var(--normal-border);color:var(--normal-text)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast] [data-close-button]:hover{background:var(--normal-bg-hover);border-color:var(--normal-border-hover)}[data-rich-colors=true][data-sonner-toast][data-type=success]{background:var(--success-bg);border-color:var(--success-border);color:var(--success-text)}[data-rich-colors=true][data-sonner-toast][data-type=success] [data-close-button]{background:var(--success-bg);border-color:var(--success-border);color:var(--success-text)}[data-rich-colors=true][data-sonner-toast][data-type=info]{background:var(--info-bg);border-color:var(--info-border);color:var(--info-text)}[data-rich-colors=true][data-sonner-toast][data-type=info] [data-close-button]{background:var(--info-bg);border-color:var(--info-border);color:var(--info-text)}[data-rich-colors=true][data-sonner-toast][data-type=warning]{background:var(--warning-bg);border-color:var(--warning-border);color:var(--warning-text)}[data-rich-colors=true][data-sonner-toast][data-type=warning] [data-close-button]{background:var(--warning-bg);border-color:var(--warning-border);color:var(--warning-text)}[data-rich-colors=true][data-sonner-toast][data-type=error]{background:var(--error-bg);border-color:var(--error-border);color:var(--error-text)}[data-rich-colors=true][data-sonner-toast][data-type=error] [data-close-button]{background:var(--error-bg);border-color:var(--error-border);color:var(--error-text)}.sonner-loading-wrapper{--size:16px;height:var(--size);width:var(--size);position:absolute;inset:0;z-index:10}.sonner-loading-wrapper[data-visible=false]{transform-origin:center;animation:sonner-fade-out .2s ease forwards}.sonner-spinner{position:relative;top:50%;left:50%;height:var(--size);width:var(--size)}.sonner-loading-bar{animation:sonner-spin 1.2s linear infinite;background:var(--gray11);border-radius:6px;height:8%;left:-10%;position:absolute;top:-3.9%;width:24%}.sonner-loading-bar:first-child{animation-delay:-1.2s;transform:rotate(.0001deg) translate(146%)}.sonner-loading-bar:nth-child(2){animation-delay:-1.1s;transform:rotate(30deg) translate(146%)}.sonner-loading-bar:nth-child(3){animation-delay:-1s;transform:rotate(60deg) translate(146%)}.sonner-loading-bar:nth-child(4){animation-delay:-.9s;transform:rotate(90deg) translate(146%)}.sonner-loading-bar:nth-child(5){animation-delay:-.8s;transform:rotate(120deg) translate(146%)}.sonner-loading-bar:nth-child(6){animation-delay:-.7s;transform:rotate(150deg) translate(146%)}.sonner-loading-bar:nth-child(7){animation-delay:-.6s;transform:rotate(180deg) translate(146%)}.sonner-loading-bar:nth-child(8){animation-delay:-.5s;transform:rotate(210deg) translate(146%)}.sonner-loading-bar:nth-child(9){animation-delay:-.4s;transform:rotate(240deg) translate(146%)}.sonner-loading-bar:nth-child(10){animation-delay:-.3s;transform:rotate(270deg) translate(146%)}.sonner-loading-bar:nth-child(11){animation-delay:-.2s;transform:rotate(300deg) translate(146%)}.sonner-loading-bar:nth-child(12){animation-delay:-.1s;transform:rotate(330deg) translate(146%)}@keyframes sonner-fade-in{0%{opacity:0;transform:scale(.8)}100%{opacity:1;transform:scale(1)}}@keyframes sonner-fade-out{0%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(.8)}}@keyframes sonner-spin{0%{opacity:1}100%{opacity:.15}}@media (prefers-reduced-motion){.sonner-loading-bar,[data-sonner-toast],[data-sonner-toast]>*{transition:none!important;animation:none!important}}.sonner-loader{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);transform-origin:center;transition:opacity .2s,transform .2s}.sonner-loader[data-visible=false]{opacity:0;transform:scale(.8) translate(-50%,-50%)}");t.s(["toast",()=>n])},67087,t=>{"use strict";var e=t.i(44990),a=t.i(403055),r=t.i(541428);let o=a.forwardRef(({className:t,orientation:a="horizontal",decorative:o=!0,...s},n)=>(0,e.jsx)("div",{ref:n,role:o?"none":"separator","aria-orientation":o?void 0:a,className:(0,r.cn)("shrink-0 bg-gray-200","horizontal"===a?"h-[1px] w-full":"h-full w-[1px]",t),...s}));o.displayName="Separator",t.s(["Separator",()=>o])},495043,t=>{"use strict";var e=t.i(217696);t.s(["MoreVertical",()=>e.default])},574375,t=>{"use strict";var e=t.i(984804);let a=e.gql`
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
`,o=e.gql`
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
`,s=e.gql`
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
`;t.s(["CATEGORY_BASIC_FRAGMENT",0,a,"CATEGORY_TREE_FRAGMENT",0,o,"CATEGORY_WITH_COUNT_FRAGMENT",0,r,"COMMENT_FRAGMENT",0,l,"POST_FRAGMENT",0,d,"PRODUCT_IMAGE_FRAGMENT",0,s,"PRODUCT_VARIANT_FRAGMENT",0,n,"USER_FRAGMENT",0,i])},31968,t=>{"use strict";var e=t.i(494753);t.s(["Pencil",()=>e.default])},125284,t=>{"use strict";var e=t.i(429105),a=t.i(950988),r=t.i(984804),o=t.i(574375);class s{static generateCRUDQueries(t,e=[],a={}){let o=t.toLowerCase();t.charAt(0).toLowerCase(),t.slice(1);let s=t.startsWith("ext_"),n=(e.length>0?e:["id","createdAt","updatedAt"]).join("\n    ");Object.keys(a).length>0&&Object.entries(a).forEach(([t,e])=>{n+=`
    ${t} {
      ${e.join("\n      ")}
    }`});let i=s?"JSON":`${t}FilterInput`;return{[`GET_${t.toUpperCase()}S`]:s?r.gql`
          query Get${t}s($filters: ${i}) {
            get${t}s(filters: $filters)
          }
        `:r.gql`
          query Get${t}s($filters: ${i}) {
            get${t}s(filters: $filters) {
              ${n}
            }
          }
        `,[`GET_${t.toUpperCase()}S_PAGINATED`]:s?r.gql`
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
        `,[`GET_${t.toUpperCase()}_BY_ID`]:s?r.gql`
          query Get${t}ById($id: ID!, $options: JSON) {
            get${t}ById(id: $id, options: $options)
          }
        `:r.gql`
          query Get${t}ById($id: ID!, $options: JSON) {
            get${t}ById(id: $id, options: $options) {
              ${n}
            }
          }
        `,[`CREATE_${t.toUpperCase()}`]:s?r.gql`
          mutation Create${t}($data: JSON!, $options: JSON) {
            create${t}(data: $data, options: $options)
          }
        `:r.gql`
          mutation Create${t}($data: JSON!, $options: JSON) {
            create${t}(data: $data, options: $options) {
              ${n}
            }
          }
        `,[`CREATE_${t.toUpperCase()}S_BULK`]:s?r.gql`
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
        `,[`UPDATE_${t.toUpperCase()}`]:s?r.gql`
          mutation Update${t}($id: ID!, $data: JSON!, $options: JSON) {
            update${t}(id: $id, data: $data, options: $options)
          }
        `:r.gql`
          mutation Update${t}($id: ID!, $data: JSON!, $options: JSON) {
            update${t}(id: $id, data: $data, options: $options) {
              ${n}
            }
          }
        `,[`UPDATE_${t.toUpperCase()}S_BULK`]:s?r.gql`
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
        `,[`DELETE_${t.toUpperCase()}`]:s?r.gql`
          mutation Delete${t}($id: ID!, $options: JSON) {
            delete${t}(id: $id, options: $options)
          }
        `:r.gql`
          mutation Delete${t}($id: ID!, $options: JSON) {
            delete${t}(id: $id, options: $options) {
              ${n}
            }
          }
        `,[`DELETE_${t.toUpperCase()}S_BULK`]:s?r.gql`
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
        `,[`UPSERT_${t.toUpperCase()}`]:s?r.gql`
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
          ${o}Exists(where: $where)
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
      `}}}o.USER_FRAGMENT,o.POST_FRAGMENT,r.gql`
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
  `,o.COMMENT_FRAGMENT;let n=s.generateCRUDQueries("User",["id","email","username","firstName","lastName","avatar","role","isActive","createdAt","updatedAt"]),i=s.generateCRUDQueries("Post",["id","title","content","excerpt","slug","status","publishedAt","authorId","createdAt","updatedAt"]),d=s.generateCRUDQueries("Task",["id","title","description","category","priority","status","dueDate","userId","createdAt","updatedAt"]),l=s.generateCRUDQueries("Comment",["id","content","postId","userId","parentId","createdAt","updatedAt"]),u=s.generateUniversalQueries();Object.entries({User:["id","email","username","firstName","lastName","avatar","role","isActive","createdAt","updatedAt"],Post:["id","title","content","excerpt","slug","status","publishedAt","authorId","createdAt","updatedAt"],Task:["id","title","description","category","priority","status","dueDate","userId","createdAt","updatedAt"],Comment:["id","content","postId","userId","parentId","createdAt","updatedAt"],Tag:["id","name","slug","description","color","createdAt","updatedAt"],Media:["id","filename","fileUrl","fileSize","mimeType","uploadedById","createdAt"],TaskComment:["id","content","taskId","authorId","parentId","createdAt","updatedAt"],TaskShare:["id","taskId","userId","permission","shareToken","expiresAt","isActive","createdAt"],TaskMedia:["id","filename","url","type","size","mimeType","taskId","uploadedBy","createdAt"]}).reduce((t,[e,a])=>(t[e]=s.generateCRUDQueries(e,a),t),{});let{GET_USERS:c,GET_USERS_PAGINATED:p,GET_USER_BY_ID:m,CREATE_USER:g,CREATE_USERS_BULK:f,UPDATE_USER:h,UPDATE_USERS_BULK:y,DELETE_USER:$,DELETE_USERS_BULK:b,UPSERT_USER:v,COUNT_USERS:T,USER_EXISTS:E}=n,{GET_POSTS:k,GET_POSTS_PAGINATED:N,GET_POST_BY_ID:w,CREATE_POST:x,CREATE_POSTS_BULK:A,UPDATE_POST:C,UPDATE_POSTS_BULK:D,DELETE_POST:S,DELETE_POSTS_BULK:I,UPSERT_POST:U,COUNT_POSTS:_,POST_EXISTS:O}=i,{GET_TASKS:q,GET_TASKS_PAGINATED:M,GET_TASK_BY_ID:R,CREATE_TASK:B,CREATE_TASKS_BULK:F,UPDATE_TASK:P,UPDATE_TASKS_BULK:G,DELETE_TASK:J,DELETE_TASKS_BULK:L,UPSERT_TASK:Y,COUNT_TASKS:Q,TASK_EXISTS:j}=d,{GET_COMMENTS:z,GET_COMMENTS_PAGINATED:W,GET_COMMENT_BY_ID:K,CREATE_COMMENT:V,CREATE_COMMENTS_BULK:H,UPDATE_COMMENT:X,UPDATE_COMMENTS_BULK:Z,DELETE_COMMENT:tt,DELETE_COMMENTS_BULK:te,UPSERT_COMMENT:ta,COUNT_COMMENTS:tr,COMMENT_EXISTS:to}=l,{DYNAMIC_FIND_MANY:ts,DYNAMIC_FIND_BY_ID:tn,DYNAMIC_CREATE:ti,DYNAMIC_UPDATE:td,DYNAMIC_DELETE:tl,DYNAMIC_CREATE_BULK:tu,DYNAMIC_UPDATE_BULK:tc,DYNAMIC_DELETE_BULK:tp}=u;var tm=t.i(403055);function tg(t,a,r={}){let{fields:o,nestedFields:n,...i}=r,d=(0,tm.useMemo)(()=>{let e=s.generateCRUDQueries(a,o);switch(t){case"GET_ALL":return e[`GET_${a.toUpperCase()}S`];case"GET_PAGINATED":return e[`GET_${a.toUpperCase()}S_PAGINATED`];case"GET_BY_ID":return e[`GET_${a.toUpperCase()}_BY_ID`];default:throw Error(`Unsupported operation type: ${t}`)}},[t,a,o,n]);return(0,e.useQuery)(d,i)}function tf(t,e,r={}){let{fields:o,nestedFields:n,...i}=r,d=(0,tm.useMemo)(()=>{let a=s.generateCRUDQueries(e,o);switch(t){case"CREATE":return a[`CREATE_${e.toUpperCase()}`];case"CREATE_BULK":return a[`CREATE_${e.toUpperCase()}S_BULK`];case"UPDATE":return a[`UPDATE_${e.toUpperCase()}`];case"UPDATE_BULK":return a[`UPDATE_${e.toUpperCase()}S_BULK`];case"DELETE":return a[`DELETE_${e.toUpperCase()}`];case"DELETE_BULK":return a[`DELETE_${e.toUpperCase()}S_BULK`];default:throw Error(`Unsupported operation type: ${t}`)}},[t,e,o,n]);return(0,a.useMutation)(d,i)}function th(t){let e=function(t,e={}){return tg("GET_ALL",t,e)}(t),a=function(t,e={}){return tg("GET_PAGINATED",t,e)}(t),[r]=function(t,e={}){return tf("CREATE",t,e)}(t),[o]=function(t,e={}){return tf("CREATE_BULK",t,e)}(t),[s]=function(t,e={}){return tf("UPDATE",t,e)}(t),[n]=function(t,e={}){return tf("UPDATE_BULK",t,e)}(t),[i]=function(t,e={}){return tf("DELETE",t,e)}(t),[d]=function(t,e={}){return tf("DELETE_BULK",t,e)}(t);return{getAll:e,getPaginated:a,getById:(0,tm.useCallback)(e=>(function(t,e={}){return tg("GET_BY_ID",t,e)})(t,{variables:{id:e}}),[t]),create:r,createBulk:o,update:s,updateBulk:n,delete:i,deleteBulk:d}}function ty(t){return t&&t.graphQLErrors&&void 0!==t.networkError}function t$(t){return t.graphQLErrors.length>0?t.graphQLErrors.map(t=>t.message).join(", "):t.networkError?`Network error: ${t.networkError.message}`:t.message||"Unknown GraphQL error"}t.s(["formatDynamicGraphQLError",()=>t$,"isDynamicGraphQLError",()=>ty,"useCRUD",()=>th,"useDynamicMutation",()=>tf,"useDynamicQuery",()=>tg],125284)},343698,t=>{"use strict";var e,a,r,o,s,n=((e={}).WORK="WORK",e.PERSONAL="PERSONAL",e.STUDY="STUDY",e),i=((a={}).HIGH="HIGH",a.MEDIUM="MEDIUM",a.LOW="LOW",a),d=((r={}).PENDING="PENDING",r.IN_PROGRESS="IN_PROGRESS",r.COMPLETED="COMPLETED",r.CANCELLED="CANCELLED",r),l=((o={}).VIEW="VIEW",o.EDIT="EDIT",o.ADMIN="ADMIN",o),u=((s={}).IMAGE="IMAGE",s.VIDEO="VIDEO",s.DOCUMENT="DOCUMENT",s);l.READ="READ",l.WRITE="WRITE",t.s(["MediaType",()=>u,"TaskCategory",()=>n,"TaskPriority",()=>i,"TaskStatus",()=>d])},665691,t=>{"use strict";t.i(403055);var e=t.i(429105),a=t.i(950988);t.i(477469),t.i(349252),t.i(122363),t.i(919474),t.i(829319),t.i(413772),t.i(109709),t.i(131893),t.i(529590),t.i(308432),t.i(196446);var r=t.i(984804);let o=r.gql`
  fragment TaskFragment on Task {
    id
    title
    description
    category
    priority
    status
    dueDate
    createdAt
    updatedAt
    userId
    author {
      id
      username
      firstName
      lastName
      avatar
    }
  }
`,s=r.gql`
  fragment TaskMediaFragment on TaskMedia {
    id
    filename
    url
    type
    size
    mimeType
    caption
    createdAt
    updatedAt
    taskId
    uploadedBy
    uploader {
      id
      username
      firstName
      lastName
      avatar
    }
  }
`,n=r.gql`
  fragment TaskShareFragment on TaskShare {
    id
    permission
    shareToken
    expiresAt
    isActive
    createdAt
    updatedAt
    taskId
    sharedBy
    sharedByUser {
      id
      username
      firstName
      lastName
      avatar
    }
    sharedWith
    sharedWithUser {
      id
      username
      firstName
      lastName
      avatar
    }
  }
`,i=r.gql`
  fragment TaskCommentFragment on TaskComment {
    id
    content
    createdAt
    updatedAt
    taskId
    userId
    user {
      id
      username
      firstName
      lastName
      avatar
    }
  }
`;r.gql`
  fragment NotificationFragment on Notification {
    id
    type
    title
    message
    isRead
    createdAt
    userId
    user {
      id
      username
      firstName
      lastName
      avatar
    }
  }
`;let d=r.gql`
  ${o}
  query GetTasks($filters: TaskFilterInput) {
    getTasks(filters: $filters) {
      ...TaskFragment
    }
  }
`,l=r.gql`
  ${o}
  ${s}
  ${n}
  ${i}
  query GetTaskById($id: ID!) {
    getTaskById(id: $id) {
      ...TaskFragment
      media {
        ...TaskMediaFragment
      }
      shares {
        ...TaskShareFragment
      }
      comments {
        ...TaskCommentFragment
      }
    }
  }
`,u=r.gql`
  ${o}
  query GetSharedTasks($filters: TaskFilterInput) {
    getSharedTasks(filters: $filters) {
      ...TaskFragment
    }
  }
`,c=r.gql`
  ${o}
  mutation CreateTask($input: CreateTaskInput!) {
    createTask(input: $input) {
      ...TaskFragment
    }
  }
`,p=r.gql`
  ${o}
  mutation UpdateTask($input: UpdateTaskInput!) {
    updateTask(input: $input) {
      ...TaskFragment
    }
  }
`,m=r.gql`
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id)
  }
`,g=r.gql`
  ${n}
  mutation ShareTask($input: ShareTaskInput!) {
    shareTask(input: $input) {
      ...TaskShareFragment
    }
  }
`,f=r.gql`
  ${i}
  mutation CreateTaskComment($input: CreateTaskCommentInput!) {
    createTaskComment(input: $input) {
      ...TaskCommentFragment
    }
  }
`;r.gql`
  ${o}
  subscription TaskCreated {
    taskCreated {
      ...TaskFragment
    }
  }
`,r.gql`
  ${o}
  subscription TaskUpdated {
    taskUpdated {
      ...TaskFragment
    }
  }
`,r.gql`
  ${i}
  subscription TaskCommentCreated {
    taskCommentCreated {
      ...TaskCommentFragment
    }
  }
`,t.s(["useDeleteTask",0,()=>{let[t,{loading:e,error:r}]=(0,a.useMutation)(m,{refetchQueries:[d,u]});return{deleteTask:t,loading:e,error:r}},"useSharedTasks",0,t=>{let{data:a,loading:r,error:o,refetch:s}=(0,e.useQuery)(u,{variables:{filters:t},fetchPolicy:"cache-and-network"});return{sharedTasks:a?.getSharedTasks||[],loading:r,error:o,refetch:s}},"useTaskById",0,t=>(t=>{let{data:a,loading:r,error:o,refetch:s}=(0,e.useQuery)(l,{variables:{id:t},skip:!t,fetchPolicy:"cache-and-network"});return{task:a?.getTaskById,loading:r,error:o,refetch:s}})(t),"useTaskMutations",0,()=>{let[t,{loading:e}]=(0,a.useMutation)(c,{refetchQueries:[d,u]}),[r,{loading:o}]=(0,a.useMutation)(p,{refetchQueries:[d,u,l]}),[s,{loading:n}]=(0,a.useMutation)(m,{refetchQueries:[d,u]}),[i,{loading:h}]=(0,a.useMutation)(g,{refetchQueries:[l]}),[y,{loading:$}]=(0,a.useMutation)(f,{refetchQueries:[l]});return{createTask:async e=>{try{let a=await t({variables:{input:e}});return a.data?.createTask}catch(t){throw t}},updateTask:async t=>{try{let e=await r({variables:{input:t}});return e.data?.updateTask}catch(t){throw t}},deleteTask:async t=>{try{return await s({variables:{id:t}}),!0}catch(t){throw t}},shareTask:async t=>{try{let e=await i({variables:{input:t}});return e.data?.shareTask}catch(t){throw t}},createComment:async t=>{try{let e=await y({variables:{input:t}});return e.data?.createTaskComment}catch(t){throw t}},loading:{creating:e,updating:o,deleting:n,sharing:h,commenting:$}}},"useTasks",0,t=>{let{data:a,loading:r,error:o,refetch:s}=(0,e.useQuery)(d,{variables:{filters:t},fetchPolicy:"cache-and-network"});return{tasks:a?.getTasks||[],loading:r,error:o,refetch:s}},"useUpdateTask",0,()=>{let[t,{loading:e,error:r}]=(0,a.useMutation)(p,{refetchQueries:[d,u,l]});return{updateTask:t,loading:e,error:r}}],665691)},199382,t=>{"use strict";var e=t.i(403055);let a=e.forwardRef(function({title:t,titleId:a,...r},o){return e.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:o,"aria-labelledby":a},r),t?e.createElement("title",{id:a},t):null,e.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M6 18 18 6M6 6l12 12"}))});t.s(["XMarkIcon",0,a],199382)}]);