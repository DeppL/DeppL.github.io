(function() {
    new function(){
        "undefined"!==typeof window&&window.navigator.userAgent.match(/Macintosh/)
    };
    
    function n(g,d){
        this.i=(this.g="PUBLIC"!==g)?g:"*";
        this.l=d
    }
    
    n.prototype.init=function(g){
        window.addEventListener(
            "message",
            function(d){
                d=d.data;
                d.isCanvaApi&&(g[d.type]||$.noop)(d)
            },
            !1);

        this.sendMessage({
            type:"Init",authenticated:this.g
        })
    };


    n.prototype.sendMessage=function(g){
        g.isCanvaApi=!0;
        this.l.postMessage(g,this.i)};
        
        function v(){
            var g={embedDomain:"PUBLIC"};
            function d(b){
                0===$(b.target).closest(".signupForm, .loginForm, .resetForm, .header, .footer").length&&f.sendMessage({type:"LoginSignup",action:"hide"})
            }
                
            function p(b){
                b=b.emailAddress;h();
                b&&$("#emailSignup #email").val(b);
                l()
            }
            
            function l(){
                window.setTimeout(
                    function(){
                        f.sendMessage({type:"LoginSignup",action:"show"})
                    },
                    300)
            }
            
            function c(){
                var b=$("body").css("background-image").replace("url","").replace("(","").replace(")","").replace(/["']/g,"");
                f.sendMessage({type:"LoginSignup",action:"pageTransition",o:b})
            }
            
            function h(){
                $("html").addClass("embedded");
                $(".embedded canvas").css("display","none");
                if(/login\?redirect/gi.test(window.location.href)){
                    var b=window.location.href.replace("login?","signup?").replace("redirect","signupRedirect"),b=b+"%3Fonboarding%26layouts";
                    $(function(){
                        if(1===$("#signupLinkWrapper a").length)$("#signupLinkWrapper a").attr("href",b),$("#signupLinkWrapper a").on("mousedown",c);
                        else{
                            var e=$('\x3ca href\x3d"'+b+'"\x3eSignup now\x3c/a\x3e');
                            e.on("mousedown",c);
                            $("#loginForm .message").html("Don\x26#8217;t have an account?").append(e)
                        }
                    })
                }else if(/signup\?signupRedirect/gi.test(window.location.href)){
                    var d=window.location.href.replace("signup?","login?").replace("signupRedirect","redirect");
                    $(function(){
                        if(1===$("#loginLinkWrapper a").length)$("#loginLinkWrapper a").attr("href",d),$("#loginLinkWrapper a").on("mousedown",c);
                        else{
                            var b=$('\x3cp style\x3d"margin-top:2em;"\x3eAlready have an account?\x3c/p\x3e'),f=$('\x3ca href\x3d"'+d+'"\x3eLogin\x3c/a\x3e');
                            b.append(f);
                            f.on("mousedown",c);
                            $("#signupForm").append(b)
                        }
                    })
                }
                
                var f=document.createElement("style");
                f.setAttribute("type","text/css");
                var g=document.head||document.getElementsByTagName("head")[0];
                f.styleSheet?f.styleSheet.cssText="\n.embedded .header__menu { display: none !important; } .embedded footer { display: none !important; } .embedded body \x3e canvas { display: none !important; } ":f.appendChild(document.createTextNode("\n.embedded .header__menu { display: none!important; } .embedded footer { display: none !important; } .embedded body \x3e canvas { display: none !important; } "));
                
                g.appendChild(f);
                $("footer").hide()
            }
            
            if(window!=window.top){
                var f=new n(g.embedDomain,window.parent);
                f.init({blur:function(){},focus:function(){},registerOrShowLogin:p});
                f.sendMessage({type:"LoginSignup"});
                window.addEventListener("click",d,!1)}
            }


        window!==window.top&&v();
        
        (function(){
            function g(){
                $("body").mousemove(
                    function(a){
                        m=a.clientX;
                        q=a.clientY;
                        u=Date.now();
                        r||l()
                    }
                );
                
                $(window).on("blur mouseout",function(){q=m=null}).on(
                    "resize",
                    function(){
                        c&&c.parentNode&&c.parentNode.removeChild(c);
                        d()
                    }
                );
                d()
            }
                
            
            function d(){
                var a,e;
                p();
                a=$("body").width();
                e=$("body").height();
                c=document.createElement("canvas");
                c.className="loginFun";
                c.width=a;
                c.height=e;
                $("body").append(c);
                h=document.createElement("canvas");
                h.width=a;
                h.height=e;
                if(c.getContext&&c.getContext("2d")&&(f=c.getContext("2d"),b=h.getContext("2d"),b.lineCap="round",b.shadowColor="#000000",b.shadowBlur=-1<navigator.userAgent.indexOf("Firefox")?0:30,!k)){
                    k=new Image;
                    if(!$("body").css("background-image"))throw Error("body must have a background image");
                    $(k).one("load",l);
                    // $(k).attr("src","https://static.canva.com/static/images/bg_tiles_color.2.jpg")
                    $(k).attr("src","img/backimage2.jpg")
                }
            }
        
            function p(){
                t=[];
                $(".js-blurEffect--skip").each(
                    function(a,b){
                        var c;
                        c=$(b);
                        c.is(":visible")&&(a=c.position(),b=c.outerWidth(),c=c.outerHeight(),t.push({top:a.top,left:a.left,width:b,height:c}))
                    }
                )
            }
            
            function l(){
                var a,d=Date.now();
                a=$("body").scrollTop();
                r=d>u+500?!1:!0;
                m&&r&&e.unshift({time:d,x:m,y:q+a});
                for(a=0;a<e.length;)1E3<d-e[a].time?e.length=a:a++;0<e.length&&window.j(l);
                b.clearRect(0,0,h.width,h.height);
                for(a=1;a<e.length;a++){
                    var g=Math.sqrt(Math.pow(e[a].x-e[a-1].x,2)+Math.pow(e[a].y-e[a-1].y,2));
                    b.strokeStyle="rgba(0,0,0,"+Math.max(1-(d-e[a].time)/1E3,0)+")";
                    b.lineWidth=200+75*Math.max(1-g/50,0);
                    b.beginPath();
                    b.moveTo(e[a-1].x,e[a-1].y);
                    b.lineTo(e[a].x,e[a].y);
                    b.stroke()}d=c.width;
                    a=c.width/k.naturalWidth*k.naturalHeight;
                    a<c.height&&(a=c.height,d=c.height/k.naturalHeight*k.naturalWidth);
                    f.drawImage(k,0,0,d,a);
                    f.globalCompositeOperation="destination-in";
                    f.drawImage(h,0,0);
                    f.globalCompositeOperation="source-over";
                    t.forEach(
                        function(a){
                            f.clearRect(a.left,a.top,a.width,a.height)
                        })
                }
                    
                
            var c,h,f,b,k,m=null,q=null,e=[],u=0,r=!0,t=[];
            "createTouch"in document||$(g);
            window.j=function(){
                return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(a){window.setTimeout(a,1E3/60)}
                }()

        })();
})();