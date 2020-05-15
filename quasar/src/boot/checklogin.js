export default ({ router, store, Vue }) => {
    router.beforeEach((to, from, next)=>{

        // var getinfo = localStorage.getItem('loginInfo')
        //     if (getinfo) {
        //         var jsoninfo = JSON.parse(getinfo)
        //         var loginStatus = jsoninfo.loginStatus
        //         console.log('loginStatus :' + loginStatus)
        //     } else {
        //         console.log('NOT login')
        //     }

        // var loginInfo = { 'loginStatus': true, 'verficationCode': 111111, 'logintimestamp': Math.floor(new Date().getTime() / 1000)}
        // localStorage.setItem('loginInfo', JSON.stringify(loginInfo))
        const isLogin = localStorage.getItem('loginInfo')
        
        // if(time_now - isLogin >= 6000){
        //     localStorage.removeItem('loginInfo')
        //     alert("10 minutes overtime, Please login again")
        //     next('/login')
        // }
        if( isLogin ){
            var login_time = JSON.parse(isLogin).logintimestamp
            var time_now = Math.floor(new Date().getTime() / 1000)
        
            // console.log("This is login information: ", isLogin)
            // console.log("login_time: ", login_time)
            // console.log("time_now: ", time_now)
            // console.log("time_now - login_time: ", time_now - login_time)
            if(time_now - login_time >= 604800){
                alert("You have already login exceed 7 days, please login again.")
                localStorage.removeItem('loginInfo');
                next('/login')
            }
            if (to.path == '/login' || to.path == '/register' || to.path == '/email_validation' || to.path == '/'){
                next('/dashboard');
            }
            else{
                next();
            }
        } 
        else {
            localStorage.removeItem('loginInfo');
            if( to.path == '/register'){
                next();
            }

            else if( to.path == '/email_validation'){
                next();
            }

            else if( to.path !== '/login'){
                next('/login');
            }

            else{
                next();
            }
        }
    });
}