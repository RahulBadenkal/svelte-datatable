	// Methods
  export const isNullOrUndefined = (data: any) => {
		return data === undefined || data === null
	}

	export const isEmpty = (data: any, trimString = true) => {
		return data === undefined || data === null || (trimString ? data.toString().trim() : data.toString()) === '';
	}

  export const getRandomString = (length: number) => {
		const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
		let result = '';
		for (let i = length; i > 0; --i) {
			result += chars[Math.floor(Math.random() * chars.length)];
		}
		return result;
	}

  // TODO: Improve this to add paths and add encoding also if required
  export const formURL = (baseURL: string, queryParams = null) => {
		if (!queryParams || Object.keys(queryParams).length === 0) {
			return baseURL;
		}
		let paramsString = new URLSearchParams(queryParams).toString();
		let url = `${baseURL}?${paramsString}`;
		return url;
	}

 export const isNum = (num: any) => {
		/*
			Returns true if the passed data can be converted to a number, else returns false
			Returns true for : 0, -1, "+1", "-11", "11.23", 23e4, "23e4", "   1"
			Returns false for: null, undefined, {}, [], "++1", "--1", etc
		*/
		return !isNaN(parseFloat(num)) && !isNaN(num - 0);
	}

 export const isInt = (num: any) => {
		/*
			Checks if the passed data can be converted to an int
		*/
		return isNum(num) && Number.isInteger(+num);
	}

  export const sleep = (ms: number): Promise<null> => {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}