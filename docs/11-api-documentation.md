# API Documentation

## 📡 API Overview

The Wendessen Village Website provides RESTful API endpoints for managing events, news, gallery images, and community portraits. All API routes follow consistent patterns for authentication, error handling, and data formatting.

### Base URL

-   **Development**: `http://localhost:3000/api`
-   **Production**: `https://your-domain.com/api`

### Authentication

Admin endpoints require session-based authentication via HTTP-only cookies. Public endpoints are accessible without authentication.

### Response Format

All responses use consistent JSON formatting:

```json
// Success Response
{
  "data": {...},
  "status": "success"
}

// Error Response
{
  "error": "Error message",
  "status": "error",
  "code": 400
}
```

## 🎉 Events API

### Get All Events

```http
GET /api/events
```

**Description**: Retrieve all events ordered by start date

**Response**:

```json
[
    {
        "id": "1",
        "title": "Ortsratssitzung",
        "description": "Öffentliche Sitzung des Ortsrats",
        "start": "2025-09-25T19:00:00.000Z",
        "end": "2025-09-25T21:00:00.000Z",
        "location": "Dorfgemeinschaftshaus",
        "category": "sitzung",
        "organizer": "Ortsrat Wendessen",
        "imageUrl": null
    }
]
```

**Status Codes**:

-   `200`: Success
-   `500`: Server error

### Get Event by ID

```http
GET /api/events/{id}
```

**Parameters**:

-   `id` (string): Event ID

**Response**:

```json
{
    "id": "1",
    "title": "Ortsratssitzung",
    "description": "Öffentliche Sitzung des Ortsrats",
    "start": "2025-09-25T19:00:00.000Z",
    "end": "2025-09-25T21:00:00.000Z",
    "location": "Dorfgemeinschaftshaus",
    "category": "sitzung",
    "organizer": "Ortsrat Wendessen",
    "imageUrl": null
}
```

**Status Codes**:

-   `200`: Success
-   `404`: Event not found
-   `500`: Server error

### Create Event (Admin Only)

```http
POST /api/events
```

**Authentication**: Required

**Request Body**:

```json
{
    "title": "Neues Event",
    "description": "Event Beschreibung",
    "start": "2025-10-01T14:00:00.000Z",
    "end": "2025-10-01T16:00:00.000Z",
    "location": "Dorfplatz",
    "category": "veranstaltung",
    "organizer": "Dorfgemeinschaft",
    "imageUrl": "https://example.com/image.jpg"
}
```

**Response**:

```json
{
    "id": "2",
    "title": "Neues Event",
    "description": "Event Beschreibung",
    "start": "2025-10-01T14:00:00.000Z",
    "end": "2025-10-01T16:00:00.000Z",
    "location": "Dorfplatz",
    "category": "veranstaltung",
    "organizer": "Dorfgemeinschaft",
    "imageUrl": "https://example.com/image.jpg"
}
```

**Status Codes**:

-   `201`: Created
-   `400`: Bad request
-   `401`: Unauthorized
-   `500`: Server error

### Update Event (Admin Only)

```http
PUT /api/events/{id}
```

**Authentication**: Required
**Parameters**: `id` (string): Event ID

**Request Body**: Same as create event (all fields optional)

**Status Codes**:

-   `200`: Updated
-   `400`: Bad request
-   `401`: Unauthorized
-   `404`: Event not found
-   `500`: Server error

### Delete Event (Admin Only)

```http
DELETE /api/events/{id}
```

**Authentication**: Required
**Parameters**: `id` (string): Event ID

**Status Codes**:

-   `204`: Deleted
-   `401`: Unauthorized
-   `404`: Event not found
-   `500`: Server error

## 📰 News API

### Get All News

```http
GET /api/admin/news
```

**Authentication**: Required

**Response**:

```json
[
    {
        "id": "1",
        "title": "Neue Webseite ist online",
        "content": "Die neue Webseite von Wendessen ist jetzt verfügbar...",
        "category": "Digital",
        "publishedDate": "2025-09-20T10:00:00.000Z"
    }
]
```

### Create News Article (Admin Only)

```http
POST /api/admin/news
```

**Authentication**: Required

**Request Body**:

```json
{
    "title": "News Titel",
    "content": "News Inhalt...",
    "category": "Gemeinschaft"
}
```

**Response**: News object with generated ID and timestamp

**Status Codes**:

-   `201`: Created
-   `400`: Bad request
-   `401`: Unauthorized
-   `500`: Server error

### Update News Article (Admin Only)

```http
PUT /api/admin/news/{id}
```

**Authentication**: Required
**Parameters**: `id` (string): News ID

### Delete News Article (Admin Only)

```http
DELETE /api/admin/news/{id}
```

**Authentication**: Required
**Parameters**: `id` (string): News ID

## 🖼️ Gallery API

### Upload Gallery Image (Admin Only)

```http
POST /api/admin/gallery
```

**Authentication**: Required

**Request**: `multipart/form-data`

```
Content-Type: multipart/form-data

file: [image file]
displayName: "Image Display Name"
```

