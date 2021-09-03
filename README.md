# simple-express-server

## To test fetch api error handling

```javascript
const testFetch = (url) => {
  fetch(url)
    .then((res) => res.json())
    .then((data) => console.log("Resolved", data))
    .catch((err) => console.error("Rejected", err));
};

//Run in developer tools

testFetch("http://some-made-up-url.com"); // Rejected. DNS error
testFetch("http://localhost:5000/data"); // Resolved. { some: "data" }
testFetch("http://localhost:5000/close"); // Rejected. Connection lost
testFetch("http://localhost:5000/error/404"); // Rejected. JSON parse error
testFetch("http://localhost:5000/error/500"); // Rejected. JSON parse error
```

## Results

The the /error/XXX requests reject due to json parse not due to the server error.

## Alternate Fetch Decorator to catch both server and client errors

```javascript
class FetchError extends Error {
  constructor(meta = {}) {
    super(meta.client ? meta.cause : `Server error ${meta.status}`);
    Object.assign(this, meta);
    this.name = "FetchError";
  }
}

const makeRequest = (method) => (url, options) => {
  return fetch(url, { ...options, method })
    .catch((e) => {
      throw new FetchError({ client: true, cause: e });
    })
    .then((res) => {
      if (res.ok) {
        return res;
      }
      throw new FetchError({ server: true, status: res.status, res });
    });
};

const get = makeRequest("GET");
const post = makeRequest("POST");

//more verbs ...
```

**Now**

```javascript
const testFetch = (url) => {
  get(url)
    .then((res) => res.json())
    .then((data) => console.log("Resolved", data))
    .catch((err) => console.error("Rejected", err));
};

testFetch("http://localhost:5000/error/500"); // Rejected. FetchError: Server error 500
```
