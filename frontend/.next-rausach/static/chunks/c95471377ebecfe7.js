(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,835819,t=>{"use strict";var e=t.i(403055);t.i(940392);let a=Array(12).fill(0),r=1,o=new class{constructor(){this.subscribe=t=>(this.subscribers.push(t),()=>{let e=this.subscribers.indexOf(t);this.subscribers.splice(e,1)}),this.publish=t=>{this.subscribers.forEach(e=>e(t))},this.addToast=t=>{this.publish(t),this.toasts=[...this.toasts,t]},this.create=t=>{var e;let{message:a,...o}=t,s="number"==typeof(null==t?void 0:t.id)||(null==(e=t.id)?void 0:e.length)>0?t.id:r++,n=this.toasts.find(t=>t.id===s),i=void 0===t.dismissible||t.dismissible;return this.dismissedToasts.has(s)&&this.dismissedToasts.delete(s),n?this.toasts=this.toasts.map(e=>e.id===s?(this.publish({...e,...t,id:s,title:a}),{...e,...t,id:s,dismissible:i,title:a}):e):this.addToast({title:a,...o,dismissible:i,id:s}),s},this.dismiss=t=>(t?(this.dismissedToasts.add(t),requestAnimationFrame(()=>this.subscribers.forEach(e=>e({id:t,dismiss:!0})))):this.toasts.forEach(t=>{this.subscribers.forEach(e=>e({id:t.id,dismiss:!0}))}),t),this.message=(t,e)=>this.create({...e,message:t}),this.error=(t,e)=>this.create({...e,message:t,type:"error"}),this.success=(t,e)=>this.create({...e,type:"success",message:t}),this.info=(t,e)=>this.create({...e,type:"info",message:t}),this.warning=(t,e)=>this.create({...e,type:"warning",message:t}),this.loading=(t,e)=>this.create({...e,type:"loading",message:t}),this.promise=(t,a)=>{let r,o;if(!a)return;void 0!==a.loading&&(o=this.create({...a,promise:t,type:"loading",message:a.loading,description:"function"!=typeof a.description?a.description:void 0}));let n=Promise.resolve(t instanceof Function?t():t),i=void 0!==o,l=n.then(async t=>{if(r=["resolve",t],e.default.isValidElement(t))i=!1,this.create({id:o,type:"default",message:t});else if(s(t)&&!t.ok){i=!1;let r="function"==typeof a.error?await a.error(`HTTP error! status: ${t.status}`):a.error,s="function"==typeof a.description?await a.description(`HTTP error! status: ${t.status}`):a.description,n="object"!=typeof r||e.default.isValidElement(r)?{message:r}:r;this.create({id:o,type:"error",description:s,...n})}else if(t instanceof Error){i=!1;let r="function"==typeof a.error?await a.error(t):a.error,s="function"==typeof a.description?await a.description(t):a.description,n="object"!=typeof r||e.default.isValidElement(r)?{message:r}:r;this.create({id:o,type:"error",description:s,...n})}else if(void 0!==a.success){i=!1;let r="function"==typeof a.success?await a.success(t):a.success,s="function"==typeof a.description?await a.description(t):a.description,n="object"!=typeof r||e.default.isValidElement(r)?{message:r}:r;this.create({id:o,type:"success",description:s,...n})}}).catch(async t=>{if(r=["reject",t],void 0!==a.error){i=!1;let r="function"==typeof a.error?await a.error(t):a.error,s="function"==typeof a.description?await a.description(t):a.description,n="object"!=typeof r||e.default.isValidElement(r)?{message:r}:r;this.create({id:o,type:"error",description:s,...n})}}).finally(()=>{i&&(this.dismiss(o),o=void 0),null==a.finally||a.finally.call(a)}),d=()=>new Promise((t,e)=>l.then(()=>"reject"===r[0]?e(r[1]):t(r[1])).catch(e));return"string"!=typeof o&&"number"!=typeof o?{unwrap:d}:Object.assign(o,{unwrap:d})},this.custom=(t,e)=>{let a=(null==e?void 0:e.id)||r++;return this.create({jsx:t(a),id:a,...e}),a},this.getActiveToasts=()=>this.toasts.filter(t=>!this.dismissedToasts.has(t.id)),this.subscribers=[],this.toasts=[],this.dismissedToasts=new Set}},s=t=>t&&"object"==typeof t&&"ok"in t&&"boolean"==typeof t.ok&&"status"in t&&"number"==typeof t.status,n=Object.assign((t,e)=>{let a=(null==e?void 0:e.id)||r++;return o.addToast({title:t,...e,id:a}),a},{success:o.success,info:o.info,warning:o.warning,error:o.error,custom:o.custom,message:o.message,promise:o.promise,dismiss:o.dismiss,loading:o.loading},{getHistory:()=>o.toasts,getToasts:()=>o.getActiveToasts()});!function(t){if(!t||"undefined"==typeof document)return;let e=document.head||document.getElementsByTagName("head")[0],a=document.createElement("style");a.type="text/css",e.appendChild(a),a.styleSheet?a.styleSheet.cssText=t:a.appendChild(document.createTextNode(t))}("[data-sonner-toaster][dir=ltr],html[dir=ltr]{--toast-icon-margin-start:-3px;--toast-icon-margin-end:4px;--toast-svg-margin-start:-1px;--toast-svg-margin-end:0px;--toast-button-margin-start:auto;--toast-button-margin-end:0;--toast-close-button-start:0;--toast-close-button-end:unset;--toast-close-button-transform:translate(-35%, -35%)}[data-sonner-toaster][dir=rtl],html[dir=rtl]{--toast-icon-margin-start:4px;--toast-icon-margin-end:-3px;--toast-svg-margin-start:0px;--toast-svg-margin-end:-1px;--toast-button-margin-start:0;--toast-button-margin-end:auto;--toast-close-button-start:unset;--toast-close-button-end:0;--toast-close-button-transform:translate(35%, -35%)}[data-sonner-toaster]{position:fixed;width:var(--width);font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;--gray1:hsl(0, 0%, 99%);--gray2:hsl(0, 0%, 97.3%);--gray3:hsl(0, 0%, 95.1%);--gray4:hsl(0, 0%, 93%);--gray5:hsl(0, 0%, 90.9%);--gray6:hsl(0, 0%, 88.7%);--gray7:hsl(0, 0%, 85.8%);--gray8:hsl(0, 0%, 78%);--gray9:hsl(0, 0%, 56.1%);--gray10:hsl(0, 0%, 52.3%);--gray11:hsl(0, 0%, 43.5%);--gray12:hsl(0, 0%, 9%);--border-radius:8px;box-sizing:border-box;padding:0;margin:0;list-style:none;outline:0;z-index:999999999;transition:transform .4s ease}@media (hover:none) and (pointer:coarse){[data-sonner-toaster][data-lifted=true]{transform:none}}[data-sonner-toaster][data-x-position=right]{right:var(--offset-right)}[data-sonner-toaster][data-x-position=left]{left:var(--offset-left)}[data-sonner-toaster][data-x-position=center]{left:50%;transform:translateX(-50%)}[data-sonner-toaster][data-y-position=top]{top:var(--offset-top)}[data-sonner-toaster][data-y-position=bottom]{bottom:var(--offset-bottom)}[data-sonner-toast]{--y:translateY(100%);--lift-amount:calc(var(--lift) * var(--gap));z-index:var(--z-index);position:absolute;opacity:0;transform:var(--y);touch-action:none;transition:transform .4s,opacity .4s,height .4s,box-shadow .2s;box-sizing:border-box;outline:0;overflow-wrap:anywhere}[data-sonner-toast][data-styled=true]{padding:16px;background:var(--normal-bg);border:1px solid var(--normal-border);color:var(--normal-text);border-radius:var(--border-radius);box-shadow:0 4px 12px rgba(0,0,0,.1);width:var(--width);font-size:13px;display:flex;align-items:center;gap:6px}[data-sonner-toast]:focus-visible{box-shadow:0 4px 12px rgba(0,0,0,.1),0 0 0 2px rgba(0,0,0,.2)}[data-sonner-toast][data-y-position=top]{top:0;--y:translateY(-100%);--lift:1;--lift-amount:calc(1 * var(--gap))}[data-sonner-toast][data-y-position=bottom]{bottom:0;--y:translateY(100%);--lift:-1;--lift-amount:calc(var(--lift) * var(--gap))}[data-sonner-toast][data-styled=true] [data-description]{font-weight:400;line-height:1.4;color:#3f3f3f}[data-rich-colors=true][data-sonner-toast][data-styled=true] [data-description]{color:inherit}[data-sonner-toaster][data-sonner-theme=dark] [data-description]{color:#e8e8e8}[data-sonner-toast][data-styled=true] [data-title]{font-weight:500;line-height:1.5;color:inherit}[data-sonner-toast][data-styled=true] [data-icon]{display:flex;height:16px;width:16px;position:relative;justify-content:flex-start;align-items:center;flex-shrink:0;margin-left:var(--toast-icon-margin-start);margin-right:var(--toast-icon-margin-end)}[data-sonner-toast][data-promise=true] [data-icon]>svg{opacity:0;transform:scale(.8);transform-origin:center;animation:sonner-fade-in .3s ease forwards}[data-sonner-toast][data-styled=true] [data-icon]>*{flex-shrink:0}[data-sonner-toast][data-styled=true] [data-icon] svg{margin-left:var(--toast-svg-margin-start);margin-right:var(--toast-svg-margin-end)}[data-sonner-toast][data-styled=true] [data-content]{display:flex;flex-direction:column;gap:2px}[data-sonner-toast][data-styled=true] [data-button]{border-radius:4px;padding-left:8px;padding-right:8px;height:24px;font-size:12px;color:var(--normal-bg);background:var(--normal-text);margin-left:var(--toast-button-margin-start);margin-right:var(--toast-button-margin-end);border:none;font-weight:500;cursor:pointer;outline:0;display:flex;align-items:center;flex-shrink:0;transition:opacity .4s,box-shadow .2s}[data-sonner-toast][data-styled=true] [data-button]:focus-visible{box-shadow:0 0 0 2px rgba(0,0,0,.4)}[data-sonner-toast][data-styled=true] [data-button]:first-of-type{margin-left:var(--toast-button-margin-start);margin-right:var(--toast-button-margin-end)}[data-sonner-toast][data-styled=true] [data-cancel]{color:var(--normal-text);background:rgba(0,0,0,.08)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast][data-styled=true] [data-cancel]{background:rgba(255,255,255,.3)}[data-sonner-toast][data-styled=true] [data-close-button]{position:absolute;left:var(--toast-close-button-start);right:var(--toast-close-button-end);top:0;height:20px;width:20px;display:flex;justify-content:center;align-items:center;padding:0;color:var(--gray12);background:var(--normal-bg);border:1px solid var(--gray4);transform:var(--toast-close-button-transform);border-radius:50%;cursor:pointer;z-index:1;transition:opacity .1s,background .2s,border-color .2s}[data-sonner-toast][data-styled=true] [data-close-button]:focus-visible{box-shadow:0 4px 12px rgba(0,0,0,.1),0 0 0 2px rgba(0,0,0,.2)}[data-sonner-toast][data-styled=true] [data-disabled=true]{cursor:not-allowed}[data-sonner-toast][data-styled=true]:hover [data-close-button]:hover{background:var(--gray2);border-color:var(--gray5)}[data-sonner-toast][data-swiping=true]::before{content:'';position:absolute;left:-100%;right:-100%;height:100%;z-index:-1}[data-sonner-toast][data-y-position=top][data-swiping=true]::before{bottom:50%;transform:scaleY(3) translateY(50%)}[data-sonner-toast][data-y-position=bottom][data-swiping=true]::before{top:50%;transform:scaleY(3) translateY(-50%)}[data-sonner-toast][data-swiping=false][data-removed=true]::before{content:'';position:absolute;inset:0;transform:scaleY(2)}[data-sonner-toast][data-expanded=true]::after{content:'';position:absolute;left:0;height:calc(var(--gap) + 1px);bottom:100%;width:100%}[data-sonner-toast][data-mounted=true]{--y:translateY(0);opacity:1}[data-sonner-toast][data-expanded=false][data-front=false]{--scale:var(--toasts-before) * 0.05 + 1;--y:translateY(calc(var(--lift-amount) * var(--toasts-before))) scale(calc(-1 * var(--scale)));height:var(--front-toast-height)}[data-sonner-toast]>*{transition:opacity .4s}[data-sonner-toast][data-x-position=right]{right:0}[data-sonner-toast][data-x-position=left]{left:0}[data-sonner-toast][data-expanded=false][data-front=false][data-styled=true]>*{opacity:0}[data-sonner-toast][data-visible=false]{opacity:0;pointer-events:none}[data-sonner-toast][data-mounted=true][data-expanded=true]{--y:translateY(calc(var(--lift) * var(--offset)));height:var(--initial-height)}[data-sonner-toast][data-removed=true][data-front=true][data-swipe-out=false]{--y:translateY(calc(var(--lift) * -100%));opacity:0}[data-sonner-toast][data-removed=true][data-front=false][data-swipe-out=false][data-expanded=true]{--y:translateY(calc(var(--lift) * var(--offset) + var(--lift) * -100%));opacity:0}[data-sonner-toast][data-removed=true][data-front=false][data-swipe-out=false][data-expanded=false]{--y:translateY(40%);opacity:0;transition:transform .5s,opacity .2s}[data-sonner-toast][data-removed=true][data-front=false]::before{height:calc(var(--initial-height) + 20%)}[data-sonner-toast][data-swiping=true]{transform:var(--y) translateY(var(--swipe-amount-y,0)) translateX(var(--swipe-amount-x,0));transition:none}[data-sonner-toast][data-swiped=true]{user-select:none}[data-sonner-toast][data-swipe-out=true][data-y-position=bottom],[data-sonner-toast][data-swipe-out=true][data-y-position=top]{animation-duration:.2s;animation-timing-function:ease-out;animation-fill-mode:forwards}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=left]{animation-name:swipe-out-left}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=right]{animation-name:swipe-out-right}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=up]{animation-name:swipe-out-up}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=down]{animation-name:swipe-out-down}@keyframes swipe-out-left{from{transform:var(--y) translateX(var(--swipe-amount-x));opacity:1}to{transform:var(--y) translateX(calc(var(--swipe-amount-x) - 100%));opacity:0}}@keyframes swipe-out-right{from{transform:var(--y) translateX(var(--swipe-amount-x));opacity:1}to{transform:var(--y) translateX(calc(var(--swipe-amount-x) + 100%));opacity:0}}@keyframes swipe-out-up{from{transform:var(--y) translateY(var(--swipe-amount-y));opacity:1}to{transform:var(--y) translateY(calc(var(--swipe-amount-y) - 100%));opacity:0}}@keyframes swipe-out-down{from{transform:var(--y) translateY(var(--swipe-amount-y));opacity:1}to{transform:var(--y) translateY(calc(var(--swipe-amount-y) + 100%));opacity:0}}@media (max-width:600px){[data-sonner-toaster]{position:fixed;right:var(--mobile-offset-right);left:var(--mobile-offset-left);width:100%}[data-sonner-toaster][dir=rtl]{left:calc(var(--mobile-offset-left) * -1)}[data-sonner-toaster] [data-sonner-toast]{left:0;right:0;width:calc(100% - var(--mobile-offset-left) * 2)}[data-sonner-toaster][data-x-position=left]{left:var(--mobile-offset-left)}[data-sonner-toaster][data-y-position=bottom]{bottom:var(--mobile-offset-bottom)}[data-sonner-toaster][data-y-position=top]{top:var(--mobile-offset-top)}[data-sonner-toaster][data-x-position=center]{left:var(--mobile-offset-left);right:var(--mobile-offset-right);transform:none}}[data-sonner-toaster][data-sonner-theme=light]{--normal-bg:#fff;--normal-border:var(--gray4);--normal-text:var(--gray12);--success-bg:hsl(143, 85%, 96%);--success-border:hsl(145, 92%, 87%);--success-text:hsl(140, 100%, 27%);--info-bg:hsl(208, 100%, 97%);--info-border:hsl(221, 91%, 93%);--info-text:hsl(210, 92%, 45%);--warning-bg:hsl(49, 100%, 97%);--warning-border:hsl(49, 91%, 84%);--warning-text:hsl(31, 92%, 45%);--error-bg:hsl(359, 100%, 97%);--error-border:hsl(359, 100%, 94%);--error-text:hsl(360, 100%, 45%)}[data-sonner-toaster][data-sonner-theme=light] [data-sonner-toast][data-invert=true]{--normal-bg:#000;--normal-border:hsl(0, 0%, 20%);--normal-text:var(--gray1)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast][data-invert=true]{--normal-bg:#fff;--normal-border:var(--gray3);--normal-text:var(--gray12)}[data-sonner-toaster][data-sonner-theme=dark]{--normal-bg:#000;--normal-bg-hover:hsl(0, 0%, 12%);--normal-border:hsl(0, 0%, 20%);--normal-border-hover:hsl(0, 0%, 25%);--normal-text:var(--gray1);--success-bg:hsl(150, 100%, 6%);--success-border:hsl(147, 100%, 12%);--success-text:hsl(150, 86%, 65%);--info-bg:hsl(215, 100%, 6%);--info-border:hsl(223, 43%, 17%);--info-text:hsl(216, 87%, 65%);--warning-bg:hsl(64, 100%, 6%);--warning-border:hsl(60, 100%, 9%);--warning-text:hsl(46, 87%, 65%);--error-bg:hsl(358, 76%, 10%);--error-border:hsl(357, 89%, 16%);--error-text:hsl(358, 100%, 81%)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast] [data-close-button]{background:var(--normal-bg);border-color:var(--normal-border);color:var(--normal-text)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast] [data-close-button]:hover{background:var(--normal-bg-hover);border-color:var(--normal-border-hover)}[data-rich-colors=true][data-sonner-toast][data-type=success]{background:var(--success-bg);border-color:var(--success-border);color:var(--success-text)}[data-rich-colors=true][data-sonner-toast][data-type=success] [data-close-button]{background:var(--success-bg);border-color:var(--success-border);color:var(--success-text)}[data-rich-colors=true][data-sonner-toast][data-type=info]{background:var(--info-bg);border-color:var(--info-border);color:var(--info-text)}[data-rich-colors=true][data-sonner-toast][data-type=info] [data-close-button]{background:var(--info-bg);border-color:var(--info-border);color:var(--info-text)}[data-rich-colors=true][data-sonner-toast][data-type=warning]{background:var(--warning-bg);border-color:var(--warning-border);color:var(--warning-text)}[data-rich-colors=true][data-sonner-toast][data-type=warning] [data-close-button]{background:var(--warning-bg);border-color:var(--warning-border);color:var(--warning-text)}[data-rich-colors=true][data-sonner-toast][data-type=error]{background:var(--error-bg);border-color:var(--error-border);color:var(--error-text)}[data-rich-colors=true][data-sonner-toast][data-type=error] [data-close-button]{background:var(--error-bg);border-color:var(--error-border);color:var(--error-text)}.sonner-loading-wrapper{--size:16px;height:var(--size);width:var(--size);position:absolute;inset:0;z-index:10}.sonner-loading-wrapper[data-visible=false]{transform-origin:center;animation:sonner-fade-out .2s ease forwards}.sonner-spinner{position:relative;top:50%;left:50%;height:var(--size);width:var(--size)}.sonner-loading-bar{animation:sonner-spin 1.2s linear infinite;background:var(--gray11);border-radius:6px;height:8%;left:-10%;position:absolute;top:-3.9%;width:24%}.sonner-loading-bar:first-child{animation-delay:-1.2s;transform:rotate(.0001deg) translate(146%)}.sonner-loading-bar:nth-child(2){animation-delay:-1.1s;transform:rotate(30deg) translate(146%)}.sonner-loading-bar:nth-child(3){animation-delay:-1s;transform:rotate(60deg) translate(146%)}.sonner-loading-bar:nth-child(4){animation-delay:-.9s;transform:rotate(90deg) translate(146%)}.sonner-loading-bar:nth-child(5){animation-delay:-.8s;transform:rotate(120deg) translate(146%)}.sonner-loading-bar:nth-child(6){animation-delay:-.7s;transform:rotate(150deg) translate(146%)}.sonner-loading-bar:nth-child(7){animation-delay:-.6s;transform:rotate(180deg) translate(146%)}.sonner-loading-bar:nth-child(8){animation-delay:-.5s;transform:rotate(210deg) translate(146%)}.sonner-loading-bar:nth-child(9){animation-delay:-.4s;transform:rotate(240deg) translate(146%)}.sonner-loading-bar:nth-child(10){animation-delay:-.3s;transform:rotate(270deg) translate(146%)}.sonner-loading-bar:nth-child(11){animation-delay:-.2s;transform:rotate(300deg) translate(146%)}.sonner-loading-bar:nth-child(12){animation-delay:-.1s;transform:rotate(330deg) translate(146%)}@keyframes sonner-fade-in{0%{opacity:0;transform:scale(.8)}100%{opacity:1;transform:scale(1)}}@keyframes sonner-fade-out{0%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(.8)}}@keyframes sonner-spin{0%{opacity:1}100%{opacity:.15}}@media (prefers-reduced-motion){.sonner-loading-bar,[data-sonner-toast],[data-sonner-toast]>*{transition:none!important;animation:none!important}}.sonner-loader{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);transform-origin:center;transition:opacity .2s,transform .2s}.sonner-loader[data-visible=false]{opacity:0;transform:scale(.8) translate(-50%,-50%)}");t.s(["toast",()=>n])},351049,t=>{"use strict";var e,a,r=((e={}).TEXT="TEXT",e.RICH_TEXT="RICH_TEXT",e.IMAGE="IMAGE",e.VIDEO="VIDEO",e.CAROUSEL="CAROUSEL",e.HERO="HERO",e.BUTTON="BUTTON",e.DIVIDER="DIVIDER",e.SPACER="SPACER",e.TEAM="TEAM",e.STATS="STATS",e.CONTACT_INFO="CONTACT_INFO",e.GALLERY="GALLERY",e.CARD="CARD",e.TESTIMONIAL="TESTIMONIAL",e.FAQ="FAQ",e.CONTACT_FORM="CONTACT_FORM",e.COMPLETED_TASKS="COMPLETED_TASKS",e.SEARCH="SEARCH",e.BOOKMARK="BOOKMARK",e.CONTAINER="CONTAINER",e.SECTION="SECTION",e.GRID="GRID",e.FLEX_ROW="FLEX_ROW",e.FLEX_COLUMN="FLEX_COLUMN",e.COLUMN="COLUMN",e.ROW="ROW",e.DYNAMIC="DYNAMIC",e.PRODUCT_LIST="PRODUCT_LIST",e.PRODUCT_DETAIL="PRODUCT_DETAIL",e.PRODUCT_CAROUSEL="PRODUCT_CAROUSEL",e),o=((a={}).DRAFT="DRAFT",a.PUBLISHED="PUBLISHED",a.ARCHIVED="ARCHIVED",a);t.s(["BlockType",()=>r,"PageStatus",()=>o])},390517,206667,752860,51736,t=>{"use strict";var e=t.i(984804);let a=e.gql`
  fragment PageFields on Page {
    id
    title
    slug
    content
    status
    isHomepage
    isDynamic
    dynamicConfig
    seoTitle
    seoDescription
    seoKeywords
    createdAt
    updatedAt
  }
`,r=e.gql`
  fragment PageBlockFields on PageBlock {
    id
    type
    content
    style
    config
    order
    parentId
    depth
    isVisible
    children {
      id
      type
      content
      style
      config
      order
      parentId
      depth
      isVisible
      children {
        id
        type
        content
        style
        config
        order
        parentId
        depth
        isVisible
        children {
          id
          type
          content
          style
          config
          order
          parentId
          depth
          isVisible
        }
      }
    }
  }
`,o=e.gql`
  ${a}
  query GetPages($pagination: PaginationInput, $filters: PageFiltersInput) {
    getPages(pagination: $pagination, filters: $filters) {
      items {
        ...PageFields
        blocks {
          id
          type
          order
        }
      }
      pagination {
        currentPage
        totalPages
        totalItems
        hasNextPage
        hasPreviousPage
      }
    }
  }
`,s=e.gql`
  ${a}
  ${r}
  query GetPageById($id: String!) {
    getPageById(id: $id) {
      ...PageFields
      blocks {
        ...PageBlockFields
      }
    }
  }
`,n=e.gql`
  ${a}
  ${r}
  query GetPageBySlug($slug: String!) {
    getPageBySlug(slug: $slug) {
      ...PageFields
      blocks {
        ...PageBlockFields
      }
    }
  }
`,i=e.gql`
  ${a}
  ${r}
  query GetHomepage {
    getHomepage {
      ...PageFields
      isHomepage
      blocks {
        ...PageBlockFields
      }
    }
  }
`,l=e.gql`
  ${a}
  mutation CreatePage($input: CreatePageInput!) {
    createPage(input: $input) {
      ...PageFields
    }
  }
`,d=e.gql`
  ${a}
  mutation UpdatePage($id: String!, $input: UpdatePageInput!) {
    updatePage(id: $id, input: $input) {
      ...PageFields
    }
  }
`,c=e.gql`
  ${a}
  mutation DeletePage($id: String!) {
    deletePage(id: $id) {
      ...PageFields
    }
  }
`,u=e.gql`
  fragment PageBlockFields on PageBlock {
    id
    type
    content
    style
    config
    order
    parentId
    depth
    isVisible
    children {
      id
      type
      content
      style
      config
      order
      parentId
      depth
      isVisible
      children {
        id
        type
        content
        style
        config
        order
        parentId
        depth
        isVisible
        children {
          id
          type
          content
          style
          config
          order
          parentId
          depth
          isVisible
        }
      }
    }
  }
  mutation AddPageBlock($pageId: String!, $input: CreatePageBlockInput!) {
    addPageBlock(pageId: $pageId, input: $input) {
      ...PageBlockFields
    }
  }
`,p=e.gql`
  fragment PageBlockFields on PageBlock {
    id
    type
    content
    style
    config
    order
    parentId
    depth
    isVisible
    children {
      id
      type
      content
      style
      config
      order
      parentId
      depth
      isVisible
      children {
        id
        type
        content
        style
        config
        order
        parentId
        depth
        isVisible
        children {
          id
          type
          content
          style
          config
          order
          parentId
          depth
          isVisible
        }
      }
    }
  }
  mutation UpdatePageBlock($id: String!, $input: UpdatePageBlockInput!) {
    updatePageBlock(id: $id, input: $input) {
      ...PageBlockFields
    }
  }
`,h=e.gql`
  fragment PageBlockFields on PageBlock {
    id
    type
    content
    style
    config
    order
    parentId
    depth
    isVisible
    children {
      id
      type
      content
      style
      config
      order
      parentId
      depth
      isVisible
      children {
        id
        type
        content
        style
        config
        order
        parentId
        depth
        isVisible
        children {
          id
          type
          content
          style
          config
          order
          parentId
          depth
          isVisible
        }
      }
    }
  }
  mutation DeletePageBlock($id: String!) {
    deletePageBlock(id: $id) {
      ...PageBlockFields
    }
  }
`,g=e.gql`
  fragment PageBlockFields on PageBlock {
    id
    type
    content
    style
    config
    order
    parentId
    depth
    isVisible
    children {
      id
      type
      content
      style
      config
      order
      parentId
      depth
      isVisible
      children {
        id
        type
        content
        style
        config
        order
        parentId
        depth
        isVisible
        children {
          id
          type
          content
          style
          config
          order
          parentId
          depth
          isVisible
        }
      }
    }
  }
  mutation UpdatePageBlocksOrder($pageId: String!, $updates: [BulkUpdateBlockOrderInput!]!) {
    updatePageBlocksOrder(pageId: $pageId, updates: $updates) {
      ...PageBlockFields
    }
  }
`;t.s(["ADD_PAGE_BLOCK",0,u,"CREATE_PAGE",0,l,"DELETE_PAGE",0,c,"DELETE_PAGE_BLOCK",0,h,"GET_HOMEPAGE",0,i,"GET_PAGES",0,o,"GET_PAGE_BY_ID",0,s,"GET_PAGE_BY_SLUG",0,n,"UPDATE_PAGE",0,d,"UPDATE_PAGE_BLOCK",0,p,"UPDATE_PAGE_BLOCKS_ORDER",0,g],390517),t.i(308140);var f=t.i(44990),m=t.i(403055),y=t.i(351049),b=t.i(950988),k=t.i(429105),v=t.i(835819);let x=t=>{let{data:e,loading:a,error:r,refetch:o}=(0,k.useQuery)(s,{variables:{id:t},skip:!t,errorPolicy:"all"});return{page:e?.getPageById,loading:a,error:r,refetch:o}},w=t=>{let[e]=(0,b.useMutation)(u),[a]=(0,b.useMutation)(p),[r]=(0,b.useMutation)(h),[o]=(0,b.useMutation)(g);return{addBlock:async a=>{try{let{data:r}=await e({variables:{pageId:t,input:a},refetchQueries:[{query:s,variables:{id:t}}]});return v.toast.success("Block added successfully!"),r?.addPageBlock}catch(t){throw v.toast.error(t.message||"Failed to add block"),t}},updateBlock:async(e,r)=>{try{let{data:o}=await a({variables:{id:e,input:r},refetchQueries:[{query:s,variables:{id:t}}]});return void 0!==r.content&&v.toast.success("Block updated successfully!"),o?.updatePageBlock}catch(t){throw v.toast.error(t.message||"Failed to update block"),t}},deleteBlock:async e=>{try{await r({variables:{id:e},refetchQueries:[{query:s,variables:{id:t}}]}),v.toast.success("Block deleted successfully!")}catch(t){throw v.toast.error(t.message||"Failed to delete block"),t}},updateBlocksOrder:async e=>{try{await o({variables:{pageId:t,updates:e},refetchQueries:[{query:s,variables:{id:t}}]})}catch(t){throw v.toast.error(t.message||"Failed to reorder blocks"),t}}}};t.s(["useBlockOperations",0,w,"useNestedBlockOperations",0,t=>{let{addBlock:e,updateBlock:a,deleteBlock:r}=w(t),{page:o,refetch:s}=x(t),n=()=>{var t;let e,a;return o?.blocks?(t=o.blocks,e=[],a=t=>{e.push(t),t.children&&t.children.length>0&&t.children.forEach(t=>a(t))},t.forEach(a),e):[]},i=async(t,a,r={},o={})=>{let i=n(),l=i.find(e=>e.id===t);if(!l)throw Error("Parent block not found");if(!u(l.type))throw v.toast.error("This block type cannot contain child blocks"),Error("Parent block is not a container");let d=l.depth||0;if(d>=4)throw v.toast.error("Maximum nesting depth (5 levels) reached"),Error("Maximum depth of 5 exceeded");if(i.filter(e=>e.parentId===t).length>=20)throw v.toast.error("Maximum 20 blocks per container"),Error("Maximum children limit (20) exceeded");if(i.length>=100)throw v.toast.error("Maximum 100 blocks per page"),Error("Maximum blocks limit (100) exceeded");try{let n=await e({type:a,content:r||{},style:o||{},parentId:t,depth:d+1,isVisible:!0});return await s(),n}catch(t){throw t}},l=async(t,e,r)=>{let o=n(),i=o.find(e=>e.id===t);if(!i)throw Error("Block not found");let l=0;if(e){let a=o.find(t=>t.id===e);if(!a)throw Error("New parent block not found");if(!u(a.type))throw v.toast.error("Target block cannot contain child blocks"),Error("New parent is not a container");if((l=(a.depth||0)+1)+c(t).reduce((t,e)=>Math.max(t,(e.depth||0)-(i.depth||0)),0)>=5)throw v.toast.error("Moving this block would exceed maximum depth (5 levels)"),Error("Move would exceed maximum depth");if(o.filter(a=>a.parentId===e&&a.id!==t).length>=20)throw v.toast.error("Target container has reached maximum 20 blocks"),Error("Target container is full")}let d=r;void 0===d&&(d=o.filter(a=>a.parentId===e&&a.id!==t).length);let p={parentId:e,depth:l,order:d};try{await a(t,p);let e=c(t),r=l-(i.depth||0);if(0!==r&&e.length>0)for(let t of e)await a(t.id,{depth:(t.depth||0)+r});await s()}catch(t){throw t}},d=t=>n().filter(e=>e.parentId===t).sort((t,e)=>t.order-e.order),c=t=>{let e=[],a=n(),r=t=>{for(let o of a.filter(e=>e.parentId===t))e.push(o),r(o.id)};return r(t),e},u=t=>["CONTAINER","SECTION","GRID","FLEX_ROW","FLEX_COLUMN"].includes(t),p=async t=>{let a=n(),r=a.find(e=>e.id===t);if(!r)throw Error("Block not found");let o=a.filter(t=>t.parentId===r.parentId).length,i={type:r.type,content:JSON.parse(JSON.stringify(r.content)),style:JSON.parse(JSON.stringify(r.style||{})),parentId:r.parentId,depth:r.depth||0,order:o,isVisible:r.isVisible,config:r.config?JSON.parse(JSON.stringify(r.config)):void 0};try{let a=await e(i),r=d(t);if(r.length>0&&a?.id)for(let t of r)await h(t,a.id);return await s(),a}catch(t){throw t}},h=async(t,a)=>{let r=n(),o=r.find(t=>t.id===a),s=r.filter(t=>t.parentId===a),i={type:t.type,content:JSON.parse(JSON.stringify(t.content)),style:JSON.parse(JSON.stringify(t.style||{})),parentId:a,depth:(o?.depth||0)+1,order:s.length,isVisible:t.isVisible,config:t.config?JSON.parse(JSON.stringify(t.config)):void 0},l=await e(i),c=d(t.id);if(c.length>0&&l?.id)for(let t of c)await h(t,l.id);return l};return{addBlock:e,updateBlock:a,deleteBlock:r,addChildBlock:i,moveBlockToContainer:l,duplicateBlock:p,getAllBlocks:n,getBlockTree:()=>{var t;let e,a,r;return o?.blocks?(t=o.blocks,e=new Map,a=[],t.forEach(t=>{e.set(t.id,{...t,children:[]})}),t.forEach(t=>{let r=e.get(t.id);if(t.parentId){let a=e.get(t.parentId);a&&a.children.push(r)}else a.push(r)}),r=t=>{t.children&&t.children.length>0&&(t.children.sort((t,e)=>t.order-e.order),t.children.forEach(t=>r(t)))},a.forEach(r),a.sort((t,e)=>t.order-e.order),a):[]},getBlockChildren:d,getBlockParent:t=>{let e=n(),a=e.find(e=>e.id===t);return a?.parentId&&e.find(t=>t.id===a.parentId)||null},getBlockAncestors:t=>{let e=[],a=n().find(e=>e.id===t);for(;a?.parentId;){let t=n().find(t=>t.id===a.parentId);if(t)e.push(t),a=t;else break}return e},getBlockDescendants:c,isContainerBlock:u,page:o,refetch:s}},"usePage",0,x,"usePageOperations",0,()=>{let[t]=(0,b.useMutation)(l),[e]=(0,b.useMutation)(d),[a]=(0,b.useMutation)(c);return{createPage:async e=>{try{console.log("Creating new page:",e);let{data:a}=await t({variables:{input:e},refetchQueries:[o]});return v.toast.success("Page created successfully!"),a?.createPage}catch(t){throw v.toast.error(t.message||"Failed to create page"),t}},updatePage:async(t,a)=>{try{let{data:r}=await e({variables:{id:t,input:a},refetchQueries:[o]});return v.toast.success("Page updated successfully!"),r?.updatePage}catch(t){throw v.toast.error(t.message||"Failed to update page"),t}},deletePage:async t=>{try{await a({variables:{id:t},refetchQueries:[o]}),v.toast.success("Page deleted successfully!")}catch(t){throw v.toast.error(t.message||"Failed to delete page"),t}}}},"usePages",0,(t,e,a)=>{let{data:r,loading:s,error:n,refetch:i}=(0,k.useQuery)(o,{variables:{pagination:t,filters:e},errorPolicy:"all",skip:a?.skip||!1});return{pages:r?.getPages,loading:s,error:n,refetch:i}}],206667);let T=(0,m.createContext)(void 0);function P({children:t,pageId:e}){let a=!e,[r,o]=(0,m.useState)(a),[s,n]=(0,m.useState)(a?{id:"",title:"Untitled Page",slug:"untitled-page",content:{},status:y.PageStatus.DRAFT,blocks:[],seoTitle:"",seoDescription:"",seoKeywords:[],createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()}:null),[i,l]=(0,m.useState)([]),[d,c]=(0,m.useState)(null),[u,p]=(0,m.useState)(null),{page:h,loading:g,refetch:b}=x(e||""),k=(0,m.useCallback)(t=>{n(t)},[]),v=(0,m.useCallback)(t=>{l(t)},[]),w=(0,m.useCallback)(t=>{c(t)},[]),P=(0,m.useCallback)(t=>{p(t)},[]);(0,m.useEffect)(()=>{e?(o(!1),b()):o(!0)},[e,b]),(0,m.useEffect)(()=>{h&&!r&&n(h)},[h,r]),(0,m.useEffect)(()=>{h?.blocks&&l(h.blocks)},[h?.blocks]);let E=(0,m.useMemo)(()=>{if(!d)return null;let t=e=>{for(let a of e){if(a.id===d)return a;if(a.children){let e=t(a.children);if(e)return e}}return null};return t(i)},[d,i]);return(0,f.jsx)(T.Provider,{value:{page:h||null,editingPage:s,isNewPageMode:r,loading:g,blocks:i,selectedBlockId:d,selectedBlock:E,draggedBlock:u,setEditingPage:k,setBlocks:v,setSelectedBlockId:w,setDraggedBlock:P,refetch:b},children:t})}function E(){let t=(0,m.useContext)(T);if(void 0===t)throw Error("usePageState must be used within a PageStateProvider. Make sure your component is wrapped with <PageBuilderProvider>");return t}t.s(["PageStateContext",()=>T,"PageStateProvider",()=>P,"usePageState",()=>E],752860);var B=m,I=t.i(198513);class A extends B.Component{constructor(t){super(t),this.state={hasError:!1,error:null}}static getDerivedStateFromError(t){return{hasError:!0,error:t}}componentDidCatch(t,e){this.props.onError&&this.props.onError(t,e)}handleReset=()=>{this.setState({hasError:!1,error:null})};render(){return this.state.hasError?(0,f.jsx)("div",{className:"p-3 bg-orange-50 border border-orange-200 rounded",children:(0,f.jsxs)("div",{className:"flex gap-2 items-start",children:[(0,f.jsx)(I.AlertCircle,{className:"h-4 w-4 text-orange-600 flex-shrink-0 mt-0.5"}),(0,f.jsxs)("div",{className:"flex-1 min-w-0",children:[(0,f.jsxs)("p",{className:"font-medium text-orange-900 text-sm",children:["Block Render Error",this.props.blockId&&` (${this.props.blockId})`]}),(0,f.jsx)("p",{className:"text-xs text-orange-800 mt-0.5",children:this.state.error?.message||"Failed to render this block"}),!1,(0,f.jsx)("button",{onClick:this.handleReset,className:"mt-2 text-xs px-2 py-1 bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors",children:"Retry"})]})]})}):this.props.children}}let C=(0,m.lazy)(()=>t.A(279623).then(t=>({default:t.TextBlock}))),O=(0,m.lazy)(()=>t.A(670122).then(t=>({default:t.default}))),S=(0,m.lazy)(()=>t.A(344140).then(t=>({default:t.ImageBlock}))),j=(0,m.lazy)(()=>t.A(811023).then(t=>({default:t.HeroBlock}))),N=(0,m.lazy)(()=>t.A(848296).then(t=>({default:t.ButtonBlock}))),R=(0,m.lazy)(()=>t.A(869759).then(t=>({default:t.DividerBlock}))),D=(0,m.lazy)(()=>t.A(703269).then(t=>({default:t.SpacerBlock}))),_=(0,m.lazy)(()=>t.A(811972).then(t=>({default:t.TeamBlock}))),F=(0,m.lazy)(()=>t.A(802114).then(t=>({default:t.StatsBlock}))),L=(0,m.lazy)(()=>t.A(728073).then(t=>({default:t.ContactInfoBlock}))),U=(0,m.lazy)(()=>t.A(892873).then(t=>({default:t.ContainerBlock}))),$=(0,m.lazy)(()=>t.A(264593).then(t=>({default:t.SectionBlock}))),M=(0,m.lazy)(()=>t.A(116415).then(t=>({default:t.GridBlock}))),V=(0,m.lazy)(()=>t.A(368653).then(t=>({default:t.FlexBlock}))),z=(0,m.lazy)(()=>t.A(876265).then(t=>({default:t.DynamicBlock}))),G=(0,m.lazy)(()=>t.A(810411).then(t=>({default:t.CarouselBlock}))),Y=(0,m.lazy)(()=>t.A(902694).then(t=>({default:t.ProductListBlock}))),H=(0,m.lazy)(()=>t.A(829868).then(t=>({default:t.ProductDetailBlock}))),X=(0,m.lazy)(()=>t.A(160548).then(t=>({default:t.ProductCarouselBlock}))),q=(0,m.lazy)(()=>t.A(248187).then(t=>({default:t.VideoBlock}))),K=(0,m.lazy)(()=>t.A(84347).then(t=>({default:t.SearchBlock}))),Q=(0,m.lazy)(()=>t.A(516420).then(t=>({default:t.BookmarkBlock}))),J={[y.BlockType.TEXT]:C,[y.BlockType.RICH_TEXT]:O,[y.BlockType.IMAGE]:S,[y.BlockType.VIDEO]:q,[y.BlockType.CAROUSEL]:G,[y.BlockType.HERO]:j,[y.BlockType.BUTTON]:N,[y.BlockType.DIVIDER]:R,[y.BlockType.SPACER]:D,[y.BlockType.TEAM]:_,[y.BlockType.STATS]:F,[y.BlockType.CONTACT_INFO]:L,[y.BlockType.GALLERY]:S,[y.BlockType.CARD]:C,[y.BlockType.TESTIMONIAL]:C,[y.BlockType.FAQ]:C,[y.BlockType.CONTACT_FORM]:C,[y.BlockType.COMPLETED_TASKS]:C,[y.BlockType.SEARCH]:K,[y.BlockType.BOOKMARK]:Q,[y.BlockType.CONTAINER]:U,[y.BlockType.SECTION]:$,[y.BlockType.GRID]:M,[y.BlockType.FLEX_ROW]:V,[y.BlockType.FLEX_COLUMN]:V,[y.BlockType.COLUMN]:V,[y.BlockType.ROW]:V,[y.BlockType.DYNAMIC]:z,[y.BlockType.PRODUCT_LIST]:Y,[y.BlockType.PRODUCT_DETAIL]:H,[y.BlockType.PRODUCT_CAROUSEL]:X},W=({height:t="200px"})=>(0,f.jsx)("div",{className:"animate-pulse bg-gray-200 rounded",style:{height:t}}),Z=({blockType:t,blockId:e,props:a,skeletonHeight:r="200px"})=>{let o=t&&J["string"==typeof t?t.toUpperCase():t]||null;return o?(0,f.jsx)(A,{blockId:e,children:(0,f.jsx)(m.Suspense,{fallback:(0,f.jsx)(W,{height:r}),children:(0,f.jsx)(o,{...a})})}):(console.error(`[BlockLoader] Unknown block type: ${t} (type: ${typeof t}, blockId: ${e})`),(0,f.jsxs)("div",{className:"p-4 border border-red-300 bg-red-50 text-red-600 rounded",children:["Unknown block type: ",t]}))},tt=({block:t,isEditing:e=!0,onUpdate:a,onDelete:r,onAddChild:o,onUpdateChild:s,onDeleteChild:n,onSelect:i,depth:l=0})=>{let d,c=(0,m.useContext)(T),u=(c?.selectedBlockId??null)===t.id,p={block:t,isEditable:e,onUpdate:(t,e)=>a(t,e),onDelete:r},h=[y.BlockType.CONTAINER,y.BlockType.SECTION,y.BlockType.GRID,y.BlockType.FLEX_ROW,y.BlockType.FLEX_COLUMN].includes(t.type),g={...p,onAddChild:h?()=>{console.log(`[BlockRenderer ${t.id}] onAddChild wrapper called, isContainerBlock=${h}, onAddChild=${!!o}`),o?.(t.id)}:void 0,children:h?(()=>{if(t.children&&0!==t.children.length)return t.type===y.BlockType.GRID?[...t.children].sort((t,e)=>t.order-e.order).map(t=>(0,f.jsx)("div",{className:"grid-item",children:(0,f.jsx)(tt,{block:t,isEditing:e,onUpdate:(e,a)=>s?.(t.id,e,a),onDelete:()=>n?.(t.id),onAddChild:o,onUpdateChild:s,onDeleteChild:n,onSelect:i,depth:l+1})},t.id)):(0,f.jsxs)("div",{className:"nested-blocks-container border-l-4 border-blue-200 ml-4 pl-4 mt-2 space-y-2",children:[(0,f.jsxs)("div",{className:"text-xs text-blue-600 font-semibold mb-2 flex items-center gap-1",children:["📦 Nested Blocks (",t.children.length,")"]}),[...t.children].sort((t,e)=>t.order-e.order).map(t=>(0,f.jsx)("div",{className:"nested-block-item bg-blue-50/30 rounded-lg p-2 border border-blue-100",children:(0,f.jsx)(tt,{block:t,isEditing:e,onUpdate:(e,a)=>s?.(t.id,e,a),onDelete:()=>n?.(t.id),onAddChild:o,onUpdateChild:s,onDeleteChild:n,onSelect:i,depth:l+1})},t.id))]})})():void 0};h&&console.log(`[BlockRenderer] Rendering container block ${t.id}:`,{isContainerBlock:h,onAddChildDefined:!!g.onAddChild,blockType:t.type}),(0,m.useEffect)(()=>{},[t.id,h,t.children,o,s,n,l,t.type]);let b=(d=[y.BlockType.CONTAINER,y.BlockType.SECTION,y.BlockType.GRID,y.BlockType.FLEX_ROW,y.BlockType.FLEX_COLUMN].includes(t.type)?g:p,(0,f.jsx)(Z,{blockType:t.type,blockId:t.id,props:d,skeletonHeight:"200px"}));return e&&i?(0,f.jsx)("div",{onClick:a=>{e&&i&&(a.stopPropagation(),i(t.id))},className:`
          w-full cursor-pointer transition-all 
          ${u?"ring-2 ring-blue-500 ring-opacity-100 shadow-lg":"hover:ring-2 hover:ring-blue-400 hover:ring-opacity-50"}
        `,role:"button",tabIndex:0,onKeyDown:e=>{("Enter"===e.key||" "===e.key)&&(e.preventDefault(),i(t.id))},children:b}):b};t.s(["BlockRenderer",0,tt],51736)},6712,(t,e,a)=>{"use strict";function r(){return null}Object.defineProperty(a,"__esModule",{value:!0}),Object.defineProperty(a,"default",{enumerable:!0,get:function(){return r}}),("function"==typeof a.default||"object"==typeof a.default&&null!==a.default)&&void 0===a.default.__esModule&&(Object.defineProperty(a.default,"__esModule",{value:!0}),Object.assign(a.default,a),e.exports=a.default)},170122,t=>{"use strict";var e=t.i(44990),a=t.i(429105),r=t.i(390517),o=t.i(51736),s=t.i(351049),n=t.i(130775),i=t.i(6712),l=t.i(403055);function d({params:t}){let[d,c]=(0,l.useState)(null),[u,p]=(0,l.useState)(null);(0,l.useEffect)(()=>{(async()=>{try{let e=await t;if(console.log("Rendering page for slug:",e),e&&e.slug){if(["baiviet","sanpham","website"].includes(e.slug)){console.warn(`Route "${e.slug}" is reserved and should use specific handler`),p(`Route "/${e.slug}" kh\xf4ng được xử l\xfd bởi dynamic page handler`),c("");return}c(e.slug)}else console.error("No slug found in params:",e),c("")}catch(t){console.error("Error resolving params:",t),p("Lỗi khi xử lý tham số route"),c("")}})()},[t]);let{data:h,loading:g,error:f}=(0,a.useQuery)(r.GET_PAGE_BY_SLUG,{variables:{slug:d||""},skip:null===d,errorPolicy:"all"});if(null===d||g)return(0,e.jsx)("div",{className:"min-h-screen flex items-center justify-center",children:(0,e.jsx)("div",{className:"animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"})});if(f||!h?.getPageBySlug||""===d)return(0,n.notFound)();let m=h.getPageBySlug;if(console.log("Fetched page data:",m),m.status!==s.PageStatus.PUBLISHED)return(0,n.notFound)();let y=m.seoTitle||m.title,b=m.seoDescription||m.content,k=m.seoKeywords?.join(", ");return m.layoutSettings,(0,e.jsxs)(e.Fragment,{children:[(0,e.jsxs)(i.default,{children:[(0,e.jsx)("title",{children:y}),b&&(0,e.jsx)("meta",{name:"description",content:b}),k&&(0,e.jsx)("meta",{name:"keywords",content:k}),(0,e.jsx)("meta",{property:"og:title",content:y}),b&&(0,e.jsx)("meta",{property:"og:description",content:b}),(0,e.jsx)("meta",{property:"og:type",content:"website"}),(0,e.jsx)("meta",{property:"og:url",content:`http://116.118.49.243:12000/${m.slug}`}),(0,e.jsx)("meta",{name:"twitter:card",content:"summary_large_image"}),(0,e.jsx)("meta",{name:"twitter:title",content:y}),b&&(0,e.jsx)("meta",{name:"twitter:description",content:b}),(0,e.jsx)("meta",{name:"robots",content:"index, follow"}),(0,e.jsx)("link",{rel:"canonical",href:`http://116.118.49.243:12000/${m.slug}`})]}),(0,e.jsx)(e.Fragment,{children:(0,e.jsx)("main",{className:"w-full",children:m.blocks&&m.blocks.length>0?(0,e.jsx)("div",{children:[...m.blocks].sort((t,e)=>(t.order||0)-(e.order||0)).map(t=>(0,e.jsx)("div",{className:"w-full",children:(0,e.jsx)(o.BlockRenderer,{block:t,isEditing:!1,onUpdate:()=>{},onDelete:()=>{}})},t.id))}):(0,e.jsx)("div",{className:"min-h-screen flex items-center justify-center",children:(0,e.jsxs)("div",{className:"text-center py-12",children:[(0,e.jsx)("h2",{className:"text-2xl font-semibold text-gray-900 mb-4",children:"Page Content Coming Soon"}),(0,e.jsx)("p",{className:"text-gray-600",children:"This page is currently being built. Please check back later."})]})})})})]})}t.s(["default",()=>d])},279623,t=>{t.v(e=>Promise.all(["static/chunks/5c4a264e23ccca26.js","static/chunks/cc50b4dea4b294aa.js"].map(e=>t.l(e))).then(()=>e(295944)))},670122,t=>{t.v(e=>Promise.all(["static/chunks/9c30b07df7fb3c83.js"].map(e=>t.l(e))).then(()=>e(724756)))},344140,t=>{t.v(e=>Promise.all(["static/chunks/0df6dc4a95d08801.js","static/chunks/f740926d364ae5fe.js","static/chunks/bb7ee1d89d8de24b.js"].map(e=>t.l(e))).then(()=>e(297562)))},811023,t=>{t.v(e=>Promise.all(["static/chunks/d75ee9590e07ba45.js"].map(e=>t.l(e))).then(()=>e(845934)))},848296,t=>{t.v(e=>Promise.all(["static/chunks/a76932b1cee6552e.js"].map(e=>t.l(e))).then(()=>e(308520)))},869759,t=>{t.v(e=>Promise.all(["static/chunks/2051a7f5af872173.js"].map(e=>t.l(e))).then(()=>e(969991)))},703269,t=>{t.v(e=>Promise.all(["static/chunks/bd604c9be6c98034.js"].map(e=>t.l(e))).then(()=>e(298998)))},811972,t=>{t.v(e=>Promise.all(["static/chunks/b7fa19037bb7808f.js"].map(e=>t.l(e))).then(()=>e(525451)))},802114,t=>{t.v(e=>Promise.all(["static/chunks/a860898f7cd77973.js"].map(e=>t.l(e))).then(()=>e(278706)))},728073,t=>{t.v(e=>Promise.all(["static/chunks/55fbf6e980b60eb2.js"].map(e=>t.l(e))).then(()=>e(659938)))},892873,t=>{t.v(e=>Promise.all(["static/chunks/a6bde1ab96bd1295.js","static/chunks/6834b1fdcdc275f6.js","static/chunks/a7134c13576538b7.js"].map(e=>t.l(e))).then(()=>e(230588)))},264593,t=>{t.v(e=>Promise.all(["static/chunks/c9c49573ca7b77f1.js","static/chunks/a7134c13576538b7.js"].map(e=>t.l(e))).then(()=>e(129155)))},116415,t=>{t.v(e=>Promise.all(["static/chunks/d829083a0bb4c969.js"].map(e=>t.l(e))).then(()=>e(761121)))},368653,t=>{t.v(e=>Promise.all(["static/chunks/a00cf2b250d02345.js","static/chunks/6834b1fdcdc275f6.js","static/chunks/a7134c13576538b7.js"].map(e=>t.l(e))).then(()=>e(491352)))},876265,t=>{t.v(e=>Promise.all(["static/chunks/2d6d4e71124c04ae.js","static/chunks/e7b1ff91b2909b3b.js","static/chunks/cd918748a6722f3f.js"].map(e=>t.l(e))).then(()=>e(56419)))},810411,t=>{t.v(e=>Promise.all(["static/chunks/16a843148fdd374c.js","static/chunks/cd918748a6722f3f.js","static/chunks/3f6b8c1d209c0ff3.js"].map(e=>t.l(e))).then(()=>e(471622)))},902694,t=>{t.v(e=>Promise.all(["static/chunks/27d298d084ea567d.js"].map(e=>t.l(e))).then(()=>e(464737)))},829868,t=>{t.v(e=>Promise.all(["static/chunks/50911135c78ccec9.js"].map(e=>t.l(e))).then(()=>e(879296)))},160548,t=>{t.v(e=>Promise.all(["static/chunks/cd918748a6722f3f.js","static/chunks/46d855cad72e100a.js"].map(e=>t.l(e))).then(()=>e(164925)))},248187,t=>{t.v(e=>Promise.all(["static/chunks/13c9c590f27302e1.js"].map(e=>t.l(e))).then(()=>e(129903)))},84347,t=>{t.v(e=>Promise.all(["static/chunks/cbd5d202307c9d12.js"].map(e=>t.l(e))).then(()=>e(160116)))},516420,t=>{t.v(e=>Promise.all(["static/chunks/d5cd4ec562fa6ab9.js"].map(e=>t.l(e))).then(()=>e(826896)))}]);