**Response**:

```json
{
    "id": "1",
    "filename": "unique-filename.jpg",
    "originalName": "original.jpg",
    "displayName": "Image Display Name",
    "url": "https://storage.vercel.com/path/to/image.jpg",
    "size": 1024576,
    "mimeType": "image/jpeg",
    "uploadedAt": "2025-09-25T10:00:00.000Z"
}
```

**Status Codes**:

-   `201`: Created
-   `400`: Bad request (invalid file)
-   `401`: Unauthorized
-   `413`: File too large
-   `500`: Server error

### Get Gallery Images (Admin Only)

```http
GET /api/admin/gallery
```

**Authentication**: Required

### Delete Gallery Image (Admin Only)

```http
DELETE /api/admin/gallery/{id}
```

**Authentication**: Required
**Parameters**: `id` (string): Image ID

## 👥 Portraits API

### Submit Portrait (Public)

```http
POST /api/portraits
```

**Request**: `multipart/form-data`

```
Content-Type: multipart/form-data

name: "Full Name"
description: "Brief description..."
email: "email@example.com" (optional)
image: [image file]
```

**Response**:

```json
{
    "id": "1",
    "name": "Full Name",
    "description": "Brief description...",
    "email": "email@example.com",
    "status": "pending",
    "submittedAt": "2025-09-25T10:00:00.000Z"
}
```

**Status Codes**:

-   `201`: Submitted
-   `400`: Bad request
-   `413`: File too large
-   `500`: Server error

### Get Approved Portraits (Public)

```http
GET /api/portraits/approved
```

**Response**:

```json
[
    {
        "id": "1",
        "name": "Full Name",
        "description": "Brief description...",
        "imageData": "data:image/jpeg;base64,/9j/4AAQSkZJRgABA...",
        "imageMimeType": "image/jpeg",
        "status": "approved",
        "submittedAt": "2025-09-25T10:00:00.000Z"
    }
]
```

### Manage Portraits (Admin Only)

```http
GET /api/admin/portraits
```

**Authentication**: Required

**Response**: All portrait submissions with status

```http
PUT /api/admin/portraits/{id}
```

**Authentication**: Required
**Parameters**: `id` (string): Portrait ID

**Request Body**:

```json
{
    "status": "approved", // or "rejected"
    "reviewedBy": "Admin Name"
}
```

```http
DELETE /api/admin/portraits/{id}
```

**Authentication**: Required
**Parameters**: `id` (string): Portrait ID

## 🔐 Authentication API

### Admin Login

```http
POST /api/admin/login
```

**Request Body**:

```json
{
    "password": "admin_password"
}
```

**Response**:

```json
{
    "success": true
}
```

**Status Codes**:

-   `200`: Login successful
-   `401`: Invalid password
-   `500`: Server error

**Side Effects**: Sets HTTP-only session cookie

### Admin Logout

```http
POST /api/admin/logout
```

**Authentication**: Required

**Response**:

```json
{
    "success": true
}
```

**Side Effects**: Clears session cookie

### Check Admin Status

```http
GET /api/admin/status
```

**Authentication**: Required

**Response**:

```json
{
    "authenticated": true,
    "stats": {
        "events": 12,
        "news": 8,
        "portraits": 5,
        "galleryImages": 24
    }
}
```

**Status Codes**:

-   `200`: Authenticated
-   `401`: Not authenticated

## 🏥 Health Check API

### System Health

```http
GET /api/health
```

**Response**:

```json
{
    "status": "healthy",
    "timestamp": "2025-09-25T10:00:00.000Z",
    "environment": "production",
    "database": "connected",
    "tables": {
        "events": 12,
        "news": 8
    },
    "version": "1.0.0"
}
```

**Status Codes**:

-   `200`: Healthy
-   `503`: Unhealthy

## 📝 Data Models

### Event Model

```typescript
interface CalendarEvent {
    id: string;
    title: string;
    description?: string;
    start: Date;
    end: Date;
    location?: string;
    category:
        | 'sitzung'
        | 'veranstaltung'
        | 'sport'
        | 'kultur'
        | 'notfall'
        | 'sonstiges';
    organizer?: string;
    imageUrl?: string;
}
```

### News Model

```typescript
interface NewsItem {
    id: string;
    title: string;
    content?: string;
    category: string;
    publishedDate: Date;
}
```

### Portrait Model

```typescript
interface PortraitSubmission {
    id: string;
    name: string;
    description: string;
    email?: string;
    imageData: string; // Base64 encoded
    imageMimeType: string;
    imageFilename?: string;
    status: 'pending' | 'approved' | 'rejected';
    submittedAt: Date;
    reviewedAt?: Date;
    reviewedBy?: string;
}
```

### Gallery Image Model

```typescript
interface GalleryImage {
    id: string;
    filename: string;
    originalName: string;
    displayName: string;
    url: string;
    size: number;
    mimeType: string;
    uploadedAt: Date;
}
```

## 🚫 Error Handling

### Error Response Format

