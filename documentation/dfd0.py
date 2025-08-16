from graphviz import Digraph

# Create a new Digraph object for the Level 0 DFD
dfd0 = Digraph('EventManagement_DFD_Level0', comment='Level 0 DFD for Event Management System')
dfd0.attr(rankdir='LR', splines='true', overlap='false', label='Level 0 DFD: Context Diagram', labelloc='t', fontsize='16')

# --- Define Node and Edge Styles for correct DFD symbols---
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
    'width': '2.5' # Make the central process larger
}
edge_style = {
    'color': 'gray40',
    'fontname': 'Helvetica',
    'fontsize': '10'
}

# --- Create External Entity (Rectangle) ---
with dfd0.subgraph() as s:
    s.attr('node', **entity_style)
    s.node('USER', 'User\n(Attendee & Organizer)')

# --- Create the Single Central Process (Circle) ---
with dfd0.subgraph() as s:
    s.attr('node', **process_style)
    s.node('SYSTEM', '0\nEvent Management\nSystem')

# --- Create Data Flows (Labeled Arrows) ---
with dfd0.subgraph() as s:
    s.attr('edge', **edge_style)

    # Data flowing from User to the System
    s.edge('USER', 'SYSTEM', label='User Inputs\n(Login, Event Details, Bookings, Reviews)')

    # Data flowing from the System to the User
    s.edge('SYSTEM', 'USER', label='System Outputs\n(Confirmations, Event Lists, Tickets)')

# Render the graph to a file
try:
    dfd0.render('event_management_dfd_level0_correct', view=True, format='png', cleanup=True)
    print("Corrected Level 0 DFD 'event_management_dfd_level0_correct.png' created and opened successfully.")
except Exception as e:
    print(f"Error rendering graph: {e}")
    print("Please ensure Graphviz is installed and in your system's PATH.")