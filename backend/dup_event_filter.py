from backend.bloom_filter2 import BloomFilter2
from backend.models import Event
import sys
event_filter = BloomFilter2(capacity=1000, err_rate=0.01)

def build_filter():
    try:
        event_filter.clear()
        events = Event.query.all()
        for e in events:

            title = e.title.lower()
            date = e.date
            location = e.location.lower()
            event_filter.add(title + date + location)
            # print(f"{title+date+location}", file=sys.stdout)
            
    except:
        print("ERROR INIT FILTER")
    
def event_might_match(event):
    return event_filter.check(event)

def add_event_to_filter(event):
    event_filter.add(event)