```json
{
    "error": "Human readable error message",
    "code": "ERROR_CODE",
    "timestamp": "2025-09-25T10:00:00.000Z",
    "path": "/api/events"
}
```

### Common Error Codes

#### 400 Bad Request

```json
{
    "error": "Validation failed",
    "details": [
        {
            "field": "title",
            "message": "Title is required"
        }
    ]
}
```

#### 401 Unauthorized

```json
{
    "error": "Authentication required",
    "code": "UNAUTHORIZED"
}
```

#### 404 Not Found

```json
{
    "error": "Resource not found",
    "code": "NOT_FOUND"
}
```

#### 413 Payload Too Large

```json
{
    "error": "File size exceeds limit",
    "maxSize": "5MB",
    "code": "FILE_TOO_LARGE"
}
```

#### 500 Internal Server Error

```json
{
    "error": "Internal server error",
    "code": "INTERNAL_ERROR"
}
```

## 🔧 Rate Limiting

### Limits by Endpoint Type

-   **Public APIs**: 100 requests per minute per IP
-   **Admin APIs**: 1000 requests per minute per session
-   **File Uploads**: 10 uploads per minute per IP
-   **Portrait Submissions**: 5 submissions per hour per IP

### Rate Limit Headers

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1632150000
```

## 📊 API Usage Examples

### JavaScript/TypeScript Client

```typescript
// API client utility
class WendessenAPI {
    private baseURL: string;

    constructor(baseURL: string = '/api') {
        this.baseURL = baseURL;
    }

    async getEvents(): Promise<CalendarEvent[]> {
        const response = await fetch(`${this.baseURL}/events`);
        if (!response.ok) {
            throw new Error('Failed to fetch events');
        }
        return response.json();
    }

    async createEvent(
        event: Omit<CalendarEvent, 'id'>
    ): Promise<CalendarEvent> {
        const response = await fetch(`${this.baseURL}/events`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(event),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to create event');
        }

        return response.json();
    }

    async uploadGalleryImage(
        file: File,
        displayName: string
    ): Promise<GalleryImage> {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('displayName', displayName);

        const response = await fetch(`${this.baseURL}/admin/gallery`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to upload image');
        }

        return response.json();
    }
}

// Usage
const api = new WendessenAPI();

// Get events
try {
    const events = await api.getEvents();
    console.log('Events:', events);
} catch (error) {
    console.error('Error fetching events:', error);
}

// Create event
try {
    const newEvent = await api.createEvent({
        title: 'New Event',
        start: new Date('2025-10-01T14:00:00Z'),
        end: new Date('2025-10-01T16:00:00Z'),
        category: 'veranstaltung',
    });
    console.log('Created event:', newEvent);
} catch (error) {
    console.error('Error creating event:', error);
}
```

### React Hook Integration

```typescript
// Custom hook for events
export function useEvents() {
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const api = new WendessenAPI();
            const events = await api.getEvents();
            setEvents(events);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    const createEvent = async (event: Omit<CalendarEvent, 'id'>) => {
        try {
            const api = new WendessenAPI();
            const newEvent = await api.createEvent(event);
            setEvents((prev) => [...prev, newEvent]);
            return newEvent;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
            throw err;
        }
    };

    return {
        events,
        loading,
        error,
        refetch: fetchEvents,
        createEvent,
    };
}

// Usage in component
export default function EventsList() {
    const { events, loading, error, createEvent } = useEvents();

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            {events.map((event) => (
                <EventCard key={event.id} {...event} />
            ))}
        </div>
    );
}
```

### cURL Examples

```bash
# Get all events
curl -X GET "https://your-domain.com/api/events" \
  -H "Accept: application/json"

# Create event (requires authentication)
curl -X POST "https://your-domain.com/api/events" \
  -H "Content-Type: application/json" \
  -H "Cookie: admin-session=your-session-token" \
  -d '{
    "title": "New Event",
    "start": "2025-10-01T14:00:00Z",
    "end": "2025-10-01T16:00:00Z",
    "category": "veranstaltung"
  }'

# Upload gallery image
curl -X POST "https://your-domain.com/api/admin/gallery" \
  -H "Cookie: admin-session=your-session-token" \
  -F "file=@image.jpg" \
  -F "displayName=My Image"

# Submit portrait
curl -X POST "https://your-domain.com/api/portraits" \
  -F "name=John Doe" \
  -F "description=Village resident" \
  -F "email=john@example.com" \
  -F "image=@portrait.jpg"
```

## 🔒 Security Considerations

### Input Validation

-   All inputs are validated using TypeScript interfaces
-   File uploads restricted to specific types and sizes
-   SQL injection prevention through parameterized queries

### Authentication

-   Session-based authentication for admin functions
-   HTTP-only cookies prevent XSS attacks
-   CSRF protection through SameSite cookie attribute

### File Upload Security

-   File type validation
-   File size limits (5MB max)
-   Virus scanning (recommended for production)
-   Secure file storage with Vercel Blob

---

**Next:** [FAQ & Resources](./12-faq-resources.md)
