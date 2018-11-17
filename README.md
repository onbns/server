# server.onbns.com RESTful API v1 documentation

## BaseURI

- [base_url][base url]:   `https://server.onbns.com`
- [webhook][webhook]:     `https://server.onbns.com/ping`
- [auth_api][auth api]:   `https://server.onbns.com/api`

notes: The first three route are publicly available.

[base url]: https://server.onbns.com/
[webhook]: https://server.onbns.com/ping/
[open api]: https://server.onbns.com/openapi/
[auth api]: https://server.onbns.com/api/

## API Usage & Response

to use `/api` route, complete the following stpes:

- Login [onbns](https://onbns.com/#signin) to signup
- A `auth_jwt_token` will be generated and stored in your browser localStorage
- This token will expired in 7 days, to request an extended token, [contact]((team@onbns.com)) us
- Every API endpoint requires an `Authentication` header

Example:

```javascript
request.headers['Authorization'] = `token`
```

### Endpoints

#### Auth

##### POST `/auth/signupWithEmail`
`-H 'Content-Type: application/json' -d {"email":"andy@onbns.com"}`

#### Account

##### GET `https://server.onbns.com/api`
  - good response
  ```json
  {"message": "/api connected"}
  ```
  - bad response
  ```json
  "Please make sure your request has an Authorization header."
  ```

#### Admin

##### GET `https://server.onbns.com/api/admin`
  - good response:
  ```json
  {"message": "/api/admin connected"}
  ```