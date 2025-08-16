from graphviz import Digraph

# Create a new Digraph object for the Level 2 DFD
dfd2 = Digraph('EventManagement_DFD_Level2_Bookings', comment='Level 2 DFD for Process Bookings')
dfd2.attr(rankdir='LR', splines='true', overlap='false', label='Level 2 DFD: 3.0 Process Bookings', labelloc='t', fontsize='16')

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
    'fontname': 'Helvetica',
    'width': '1.5' # Make circles larger for readability
}
datastore_style = {
    'shape': 'record',
    'color': 'darkseagreen',
    'fontcolor': 'darkseagreen',
    'fontname': 'Helvetica'
}
edge_style = {
    'color': 'gray40',
    'fontname': 'Helvetica',
    'fontsize': '10'
}

# --- External Entities and Data Stores from Level 1 ---
with dfd2.subgraph() as s:
    s.attr('node', **entity_style)
    s.node('USER', 'User')

with dfd2.subgraph() as s:
    s.attr('node', **datastore_style)
    s.node('DS_EVENTS', '{D2 | Events}')
    s.node('DS_BOOKINGS', '{D3 | Bookings}')

# --- Decomposed Subprocesses for "3.0 Process Bookings" ---
with dfd2.subgraph() as s:
    s.attr('node', **process_style)
    s.node('P3_1', '3.1\nCheck Ticket\nAvailability')
    s.node('P3_2', '3.2\nProcess\nPayment')
    s.node('P3_3', '3.3\nCreate\nBooking Record')
    s.node('P3_4', '3.4\nGenerate\nConfirmation')


# --- Data Flows for Level 2 ---
with dfd2.subgraph() as s:
    s.attr('edge', **edge_style)

    # 1. User initiates the booking
    s.edge('USER', 'P3_1', label='Booking Request (EventID, Quantity)')
    
    # 2. System checks if tickets are available
    s.edge('DS_EVENTS', 'P3_1', label='Event & Ticket Info')
    s.edge('P3_1', 'P3_2', label='Availability Confirmation')
    s.edge('P3_1', 'USER', label='"Sold Out" Error', constraint='false') # Alternate flow

    # 3. System processes the payment
    s.edge('P3_2', 'USER', label='Payment Prompt')
    s.edge('USER', 'P3_2', label='Payment Details')
    s.edge('P3_2', 'P3_3', label='Payment Success Signal')

    # 4. System creates a booking record
    s.edge('P3_3', 'DS_BOOKINGS', label='New Booking Data')
    s.edge('DS_BOOKINGS', 'P3_3', label='Booking ID')
    s.edge('P3_3', 'P3_4', label='Booking Details for Confirmation')
    
    # 5. System sends confirmation to the user
    s.edge('P3_4', 'USER', label='Booking Confirmation & Ticket')


# Render the graph to a file
try:
    dfd2.render('event_management_dfd_level2', view=True, format='png', cleanup=True)
    print("Level 2 DFD 'event_management_dfd_level2.png' created and opened successfully.")
except Exception as e:
    print(f"Error rendering graph: {e}")
    print("Please ensure Graphviz is installed and in your system's PATH.")