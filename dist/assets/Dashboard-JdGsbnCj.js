import{n as e,r as t,t as n}from"./focustrap-CrFuOi1i.js";import{n as r,t as i}from"./auth-C_H5QpjX.js";import{t as a}from"./avatar-mLrx5TZv.js";import{At as o,Ct as s,Dt as c,K as l,Ot as u,Pt as d,St as f,V as p,_ as m,_t as h,bt as g,ct as _,d as v,dt as y,ft as b,gt as x,h as S,ht as C,jt as w,kt as T,lt as E,m as D,nt as O,rt as k,st as A,t as j,ut as M,v as N,vt as P,wt as F,xt as I,yt as L}from"./index-BzTmVoS4.js";var R=S.extend({name:`drawer`,style:`
    .p-drawer {
        display: flex;
        flex-direction: column;
        transform: translate3d(0px, 0px, 0px);
        position: relative;
        transition: transform 0.3s;
        background: dt('drawer.background');
        color: dt('drawer.color');
        border: 1px solid dt('drawer.border.color');
        box-shadow: dt('drawer.shadow');
    }

    .p-drawer-content {
        overflow-y: auto;
        flex-grow: 1;
        padding: dt('drawer.content.padding');
    }

    .p-drawer-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-shrink: 0;
        padding: dt('drawer.header.padding');
    }

    .p-drawer-footer {
        padding: dt('drawer.footer.padding');
    }

    .p-drawer-title {
        font-weight: dt('drawer.title.font.weight');
        font-size: dt('drawer.title.font.size');
    }

    .p-drawer-full .p-drawer {
        transition: none;
        transform: none;
        width: 100vw !important;
        height: 100vh !important;
        max-height: 100%;
        top: 0px !important;
        left: 0px !important;
        border-width: 1px;
    }

    .p-drawer-left .p-drawer-enter-from,
    .p-drawer-left .p-drawer-leave-to {
        transform: translateX(-100%);
    }

    .p-drawer-right .p-drawer-enter-from,
    .p-drawer-right .p-drawer-leave-to {
        transform: translateX(100%);
    }

    .p-drawer-top .p-drawer-enter-from,
    .p-drawer-top .p-drawer-leave-to {
        transform: translateY(-100%);
    }

    .p-drawer-bottom .p-drawer-enter-from,
    .p-drawer-bottom .p-drawer-leave-to {
        transform: translateY(100%);
    }

    .p-drawer-full .p-drawer-enter-from,
    .p-drawer-full .p-drawer-leave-to {
        opacity: 0;
    }

    .p-drawer-full .p-drawer-enter-active,
    .p-drawer-full .p-drawer-leave-active {
        transition: opacity 400ms cubic-bezier(0.25, 0.8, 0.25, 1);
    }

    .p-drawer-left .p-drawer {
        width: 20rem;
        height: 100%;
        border-inline-end-width: 1px;
    }

    .p-drawer-right .p-drawer {
        width: 20rem;
        height: 100%;
        border-inline-start-width: 1px;
    }

    .p-drawer-top .p-drawer {
        height: 10rem;
        width: 100%;
        border-block-end-width: 1px;
    }

    .p-drawer-bottom .p-drawer {
        height: 10rem;
        width: 100%;
        border-block-start-width: 1px;
    }

    .p-drawer-left .p-drawer-content,
    .p-drawer-right .p-drawer-content,
    .p-drawer-top .p-drawer-content,
    .p-drawer-bottom .p-drawer-content {
        width: 100%;
        height: 100%;
    }

    .p-drawer-open {
        display: flex;
    }

    .p-drawer-mask:dir(rtl) {
        flex-direction: row-reverse;
    }
`,classes:{mask:function(e){var t=e.instance,n=e.props,r=[`left`,`right`,`top`,`bottom`].find(function(e){return e===n.position});return[`p-drawer-mask`,{"p-overlay-mask p-overlay-mask-enter":n.modal,"p-drawer-open":t.containerVisible,"p-drawer-full":t.fullScreen},r?`p-drawer-${r}`:``]},root:function(e){var t=e.instance;return[`p-drawer p-component`,{"p-drawer-full":t.fullScreen}]},header:`p-drawer-header`,title:`p-drawer-title`,pcCloseButton:`p-drawer-close-button`,content:`p-drawer-content`,footer:`p-drawer-footer`},inlineStyles:{mask:function(e){var t=e.position,n=e.modal;return{position:`fixed`,height:`100%`,width:`100%`,left:0,top:0,display:`flex`,justifyContent:t===`left`?`flex-start`:t===`right`?`flex-end`:`center`,alignItems:t===`top`?`flex-start`:t===`bottom`?`flex-end`:`center`,pointerEvents:n?`auto`:`none`}},root:{pointerEvents:`auto`}}}),z={name:`BaseDrawer`,extends:D,props:{visible:{type:Boolean,default:!1},position:{type:String,default:`left`},header:{type:null,default:null},baseZIndex:{type:Number,default:0},autoZIndex:{type:Boolean,default:!0},dismissable:{type:Boolean,default:!0},showCloseIcon:{type:Boolean,default:!0},closeButtonProps:{type:Object,default:function(){return{severity:`secondary`,text:!0,rounded:!0}}},closeIcon:{type:String,default:void 0},modal:{type:Boolean,default:!0},blockScroll:{type:Boolean,default:!1},closeOnEscape:{type:Boolean,default:!0}},style:R,provide:function(){return{$pcDrawer:this,$parentInstance:this}}};function B(e){"@babel/helpers - typeof";return B=typeof Symbol==`function`&&typeof Symbol.iterator==`symbol`?function(e){return typeof e}:function(e){return e&&typeof Symbol==`function`&&e.constructor===Symbol&&e!==Symbol.prototype?`symbol`:typeof e},B(e)}function V(e,t,n){return(t=H(t))in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function H(e){var t=U(e,`string`);return B(t)==`symbol`?t:t+``}function U(e,t){if(B(e)!=`object`||!e)return e;var n=e[Symbol.toPrimitive];if(n!==void 0){var r=n.call(e,t);if(B(r)!=`object`)return r;throw TypeError(`@@toPrimitive must return a primitive value.`)}return(t===`string`?String:Number)(e)}var W={name:`Drawer`,extends:z,inheritAttrs:!1,emits:[`update:visible`,`show`,`after-show`,`hide`,`after-hide`,`before-hide`],data:function(){return{containerVisible:this.visible}},container:null,mask:null,content:null,headerContainer:null,footerContainer:null,closeButton:null,outsideClickListener:null,documentKeydownListener:null,watch:{dismissable:function(e){e&&!this.modal?this.bindOutsideClickListener():this.unbindOutsideClickListener()}},updated:function(){this.visible&&(this.containerVisible=this.visible)},beforeUnmount:function(){this.disableDocumentSettings(),this.mask&&this.autoZIndex&&N.clear(this.mask),this.container=null,this.mask=null},methods:{hide:function(){this.$emit(`update:visible`,!1)},onEnter:function(){this.$emit(`show`),this.focus(),this.bindDocumentKeyDownListener(),this.autoZIndex&&N.set(`modal`,this.mask,this.baseZIndex||this.$primevue.config.zIndex.modal)},onAfterEnter:function(){this.enableDocumentSettings(),this.$emit(`after-show`)},onBeforeLeave:function(){this.modal&&!this.isUnstyled&&p(this.mask,`p-overlay-mask-leave`),this.$emit(`before-hide`)},onLeave:function(){this.$emit(`hide`)},onAfterLeave:function(){this.autoZIndex&&N.clear(this.mask),this.unbindDocumentKeyDownListener(),this.containerVisible=!1,this.disableDocumentSettings(),this.$emit(`after-hide`)},onMaskClick:function(e){this.dismissable&&this.modal&&this.mask===e.target&&this.hide()},focus:function(){var e=function(e){return e&&e.querySelector(`[autofocus]`)},t=this.$slots.header&&e(this.headerContainer);t||(t=this.$slots.default&&e(this.container),t||(t=this.$slots.footer&&e(this.footerContainer),t||=this.closeButton)),t&&l(t)},enableDocumentSettings:function(){this.dismissable&&!this.modal&&this.bindOutsideClickListener(),this.blockScroll&&e()},disableDocumentSettings:function(){this.unbindOutsideClickListener(),this.blockScroll&&t()},onKeydown:function(e){e.code===`Escape`&&this.closeOnEscape&&this.hide()},containerRef:function(e){this.container=e},maskRef:function(e){this.mask=e},contentRef:function(e){this.content=e},headerContainerRef:function(e){this.headerContainer=e},footerContainerRef:function(e){this.footerContainer=e},closeButtonRef:function(e){this.closeButton=e?e.$el:void 0},bindDocumentKeyDownListener:function(){this.documentKeydownListener||(this.documentKeydownListener=this.onKeydown,document.addEventListener(`keydown`,this.documentKeydownListener))},unbindDocumentKeyDownListener:function(){this.documentKeydownListener&&=(document.removeEventListener(`keydown`,this.documentKeydownListener),null)},bindOutsideClickListener:function(){var e=this;this.outsideClickListener||(this.outsideClickListener=function(t){e.isOutsideClicked(t)&&e.hide()},document.addEventListener(`click`,this.outsideClickListener,!0))},unbindOutsideClickListener:function(){this.outsideClickListener&&=(document.removeEventListener(`click`,this.outsideClickListener,!0),null)},isOutsideClicked:function(e){return this.container&&!this.container.contains(e.target)}},computed:{fullScreen:function(){return this.position===`full`},closeAriaLabel:function(){return this.$primevue.config.locale.aria?this.$primevue.config.locale.aria.close:void 0},dataP:function(){return O(V(V(V({"full-screen":this.position===`full`},this.position,this.position),`open`,this.containerVisible),`modal`,this.modal))}},directives:{focustrap:n},components:{Button:r,Portal:m,TimesIcon:v}},G=[`data-p`],K=[`role`,`aria-modal`,`data-p`];function q(e,t,n,r,i,a){var o=f(`Button`),l=f(`Portal`),p=s(`focustrap`);return L(),M(l,null,{default:c(function(){return[i.containerVisible?(L(),b(`div`,h({key:0,ref:a.maskRef,onMousedown:t[0]||=function(){return a.onMaskClick&&a.onMaskClick.apply(a,arguments)},class:e.cx(`mask`),style:e.sx(`mask`,!0,{position:e.position,modal:e.modal}),"data-p":a.dataP},e.ptm(`mask`)),[C(k,h({name:`p-drawer`,onEnter:a.onEnter,onAfterEnter:a.onAfterEnter,onBeforeLeave:a.onBeforeLeave,onLeave:a.onLeave,onAfterLeave:a.onAfterLeave,appear:``},e.ptm(`transition`)),{default:c(function(){return[e.visible?u((L(),b(`div`,h({key:0,ref:a.containerRef,class:e.cx(`root`),style:e.sx(`root`),role:e.modal?`dialog`:`complementary`,"aria-modal":e.modal?!0:void 0,"data-p":a.dataP},e.ptmi(`root`)),[e.$slots.container?I(e.$slots,`container`,{key:0,closeCallback:a.hide}):(L(),b(A,{key:1},[E(`div`,h({ref:a.headerContainerRef,class:e.cx(`header`)},e.ptm(`header`)),[I(e.$slots,`header`,{class:w(e.cx(`title`))},function(){return[e.header?(L(),b(`div`,h({key:0,class:e.cx(`title`)},e.ptm(`title`)),d(e.header),17)):y(``,!0)]}),e.showCloseIcon?I(e.$slots,`closebutton`,{key:0,closeCallback:a.hide},function(){return[C(o,h({ref:a.closeButtonRef,type:`button`,class:e.cx(`pcCloseButton`),"aria-label":a.closeAriaLabel,unstyled:e.unstyled,onClick:a.hide},e.closeButtonProps,{pt:e.ptm(`pcCloseButton`),"data-pc-group-section":`iconcontainer`}),{icon:c(function(t){return[I(e.$slots,`closeicon`,{},function(){return[(L(),M(F(e.closeIcon?`span`:`TimesIcon`),h({class:[e.closeIcon,t.class]},e.ptm(`pcCloseButton`).icon),null,16,[`class`]))]})]}),_:3},16,[`class`,`aria-label`,`unstyled`,`onClick`,`pt`])]}):y(``,!0)],16),E(`div`,h({ref:a.contentRef,class:e.cx(`content`)},e.ptm(`content`)),[I(e.$slots,`default`)],16),e.$slots.footer?(L(),b(`div`,h({key:0,ref:a.footerContainerRef,class:e.cx(`footer`)},e.ptm(`footer`)),[I(e.$slots,`footer`)],16)):y(``,!0)],64))],16,K)),[[p]]):y(``,!0)]}),_:3},16,[`onEnter`,`onAfterEnter`,`onBeforeLeave`,`onLeave`,`onAfterLeave`])],16,G)):y(``,!0)]}),_:3})}W.render=q;var J={class:`min-h-screen bg-gray-50`},ee={class:`bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40`},Y={class:`flex items-center justify-between px-4 py-3`},X={class:`flex items-center gap-3`},Z={class:`flex items-center gap-3`},Q={class:`hidden sm:block text-right`},$={class:`text-sm font-semibold text-gray-800`},te={class:`text-xs text-gray-500`},ne={class:`flex`},re={class:`flex-1 p-4 space-y-1`},ie=[`onClick`],ae={class:`font-medium`},oe={class:`p-4 border-t border-gray-200`},se={class:`flex items-center gap-3`},ce={class:`font-semibold text-gray-800`},le={class:`text-xs text-gray-500`},ue={class:`space-y-1`},de=[`onClick`],fe={class:`font-medium`},pe={class:`flex-1 p-6`},me={class:`max-w-7xl mx-auto`},he=x({__name:`Dashboard`,setup(e){let t=j(),n=i(),s=T(!1),l=_(()=>n.user);P(()=>{});let u=_(()=>l.value?.facilities?.[0]?.name||``),p=_(()=>l.value?.user_type?.toLowerCase()?.includes(`practitioner`)?[{label:`Referrals`,icon:`pi pi-user`,route:`/dashboard/referrals`}]:l.value?.user_type?.toLowerCase()?.includes(`technician`)?[{label:`Lab dashboard`,icon:`pi pi-home`,route:`/dashboard/labs`}]:[]),m=()=>{n.logout()},h=e=>{t.push(e)},v=()=>{s.value=!s.value};return(e,t)=>{let n=f(`router-view`);return L(),b(`div`,J,[E(`header`,ee,[E(`div`,Y,[E(`div`,X,[C(o(r),{icon:`pi pi-bars`,severity:`secondary`,text:``,onClick:v,class:`md:hidden`}),t[1]||=E(`h1`,{class:`text-xl font-bold text-gray-800`},`Dashboard`,-1)]),E(`div`,Z,[E(`div`,Q,[E(`p`,$,d(l.value?.full_name),1),E(`p`,te,d(u.value),1)]),C(o(a),{label:l.value?.full_name?.charAt(0)||`U`,class:`bg-blue-500 text-white`,shape:`circle`},null,8,[`label`])])])]),E(`div`,ne,[E(`aside`,{class:w([`hidden md:flex md:flex-col bg-white border-r border-gray-200 transition-all duration-300`,s.value?`md:w-64`:`md:w-0 md:overflow-hidden`])},[E(`nav`,re,[(L(!0),b(A,null,g(p.value,e=>(L(),b(`button`,{key:e.label,class:`w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors`,onClick:t=>h(e.route)},[E(`i`,{class:w(e.icon)},null,2),E(`span`,ae,d(e.label),1)],8,ie))),128))]),E(`div`,oe,[C(o(r),{label:`Logout`,icon:`pi pi-sign-out`,severity:`danger`,text:``,class:`w-full`,onClick:m})])],2),C(o(W),{visible:s.value,"onUpdate:visible":t[0]||=e=>s.value=e,class:`md:hidden`},{header:c(()=>[E(`div`,se,[C(o(a),{label:l.value?.full_name?.charAt(0)||`U`,class:`bg-blue-500 text-white`,shape:`circle`},null,8,[`label`]),E(`div`,null,[E(`p`,ce,d(l.value?.full_name),1),E(`p`,le,d(u.value),1)])])]),footer:c(()=>[C(o(r),{label:`Logout`,icon:`pi pi-sign-out`,severity:`danger`,text:``,class:`w-full`,onClick:m})]),default:c(()=>[E(`nav`,ue,[(L(!0),b(A,null,g(p.value,e=>(L(),b(`button`,{key:e.label,class:`w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors`,onClick:t=>h(e.route)},[E(`i`,{class:w(e.icon)},null,2),E(`span`,fe,d(e.label),1)],8,de))),128))])]),_:1},8,[`visible`]),E(`main`,pe,[E(`div`,me,[C(n)])])])])}}});export{he as default};