export const accessToken = window.localStorage.getItem('accessToken' );

export const reloadIfTokenExpire = (responseData) => {
	if("ERROR" in responseData){
        if(window.localStorage.getItem('reload_count')){
            window.localStorage.removeItem('accessToken')
            window.localStorage.removeItem('reload_count')
            window.localStorage.removeItem('exaple_user')
            window.location.href = '/'
        }else{
            window.localStorage.setItem('reload_count', 1)
            window.location.reload();
        }
    }
}