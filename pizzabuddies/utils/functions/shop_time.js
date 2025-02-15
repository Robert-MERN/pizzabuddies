import { DateTime } from "luxon";

const SHOP_OPEN_HOUR = 18; // 6:30 PM
const SHOP_OPEN_MINUTE = 30;
const SHOP_CLOSE_HOUR = 1; // 1:30 AM (Next day)
const SHOP_CLOSE_MINUTE = 30;

/**
 * Checks if the shop is closed and calculates the time left until opening.
 * @returns {Object} { isClosed: boolean, timeLeft: string }
 */
export function checkShopStatus() {
  const now = DateTime.now().setZone("Asia/Karachi");
  const openTime = now.set({ hour: SHOP_OPEN_HOUR, minute: SHOP_OPEN_MINUTE, second: 0 });
  const closeTime = now.set({ hour: SHOP_CLOSE_HOUR, minute: SHOP_CLOSE_MINUTE, second: 0 });

  // Determine if the shop is closed
  const isClosed = Boolean(now < openTime && now > closeTime);

  let timeLeft = "";
  if (isClosed) {
    const diff = openTime.diff(now, ["hours", "minutes", "seconds"]);
    timeLeft = `${Boolean(diff.hours) ? `${diff.hours}h` : ""} ${Boolean(diff.minutes) ? `${diff.minutes}m` : ""} ${Math.round(diff.seconds)}s`;
  }

  return { isClosed, timeLeft };
}
