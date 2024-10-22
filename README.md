# eigen-be- betest

## Requirements :
```
1. Node JS (TypeScript)
2. MongoDB
```

## Preparation :
```
1. Move config folder to the outside of project folder in the same directory
2. Rename and remove ".example" for .env.example
3. Fill the config according to your machine
```

## Setup :
```
1. npm install
```

### Run :
```
1. npm run dev
```

### Postman Collection :
```
Please visit folder postman-collection inside root folder to find the example requests.
Add your own environment on postman with these variables and values :
1. path = /api
2. auth = Bearer eyJhbGciOiJIUxxxxx (watch the log to get the bearer and copy to Bearer Token Postman)
For auth you can use api "LOGIN" to get the headers authorization. You need to copy the response headers authorization first.
```

### Algorithm Test:
```
1. please run "node algorithmTest.js"
```