// import React from 'react'
import {apiPostClient, apiAuthClient} from "./client";

// const domain = process.env.REACT_APP_DOMAIN;
// const { token } = UserStore();
var api = apiPostClient;


const post = async (url, token, data) => {
    //console.log('userStore: ', UserStore);
    // const { token } = UserStore();
    //let postUrl = domain+'/admin'+url;
    //console.log('api: ', api);
    return api.post(
        url,
        { ...data },
        { 
            headers: { 
                "Content-Type": "application/json",
                Authorization: `bearer ${token}`
            } 
        }
    );
}

const postImage = async (url, token, data) => {
    //console.log('userStore: ', UserStore);
    // const { token } = UserStore();
    //let postUrl = domain+'/admin'+url;
    console.log('data: ', data);
    return apiPostClient.post(
        url,
        data,
        { 
            headers: { 
                "content-type": "multipart/form-data",
                Authorization: `bearer ${token}`
            } 
        }
    );
}

const get = async (url, token) => {
    //const { token } = UserStore();
    // let getUrl = domain+'/admin'+url;
    //console.log('Url: ', url);
    return apiPostClient.get(
        url, 
        {},
        { 
            headers: { 
                "Content-Type": "application/json",
                Authorization: `bearer ${token}`
            } 
        }
    );
}

const handleError = (response, statusCode) => {
    let errorMsg = [];
    let msg = '';
    //console.log('handle error', statusCode);
    switch(statusCode) {
        case 422 : 
            //console.log('error: ', response.data.errors);
            for(const key in response.data.errors) response.data.errors[key].map(error => errorMsg.push(error) );
            break;
        case 401 :
            errorMsg.push(response.data.error);
            break;
        case 404 :
                errorMsg.push('Not found');
                break;
        case 500 :
            msg = (response.data?.data?.message) ? response.data.data.message : "An error occured";
            if(msg==="An error occured") msg = (response.data?.error) ? response.data.error : "An error occured";
            if(msg==="An error occured") msg = (response.data?.message) ? response.data.message : "An error occured";
            errorMsg.push(msg);
            break;
        default :
            msg = (response.data?.data?.message) ? response.data.data.message : "An error occured";
            if(msg==="An error occured") msg = (response.data?.error) ? response.data.error : "An error occured";
            if(msg==="An error occured") msg = (response.data?.message) ? response.data.message : "An error occured";
            errorMsg.push(msg);
            break;
    }
    //console.log('error look', response);
    return {status: statusCode, message: errorMsg};
} 

export const Request = async (requestType, url, auth, data={}, apiType='post') => {
    let res = {};
    const {domain, token} = auth;
    
    if(apiType === 'auth') {
        api = apiAuthClient;
    }else{
        api = apiPostClient;
        url = domain+'/admin'+url;
    }
    //console.log('data: ', data);
    switch(requestType) {
        case 'GET' : res = await get(url, token); break;
        case 'POST' : res = await post(url, token, data); break;
        case 'POST-IMAGE' : res = await postImage (url, token, data); break;
        default : res = {};
    }
    //console.log('resp: ', res.status);
     //console.log('resp1: ', res.data);
    // console.log('resp2: ', res.data.data);
    if(res.status === 200 || res.status === 201) {
        return {status: res.status, data: res.data.data, message: res.data?.message};
    }else{
        return handleError(res, res.status);
    }
}


//export default { loginUser, registerUser };
