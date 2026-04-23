import EventCard from "./EventCard";
import { getUpcomingEvents, CalendarEvent } from "@/lib/database";

export default async function EventsSection() {
    let events: CalendarEvent[] = [];
    let hasError = false;
    try {
        events = await getUpcomingEvents(3); // Get next 3 upcoming events
    } catch (error) {
        console.error("Error fetching events:", error);
        hasError = true;
    }

    if (hasError) {
        return (
            <div className="mb-32 mt-auto">
                <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-5 text-red-800">
                    Veranstaltungen konnten aktuell nicht geladen werden. Bitte
                    versuchen Sie es später erneut.
                </div>
            </div>
        );
    }

    return (
        <div className="mb-32 mt-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {events.map((event: CalendarEvent) => {
                    const startDate = event.start
                        ? new Date(event.start)
                        : null;
                    const endDate = event.end ? new Date(event.end) : null;

                    let timeDisplay = "";
                    if (startDate) {
                        timeDisplay = startDate.toLocaleTimeString("de-DE", {
                            hour: "2-digit",
                            minute: "2-digit",
                        });

                        if (endDate) {
                            const endTime = endDate.toLocaleTimeString(
                                "de-DE",
                                {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                }
                            );
                            if (endTime !== timeDisplay) {
                                timeDisplay += ` - ${endTime}`;
                            }
                        }
                    }

                    return (
                        <EventCard
                            key={event.id}
                            id={event.id}
                            title={event.title}
                            location={event.location || "Wendessen"}
                            time={timeDisplay}
                            date={
                                startDate
                                    ? startDate.toLocaleDateString("de-DE", {
                                          day: "2-digit",
                                          month: "2-digit",
                                          year: "numeric",
                                      })
                                    : ""
                            }
                            imageSrc={event.imageUrl}
                            imageCropData={event.imageCropData}
                            imageAlt={event.title}
                            hasImage={!!event.imageUrl}
                            isCancelled={event.isCancelled}
                        />
                    );
                })}
            </div>
        </div>
    );
}
