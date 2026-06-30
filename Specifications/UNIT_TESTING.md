# Unit Testing Guidelines

This document provides guidelines for writing unit tests for both the backend and frontend of the Wentworth Computer Science College SISO application.

---

## General Philosophy

- **Test for behavior, not implementation:** A good test should validate that the code produces the correct output for a given input, without being tightly coupled to the internal implementation details.
- **Aim for high coverage:** Every new feature or bugfix should be accompanied by tests.
- **Tests should be fast and isolated:** Unit tests should not depend on external services (like a live database or network) and should run quickly.

---

## Backend (pytest)

- **Framework:** We use `pytest` for writing and running tests.
- **Location:** Tests for the backend are located in the `backend/tests/` directory.
- **Test Discovery:** `pytest` will automatically discover files named `test_*.py` or `*_test.py`.
- **Fixtures:** Use `pytest` fixtures to set up reusable test contexts, such as a test client or a pre-populated in-memory database.

### Example: Testing a Flask Endpoint

```python
# backend/tests/test_api.py
from app.models import User

def test_registration_endpoint(client, db_session):
    """
    GIVEN a Flask application configured for testing
    WHEN a POST request is sent to the '/api/register' endpoint
    THEN a new user should be created in the database
    """
    response = client.post('/api/register', json={
        'username': 'testuser',
        'email': 'test@example.com',
        'password': 'password123'
    })
    assert response.status_code == 201
    user = User.query.filter_by(email='test@example.com').first()
    assert user is not None
    assert user.username == 'testuser'
```

### What to Test:
- **API Endpoints:** Test for correct status codes, response data, and side effects (e.g., database changes).
- **Models:** Test custom logic, relationships, and validation.
- **Utils:** Test utility functions (like encryption) with various inputs.
- **Authentication & Authorization:** Test that protected routes are inaccessible without proper credentials and roles.

---

## Frontend (React Testing Library)

- **Framework:** We use `@testing-library/react` with a test runner like Jest.
- **Philosophy:** "The more your tests resemble the way your software is used, the more confidence they can give you."
- **Queries:** Use user-centric queries like `getByRole`, `getByLabelText`, and `getByText`. Avoid testing implementation details.

### Example: Testing a React Component

```tsx
// frontend/src/components/__tests__/Register.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Register from '../Register';

test('renders registration form and submits data', () => {
  render(<Register />);

  // Find form elements by their accessible labels
  const nameInput = screen.getByLabelText(/full name/i);
  const submitButton = screen.getByRole('button', { name: /register/i });

  // Simulate user interaction
  fireEvent.change(nameInput, { target: { value: 'Jane Doe' } });
  expect(nameInput.value).toBe('Jane Doe');

  // Simulate form submission
  fireEvent.click(submitButton);

  // Assert that the form submission logic was called (e.g., mock an API call)
  // ...
});
```

### What to Test:
- **Component Rendering:** Does the component render correctly with given props?
- **User Interaction:** Does the component respond correctly to user events (clicks, input, etc.)?
- **Conditional Rendering:** Does the UI change correctly based on state or props?
- **Accessibility:** Ensure components are accessible by using semantic queries.
