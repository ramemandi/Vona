
export const apiCall = (url, method, body) => {
    console.log(url, method, body, 'url, method, body');

    return new Promise(async (resolve, reject) => {
        // console.log('data from manager js');
        let result = commonApi(url, method, body);
        if (result) {
            resolve(result)
        } else {
            reject(reject)
        }

    });
}


async function commonApi(url, method, body) {
    console.log(`Http call - url: ${url} + body - ${method}`);
    let headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }; 
    switch (method) {
        case 'post': return await fetch(url, { method: 'POST',  headers:headers, body: body })
            .then(response => response.json())
            .then(responseJson => { return responseJson; })
            .catch((err) => {
                return err.message
            })

        case 'get':
            return await fetch(url, {
                method: 'GET', headers:headers
            }).then(response => response.json())
                .then(responseJson => { return responseJson; })
                .catch((err) => {
                    return err.message
                })
        // case 'put':
        //     return this._http
        //         .put(url, body, options)
        //         .pipe(map((response: Response) => response.json())).catch((err) => {
        //             // Do messaging anREd error handling here
        //             const empty = [];
        //             const res = JSON.parse(err._body);
        //             empty.push(res);
        //             return empty;
        //         });
        // case 'delete':
        //     return this._http
        //         .delete(url, options)
        //         .pipe(map((response: Response) => response.json())).catch((err) => {
        //             // Do messaging anREd error handling here
        //             const empty = [];
        //             const res = JSON.parse(err._body);
        //             empty.push(res);
        //             return empty;
        //         });

    }
}