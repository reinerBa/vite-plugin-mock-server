import mockRoutes from './mockRoutes'

export default async function runTests (baseUrl: string, fetchFn?: Function) {
    const _fetch = fetchFn ?? fetch
    const errors: string[] = []

    let url = `/api/test1/1`
    let responseText: string = await fetchText(url)
    assertEq(responseText, 'Hello world!/api/test1/1', url)

    url = `/api/test1/abc`
    responseText = await fetchText(url)
    assertEq(responseText, 'Hello world star /api/test1/abc', url)

    url = `/config.json`
    let responseObj: any = await fetchJson(url)
    assertEq(responseObj.env, 'dev', url)

    url = '/api/test1/users/testUser'
    responseObj = await fetchJson(url)
    assertEq(responseObj.params.userId, 'testUser', url)

    url = '/api/test1/body/json'
    const resp = await _fetch(`${baseUrl}${url}`, {method: 'POST', body: JSON.stringify({'myKey': 'myVal'})})
    responseObj = await resp.json()
    assertEq(responseObj.myKey, 'myVal', url)

    return errors


    async function fetchText(url: string): Promise<string> {
        const resp = await _fetch(`${baseUrl}${url}`)
        return await resp.text()
    }
    async function fetchJson(url: string): Promise<Object> {
        const resp = await _fetch(`${baseUrl}${url}`)
        return await resp.json()
    }
    function assertEq(val1, val2, url: string) {
      if (val1 !== val2) 
        errors.push(url)  
      else 
        console.log(`\x1b[32m ✓ correct mock response from: ${url} \x1b[0m`)
    }
}