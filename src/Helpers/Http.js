const HOST = "http://localhost:3000"

export default class Http {
    static getRequest = (data, url, method) => {
        const init = {
            method: method,
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        }
        return new Request(`${HOST}${url}`, init)
    }

    static post = async (body, url) => {
        const request = this.getRequest(body, url, "POST")
        const res = await fetch(request)
        return await res.json()
    }

    static get = async url => {
        const res = await fetch(`${HOST}${url}`, {
            credentials: "include"
        })
        return await res.json()
    }
}