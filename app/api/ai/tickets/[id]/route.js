import tickets from "@/app/database";
import { NextResponse } from "next/server";

export const GET = async (request, { params }) => {
  const { id } = await params;

  const ticket = tickets.find((ticket) => ticket.id === parseInt(id));

  return NextResponse.json(ticket);
};

export const PUT = async (request, { params }) => {
  const { id } = await params;
  const { name, status, type } = await request.json();

  const ticket = tickets.find((ticket) => ticket.id === parseInt(id));
  if (!ticket) {
    return NextResponse.json(new Error("Tickets not found"), { status: 400 });
  }
  if (name) ticket.name = name;

  if (status) ticket.status = status;

  if (type) ticket.type = type;

  return NextResponse.json(ticket);
};

export const DELETE = async (request, { params }) => {
  const { id } = await params;

  const ticketIndex = tickets.findIndex((ticket) => ticket.id === parseInt(id));

  if (ticketIndex === -1) {
    return NextResponse.json(new Error("Ticket not found"), { status: 404 });
  }

  tickets.splice(ticketIndex, 1);
  return NextResponse.json(tickets);
};
