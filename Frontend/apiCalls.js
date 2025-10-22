export class apiCalls {

    // Need to test out and replace current iterations if possible
    async fetchGetAPI(endpoint, params = {}) {

        const url = new URL(endpoint, window.location.origin);

        Object.entries(params).forEach(([key, value]) => {
            url.searchParams.append(key, value);
        })
        
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            });
        
        if (!res.ok) {
            throw new Error(`GET ${url} failed with status ${res.status}`);
            return null;
        }

        return await res.json();

        } catch (err) {
            throw new Error('API get error: ', err);
            return null;
        }
    }

    fetchPostAPI() {
            //todo 
    }
}