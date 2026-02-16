# API Contract: iCal Feed

## GET /api/ical/[config]

Returns an iCalendar (.ics) feed for the given room config.

**Path params**:
- `config`: Room config key, e.g. `3-2`, `2-1`, `1-1` (URL-safe; use hyphen)

**Response**:
- Status: 200
- Content-Type: `text/calendar; charset=utf-8`
- Body: RFC 5545 iCalendar format

**Example**:
```
GET /api/ical/3-2
→ text/calendar
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Manna Family Hotel//EN
...
BEGIN:VEVENT
DTSTART;VALUE=DATE:20260215
DTEND;VALUE=DATE:20260228
SUMMARY:Unavailable
...
END:VEVENT
END:VCALENDAR
```

**Errors**:
- 404: Config not found
- 500: Upstream iCal fetch failed
