(()=>{
const s=document.createElement("style");
s.textContent=`
.mast{
position:relative!important;
overflow:hidden!important;
min-height:240px!important;
padding:calc(env(safe-area-inset-top) + 12px) 18px 26px!important;
border-radius:0 0 32px 32px!important;
background-image:
linear-gradient(180deg,rgba(4,30,20,.15),rgba(4,30,20,.72)),
url("./christmas-hero-bg.png?v=8")!important;
background-size:cover!important;
background-position:center!important;
color:#fff!important;
box-shadow:0 12px 28px #173f2b35!important
}

.mast:before{
content:""!important;
position:absolute!important;
inset:0!important;
background:linear-gradient(180deg,transparent,rgba(0,25,15,.35))!important;
pointer-events:none!important
}

.mast>*{
position:relative!important;
z-index:2!important
}

.mast-name{
font:800 26px Georgia,serif!important;
text-shadow:0 2px 8px #000!important
}

.mast-tag,
.mast-kicker,
.mast-desc{
color:#fff!important;
text-shadow:0 2px 7px #000!important
}

.mast-title{
color:#fff!important;
font:800 33px/1.05 Georgia,serif!important;
text-shadow:0 3px 10px #000!important
}

.hero{
min-height:160px!important;
padding:16px!important;
border-radius:24px!important
}

.hero-count{
font-size:44px!important;
letter-spacing:-2px!important;
margin:6px 0 0!important
}

.hero-text{
font-size:17px!important
}

.hero-sub{
font-size:12px!important;
margin-top:5px!important;
max-width:66%!important
}

.hero-tree{
font-size:61px!important;
right:10px!important;
bottom:12px!important
}

@media(max-width:430px){
.mast{min-height:225px!important}
.mast-title{font-size:30px!important}
.hero-count{font-size:42px!important}
}
`;
document.head.appendChild(s);
})();
