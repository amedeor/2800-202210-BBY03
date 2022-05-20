/**
 * TinyMCE version 6.0.2 (2022-04-27)
 */
!function(){"use strict";var e=tinymce.util.Tools.resolve("tinymce.PluginManager");const t=e=>t=>(e=>{const t=typeof e;return null===e?"null":"object"===t&&Array.isArray(e)?"array":"object"===t&&(r=a=e,(o=String).prototype.isPrototypeOf(r)||(null===(s=a.constructor)||void 0===s?void 0:s.name)===o.name)?"string":t;var r,a,o,s})(t)===e,r=t("string"),a=t("object"),o=t("array"),s=e=>!(e=>null==e)(e);class i{constructor(e,t){this.tag=e,this.value=t}static some(e){return new i(!0,e)}static none(){return i.singletonNone}fold(e,t){return this.tag?t(this.value):e()}isSome(){return this.tag}isNone(){return!this.tag}map(e){return this.tag?i.some(e(this.value)):i.none()}bind(e){return this.tag?e(this.value):i.none()}exists(e){return this.tag&&e(this.value)}forall(e){return!this.tag||e(this.value)}filter(e){return!this.tag||e(this.value)?this:i.none()}getOr(e){return this.tag?this.value:e}or(e){return this.tag?this:e}getOrThunk(e){return this.tag?this.value:e()}orThunk(e){return this.tag?this:e()}getOrDie(e){if(this.tag)return this.value;throw new Error(null!=e?e:"Called getOrDie on None")}static from(e){return s(e)?i.some(e):i.none()}getOrNull(){return this.tag?this.value:null}getOrUndefined(){return this.value}each(e){this.tag&&e(this.value)}toArray(){return this.tag?[this.value]:[]}toString(){return this.tag?`some(${this.value})`:"none()"}}i.singletonNone=new i(!1);const c=Array.prototype.push,n=(e,t)=>{for(let r=0,a=e.length;r<a;r++)t(e[r],r)},l=e=>{const t=[];for(let r=0,a=e.length;r<a;++r){if(!o(e[r]))throw new Error("Arr.flatten item "+r+" was not an array, input: "+e);c.apply(t,e[r])}return t},m=Object.keys,u=Object.hasOwnProperty,d=(e,t)=>h(e,t)?i.from(e[t]):i.none(),h=(e,t)=>u.call(e,t),p=e=>t=>t.options.get(e),g=p("audio_template_callback"),b=p("video_template_callback"),w=p("media_live_embeds"),y=p("media_filter_html"),f=p("media_url_resolver"),v=p("media_alt_source"),x=p("media_poster"),_=p("media_dimensions");var j=tinymce.util.Tools.resolve("tinymce.util.Tools"),k=tinymce.util.Tools.resolve("tinymce.dom.DOMUtils"),O=tinymce.util.Tools.resolve("tinymce.html.DomParser");const A=k.DOM,S=e=>e.replace(/px$/,""),D=e=>{const t=e.attr("style"),r=t?A.parseStyle(t):{};return{type:"ephox-embed-iri",source:e.attr("data-ephox-embed-iri"),altsource:"",poster:"",width:d(r,"max-width").map(S).getOr(""),height:d(r,"max-height").map(S).getOr("")}},T=(e,t)=>{let r={};for(let a=O({validate:!1,forced_root_block:!1},t).parse(e);a;a=a.walk())if(1===a.type){const e=a.name;if(a.attr("data-ephox-embed-iri")){r=D(a);break}r.source||"param"!==e||(r.source=a.attr("movie")),"iframe"!==e&&"object"!==e&&"embed"!==e&&"video"!==e&&"audio"!==e||(r.type||(r.type=e),r=j.extend(a.attributes.map,r)),"script"===e&&(r={type:"script",source:a.attr("src")}),"source"===e&&(r.source?r.altsource||(r.altsource=a.attr("src")):r.source=a.attr("src")),"img"!==e||r.poster||(r.poster=a.attr("src"))}return r.source=r.source||r.src||r.data,r.altsource=r.altsource||"",r.poster=r.poster||"",r},C=e=>({mp3:"audio/mpeg",m4a:"audio/x-m4a",wav:"audio/wav",mp4:"video/mp4",webm:"video/webm",ogg:"video/ogg",swf:"application/x-shockwave-flash"}[e.toLowerCase().split(".").pop()]||"");var $=tinymce.util.Tools.resolve("tinymce.html.Node"),z=tinymce.util.Tools.resolve("tinymce.html.Serializer");const M=(e,t={})=>O({forced_root_block:!1,validate:!1,allow_conditional_comments:!0,...t},e),F=k.DOM,N=e=>/^[0-9.]+$/.test(e)?e+"px":e,R=(e,t)=>{const r=t.attr("style"),a=r?F.parseStyle(r):{};a["max-width"]=N(e.width),a["max-height"]=N(e.height),t.attr("style",F.serializeStyle(a))},U=["source","altsource"],P=(e,t,r,a)=>{let o=0,s=0;const i=M(a);i.addNodeFilter("source",(e=>o=e.length));const c=i.parse(e);for(let e=c;e;e=e.walk())if(1===e.type){const a=e.name;if(e.attr("data-ephox-embed-iri")){R(t,e);break}switch(a){case"video":case"object":case"embed":case"img":case"iframe":void 0!==t.height&&void 0!==t.width&&(e.attr("width",t.width),e.attr("height",t.height))}if(r)switch(a){case"video":e.attr("poster",t.poster),e.attr("src",null);for(let r=o;r<2;r++)if(t[U[r]]){const a=new $("source",1);a.attr("src",t[U[r]]),a.attr("type",t[U[r]+"mime"]||null),e.append(a)}break;case"iframe":e.attr("src",t.source);break;case"object":const r=e.getAll("img").length>0;if(t.poster&&!r){e.attr("src",t.poster);const r=new $("img",1);r.attr("src",t.poster),r.attr("width",t.width),r.attr("height",t.height),e.append(r)}break;case"source":if(s<2&&(e.attr("src",t[U[s]]),e.attr("type",t[U[s]+"mime"]||null),!t[U[s]])){e.remove();continue}s++;break;case"img":t.poster||e.remove()}}return z({},a).serialize(c)},E=[{regex:/youtu\.be\/([\w\-_\?&=.]+)/i,type:"iframe",w:560,h:314,url:"www.youtube.com/embed/$1",allowFullscreen:!0},{regex:/youtube\.com(.+)v=([^&]+)(&([a-z0-9&=\-_]+))?/i,type:"iframe",w:560,h:314,url:"www.youtube.com/embed/$2?$4",allowFullscreen:!0},{regex:/youtube.com\/embed\/([a-z0-9\?&=\-_]+)/i,type:"iframe",w:560,h:314,url:"www.youtube.com/embed/$1",allowFullscreen:!0},{regex:/vimeo\.com\/([0-9]+)/,type:"iframe",w:425,h:350,url:"player.vimeo.com/video/$1?title=0&byline=0&portrait=0&color=8dc7dc",allowFullscreen:!0},{regex:/vimeo\.com\/(.*)\/([0-9]+)/,type:"iframe",w:425,h:350,url:"player.vimeo.com/video/$2?title=0&amp;byline=0",allowFullscreen:!0},{regex:/maps\.google\.([a-z]{2,3})\/maps\/(.+)msid=(.+)/,type:"iframe",w:425,h:350,url:'maps.google.com/maps/ms?msid=$2&output=embed"',allowFullscreen:!1},{regex:/dailymotion\.com\/video\/([^_]+)/,type:"iframe",w:480,h:270,url:"www.dailymotion.com/embed/video/$1",allowFullscreen:!0},{regex:/dai\.ly\/([^_]+)/,type:"iframe",w:480,h:270,url:"www.dailymotion.com/embed/video/$1",allowFullscreen:!0}],L=(e,t)=>{const r=(e=>{const t=e.match(/^(https?:\/\/|www\.)(.+)$/i);return t&&t.length>1?"www."===t[1]?"https://":t[1]:"https://"})(t),a=e.regex.exec(t);let o=r+e.url;for(let e=0;e<a.length;e++)o=o.replace("$"+e,(()=>a[e]?a[e]:""));return o.replace(/\?$/,"")},I=(e,t)=>{const r=j.extend({},t);if(!r.source&&(j.extend(r,T(r.embed,e.schema)),!r.source))return"";r.altsource||(r.altsource=""),r.poster||(r.poster=""),r.source=e.convertURL(r.source,"source"),r.altsource=e.convertURL(r.altsource,"source"),r.sourcemime=C(r.source),r.altsourcemime=C(r.altsource),r.poster=e.convertURL(r.poster,"poster");const a=(e=>{const t=E.filter((t=>t.regex.test(e)));return t.length>0?j.extend({},t[0],{url:L(t[0],e)}):null})(r.source);if(a&&(r.source=a.url,r.type=a.type,r.allowfullscreen=a.allowFullscreen,r.width=r.width||String(a.w),r.height=r.height||String(a.h)),r.embed)return P(r.embed,r,!0,e.schema);{const t=g(e),a=b(e);return r.width=r.width||"300",r.height=r.height||"150",j.each(r,((t,a)=>{r[a]=e.dom.encode(""+t)})),"iframe"===r.type?(e=>{const t=e.allowfullscreen?' allowFullscreen="1"':"";return'<iframe src="'+e.source+'" width="'+e.width+'" height="'+e.height+'"'+t+"></iframe>"})(r):"application/x-shockwave-flash"===r.sourcemime?(e=>{let t='<object data="'+e.source+'" width="'+e.width+'" height="'+e.height+'" type="application/x-shockwave-flash">';return e.poster&&(t+='<img src="'+e.poster+'" width="'+e.width+'" height="'+e.height+'" />'),t+="</object>",t})(r):-1!==r.sourcemime.indexOf("audio")?((e,t)=>t?t(e):'<audio controls="controls" src="'+e.source+'">'+(e.altsource?'\n<source src="'+e.altsource+'"'+(e.altsourcemime?' type="'+e.altsourcemime+'"':"")+" />\n":"")+"</audio>")(r,t):"script"===r.type?(e=>'<script src="'+e.source+'"><\/script>')(r):((e,t)=>t?t(e):'<video width="'+e.width+'" height="'+e.height+'"'+(e.poster?' poster="'+e.poster+'"':"")+' controls="controls">\n<source src="'+e.source+'"'+(e.sourcemime?' type="'+e.sourcemime+'"':"")+" />\n"+(e.altsource?'<source src="'+e.altsource+'"'+(e.altsourcemime?' type="'+e.altsourcemime+'"':"")+" />\n":"")+"</video>")(r,a)}},B=e=>e.hasAttribute("data-mce-object")||e.hasAttribute("data-ephox-embed-iri"),G={},W=e=>t=>I(e,t),q=(e,t)=>{const r=f(e);return r?((e,t,r)=>new Promise(((a,o)=>{const s=r=>(r.html&&(G[e.source]=r),a({url:e.source,html:r.html?r.html:t(e)}));G[e.source]?s(G[e.source]):r({url:e.source},s,o)})))(t,W(e),r):((e,t)=>Promise.resolve({html:t(e),url:e.source}))(t,W(e))},H=(e,t)=>{const r={};return d(e,"dimensions").each((e=>{n(["width","height"],(a=>{d(t,a).orThunk((()=>d(e,a))).each((e=>r[a]=e))}))})),r},J=(e,t)=>{const r=t?((e,t)=>d(t,e).bind((e=>d(e,"meta"))))(t,e).getOr({}):{},o=((e,t,r)=>o=>{const s=()=>d(e,o),c=()=>d(t,o),n=e=>d(e,"value").bind((e=>e.length>0?i.some(e):i.none()));return{[o]:(o===r?s().bind((e=>a(e)?n(e).orThunk(c):c().orThunk((()=>i.from(e))))):c().orThunk((()=>s().bind((e=>a(e)?n(e):i.from(e)))))).getOr("")}})(e,r,t);return{...o("source"),...o("altsource"),...o("poster"),...o("embed"),...H(e,r)}},K=e=>{const t={...e,source:{value:d(e,"source").getOr("")},altsource:{value:d(e,"altsource").getOr("")},poster:{value:d(e,"poster").getOr("")}};return n(["width","height"],(r=>{d(e,r).each((e=>{const a=t.dimensions||{};a[r]=e,t.dimensions=a}))})),t},Q=e=>t=>{const r=t&&t.msg?"Media embed handler error: "+t.msg:"Media embed handler threw unknown error.";e.notificationManager.open({type:"error",text:r})},V=(e,t)=>a=>{if(r(a.url)&&a.url.trim().length>0){const r=a.html,o={...T(r,t.schema),source:a.url,embed:r};e.setData(K(o))}},X=(e,t)=>{const r=e.dom.select("*[data-mce-object]");e.insertContent(t),((e,t)=>{const r=e.dom.select("*[data-mce-object]");for(let e=0;e<t.length;e++)for(let a=r.length-1;a>=0;a--)t[e]===r[a]&&r.splice(a,1);e.selection.select(r[0])})(e,r),e.nodeChanged()},Y=e=>{const t=(e=>{const t=e.selection.getNode(),r=B(t)?e.serializer.serialize(t,{selection:!0}):"";return{embed:r,...T(r,e.schema)}})(e),r=(e=>{let t=e;return{get:()=>t,set:e=>{t=e}}})(t),a=K(t),o=_(e)?[{type:"sizeinput",name:"dimensions",label:"Constrain proportions",constrain:!0}]:[],s={title:"General",name:"general",items:l([[{name:"source",type:"urlinput",filetype:"media",label:"Source"}],o])},i=[];v(e)&&i.push({name:"altsource",type:"urlinput",filetype:"media",label:"Alternative source URL"}),x(e)&&i.push({name:"poster",type:"urlinput",filetype:"image",label:"Media poster (Image URL)"});const c={title:"Advanced",name:"advanced",items:i},n=[s,{title:"Embed",items:[{type:"textarea",name:"embed",label:"Paste your embed code below:"}]}];i.length>0&&n.push(c);const m={type:"tabpanel",tabs:n},u=e.windowManager.open({title:"Insert/Edit Media",size:"normal",body:m,buttons:[{type:"cancel",name:"cancel",text:"Cancel"},{type:"submit",name:"save",text:"Save",primary:!0}],onSubmit:t=>{const a=J(t.getData());((e,t,r)=>{var a;t.embed=P(t.embed,t,!1,r.schema),t.embed&&(e.source===t.source||(a=t.source,h(G,a)))?X(r,t.embed):q(r,t).then((e=>{X(r,e.html)})).catch(Q(r))})(r.get(),a,e),t.close()},onChange:(t,a)=>{switch(a.name){case"source":((t,r)=>{const a=J(r.getData(),"source");t.source!==a.source&&(V(u,e)({url:a.source,html:""}),q(e,a).then(V(u,e)).catch(Q(e)))})(r.get(),t);break;case"embed":(t=>{const r=J(t.getData()),a=T(r.embed,e.schema);t.setData(K(a))})(t);break;case"dimensions":case"altsource":case"poster":((t,r)=>{const a=J(t.getData(),r),o=I(e,a);t.setData(K({...a,embed:o}))})(t,a.name)}r.set(J(t.getData()))},initialData:a})};var Z=tinymce.util.Tools.resolve("tinymce.Env");const ee=e=>{const t=e.name;return"iframe"===t||"video"===t||"audio"===t},te=(e,t,r,a=null)=>{const o=e.attr(r);return s(o)?o:h(t,r)?null:a},re=(e,t,r)=>{const a="img"===t.name||"video"===e.name,o=a?"300":null,s="audio"===e.name?"30":"150",i=a?s:null;t.attr({width:te(e,r,"width",o),height:te(e,r,"height",i)})},ae=(e,t)=>{const r=t.name,a=new $("img",1);return se(e,t,a),re(t,a,{}),a.attr({style:t.attr("style"),src:Z.transparentSrc,"data-mce-object":r,class:"mce-object mce-object-"+r}),a},oe=(e,t)=>{const r=t.name,a=new $("span",1);a.attr({contentEditable:"false",style:t.attr("style"),"data-mce-object":r,class:"mce-preview-object mce-object-"+r}),se(e,t,a);const o=e.dom.parseStyle(t.attr("style")),i=new $(r,1);if(re(t,i,o),i.attr({src:t.attr("src"),style:t.attr("style"),class:t.attr("class")}),"iframe"===r)i.attr({allowfullscreen:t.attr("allowfullscreen"),frameborder:"0"});else{n(["controls","crossorigin","currentTime","loop","muted","poster","preload"],(e=>{i.attr(e,t.attr(e))}));const o=a.attr("data-mce-html");s(o)&&((e,t,r,a)=>{const o=M(e.schema).parse(a,{context:t});for(;o.firstChild;)r.append(o.firstChild)})(e,r,i,unescape(o))}const c=new $("span",1);return c.attr("class","mce-shim"),a.append(i),a.append(c),a},se=(e,t,r)=>{const a=t.attributes;let o=a.length;for(;o--;){const t=a[o].name;let c=a[o].value;"width"===t||"height"===t||"style"===t||(i="data-mce-",(s=t).length>=i.length&&s.substr(0,0+i.length)===i)||("data"!==t&&"src"!==t||(c=e.convertURL(c,t)),r.attr("data-mce-p-"+t,c))}var s,i;const c=z({inner:!0},e.schema),l=new $("div",1);n(t.children(),(e=>l.append(e)));const m=c.serialize(l);m&&(r.attr("data-mce-html",escape(m)),r.empty())},ie=e=>{const t=e.attr("class");return t&&/\btiny-pageembed\b/.test(t)},ce=e=>{for(;e=e.parent;)if(e.attr("data-ephox-embed-iri")||ie(e))return!0;return!1},ne=(e,t,r)=>{const a=y(e);return M(e.schema,{validate:a}).parse(r,{context:t})};e.add("media",(e=>((e=>{const t=e.options.register;t("audio_template_callback",{processor:"function"}),t("video_template_callback",{processor:"function"}),t("media_live_embeds",{processor:"boolean",default:!0}),t("media_filter_html",{processor:"boolean",default:!0}),t("media_url_resolver",{processor:"function"}),t("media_alt_source",{processor:"boolean",default:!0}),t("media_poster",{processor:"boolean",default:!0}),t("media_dimensions",{processor:"boolean",default:!0})})(e),(e=>{e.addCommand("mceMedia",(()=>{Y(e)}))})(e),(e=>{const t=()=>e.execCommand("mceMedia");e.ui.registry.addToggleButton("media",{tooltip:"Insert/edit media",icon:"embed",onAction:t,onSetup:t=>{const r=e.selection;return t.setActive(B(r.getNode())),r.selectorChangedWithUnbind("img[data-mce-object],span[data-mce-object],div[data-ephox-embed-iri]",t.setActive).unbind}}),e.ui.registry.addMenuItem("media",{icon:"embed",text:"Media...",onAction:t})})(e),(e=>{e.on("ResolveName",(e=>{let t;1===e.target.nodeType&&(t=e.target.getAttribute("data-mce-object"))&&(e.name=t)}))})(e),(e=>{e.on("PreInit",(()=>{const{schema:t,serializer:r,parser:a}=e,o=t.getBoolAttrs();n("webkitallowfullscreen mozallowfullscreen".split(" "),(e=>{o[e]={}})),((e,t)=>{const r=m(e);for(let a=0,o=r.length;a<o;a++){const o=r[a];t(e[o],o)}})({embed:["wmode"]},((e,r)=>{const a=t.getElementRule(r);n(e,(e=>{a.attributes[e]={},a.attributesOrder.push(e)}))})),a.addNodeFilter("iframe,video,audio,object,embed,script",(e=>t=>{let r,a=t.length;for(;a--;)r=t[a],r.parent&&(r.parent.attr("data-mce-object")||(ee(r)&&w(e)?ce(r)||r.replace(oe(e,r)):ce(r)||r.replace(ae(e,r))))})(e)),r.addAttributeFilter("data-mce-object",((t,r)=>{let a=t.length;for(;a--;){const o=t[a];if(!o.parent)continue;const s=o.attr(r),i=new $(s,1);if("audio"!==s&&"script"!==s){const e=o.attr("class");e&&-1!==e.indexOf("mce-preview-object")?i.attr({width:o.firstChild.attr("width"),height:o.firstChild.attr("height")}):i.attr({width:o.attr("width"),height:o.attr("height")})}i.attr({style:o.attr("style")});const c=o.attributes;let l=c.length;for(;l--;){const e=c[l].name;0===e.indexOf("data-mce-p-")&&i.attr(e.substr(11),c[l].value)}"script"===s&&i.attr("type","text/javascript");const m=o.attr("data-mce-html");if(m){const t=ne(e,s,unescape(m));n(t.children(),(e=>i.append(e)))}o.replace(i)}}))})),e.on("SetContent",(()=>{const t=e.dom;n(t.select("span.mce-preview-object"),(e=>{0===t.select("span.mce-shim",e).length&&t.add(e,"span",{class:"mce-shim"})}))}))})(e),(e=>{e.on("click keyup touchend",(()=>{const t=e.selection.getNode();t&&e.dom.hasClass(t,"mce-preview-object")&&e.dom.getAttrib(t,"data-mce-selected")&&t.setAttribute("data-mce-selected","2")})),e.on("ObjectSelected",(e=>{"script"===e.target.getAttribute("data-mce-object")&&e.preventDefault()})),e.on("ObjectResized",(t=>{const r=t.target;if(r.getAttribute("data-mce-object")){let a=r.getAttribute("data-mce-html");a&&(a=unescape(a),r.setAttribute("data-mce-html",escape(P(a,{width:String(t.width),height:String(t.height)},!1,e.schema))))}}))})(e),(e=>({showDialog:()=>{Y(e)}}))(e))))}();