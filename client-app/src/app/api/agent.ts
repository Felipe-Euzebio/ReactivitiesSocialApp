import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { Activity } from "../models/activity";
import { router } from "../router/Routes";
import { store } from "../stores/store";

axios.defaults.baseURL = "http://localhost:5000/api";

const sleep = (delay: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, delay);
    });
};

axios.interceptors.response.use(async response => {

    await sleep(1000);
    return response;

}, (error: AxiosError) => {

    const { data, status, config } = error.response as AxiosResponse;

    switch (status) {
        case 400:
            // toast.error("Bad Request");
            if (config.method === "get" && data.errors.hasOwnProperty("id")) {
                router.navigate("/not-found");
            }
            
            if (data.errors) {
                const modalStateErrors = [];
                for (const key in data.errors) {
                    if (data.errors[key]) {
                        modalStateErrors.push(data.errors[key]);
                    }
                }
                throw modalStateErrors.flat();
            } else {
                toast.error(data);
            }
            break;
        
        case 401:
            toast.error("Unauthorized");
            break;

        case 403:
            toast.error("Forbidden");
            break;

        case 404:
            // toast.error("Not Found");
            router.navigate("/not-found");
            break;

        case 500:
            // toast.error("Server Error");
            store.commonStore.setServerError(data);
            router.navigate("/server-error");
            break;
    }

    return Promise.reject(error);

});

const responseBody = <T> (response: AxiosResponse<T>) => response.data;

const requests = {
    get: <T> (url: string) => axios.get<T>(url).then(responseBody),
    post: <T> (url: string, body: {}) => axios.post<T>(url, body).then(responseBody),
    put: <T> (url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
    del: <T> (url: string) => axios.delete<T>(url).then(responseBody),
};

const Activities = {
    list: () => requests.get<Activity[]>("/activities"),
    details: (id: string) => requests.get<Activity>(`/activities/${id}`),
    create: (activity: any) => requests.post("/activities", activity),
    update: (activity: any) => requests.put(`/activities/${activity.id}`, activity),
    delete: (id: string) => requests.del(`/activities/${id}`),
};

const agent = {
    Activities,
};

export default agent;