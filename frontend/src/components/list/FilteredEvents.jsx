import React from 'react'

const FilteredEvents = () => {
  return (
    <>
    <div className="max-w-2xl mx-auto px-4 py-6">
      <TopHeader value={` This Week's Events`} />
      {weekEvents.length === 0 ? (
        <p className="text-center text-gray-500 text-lg italic">
          No events this week.
        </p>
      ) : (
        <div className="space-y-4">
          {weekEvents.map((event) => (
            <div
              key={event.id}
              className="flex items-center bg-white rounded-xl shadow-sm hover:shadow-md transition duration-300 overflow-hidden"
            >
              {/* Banner Image */}
              {event.banner_image && (
                <img
                  src={API_ENDPOINTS.MAIN_URL + event.banner_image}
                  alt={event.title}
                  className="w-32 h-20 object-cover"
                />
              )}

              {/* Event Info */}
              <div className="flex-1 p-4">
                <div className="flex flex-wrap items-center justify-between">
                  <h3 className="text-lg font-semibold text-indigo-700 mr-4">
                    {event.title}
                  </h3>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                      event.is_public
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {event.is_public ? "Public" : "Private"}
                  </span>
                </div>

                <div className="text-sm text-gray-600">
                  <p>
                    🕒{" "}
                    {dayjs
                      .utc(event.start_time)
                      .local()
                      .format("ddd, MMM D · h:mm A")}{" "}
                    - {dayjs.utc(event.end_time).local().format("h:mm A")}
                  </p>
                  <p className="truncate">
                    📍 {event.venue?.name || "Venue not specified"},{" "}
                    {event.city?.name || "City not specified"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );</>
  )
}

export default FilteredEvents