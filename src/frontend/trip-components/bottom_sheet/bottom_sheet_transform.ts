type BottomSheetPercentage = "20%" | "50%" | "100%";

class BottomSheetTransform {
  private bottomSheetRef = null;
  setBottomSheetRef(btsheetRef) {
    this.bottomSheetRef = btsheetRef;
    console.log("ref", btsheetRef);
  }
  setBottomSheetPercentage(percentage: BottomSheetPercentage) {
    if (!this.bottomSheetRef) return;
    this.bottomSheetRef?.snapToPosition(percentage);
  }
}
export default new BottomSheetTransform();
