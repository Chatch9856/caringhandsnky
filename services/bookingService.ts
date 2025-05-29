
import { BookingRequest, BookingStatus } from '../types';

// This will hold bookings in memory after fetching or if fetch fails.
let bookingsCache: BookingRequest[] = [];
let hasAttemptedFetch = false;

const BOOKINGS_JSON_PATH = '/data/booking-requests.json'; // Relative to public folder

// Function to load bookings from the static JSON file
export const loadBookingsFromJSON = async (): Promise<BookingRequest[]> => {
  if (hasAttemptedFetch && bookingsCache.length > 0) {
    return [...bookingsCache]; // Return cached if already fetched successfully
  }

  try {
    const response = await fetch(BOOKINGS_JSON_PATH);
    if (!response.ok) {
      console.error(`Failed to load ${BOOKINGS_JSON_PATH}, status: ${response.status}. Serving empty/cached bookings.`);
      // If the file is not found (404), it's okay to proceed with an empty array.
      // For other errors, it might indicate a problem.
      hasAttemptedFetch = true;
      return [...bookingsCache]; // return current cache (might be empty)
    }
    const data = await response.json();
    // Ensure data is an array and has expected structure
    if (Array.isArray(data)) {
       bookingsCache = data.map((b: any) => ({ 
        ...b, 
        submittedAt: b.submittedAt || new Date().toISOString(),
        status: b.status || BookingStatus.PENDING // Ensure status exists
      }));
    } else {
      console.error(`${BOOKINGS_JSON_PATH} did not return an array. Using empty bookings.`);
      bookingsCache = [];
    }
  } catch (error) {
    console.error(`Error fetching or parsing ${BOOKINGS_JSON_PATH}:`, error);
    // Fallback to empty array if fetch fails (e.g., network error)
  }
  hasAttemptedFetch = true;
  return [...bookingsCache];
};

export const getBookingRequests = async (): Promise<BookingRequest[]> => {
  if (!hasAttemptedFetch) {
    await loadBookingsFromJSON();
  }
  return [...bookingsCache]; // Return a copy
};

export const addBookingRequest = async (requestData: Omit<BookingRequest, 'id' | 'status' | 'submittedAt'>): Promise<BookingRequest> => {
  if (!hasAttemptedFetch) { // Ensure cache is populated if not done yet
    await loadBookingsFromJSON();
  }
  const newBooking: BookingRequest = {
    ...requestData,
    id: `BKG-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    status: BookingStatus.PENDING,
    submittedAt: new Date().toISOString(),
  };
  bookingsCache.push(newBooking);
  // Note: This only updates the in-memory array. The JSON file is not modified.
  console.log("New booking added (in-memory):", newBooking);
  return newBooking;
};

export const updateBookingStatus = async (bookingId: string, status: BookingStatus): Promise<BookingRequest | null> => {
  if (!hasAttemptedFetch) {
    await loadBookingsFromJSON();
  }
  const bookingIndex = bookingsCache.findIndex(b => b.id === bookingId);
  if (bookingIndex !== -1) {
    bookingsCache[bookingIndex].status = status;
    console.log(`Booking ${bookingId} status updated to ${status} (in-memory)`);
    return { ...bookingsCache[bookingIndex] };
  }
  console.warn(`Booking with ID ${bookingId} not found for status update.`);
  return null;
};

// Call this once, e.g. in App.tsx or when AdminDashboard mounts, to pre-load.
// Or rely on lazy loading when getBookingRequests is first called.
// For simplicity, we'll rely on lazy loading.
