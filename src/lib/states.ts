/* For Api loading states */
export enum ApiStateEnum {
	NOTLOADED = 'notloaded',
	ERROR = 'error',
	LOADING = 'loading',
	LOADED = 'loaded'
}

export interface ApiError {
	errorCode: number; 
	errorMessage: string;
	errorType: string;
}
export interface ApiLoadInfo {
	state: ApiStateEnum;
	error?: ApiError;
}