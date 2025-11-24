from pybloom_live import BloomFilter

# Create bloom filters
title_filter = BloomFilter(capacity=500, error_rate=0.01)
location_filter = BloomFilter(capacity=500, error_rate=0.01)
date_filter = BloomFilter(capacity=500, error_rate=0.01)


def build_filters():
    """Rebuild bloom filters from all events in the DB."""
    from backend.models import Event

    events = Event.query.all()
    title_filter.clear()
    location_filter.clear()
    date_filter.clear()

    for e in events:
        title_filter.add(e.title.lower())
        location_filter.add(e.location.lower())
        date_filter.add(e.date)


def might_match_title(query):
    return query.lower() in title_filter


def might_match_location(query):
    return query.lower() in location_filter


def might_match_date(query):
    return query in date_filter


def add_event_to_filters(event):
    """Add a single new event to the bloom filters."""
    if event.title:
        title_filter.add(event.title.lower())
    if event.location:
        location_filter.add(event.location.lower())
    if event.date:
        date_filter.add(event.date)