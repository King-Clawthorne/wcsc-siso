# Making requests in Issues for API endpoints

When requesting an API Endpoint, you eed to specify the following information:

## Endpoints:
* Specific URIs (URLs) where requests are sent (e.g., /users).
* Methods: HTTP actions like GET, POST, PUT, DELETE.
* Parameters: Data required for the request, including headers, query string parameters, and payload.
* Authentication Methods: Details on how to authorize requests.
* Response Structures: Expected output formats, including data models and error codes.

for example:
Please create a new API endpoint
* /api/student
* Method: GET & POST
* Parameters: I will send Barcode Number
* Authentication Methods: AuthORIZATION: <API_KEY>
* Response: JSON data including:
  * Student name(s)
  * Year group
  * Current Location (in-school, bakery, newmarket, doctor, home, other )
  * Currentlychecked out items: [List of items currently signed out]
  * Photo (BAse64 encoded student photo)
