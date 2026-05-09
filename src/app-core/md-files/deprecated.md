src/frontend/trip-compoments/components/banners => replace by tripstat /frontend/trip-compoments/bottom_sheet/trip_stat.js
src/backend/services/hash_service => was use for etag purposes but change to use modified_time instead
src/backend/storage/settings => was using to store user setting (device), => now asking directly, can reuse for user custome setting in the future
