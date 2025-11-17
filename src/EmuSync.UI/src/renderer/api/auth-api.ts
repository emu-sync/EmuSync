import { get } from "@/renderer/api/api-helper";
import { DropboxAuthUrlResponse, GoogleAuthUrlResponse } from "@/renderer/types";

const controller = "Auth"

export async function getDropboxAuthUrl(): Promise<DropboxAuthUrlResponse> {

    const path = `${controller}/Dropbox/AuthUrl`;

    return await get({
        path
    });

}

export async function getGoogleAuthUrl(): Promise<GoogleAuthUrlResponse> {

    const path = `${controller}/Google/AuthUrl`;

    return await get({
        path
    });

}