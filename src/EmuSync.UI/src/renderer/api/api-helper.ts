//set of helper methods for get, post, put
//also makes it easier to ensure the auth token is part of every request when we come through here

type QueryParams = Record<string, any>;
type RequestBody = Record<string, any>;

// interface RequestResponse<TData> {
//     data: TData;
//     status: number;
// }

interface FetchOptions extends RequestInit {
    method: "GET" | "POST" | "PUT" | "DELETE";
    headers: Record<string, string>;
    body?: string | FormData;
}

export interface GetParams {
    path: string;
    query?: QueryParams;
}

export interface DeleteParams {
    path: string;
    query?: QueryParams;
}

export interface PostParams {
    path: string;
    body?: RequestBody;
}


export async function get<T>({ path, query }: GetParams): Promise<T> {

    const response = await executeFetch(
        path,
        query,
        "GET"
    );

    return response.json();

}

export async function remove({ path, query }: DeleteParams): Promise<Response> {
    return executeFetch(path, query, "DELETE");
}

export async function post<T>({ path, body }: PostParams): Promise<T> {
    const response = await executeFetch(path, body, "POST");
    return response.json();
}

export async function postWithNoResponse({ path, body }: PostParams): Promise<void> {
    await executeFetch(path, body, "POST");
}

export async function put({ path, body }: PostParams): Promise<Response> {
    return executeFetch(path, body, "PUT");
}

async function executeFetch(
    path: string,
    bodyOrQuery: QueryParams | RequestBody | undefined,
    method: "GET" | "POST" | "PUT" | "DELETE"
): Promise<Response> {

    const options: FetchOptions = {
        method,
        headers: {}
    };

    let url = "";

    if (method === "GET" || method === "DELETE") {

        const searchString = createSearchParams(bodyOrQuery as QueryParams);
        url = buildUrl(path, searchString);

    } else {

        //I.e. POST, PUT

        url = buildUrl(path);

        //set the necessary headers so we can post a body
        //don't do this for form data
        options.headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };

        //put that body in the request
        options.body = JSON.stringify(bodyOrQuery)

        options.cache = "no-store";
    }

    const response = await fetch(url, options);

    if (!response.ok) {

        console.error(`FAILED TO FETCH`, "|", url, "|", response);
        const error = await response.json();
        throw new Error(JSON.stringify(error));
    }

    return response;
}

function buildUrl(path: string, searchString?: string | null): string {

    //append the path to the base URL, taken from environment
    const apiBaseUrl = window.electron.apiUrl;
    let url = `${apiBaseUrl}/${path}`;


    //if we have a search string, append it as a query
    if (searchString) {
        url += `?${searchString}`;
    }

    return url;
}


function createSearchParams(params?: QueryParams): string | null {
    if (!params) return null;

    const searchParams = new URLSearchParams();

    const appendParams = (key: string, value: any) => {

        //skip null or undefined values
        if (value === null || value === undefined) {
            return;
        }

        if (typeof value === "object" && !Array.isArray(value)) {

            //handle nested objects
            Object.entries(value).forEach(([nestedKey, nestedValue]) => {
                appendParams(`${key}.${nestedKey}`, nestedValue);
            });

        } else if (Array.isArray(value)) {


            //check if the array contains objects
            if (value.every((item) => (typeof item === "string" || typeof item === "number" || typeof item === "boolean") && item !== null)) {

                //simple types
                value.forEach((item) => {
                    searchParams.append(key, String(item));
                });

            } else {

                //array of objects
                value.forEach((arrayValue, index) => {
                    appendParams(`${key}[${index}]`, arrayValue);
                });

            }

        } else {

            //handle simple key-value pairs
            searchParams.append(key, String(value));
        }
    };

    Object.entries(params).forEach(([key, value]) => {
        appendParams(key, value);
    });

    return searchParams.toString();
}