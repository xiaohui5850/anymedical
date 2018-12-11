'use strict';

angular.module('hrchatbotAdminApp').constant("CHATBOT_CONSTANTS" , {
    CACHE_REPO_NAME: "cacheRepo",
    BASE_URL: "https://xiaoqiao.accenture.com",
    WS_BASE_URL: "wss://xiaoqiao.accenture.com",
}).constant("CHATBOT_URLS", {
    PAGE_FUN: {
        GET_PAGE_FUN: "/app/pagefun/getAll"
    },
    MESSAGE_TRYPE:{
    	MESSAGE: "message",
    	INFORM: "inform"
    },
    DOWNLOAD_PATH: "https://xiaoqiao.accenture.com/app_mobike/file/download_nginx",
    CHATBOT_LETTER_URL: "https://xiaoqiao.accenture.com/letter/",
})
