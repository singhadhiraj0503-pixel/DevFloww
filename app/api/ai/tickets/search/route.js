import tickets from "@/app/database";
import { NextResponse } from "next/server";

export const GET = async (request) => {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json(tickets);
  }

  const filteredTickets = tickets.filter((ticket) =>
    ticket.name.toLowerCase().includes(query.toLowerCase()),
  );

  return NextResponse.json(filteredTickets);
};
