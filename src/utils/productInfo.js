/**
 * Product Information Constants
 * Contains detailed information about appearance conditions and battery types
 */

export const APPEARANCE_INFO_TEXT = `Our products are professionally refurbished, to function identically to new products.

We offer devices in four appearance categories:

Premium
Screen: identical to new
Body: identical to new

Excellent
Screen: like new
Body: no visible scratches from a close distance

Very good
Screen: no visible scratches when turned on
Body: minimal signs of use — visible from 30cm

Good
Screen: no visible scratches when turned on
Body: small scratches or dents`;

export const BATTERY_INFO_TEXT = `You can choose between 2 kinds of batteries:

Optimal
Optimal battery life with existing battery
No additional environmental impact

New
Seller inputs new, certified battery
Adds environmental impact; such as resource consumption, electronic waste, and emissions`;

export const getAppearanceInfoText = () => {
  return APPEARANCE_INFO_TEXT;
};

export const getBatteryInfoText = () => {
  return BATTERY_INFO_TEXT;
};
