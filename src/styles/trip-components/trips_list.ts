import { StyleSheet } from "react-native";

export const TripListStyle = StyleSheet.create({
  sheetBg: { backgroundColor: "#1a1917" },
  background: { backgroundColor: "#3a3830" },
  listContent: { paddingBottom: 80, paddingHorizontal: 12 },

  // ── user card ──
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
    backgroundColor: "#242220",
    borderRadius: 16,
    marginBottom: 20,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },

  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#333",
  },

  avatarEditBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#f0f0ec",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarEditText: {
    fontSize: 9,
    color: "#1a1a1a",
  },

  userInfo: {
    flex: 1,
    gap: 3,
  },

  displayName: {
    fontSize: 17,
    fontWeight: "600",
    color: "#f0f0ec",
    fontFamily: "DMMono",
  },

  displaySub: {
    fontSize: 10,
    color: "#5a5550",
    letterSpacing: 0.12,
    fontFamily: "DMMono",
  },

  // ── section header ──
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 70,
    marginBottom: 12,
    paddingHorizontal: 2,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#f0f0ec",
    fontFamily: "DMMono",
    letterSpacing: 0.04,
  },

  sectionActions: {
    flexDirection: "row",
    gap: 8,
  },

  iconBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#2a2826",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },

  iconBtnPrimary: {
    backgroundColor: "#f0f0ec",
    borderColor: "transparent",
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 0,
    elevation: 3,
  },

  iconBtnText: { fontSize: 18, color: "#888" },
  iconBtnTextPrimary: { color: "#1a1a1a" },

  // ── loading ──
  loadingRow: {
    paddingHorizontal: 4,
    marginBottom: 10,
  },
  loadingText: {
    fontSize: 11,
    color: "#5a5550",
    fontFamily: "DMMono",
    letterSpacing: 0.1,
  },

  // ── empty state ──
  emptyState: {
    alignItems: "center",
    paddingTop: 60,
    gap: 8,
  },
  emptyIcon: { fontSize: 40 },
  emptyText: {
    fontSize: 15,
    color: "#f0f0ec",
    fontFamily: "DMMono",
  },
  emptySub: {
    fontSize: 11,
    color: "#5a5550",
    fontFamily: "DMMono",
    letterSpacing: 0.1,
  },
});
