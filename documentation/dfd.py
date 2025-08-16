from graphviz import Digraph

# Create a new Digraph object for the DFD
dfd = Digraph('EventManagementDFD', comment='Event Management System - Level 1 DFD')
dfd.attr(rankdir='LR', splines='true', overlap='false', nodesep='0.5')

# --- Define Node and Edge Styles for DFD ---
entity_style = {
    'shape': 'box',
    'style': 'rounded',
    'color': 'tomato',
    'fontcolor': 'tomato',
    'fontname': 'Helvetica'
}
process_style = {
    'shape': 'circle',
    'style': 'filled',
    'fillcolor': 'lightblue',
    'color': 'dodgerblue',
    'fontname': 'Helvetica'
}
datastore_style = {
    'shape': 'record', # Looks like an open-ended rectangle
    'color': 'darkseagreen',
    'fontcolor': 'darkseagreen',
    'fontname': 'Helvetica'
}
edge_style = {
    'color': 'gray40',
    'fontname': 'Helvetica',
    'fontsize': '10'
}

# --- Create External Entities ---
with dfd.subgraph() as s:
    s.attr('node', **entity_style)
    s.node('USER', 'User')

# --- Create Processes ---
with dfd.subgraph() as s:
    s.attr('node', **process_style)
    s.node('P1', '1.0\nManage\nAccounts')
    s.node('P2', '2.0\nManage\nEvents')
    s.node('P3', '3.0\nProcess\nBookings')
    s.node('P4', '4.0\nHandle\nReviews')
    s.node('P5', '5.0\nSearch &\nView Events')

# --- Create Data Stores ---
with dfd.subgraph() as s:
    s.attr('node', **datastore_style)
    s.node('DS_USERS', '{D1 | Users}')
    s.node('DS_EVENTS', '{D2 | Events}')
    s.node('DS_BOOKINGS', '{D3 | Bookings}')
    s.node('DS_REVIEWS', '{D4 | Reviews}')

# --- Create Data Flows (Edges) ---
with dfd.subgraph() as s:
    s.attr('edge', **edge_style)

    # Flows for Account Management
    s.edge('USER', 'P1', label='Registration Info / Login Credentials')
    s.edge('P1', 'USER', label='Auth Confirmation / Profile Data')
    s.edge('P1', 'DS_USERS', label='New User / Updated Profile')
    s.edge('DS_USERS', 'P1', label='User Record')

    # Flows for Event Management (by Organizer/User)
    s.edge('USER', 'P2', label='New Event Details / Update Request')
    s.edge('P2', 'DS_EVENTS', label='Event Data')

    # Flows for Searching and Viewing Events
    s.edge('USER', 'P5', label='Search Query / Filter Criteria')
    s.edge('P5', 'USER', label='Filtered Event List')
    s.edge('DS_EVENTS', 'P5', label='Event Records')

    # Flows for Bookings
    s.edge('USER', 'P3', label='Booking Request')
    s.edge('P3', 'USER', label='Booking Confirmation')
    s.edge('P3', 'DS_BOOKINGS', label='New Booking Data')
    s.edge('DS_EVENTS', 'P3', label='Event & Ticket Info') # Booking needs event info
    s.edge('DS_USERS', 'P3', label='User Info') # Booking needs user info


    # Flows for Reviews
    s.edge('USER', 'P4', label='New Review / Rating')
    s.edge('P4', 'USER', label='Displayed Reviews')
    s.edge('P4', 'DS_REVIEWS', label='Review Data')
    s.edge('DS_EVENTS', 'P4', label='Event Info') # For associating review with an event

# Render the graph to a file
try:
    dfd.render('event_management_dfd', view=True, format='png', cleanup=True)
    print("DFD diagram 'event_management_dfd.png' created and opened successfully.")
except Exception as e:
    print(f"Error rendering graph: {e}")
    print("Please ensure Graphviz is installed and in your system's PATH.")