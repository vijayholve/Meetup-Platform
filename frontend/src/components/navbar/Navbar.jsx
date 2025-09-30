import React, { useContext, useEffect, useState } from "react";
import { Bell, Menu } from "lucide-react";
import { useEventContext } from "../../context/EventContext";
import { NavLink, useNavigate } from "react-router-dom";
import Nav_link from "./nav-link";
import SelectOption from "../form/select/Select";
import SearchInput from "../form/input.jsx/SearchInput";
import { logout } from "../../features/auth/authSlice";
import { useDispatch } from "react-redux";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const { events,filteredEvents, setFilteredEvents, categories, cities } = useEventContext();
const dispatch = useDispatch();
  const navigate = useNavigate();
  
  
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };
  // Set all events initially
  useEffect(() => {
    setFilteredEvents(events);
  }, [events]);

  // Filter logic
  useEffect(() => {
    let filtered = events;

    if (selectedCategory) {
      filtered = filtered.filter(
        (event) =>
          String(event.category?.id || event.category) === selectedCategory
      );
    }

    if (selectedCity) {
      filtered = filtered.filter(
        (event) => String(event.city?.id || event.city) === selectedCity
      );
    }

    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter((event) =>
        [event.title, event.description, event.organizer, event.location]
          .filter((field) => typeof field === "string") // Only keep strings
          .some((field) => field.toLowerCase().includes(lowerQuery))
      );
    }

    setFilteredEvents(filtered);
  }, [selectedCategory, selectedCity, searchQuery, events]);

  return (
    <nav className="bg-white shadow-md px-4 py-3">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* <div className="text-2xl font-bold text-blue-600">EventMate</div> */}

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <SelectOption
            value={selectedCategory}
            onChange={setSelectedCategory}
            categories={categories}
            title="Category"
          />

          <SelectOption 
          title="City"
            value={selectedCity}
            onChange={setSelectedCity}
            categories={cities}
          />

          {/* Desktop bell icon as NavLink */}
        </div>
                <div className="hidden md:flex items-center gap-6">
                  Total Events: {filteredEvents.length}
</div>
        <div className="hidden md:flex items-center gap-6">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search events..."
          />
        </div>
        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-2 space-y-2 px-2 pb-4">
          <Nav_link link="/" title={"home"}>
            Home
          </Nav_link>
          <Nav_link link="/dashboard" title={"DashBoard"}>
            Dashboard
          </Nav_link>

          <select
            className="w-full bg-gray-100 text-gray-700 px-3 py-1 rounded"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <select
            className="w-full bg-gray-100 text-gray-700 px-3 py-1 rounded"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
          >
            <option value="">City</option>
            {cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-1 border border-gray-300 rounded"
          />

          <NavLink to="/events/notification" className="relative inline-block">
            <Bell className="w-5 h-5 text-gray-700" />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
              3
            </span>
          </NavLink>
           <button
              onClick={() => {
                handleLogout();
              }}
              className="mt-4 w-full text-left text-red-600 hover:text-red-800 font-medium"
            >
              Logout
            </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
