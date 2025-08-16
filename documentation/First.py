from graphviz import Digraph

# Create a new Digraph object for the ER Diagram
dot = Digraph('EventManagementERD_Styled', comment='Styled Event Management System ER Diagram')
dot.attr(layout='neato', overlap='false', splines='true', rankdir='LR')

# --- Define Node and Edge Styles ---
entity_style = {'shape': 'box', 'style': 'rounded', 'color': 'mediumseagreen', 'fontcolor': 'mediumseagreen', 'fontname': 'Helvetica'}
attribute_style = {'shape': 'ellipse', 'color': 'darkturquoise', 'fontcolor': 'darkturquoise', 'fontname': 'Helvetica'}
relationship_style = {'shape': 'diamond', 'style': 'filled', 'fillcolor': 'orange', 'color': 'darkorange', 'fontname': 'Helvetica'}
edge_style = {'color': 'gray', 'fontname': 'Helvetica', 'fontsize': '10'}

# --- Create Entities ---
with dot.subgraph() as s:
    s.attr('node', **entity_style)
    s.node('USER', 'User')
    s.node('EVENT', 'Event')
    s.node('VENUE', 'Venue')
    s.node('CITY', 'City')
    s.node('CATEGORY', 'Category')
    s.node('TICKET', 'Ticket')
    s.node('BOOKING', 'Booking')
    s.node('REVIEW', 'Review')

# --- Create Attributes ---
with dot.subgraph() as s:
    s.attr('node', **attribute_style)
    s.node('UserID', 'UserID (PK)')
    s.node('Username')
    s.node('Email')
    s.node('PasswordHash')
    s.node('Role')
    s.node('ProfileImageURL')

    s.node('EventID', 'EventID (PK)')
    s.node('Title')
    s.node('Description')
    s.node('StartDate')
    s.node('EndDate')
    s.node('TotalCapacity')

    s.node('VenueID', 'VenueID (PK)')
    s.node('VenueName', 'Name')
    s.node('Address')
    s.node('VenueCapacity', 'Capacity')

    s.node('CityID', 'CityID (PK)')
    s.node('CityName', 'Name')

    s.node('CategoryID', 'CategoryID (PK)')
    s.node('CategoryName', 'Name')

    s.node('TicketID', 'TicketID (PK)')
    s.node('Type')
    s.node('Price')
    s.node('QuantityAvailable')

    s.node('BookingID', 'BookingID (PK)')
    s.node('BookingDate')
    s.node('NumberOfTickets')
    s.node('TotalPrice')

    s.node('ReviewID', 'ReviewID (PK)')
    s.node('Rating')
    s.node('Comment')
    s.node('DatePosted')

# --- Create Relationships ---
with dot.subgraph() as s:
    s.attr('node', **relationship_style)
    s.node('Organizes')
    s.node('Makes')
    s.node('Writes')
    s.node('Has')
    s.node('Receives')
    s.node('Gets')
    s.node('Hosts')
    s.node('Located_In', 'Located In')
    s.node('Belongs_To', 'Belongs To')

# --- Connect Attributes to Entities ---
with dot.subgraph() as s:
    s.attr('edge', arrowhead='none', **edge_style)
    s.edge('USER', 'UserID')
    s.edge('USER', 'Username')
    s.edge('USER', 'Email')
    s.edge('USER', 'PasswordHash')
    s.edge('USER', 'Role')
    s.edge('USER', 'ProfileImageURL')

    s.edge('EVENT', 'EventID')
    s.edge('EVENT', 'Title')
    s.edge('EVENT', 'Description')
    s.edge('EVENT', 'StartDate')
    s.edge('EVENT', 'EndDate')
    s.edge('EVENT', 'TotalCapacity')

    s.edge('VENUE', 'VenueID')
    s.edge('VENUE', 'VenueName')
    s.edge('VENUE', 'Address')
    s.edge('VENUE', 'VenueCapacity')

    s.edge('CITY', 'CityID')
    s.edge('CITY', 'CityName')

    s.edge('CATEGORY', 'CategoryID')
    s.edge('CATEGORY', 'CategoryName')
    
    s.edge('TICKET', 'TicketID')
    s.edge('TICKET', 'Type')
    s.edge('TICKET', 'Price')
    s.edge('TICKET', 'QuantityAvailable')

    s.edge('BOOKING', 'BookingID')
    s.edge('BOOKING', 'BookingDate')
    s.edge('BOOKING', 'NumberOfTickets')
    s.edge('BOOKING', 'TotalPrice')

    s.edge('REVIEW', 'ReviewID')
    s.edge('REVIEW', 'Rating')
    s.edge('REVIEW', 'Comment')
    s.edge('REVIEW', 'DatePosted')

# --- Connect Entities to Relationships ---
with dot.subgraph() as s:
    # MODIFIED LINE: Added arrowhead='none' to remove arrows from relationship lines
    s.attr('edge', arrowhead='none', **edge_style)
    s.edge('USER', 'Organizes', label='1')
    s.edge('Organizes', 'EVENT', label='M')

    s.edge('USER', 'Makes', label='1')
    s.edge('Makes', 'BOOKING', label='M')

    s.edge('USER', 'Writes', label='1')
    s.edge('Writes', 'REVIEW', label='M')

    s.edge('EVENT', 'Has', label='1')
    s.edge('Has', 'TICKET', label='M')

    s.edge('EVENT', 'Receives', label='1')
    s.edge('Receives', 'BOOKING', label='M')

    s.edge('EVENT', 'Gets', label='1')
    s.edge('Gets', 'REVIEW', label='M')

    s.edge('VENUE', 'Hosts', label='1')
    s.edge('Hosts', 'EVENT', label='M')

    s.edge('CITY', 'Located_In', label='1')
    s.edge('Located_In', 'VENUE', label='M')

    s.edge('CATEGORY', 'Belongs_To', label='1')
    s.edge('Belongs_To', 'EVENT', label='M')

# Render the graph to a file
try:
    dot.render('event_management_erd_styled', view=True, format='png', cleanup=True)
    print("ER diagram 'event_management_erd_styled.png' created and opened successfully.")
except Exception as e:
    print(f"Error rendering graph: {e}")
    print("Please ensure Graphviz is installed and in your system's PATH.")