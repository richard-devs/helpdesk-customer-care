function generateTicketID() {
  return 'TICKET-' + Date.now();
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('ticketForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const issue = document.getElementById('issue').value.trim();
      const ticketID = generateTicketID();

      const ticket = {
        ticketID,
        name,
        email,
        issue,
        status: "Pending"
      };

      let tickets = JSON.parse(localStorage.getItem("tickets") || "[]");
      tickets.push(ticket);
      localStorage.setItem("tickets", JSON.stringify(tickets));

      document.getElementById('confirmation').innerHTML = `
        <h3>Ticket Submitted</h3>
        <p><strong>ID:</strong> ${ticketID}</p>
        <p><strong>Issue:</strong> ${issue}</p>
        <p><strong>Status:</strong> Pending</p>
      `;
      form.reset();
    });
  }

  if (document.getElementById('ticketList')) {
    showAdminTickets();
  }
});

function checkTicketStatus() {
  const ticketID = document.getElementById('ticketIdInput').value.trim();
  const tickets = JSON.parse(localStorage.getItem("tickets") || "[]");
  const ticket = tickets.find(t => t.ticketID === ticketID);
  const output = document.getElementById("ticketResult");

  if (ticket) {
    output.innerHTML = `
      <p><strong>ID:</strong> ${ticket.ticketID}</p>
      <p><strong>Name:</strong> ${ticket.name}</p>
      <p><strong>Issue:</strong> ${ticket.issue}</p>
      <p><strong>Status:</strong> ${ticket.status}</p>
    `;
  } else {
    output.innerHTML = "<p>Ticket not found.</p>";
  }
}

function showAdminTickets() {
  const tickets = JSON.parse(localStorage.getItem("tickets") || "[]");
  const list = document.getElementById('ticketList');

  if (tickets.length === 0) {
    list.innerHTML = "<p>No tickets yet.</p>";
    return;
  }

  tickets.forEach((ticket, i) => {
    const div = document.createElement('div');
    div.innerHTML = `
      <p><strong>ID:</strong> ${ticket.ticketID}</p>
      <p><strong>Name:</strong> ${ticket.name}</p>
      <p><strong>Issue:</strong> ${ticket.issue}</p>
      <label>Status:
        <select data-index="${i}" onchange="updateStatus(this)">
          <option ${ticket.status === 'Pending' ? 'selected' : ''}>Pending</option>
          <option ${ticket.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
          <option ${ticket.status === 'Resolved' ? 'selected' : ''}>Resolved</option>
        </select>
      </label>
    `;
    list.appendChild(div);
  });
}

function updateStatus(select) {
  const index = select.dataset.index;
  const tickets = JSON.parse(localStorage.getItem("tickets") || "[]");
  tickets[index].status = select.value;
  localStorage.setItem("tickets", JSON.stringify(tickets));
}